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
