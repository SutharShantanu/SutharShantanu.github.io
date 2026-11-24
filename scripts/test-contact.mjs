import assert from "node:assert/strict"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createJiti } from "jiti"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")

// Initialize jiti to compile and load TypeScript modules with @/ alias
const jiti = createJiti(path.join(rootDir, "test-runner.js"), {
    alias: {
        "@/": `${rootDir}/`,
    },
})

// Load modules under test
const { RateLimiter, rateLimiter, emailRateLimiter } = jiti("./lib/rate-limiter.ts")
const { detectSpam } = jiti("./lib/spam-detector.ts")
const {
    renderNotificationEmail,
    renderConfirmationEmail,
    sendContactEmails,
    sendMail,
    setCustomTransporter,
    getTransporter,
} = jiti("./lib/nodemailer.ts")
const { POST } = jiti("./app/api/contact/route.ts")

// Test counter
let totalTests = 0
let passedTests = 0
let failedTests = 0

async function test(name, fn) {
    totalTests++
    try {
        await fn()
        passedTests++
        console.log(`  \x1b[32m✔\x1b[0m ${name}`)
    } catch (err) {
        failedTests++
        console.error(`  \x1b[31m✖\x1b[0m ${name}`)
        console.error(`    \x1b[31m${err.message}\x1b[0m`)
        if (err.stack) {
            console.error(err.stack.split("\n").slice(1, 4).join("\n"))
        }
    }
}

// Mock NextRequest creator
function createMockRequest(body, headers = {}) {
    const rawBody = typeof body === "string" ? body : JSON.stringify(body)
    const headerMap = new Map(Object.entries({
        "content-type": "application/json",
        "content-length": Buffer.byteLength(rawBody).toString(),
        "x-real-ip": "192.168.1.100",
        ...headers,
    }))

    return {
        headers: {
            get: (key) => headerMap.get(key.toLowerCase()) || null,
        },
        text: async () => rawBody,
    }
}

console.log("\n=======================================================")
console.log("  🚀 CONTACT FORM, NODEMAILER & BOT PROTECTION TESTS")
console.log("=======================================================\n")

// =========================================================================
// 1. RATE LIMITER TESTS
// =========================================================================
console.log("\x1b[1m[1] Rate Limiter Tests (Sliding Window & Email Guard)\x1b[0m")

await test("Sliding window allows requests up to max limit", () => {
    const limiter = new RateLimiter(3, 10000)
    const id = "test-client-1"

    const r1 = limiter.check(id)
    assert.strictEqual(r1.allowed, true)
    assert.strictEqual(r1.remaining, 2)

    const r2 = limiter.check(id)
    assert.strictEqual(r2.allowed, true)
    assert.strictEqual(r2.remaining, 1)

    const r3 = limiter.check(id)
    assert.strictEqual(r3.allowed, true)
    assert.strictEqual(r3.remaining, 0)

    const r4 = limiter.check(id)
    assert.strictEqual(r4.allowed, false)
    assert.strictEqual(r4.remaining, 0)
    assert.ok(r4.retryAfterSeconds > 0)
})

await test("Rate limiter resets correctly when manually reset", () => {
    const limiter = new RateLimiter(2, 10000)
    const id = "test-reset"

    limiter.check(id)
    limiter.check(id)
    assert.strictEqual(limiter.check(id).allowed, false)

    limiter.reset(id)
    assert.strictEqual(limiter.check(id).allowed, true)
})

await test("Recipient email rate limiter prevents email flooding/bombing", () => {
    const email = "victim@example.com"
    emailRateLimiter.reset(email)

    const r1 = emailRateLimiter.check(email, 2, 5000)
    const r2 = emailRateLimiter.check(email, 2, 5000)
    const r3 = emailRateLimiter.check(email, 2, 5000)

    assert.strictEqual(r1.allowed, true)
    assert.strictEqual(r2.allowed, true)
    assert.strictEqual(r3.allowed, false)
    emailRateLimiter.reset(email)
})

// =========================================================================
// 2. SPAM DETECTOR & BOT HEURISTICS TESTS
// =========================================================================
console.log("\n\x1b[1m[2] Spam Detector & Bot Protection Tests\x1b[0m")

await test("Allows legitimate user contact inquiry", () => {
    const result = detectSpam({
        name: "Alice Cooper",
        email: "alice@company.com",
        subject: "Project proposal",
        message: "Hello Shantanu, I saw your portfolio and would like to discuss building a Next.js web application for our startup.",
    })

    assert.strictEqual(result.isSpam, false)
    assert.ok(result.score < 50)
})

