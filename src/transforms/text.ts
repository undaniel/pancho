const DIACRITICS_MAP: Record<string, string> = {
    'á': 'a', 'à': 'a', 'ä': 'a', 'â': 'a', 'ã': 'a', 'å': 'a', 'æ': 'ae',
    'é': 'e', 'è': 'e', 'ë': 'e', 'ê': 'e',
    'í': 'i', 'ì': 'i', 'ï': 'i', 'î': 'i',
    'ó': 'o', 'ò': 'o', 'ö': 'o', 'ô': 'o', 'õ': 'o', 'ø': 'o',
    'ú': 'u', 'ù': 'u', 'ü': 'u', 'û': 'u',
    'ñ': 'n', 'ç': 'c',
    'ý': 'y', 'ÿ': 'y',
    'Á': 'A', 'À': 'A', 'Ä': 'A', 'Â': 'A', 'Ã': 'A', 'Å': 'A', 'Æ': 'AE',
    'É': 'E', 'È': 'E', 'Ë': 'E', 'Ê': 'E',
    'Í': 'I', 'Ì': 'I', 'Ï': 'I', 'Î': 'I',
    'Ó': 'O', 'Ò': 'O', 'Ö': 'O', 'Ô': 'O', 'Õ': 'O', 'Ø': 'O',
    'Ú': 'U', 'Ù': 'U', 'Ü': 'U', 'Û': 'U',
    'Ñ': 'N', 'Ç': 'C',
    'Ý': 'Y', 'Ÿ': 'Y',
};

export function removeDiacritics(text: string): string {
    return text.replace(/[áàäâãåæéèëêíìïîóòöôõøúùüûñçýÿÁÀÄÂÃÅÆÉÈËÊÍÌÏÎÓÒÖÔÕØÚÙÜÛÑÇÝŸ]/g, c => DIACRITICS_MAP[c] ?? c);
}

export function stripHTMLTags(text: string): string {
    return text
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export function wrapText(text: string, width: number = 80): string {
    if (width <= 0) return text;
    const paragraphs = text.split('\n');
    return paragraphs.map(p => {
        if (p.trim() === '') return p;
        const words = p.split(' ');
        const lines: string[] = [];
        let current = '';
        for (const word of words) {
            if ((current + ' ' + word).trim().length > width && current) {
                lines.push(current);
                current = word;
            } else {
                current = (current + ' ' + word).trim();
            }
        }
        if (current) lines.push(current);
        return lines.join('\n');
    }).join('\n');
}

export function unwrapText(text: string): string {
    return text
        .replace(/([^\n])\n([^\n])/g, '$1 $2')
        .replace(/  +/g, ' ');
}
