export interface SpamCheckResult {
    isSpam: boolean
    reasons: string[]
    score: number
}

export function detectSpam(data: {
    name: string
    email: string
    subject: string
    message: string
}): SpamCheckResult {
    const reasons: string[] = []
    let score = 0

    // Check for suspicious patterns
    const suspiciousPatterns = [
        /\b(viagra|cialis|casino|lottery|winner|congratulations)\b/i,
        /\b(click here|act now|limited time|urgent|free money)\b/i,
        /\b(nigerian prince|inheritance|million dollars)\b/i,
        /\$\d+[,.]?\d*\s*(million|thousand|k)/i,
        /\b(crypto|bitcoin|investment opportunity)\b/i,
    ]

    const allText = `${data.name} ${data.email} ${data.subject} ${data.message}`.toLowerCase()

    suspiciousPatterns.forEach((pattern) => {
        if (pattern.test(allText)) {
            reasons.push("Contains suspicious keywords")
            score += 25
        }
    })

    // Check for excessive links
    const linkCount = (data.message.match(/https?:\/\/[^\s]+/g) || []).length
    if (linkCount > 3) {
        reasons.push("Too many links")
        score += 30
    }

    // Check for excessive capitalization
    const capsRatio = (data.message.match(/[A-Z]/g) || []).length / data.message.length
    if (capsRatio > 0.5 && data.message.length > 20) {
        reasons.push("Excessive capitalization")
        score += 20
    }

    // Check for repeated characters
    if (/(.)\1{4,}/.test(data.message)) {
        reasons.push("Repeated characters")
        score += 15
    }

    // Check for suspicious email patterns
    const suspiciousEmailPatterns = [/\d{5,}@/, /@[^.]+\.(tk|ml|ga|cf)$/i, /noreply|no-reply/i]

    suspiciousEmailPatterns.forEach((pattern) => {
        if (pattern.test(data.email)) {
            reasons.push("Suspicious email pattern")
            score += 20
        }
    })

    // Check message length (too short or too long can be suspicious)
    if (data.message.length < 10) {
        reasons.push("Message too short")
        score += 10
    } else if (data.message.length > 2000) {
        reasons.push("Message too long")
        score += 15
    }

    // Check for name/email mismatch patterns
    if (data.name.toLowerCase().includes("test") && data.email.includes("test")) {
        reasons.push("Test-like submission")
        score += 10
    }

    return {
        isSpam: score >= 50,
        reasons,
        score,
    }
}