await test("Detects financial and cryptocurrency scam keywords", () => {
    const result = detectSpam({
        name: "Forex Bot",
        email: "bot@profit.com",
        subject: "Investment opportunity",
        message: "Guaranteed returns on crypto profit! Make $50,000 thousand dollars fast with bitcoin doubling.",
    })

    assert.strictEqual(result.isSpam, true)
    assert.ok(result.score >= 50)
    assert.ok(result.reasons.some((r) => r.includes("scam") || r.includes("keywords")))
})

await test("Detects unsolicited SEO spam patterns", () => {
    const result = detectSpam({
        name: "SEO Marketer",
        email: "marketer@growth.com",
        subject: "Rank #1 on Google",
        message: "We provide guest post backlink building with high da50 pa50 dofollow links to boost your domain authority.",
    })

    assert.strictEqual(result.isSpam, true)
    assert.ok(result.score >= 50)
})

await test("Detects script and HTML injection payloads (XSS protection)", () => {
    const result = detectSpam({
        name: "<script>alert(1)</script>",
        email: "hacker@domain.com",
        subject: "Security check",
        message: "Look at this <iframe src='http://evil.com'></iframe> and <img src=x onerror=alert(1)>",
    })

    assert.strictEqual(result.isSpam, true)
    assert.ok(result.score >= 50)
    assert.ok(result.reasons.some((r) => r.includes("injection")))
})

await test("Detects URL in sender name field", () => {
    const result = detectSpam({
        name: "https://spam-site.com",
        email: "spammer@domain.com",
        subject: "General inquiry",
        message: "Please check our promotional services.",
    })

    assert.ok(result.reasons.some((r) => r.includes("sender name")))
})

await test("Detects disposable / temporary email domains", () => {
    const result = detectSpam({
        name: "Temporary User",
        email: "throwaway@10minutemail.com",
        subject: "Testing email",
        message: "Just checking if this message reaches you.",
    })

    assert.ok(result.reasons.some((r) => r.includes("Disposable")))
})

await test("Flags excessive links in message body", () => {
    const result = detectSpam({
        name: "Link Spammer",
        email: "links@domain.com",
        subject: "Check these links",
        message: "Visit https://link1.com and https://link2.com and https://link3.com and https://link4.com now!",
    })

    assert.ok(result.reasons.some((r) => r.includes("Excessive links")))
})

// =========================================================================
// 3. NODEMAILER EMAIL TEMPLATES & SENDER CONFIRMATION TESTS
// =========================================================================
console.log("\n\x1b[1m[3] Nodemailer Templates & Sender Confirmation Mail Tests\x1b[0m")

await test("Notification email template renders sanitized content and security audit info", () => {
    const html = renderNotificationEmail({
        name: "Jane & Tarzan <script>",
        email: "jane@jungle.com",
        subject: "Treehouse Design",
        message: "Need a modern scalable treehouse.\nLine 2.",
        siteName: "Shantanu's Portfolio",
        clientIP: "203.0.113.195",
        spamScore: 10,
        timestamp: "24/11/2026, 14:30:00",
    })

    assert.ok(html.includes("Jane &amp; Tarzan &lt;script&gt;"), "Name must be HTML escaped")
    assert.ok(html.includes("203.0.113.195"), "Client IP must be present in diagnostic footer")
    assert.ok(html.includes("Spam Score: 10/100"), "Spam score must be present")
    assert.ok(html.includes("mailto:jane%40jungle.com"), "Mailto reply link must be properly encoded")
    assert.ok(html.includes("Need a modern scalable treehouse"), "Message body must be included")
})

await test("Confirmation email template greets the sender and confirms receipt without echoing arbitrary user body", () => {
    const html = renderConfirmationEmail({
        name: "Robert Downey Jr.",
        subjectCategory: "Project proposal",
        siteName: "Shantanu Suthar Portfolio",
        portfolioUrl: "https://shantanusuthar.vercel.app",
    })

    assert.ok(html.includes("Hi Robert,"), "Must extract first name and greet politely")
    assert.ok(html.includes("Project proposal"), "Must confirm the selected topic/subject category")
    assert.ok(html.includes("Shantanu Suthar"), "Must include Shantanu's branding")
    assert.ok(html.includes("https://shantanusuthar.vercel.app"), "Must include link to portfolio")
    assert.ok(html.includes("Confirmation Receipt"), "Must be clearly labeled as a confirmation receipt")
    assert.ok(html.includes("automated receipt because your email address was submitted"), "Must include anti-abuse disclaimer")
})

