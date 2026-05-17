export function formatSQL(text: string): string {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE'];

    let formatted = text;
    for (const keyword of keywords) {
        const regex = new RegExp('\\b' + keyword + '\\b', 'gi');
        formatted = formatted.replace(regex, '\n' + keyword);
    }

    formatted = formatted
        .replace(/,\s*/g, ',\n  ')
        .replace(/\s+/g, ' ')
        .trim();

    return formatted.replace(/^\n/, '');
}