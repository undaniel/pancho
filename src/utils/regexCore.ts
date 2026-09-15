export type RegexMode = 'exec' | 'replace' | 'count';

export interface RegexJob {
    pattern: string;
    flags: string;
    text: string;
    mode: RegexMode;
    replacement?: string;
    maxMatches?: number;
}

export interface RegexMatch {
    match: string;
    index: number;
    groups: string[];
}

export interface RegexJobResult {
    matches?: RegexMatch[];
    result?: string;
    count?: number;
    error?: RegexErrorCode;
}

export type RegexErrorCode = 'invalid' | 'timeout' | 'complex' | 'exec' | 'empty';

const DEFAULT_MAX_MATCHES = 10000;

export function executeRegexJob(job: RegexJob): RegexJobResult {
    if (!job.pattern) return { error: 'empty' };

    let regex: RegExp;
    try {
        regex = new RegExp(job.pattern, job.flags);
    } catch {
        return { error: 'invalid' };
    }

    try {
        if (job.mode === 'replace') {
            const count = countMatches(regex, job.text, DEFAULT_MAX_MATCHES);
            const result = job.text.replace(regex, job.replacement ?? '');
            return { result, count };
        }

        if (job.mode === 'count') {
            return { count: countMatches(regex, job.text, job.maxMatches ?? DEFAULT_MAX_MATCHES) };
        }

        const matches: RegexMatch[] = [];
        const max = job.maxMatches ?? DEFAULT_MAX_MATCHES;
        let m: RegExpExecArray | null;
        regex.lastIndex = 0;
        while ((m = regex.exec(job.text)) !== null && matches.length < max) {
            matches.push({
                match: m[0],
                index: m.index,
                groups: m.slice(1).map(g => g ?? ''),
            });
            if (m.index === regex.lastIndex) regex.lastIndex++;
        }
        return { matches };
    } catch {
        return { error: 'exec' };
    }
}

function countMatches(regex: RegExp, text: string, max: number): number {
    const probe = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
    let count = 0;
    let m: RegExpExecArray | null;
    while ((m = probe.exec(text)) !== null) {
        count++;
        if (m.index === probe.lastIndex) probe.lastIndex++;
        if (count >= max) break;
    }
    return count;
}

const QUANTIFIER = '(?:[*+]|\\{\\d+,\\})';

/**
 * Heuristic pre-validation: rejects the classic catastrophic-backtracking
 * shapes (nested/unbounded quantifiers) without executing the pattern.
 * The worker timeout remains the definitive safety net.
 */
export function isPotentiallyCatastrophic(pattern: string): boolean {
    if (!pattern) return false;
    if (pattern.length > 10000) return true;

    const stripped = pattern
        .replace(/\\./g, '_')
        .replace(/\[(?:\\.|[^\]\\])*\]/g, 'C');

    const quantifiedGroup = new RegExp(
        `\\([^()]*${QUANTIFIER}[^()]*\\)\\s*${QUANTIFIER}`
    );
    const nestedQuantifiedGroup = new RegExp(
        `\\([^()]*\\([^()]*${QUANTIFIER}[^()]*\\)[^()]*${QUANTIFIER}[^()]*\\)\\s*${QUANTIFIER}`
    );
    const repeatedWildcard = /\.(?:\*|\+)(?:\?)?\s*\.(?:\*|\+)/.test(stripped);

    return quantifiedGroup.test(stripped) || nestedQuantifiedGroup.test(stripped) || repeatedWildcard;
}