await test("sendContactEmails dispatches BOTH notification and sender confirmation mail via mock transporter", async () => {
    const sentMails = []

    const mockTransporter = {
        sendMail: async (options) => {
            sentMails.push(options)
            return { messageId: `mock_${Date.now()}_${Math.random()}` }
        },
    }

    setCustomTransporter(mockTransporter)

    const result = await sendContactEmails({
        name: "Bruce Wayne",
        email: "bruce@wayne-enterprises.com",
        subject: "Batmobile software contract",
        message: "We need autonomous navigation software for our next vehicle.",
        clientIP: "10.0.0.1",
        spamScore: 0,
    })

    assert.strictEqual(result.notificationSent, true, "Notification mail must be sent")
    assert.strictEqual(result.confirmationSent, true, "Confirmation mail to sender must be sent")
    assert.strictEqual(sentMails.length, 2, "Exactly 2 emails must be dispatched")

    // Mail 1: To Shantanu (Notification)
    const notificationMail = sentMails[0]
    assert.ok(notificationMail.to.includes("shantanusut2000@gmail.com") || notificationMail.to.includes(process.env.CONTACT_TO_EMAIL || ""))
    assert.strictEqual(notificationMail.replyTo, "bruce@wayne-enterprises.com")

    // Mail 2: To the sender (Confirmation)
    const confirmationMail = sentMails[1]
    assert.strictEqual(confirmationMail.to, "bruce@wayne-enterprises.com", "Confirmation mail recipient must be the sender")
    assert.ok(confirmationMail.subject.includes("Thanks for reaching out!"), "Subject must confirm contact")
    assert.ok(confirmationMail.html.includes("Hi Bruce,"), "HTML must personalize confirmation to sender")

    setCustomTransporter(null)
})

await test("sendContactEmails is resilient if confirmation mail to sender fails (main notification still succeeds)", async () => {
    let callCount = 0

    const mockTransporter = {
        sendMail: async (options) => {
            callCount++
            if (callCount === 1) {
                // First call: Notification email succeeds
                return { messageId: "msg_success_1" }
            } else {
                // Second call: Confirmation to sender bounces / fails
                throw new Error("Recipient inbox full or rejected")
            }
        },
    }

    setCustomTransporter(mockTransporter)

    const result = await sendContactEmails({
        name: "Clark Kent",
        email: "clark@dailyplanet.com",
        subject: "Interview inquiry",
        message: "Can we schedule an interview about your engineering projects?",
        clientIP: "10.0.0.2",
        spamScore: 0,
    })

    assert.strictEqual(result.notificationSent, true, "Main notification to Shantanu must succeed")
    assert.strictEqual(result.confirmationSent, false, "Sender confirmation receipt caught gracefully")
    assert.strictEqual(result.notificationId, "msg_success_1")

    setCustomTransporter(null)
})

// =========================================================================
// 4. API ROUTE (/api/contact) FULL INTEGRATION TESTS
// =========================================================================
console.log("\n\x1b[1m[4] /api/contact API Route Integration Tests\x1b[0m")

await test("POST /api/contact successfully sends both emails and returns 200 with confirmationSent: true", async () => {
    rateLimiter.reset()
    emailRateLimiter.reset()

    const sentMails = []
    const mockTransporter = {
        sendMail: async (options) => {
            sentMails.push(options)
            return { messageId: `msg_${Date.now()}` }
        },
    }
    setCustomTransporter(mockTransporter)

    // Set mock env so it uses real transporter instead of simulation fallback
    const origHost = process.env.SMTP_HOST
    const origUser = process.env.SMTP_USER
    process.env.SMTP_HOST = "smtp.test.com"
    process.env.SMTP_USER = "test@test.com"

    try {
        const req = createMockRequest({
            name: "Diana Prince",
            email: "diana@themyscira.gov",
            subject: "proposal",
            message: "I would like to hire you for frontend architecture consulting.",
            formStartTime: Date.now() - 5000, // 5 seconds ago (human timing)
        })

        const res = await POST(req)
        assert.strictEqual(res.status, 200)

        const json = await res.json()
        assert.strictEqual(json.success, true)
        assert.strictEqual(json.confirmationSent, true)
        assert.ok(json.message.includes("confirmation email has been sent"))
        assert.strictEqual(sentMails.length, 2, "Both notification and sender confirmation mail were sent")
    } finally {
        if (origHost !== undefined) {
            process.env.SMTP_HOST = origHost
        } else {
            delete process.env.SMTP_HOST
        }
        if (origUser !== undefined) {
            process.env.SMTP_USER = origUser
        } else {
            delete process.env.SMTP_USER
        }
        setCustomTransporter(null)
    }
})

