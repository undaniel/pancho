export function tabsToSpaces(text: string, tabSize: number = 4): string {
    return text.replace(/\t/g, ' '.repeat(tabSize));
}

export function spacesToTabs(text: string, tabSize: number = 4): string {
    if (tabSize <= 0) return text;
    const lines = text.split('\n');
    return lines.map(line => {
        let result = '';
        let column = 0;
        let i = 0;
        while (i < line.length) {
            if (line[i] !== ' ') {
                result += line[i];
                column++;
                i++;
                continue;
            }
            let end = i;
            while (end < line.length && line[end] === ' ') end++;
            let spaces = end - i;
            while (spaces > 0) {
                const toTab = tabSize - (column % tabSize);
                if (spaces >= toTab) {
                    result += '\t';
                    column += toTab;
                    spaces -= toTab;
                } else {
                    result += ' '.repeat(spaces);
                    column += spaces;
                    spaces = 0;
                }
            }
            i = end;
        }
        return result;
    }).join('\n');
}

export function increaseIndent(text: string, tabSize: number = 4): string {
    const indent = ' '.repeat(tabSize);
    return text.split('\n').map(line => indent + line).join('\n');
}

export function decreaseIndent(text: string, tabSize: number = 4): string {
    const indent = ' '.repeat(tabSize);
    return text.split('\n').map(line => {
        if (line.startsWith(indent)) {
            return line.substring(tabSize);
        }
        return line;
    }).join('\n');
}