import { format, isValid } from "date-fns";

function getOrdinal(day: number): string {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
        case 1: return `${day}st`;
        case 2: return `${day}nd`;
        case 3: return `${day}rd`;
        default: return `${day}th`;
    }
}

function parseDDMMYYYY(dateStr: string): Date | null {
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    const [dd, mm, yyyy] = parts;
    const isoStr = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    const date = new Date(isoStr);
    return isNaN(date.getTime()) ? null : date;
}

const formatDateWithSuffix = (date: Date | string): string => {
    try {
        let parsedDate: Date;

        if (typeof date === "string") {
            parsedDate = parseDDMMYYYY(date) ?? new Date(date);
        } else {
            parsedDate = date;
        }

        if (!parsedDate || !isValid(parsedDate)) return "";

        const day = getOrdinal(parsedDate.getDate());
        const month = format(parsedDate, "MMM");
        const year = format(parsedDate, "yyyy");

        return `${day} ${month}, ${year}`;
    } catch {
        console.log("Error formatting date:", date);
        return "";
    }
};

export default formatDateWithSuffix;
