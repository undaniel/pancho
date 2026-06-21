export interface RegexTestResult {
    matches: { match: string; index: number; groups: string[] }[];
    error?: string;
}

export function testRegex(pattern: string, flags: string, text: string): RegexTestResult {
    if (!pattern) return { matches: [], error: 'Empty pattern' };
    try {
        const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
        const matches: { match: string; index: number; groups: string[] }[] = [];
        let m: RegExpExecArray | null;
        let safety = 0;
        while ((m = regex.exec(text)) !== null && safety < 10000) {
            matches.push({
                match: m[0],
                index: m.index,
                groups: m.slice(1).map(g => g ?? ''),
            });
            if (m.index === regex.lastIndex) regex.lastIndex++;
            safety++;
        }
        return { matches };
    } catch (e) {
        return { matches: [], error: 'Invalid regex: ' + String(e) };
    }
}

export function formatRegexResult(pattern: string, flags: string, text: string): { result: string; error?: string } {
    const r = testRegex(pattern, flags, text);
    if (r.error) return { result: text, error: r.error };
    if (r.matches.length === 0) return { result: 'No matches found' };
    const lines = r.matches.map((m, i) => {
        const base = `[${i + 1}] "${m.match}" @${m.index}`;
        return m.groups.length > 0 ? base + `  groups: ${JSON.stringify(m.groups)}` : base;
    });
    return { result: `Pattern: /${pattern}/${flags}\nMatches (${r.matches.length}):\n${lines.join('\n')}` };
}
