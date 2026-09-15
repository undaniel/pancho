export interface ClipboardEntry {
    text: string;
    time: number;
}

export class ClipboardHistory {
    private entries: ClipboardEntry[] = [];

    constructor(private maxSize = 20) {}

    setMaxSize(size: number): void {
        if (Number.isInteger(size) && size > 0) {
            this.maxSize = size;
            if (this.entries.length > size) this.entries.length = size;
        }
    }

    push(text: string, time: number = Date.now()): boolean {
        if (!text) return false;
        if (this.entries.length > 0 && this.entries[0].text === text) return false;

        const existing = this.entries.findIndex(entry => entry.text === text);
        if (existing >= 0) this.entries.splice(existing, 1);

        this.entries.unshift({ text, time });
        if (this.entries.length > this.maxSize) this.entries.length = this.maxSize;
        return true;
    }

    list(): ClipboardEntry[] {
        return [...this.entries];
    }

    load(entries: ClipboardEntry[]): void {
        for (let i = entries.length - 1; i >= 0; i--) {
            const entry = entries[i];
            if (entry && typeof entry.text === 'string' && typeof entry.time === 'number') {
                this.push(entry.text, entry.time);
            }
        }
    }

    get size(): number {
        return this.entries.length;
    }
}
