export function tabsToSpaces(text: string, tabSize: number = 4): string {
    return text.replace(/\t/g, ' '.repeat(tabSize));
}

export function spacesToTabs(text: string, tabSize: number = 4): string {
    const lines = text.split('\n');
    return lines.map(line => {
        let result = '';
        for (let i = 0; i < line.length; i++) {
            if (line[i] === ' ') {
                const spacesToNextTab = tabSize - (result.length % tabSize);
                result += '\t';
                i += spacesToNextTab - 1;
            } else {
                result += line[i];
            }
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