export function trimLines(text: string): string {
    return text.split('\n').map(line => line.trim()).join('\n');
}