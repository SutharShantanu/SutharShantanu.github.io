export interface FormatFileSizeOptions {
    sizeKB: number;
}

export function formatFileSize(sizeKB: number): string {
    if (typeof sizeKB !== "number" || sizeKB <= 0) return "0 KB";

    const sizeMB = sizeKB / 1024;
    const sizeGB = sizeMB / 1024;

    if (sizeGB >= 1) {
        return `${sizeGB.toFixed(2)} GB`;
    } else if (sizeMB >= 1) {
        return `${sizeMB.toFixed(2)} MB`;
    } else {
        return `${sizeKB.toFixed(2)} KB`;
    }
}
