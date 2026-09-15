export const MIN_LOREM_WORDS = 1;
export const MAX_LOREM_WORDS = 100000;

function clampWords(words: number): number {
    if (!Number.isFinite(words)) return 50;
    return Math.min(MAX_LOREM_WORDS, Math.max(MIN_LOREM_WORDS, Math.floor(words)));
}

export function generateLoremIpsum(words: number = 50): string {
    const lorem = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum';
    const count = clampWords(words);
    const pool = lorem.split(' ');
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
        result.push(pool[i % pool.length]);
    }
    return result.join(' ');
}