await test("POST /api/contact in dev environment without SMTP returns simulation status", async () => {
    rateLimiter.reset()
    emailRateLimiter.reset()

    const origHost = process.env.SMTP_HOST
    const origUser = process.env.SMTP_USER
    delete process.env.SMTP_HOST
    delete process.env.SMTP_USER

    try {
        const req = createMockRequest({
            name: "Tony Stark",
            email: "tony@stark.com",
            subject: "general",
            message: "Let us collaborate on an open source robotics project.",
            formStartTime: Date.now() - 4000,
        })

        const res = await POST(req)
        assert.strictEqual(res.status, 200)

        const json = await res.json()
        assert.strictEqual(json.success, true)
        assert.strictEqual(json.simulated, true)
        assert.strictEqual(json.confirmationSent, true)
        assert.ok(json.message.includes("simulated"))
    } finally {
        if (origHost !== undefined) {
            process.env.SMTP_HOST = origHost
        } else {
            delete process.env.SMTP_HOST
        }
        if (origUser !== undefined) {
            process.env.SMTP_USER = origUser
        } else {
            delete process.env.SMTP_USER
        }
    }
})

await test("POST /api/contact traps honeypot submissions silently without sending email", async () => {
    rateLimiter.reset()
    const sentMails = []
    setCustomTransporter({
        sendMail: async (options) => {
            sentMails.push(options)
            return { messageId: "123" }
        },
    })

    const req = createMockRequest({
        name: "Bot User",
        email: "bot@spammer.com",
        subject: "Spam proposal",
        message: "Buy cheap backlinks now!",
        website: "http://bot-honeypot-trap.com", // Filled honeypot
        formStartTime: Date.now() - 10000,
    })

    const res = await POST(req)
    assert.strictEqual(res.status, 200)

    const json = await res.json()
    assert.strictEqual(json.success, true)
    assert.strictEqual(sentMails.length, 0, "No emails must be sent for honeypot hits")

    setCustomTransporter(null)
})

await test("POST /api/contact traps too-fast bot submissions (< 2.5s) silently", async () => {
    rateLimiter.reset()
    const sentMails = []
    setCustomTransporter({
        sendMail: async (options) => {
            sentMails.push(options)
            return { messageId: "123" }
        },
    })

    const req = createMockRequest({
        name: "Fast Bot",
        email: "fast@bot.com",
        subject: "Instant submission",
        message: "Automated submission generated in 100 milliseconds.",
        formStartTime: Date.now() - 500, // Submitted in 500ms
    })

    const res = await POST(req)
    assert.strictEqual(res.status, 200)

    const json = await res.json()
    assert.strictEqual(json.success, true)
    assert.strictEqual(sentMails.length, 0, "No emails must be sent when submitted in < 2.5s")

    setCustomTransporter(null)
})

await test("POST /api/contact rejects invalid schema with 400", async () => {
    rateLimiter.reset()
    const req = createMockRequest({
        name: "A", // too short (min 2)
        email: "not-an-email",
        subject: "",
        message: "short",
    })

    const res = await POST(req)
    assert.strictEqual(res.status, 400)
    const json = await res.json()
    assert.strictEqual(json.error, "Invalid form data")
})

await test("POST /api/contact rejects oversized body with 413", async () => {
    rateLimiter.reset()
    const giantString = "x".repeat(15000)
    const req = createMockRequest(
        {
            name: "Giant",
            email: "giant@example.com",
            subject: "proposal",
            message: giantString,
        },
        { "content-length": "16000" }
    )

    const res = await POST(req)
    assert.strictEqual(res.status, 413)
    const json = await res.json()
    assert.strictEqual(json.error, "Payload too large")
})

