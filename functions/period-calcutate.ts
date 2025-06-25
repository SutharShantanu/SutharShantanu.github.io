export function PeriodCalculate(from: string, to: string): string {
    const now = new Date();
    const parseDate = (dateStr: string): Date => {
        if (dateStr.toLowerCase().includes("present")) return now;
        return new Date(Date.parse(`01 ${dateStr}`));
    };

    const fromDate = parseDate(from);
    const toDate = parseDate(to);

    const totalMonths =
        (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
        (toDate.getMonth() - fromDate.getMonth());

    if (totalMonths < 1) return "Less than a month";

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const result = [];
    if (years > 0) result.push(`${years} Year${years > 1 ? "s" : ""}`);
    if (months > 0) result.push(`${months} Month${months > 1 ? "s" : ""}`);

    return result.join(" ");
}

export function formatJoinDate(month: number, year: number): string {
    const date = new Date(year, month - 1);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" }).replace(" ", ", ");
}

export function formatJobDuration(duration: string): string {
    const yearMatch = duration.match(/(\d+)\s*yr/);
    const monthMatch = duration.match(/(\d+)\s*mo/);

    const years = yearMatch ? parseInt(yearMatch[1], 10) : 0;
    const months = monthMatch ? parseInt(monthMatch[1], 10) : 0;

    const parts = [];
    if (years > 0) parts.push(`${years} Year${years > 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} Month${months > 1 ? "s" : ""}`);

    return parts.join(", ") || "Less than a month";
}
