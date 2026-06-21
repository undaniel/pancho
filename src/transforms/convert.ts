export interface CsvOptions {
    delimiter?: string;
    quote?: string;
    hasHeader?: boolean;
}

const DEFAULT_OPTIONS: Required<CsvOptions> = {
    delimiter: ',',
    quote: '"',
    hasHeader: true,
};

function parseCsvRow(row: string, delimiter: string, quote: string): string[] {
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        if (inQuotes) {
            if (ch === quote) {
                if (row[i + 1] === quote) {
                    current += quote;
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                current += ch;
            }
        } else {
            if (ch === quote && current === '') {
                inQuotes = true;
            } else if (ch === delimiter) {
                cells.push(current);
                current = '';
            } else {
                current += ch;
            }
        }
    }
    cells.push(current);
    return cells;
}

function parseCsv(text: string, options: Required<CsvOptions>): string[][] {
    return text.split(/\r?\n/).filter(r => r.length > 0).map(r => parseCsvRow(r, options.delimiter, options.quote));
}

function csvToRows(text: string, opts: CsvOptions = {}): string[][] {
    const options = { ...DEFAULT_OPTIONS, ...opts };
    return parseCsv(text, options);
}

export function csvToJSON(text: string, opts: CsvOptions = {}): { result: string; error?: string } {
    try {
        const options = { ...DEFAULT_OPTIONS, ...opts };
        const rows = csvToRows(text, options);
        if (rows.length === 0) return { result: '[]' };
        const headers = options.hasHeader ? rows[0] : rows[0].map((_, i) => `col${i + 1}`);
        const dataRows = options.hasHeader ? rows.slice(1) : rows;
        const result = dataRows.map(row => {
            const obj: Record<string, string> = {};
            headers.forEach((h, i) => { obj[h] = row[i] ?? ''; });
            return obj;
        });
        return { result: JSON.stringify(result, null, 2) };
    } catch (e) {
        return { result: text, error: 'Invalid CSV' };
    }
}

export function jsonToCSV(text: string, opts: CsvOptions = {}): { result: string; error?: string } {
    try {
        const options = { ...DEFAULT_OPTIONS, ...opts };
        const data = JSON.parse(text);
        if (!Array.isArray(data) || data.length === 0) {
            return { result: text, error: 'JSON must be a non-empty array of objects' };
        }
        const headers = Object.keys(data[0]);
        const escape = (v: unknown): string => {
            const s = v === null || v === undefined ? '' : String(v);
            if (s.includes(options.delimiter) || s.includes(options.quote) || s.includes('\n')) {
                return options.quote + s.replace(new RegExp(options.quote, 'g'), options.quote + options.quote) + options.quote;
            }
            return s;
        };
        const lines = [headers.join(options.delimiter)];
        for (const row of data) {
            lines.push(headers.map(h => escape((row as Record<string, unknown>)[h])).join(options.delimiter));
        }
        return { result: lines.join('\n') };
    } catch (e) {
        return { result: text, error: 'Invalid JSON' };
    }
}

export function csvToTSV(text: string): string {
    const rows = csvToRows(text);
    return rows.map(r => r.join('\t')).join('\n');
}

export function tsvToCSV(text: string): string {
    return text.split(/\r?\n/).map(row => {
        const cells = row.split('\t');
        return cells.map(c => c.includes(',') || c.includes('"') ? '"' + c.replace(/"/g, '""') + '"' : c).join(',');
    }).join('\n');
}

export function csvToMarkdown(text: string, opts: CsvOptions = {}): { result: string; error?: string } {
    try {
        const rows = csvToRows(text, opts);
        if (rows.length === 0) return { result: '' };
        const widths = rows[0].map((_, i) => Math.max(...rows.map(r => (r[i] ?? '').length)));
        const formatRow = (r: string[]) => '| ' + r.map((c, i) => (c ?? '').padEnd(widths[i])).join(' | ') + ' |';
        const header = formatRow(rows[0]);
        const separator = '| ' + widths.map(w => '-'.repeat(w)).join(' | ') + ' |';
        const body = rows.slice(1).map(formatRow);
        return { result: [header, separator, ...body].join('\n') };
    } catch (e) {
        return { result: text, error: 'Invalid CSV' };
    }
}

export function markdownTableToCSV(text: string): { result: string; error?: string } {
    try {
        const lines = text.split(/\r?\n/).filter(l => l.trim().startsWith('|'));
        if (lines.length < 2) return { result: text, error: 'Not a markdown table' };
        const rows = lines
            .filter(l => !/^\|\s*[-:|\s]+\s*\|?$/.test(l.trim()))
            .map(l => l.replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
        return {
            result: rows.map(r => r.map(c => c.includes(',') || c.includes('"') ? '"' + c.replace(/"/g, '""') + '"' : c).join(',')).join('\n')
        };
    } catch (e) {
        return { result: text, error: 'Invalid markdown table' };
    }
}
