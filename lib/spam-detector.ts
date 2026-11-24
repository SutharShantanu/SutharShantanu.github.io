export interface SpamCheckResult {
    isSpam: boolean
    reasons: string[]
    score: number
}

// Known disposable/temporary email provider domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
    "10minutemail.com",
    "tempmail.com",
    "guerrillamail.com",
    "mailinator.com",
    "throwawaymail.com",
    "trashmail.com",
    "yopmail.com",
    "dispostable.com",
    "sharklasers.com",
    "crazymailing.com",
    "burnermail.io",
    "fakemailgenerator.com",
    "getairmail.com",
    "temp-mail.org",
    "mohmal.com",
])

// High-risk or frequently abused TLDs commonly seen in contact form spam
const SUSPICIOUS_TLDS = /\.(tk|ml|ga|cf|gq|top|xyz|work|click|loan|fit|rest|buzz|icu|monster)(\/|$|\s)/i

export function detectSpam(data: {
    name: string
    email: string
    subject: string
    message: string
}): SpamCheckResult {
    const reasons: string[] = []
    let score = 0

    const name = data.name.trim()
    const email = data.email.trim().toLowerCase()
    const subject = data.subject.trim()
    const message = data.message.trim()
    const allText = `${name} ${email} ${subject} ${message}`.toLowerCase()

    // 1. Phishing / Scams / Pharmaceuticals / Crypto patterns
    const financialScamPatterns = [
        /\b(viagra|cialis|levitra)\b/i,
        /\b(casino|lottery|jackpot|betting|poker)\b/i,
        /\b(nigerian prince|inheritance funds|transfer your share|beneficiary of)\b/i,
        /\b(crypto profit|bitcoin doubling|guaranteed returns|forex signals|investment opportunity)\b/i,
        /\b(claim your prize|winner notification|urgent transfer|wire transfer)\b/i,
        /\$\d+[,.]?\d*\s*(million|thousand|billion|k)\b/i,
    ]

    financialScamPatterns.forEach((pattern) => {
        if (pattern.test(allText)) {
            reasons.push("Contains financial scam or pharmaceutical keywords")
            score += 35
        }
    })

    // 2. Automated SEO & Marketing spam
    const seoSpamPatterns = [
        /\b(rank #?1 on google|first page of google|increase website traffic)\b/i,
        /\b(guest post(ing)?|backlink building|da\d+ pa\d+|dofollow links)\b/i,
        /\b(seo audit report|white hat seo|boost your domain authority)\b/i,
        /\b(b2b leads|email lists for sale|targeted email list)\b/i,
    ]

    seoSpamPatterns.forEach((pattern) => {
        if (pattern.test(allText)) {
            reasons.push("Contains unsolicited SEO or marketing spam patterns")
            score += 30
        }
    })

    // 3. Script / HTML injection patterns (XSS / Bot payloads)
    const scriptPatterns = [
        /<script\b[^>]*>/i,
        /<\/script>/i,
        /<iframe\b[^>]*>/i,
        /javascript:\s*/i,
        /\bon\w+\s*=/i, // onload=, onerror=, onclick=
        /<svg\b[^>]*\bon\w+/i,
        /<img\b[^>]*\bonerror/i,
    ]

    for (const pattern of scriptPatterns) {
        if (pattern.test(message) || pattern.test(name) || pattern.test(subject)) {
            reasons.push("Contains HTML/script injection payload")
            score += 50
            break
        }
    }

    // 4. URL checks in Name field (spambots often put URLs or keywords in name)
    if (/https?:\/\/|www\.|\.com|\.org|\.net|\.io/i.test(name)) {
        reasons.push("URL or domain found in sender name")
        score += 45
    }

    // 5. Link count and suspicious TLDs in message
    const links = message.match(/https?:\/\/[^\s]+/gi) || []
    if (links.length > 2) {
        reasons.push("Excessive links in message")
        score += 25 + (links.length - 2) * 10
    }

    if (SUSPICIOUS_TLDS.test(message) || SUSPICIOUS_TLDS.test(email)) {
        reasons.push("Links to high-risk or suspicious TLD")
        score += 30
    }

    // 6. Disposable / Throwaway email domains
    const emailDomain = email.split("@")[1] || ""
    if (DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
        reasons.push("Disposable or temporary email service")
        score += 40
    }

    // 7. Suspicious email structure
    const suspiciousEmailPatterns = [
        /^\d{6,}@/, // pure long digits
        /noreply|no-reply/i,
        /\+spam/i,
    ]
    for (const pat of suspiciousEmailPatterns) {
        if (pat.test(email)) {
            reasons.push("Suspicious email pattern")
            score += 20
            break
        }
    }

    // 8. Excessive capitalization
    if (message.length > 30) {
        const uppercaseCount = (message.match(/[A-Z]/g) || []).length
        const lettersCount = (message.match(/[a-zA-Z]/g) || []).length
        if (lettersCount > 0 && uppercaseCount / lettersCount > 0.6) {
            reasons.push("Excessive capitalization")
            score += 20
        }
    }

    // 9. Character repetition (e.g. "aaaaaa", "!!!!!!!")
    if (/(.)\1{5,}/.test(message)) {
        reasons.push("Excessive repeated characters")
        score += 15
    }

    // 10. Gibberish / consonant cluster in name (e.g. "dfghjklmn")
    if (/[bcdfghjklmnpqrstvwxyz]{7,}/i.test(name)) {
        reasons.push("Name appears to be random keyboard mash")
        score += 25
    }

    // 11. Extreme message length bounds
    if (message.length < 10) {
        reasons.push("Message too short")
        score += 15
    } else if (message.length > 2000) {
        reasons.push("Message too long")
        score += 25
    }

    return {
        isSpam: score >= 50,
        reasons,
        score,
    }
}
