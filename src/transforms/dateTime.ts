export function formatShortDateTime(locale?: string): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
    return `${dateStr} ${timeStr}`;
}

export function formatLongDateTime(locale?: string): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = now.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
    return `${dateStr} ${timeStr}`;
}

export function formatCustomDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}