await test("POST /api/contact triggers 429 when IP rate limit is exceeded", async () => {
    rateLimiter.reset()
    emailRateLimiter.reset()
    const clientIP = "198.51.100.22"

    setCustomTransporter({
        sendMail: async () => ({ messageId: "msg_rate_test" }),
    })
    const origHost = process.env.SMTP_HOST
    const origUser = process.env.SMTP_USER
    process.env.SMTP_HOST = "smtp.test.com"
    process.env.SMTP_USER = "test@test.com"

    try {
        const makeReq = (i) =>
            createMockRequest(
                {
                    name: "Repeated Submitter",
                    email: `user${i}@example.com`,
                    subject: "general",
                    message: "This is a legitimate message sent multiple times.",
                    formStartTime: Date.now() - 5000,
                },
                { "x-real-ip": clientIP }
            )

        // Default IP rate limit is 5 requests per 15 minutes
        for (let i = 0; i < 5; i++) {
            const res = await POST(makeReq(i))
            assert.strictEqual(res.status, 200)
        }

        // 6th request from same IP must trigger 429
        const blockedRes = await POST(makeReq(99))
        assert.strictEqual(blockedRes.status, 429)

        const retryAfter = blockedRes.headers.get("retry-after")
        assert.ok(Number(retryAfter) > 0, "Must set Retry-After header")

        const json = await blockedRes.json()
        assert.strictEqual(json.error, "Too many requests")
    } finally {
        if (origHost !== undefined) {
            process.env.SMTP_HOST = origHost
        } else {
            delete process.env.SMTP_HOST
        }
        if (origUser !== undefined) {
            process.env.SMTP_USER = origUser
        } else {
            delete process.env.SMTP_USER
        }
        setCustomTransporter(null)
        rateLimiter.reset()
        emailRateLimiter.reset()
    }
})

await test("POST /api/contact returns 500 when mail transporter fails", async () => {
    rateLimiter.reset()
    emailRateLimiter.reset()

    const origHost = process.env.SMTP_HOST
    const origUser = process.env.SMTP_USER
    process.env.SMTP_HOST = "smtp.test.com"
    process.env.SMTP_USER = "test@test.com"

    setCustomTransporter({
        sendMail: async () => {
            throw new Error("SMTP server connection timeout")
        },
    })

    try {
        const req = createMockRequest({
            name: "Valid User",
            email: "user@valid.com",
            subject: "feedback",
            message: "Just wanted to share some feedback on the portfolio UI.",
            formStartTime: Date.now() - 5000,
        })

        const res = await POST(req)
        assert.strictEqual(res.status, 500)
        const json = await res.json()
        assert.strictEqual(json.error, "Email service temporarily unavailable")
    } finally {
        if (origHost !== undefined) {
            process.env.SMTP_HOST = origHost
        } else {
            delete process.env.SMTP_HOST
        }
        if (origUser !== undefined) {
            process.env.SMTP_USER = origUser
        } else {
            delete process.env.SMTP_USER
        }
        setCustomTransporter(null)
    }
})

await test("POST /api/contact triggers 429 when single recipient email rate limit is exceeded (email bombing guard)", async () => {
    rateLimiter.reset()
    emailRateLimiter.reset()

    setCustomTransporter({
        sendMail: async () => ({ messageId: "msg_email_rate_test" }),
    })
    const origHost = process.env.SMTP_HOST
    const origUser = process.env.SMTP_USER
    process.env.SMTP_HOST = "smtp.test.com"
    process.env.SMTP_USER = "test@test.com"

    try {
        const makeReq = (ip) =>
            createMockRequest(
                {
                    name: "Repeated Email Target",
                    email: "single-target@example.com",
                    subject: "proposal",
                    message: "Valid message content for recipient test.",
                    formStartTime: Date.now() - 5000,
                },
                { "x-real-ip": ip }
            )

        // Email limit is 3 submissions per 30 minutes (even from rotating IPs)
        for (let i = 0; i < 3; i++) {
            const res = await POST(makeReq(`192.168.10.${i}`))
            assert.strictEqual(res.status, 200)
        }

        // 4th request targeting the same email must trigger 429
        const blockedRes = await POST(makeReq("192.168.10.99"))
        assert.strictEqual(blockedRes.status, 429)

        const json = await blockedRes.json()
        assert.strictEqual(json.error, "Too many requests")
        assert.ok(json.message.includes("email address"))
    } finally {
        if (origHost !== undefined) {
            process.env.SMTP_HOST = origHost
        } else {
            delete process.env.SMTP_HOST
        }
        if (origUser !== undefined) {
            process.env.SMTP_USER = origUser
        } else {
            delete process.env.SMTP_USER
        }
        setCustomTransporter(null)
        rateLimiter.reset()
        emailRateLimiter.reset()
    }
})

// =========================================================================
// SUMMARY
// =========================================================================
console.log("\n=======================================================")
console.log(`  Summary: ${passedTests}/${totalTests} tests passed (${failedTests} failed)`)
console.log("=======================================================\n")

if (failedTests > 0) {
    process.exit(1)
}
