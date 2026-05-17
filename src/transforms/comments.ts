export function commentLine(text: string, commentSymbol: string = '//'): string {
    return text.split('\n').map(line => `${commentSymbol}${line}`).join('\n');
}

export function uncommentLine(text: string, commentSymbol: string = '//'): string {
    return text.split('\n').map(line => {
        const trimmed = line.trimStart();
        if (trimmed.startsWith(commentSymbol)) {
            return line.substring(line.indexOf(commentSymbol) + commentSymbol.length);
        }
        return line;
    }).join('\n');
}

export function commentBlock(text: string, startComment: string = '/*', endComment: string = '*/'): string {
    return `${startComment}${text}${endComment}`;
}

export function uncommentBlock(text: string, startComment: string = '/*', endComment: string = '*/'): string {
    const startIdx = text.indexOf(startComment);
    const endIdx = text.lastIndexOf(endComment);
    if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
        return text.substring(startIdx + startComment.length, endIdx);
    }
    return text;
}