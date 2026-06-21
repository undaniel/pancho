export function decodeJWT(token: string): { result: string; error?: string } {
    const parts = token.trim().split('.');
    if (parts.length < 2) {
        return { result: token, error: 'Invalid JWT: needs 3 parts separated by dots' };
    }
    try {
        const decode = (part: string): unknown => {
            let base64 = part.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) base64 += '=';
            return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
        };
        const header = decode(parts[0]);
        const payload = decode(parts[1]);
        const signature = parts[2] || '';

        const output: Record<string, unknown> = { header, payload };
        if (signature) output.signature = signature;

        if (payload && typeof payload === 'object' && 'exp' in (payload as Record<string, unknown>)) {
            const exp = (payload as Record<string, unknown>).exp;
            if (typeof exp === 'number') {
                const date = new Date(exp * 1000);
                (output as Record<string, unknown>).expiresAt = date.toISOString();
                (output as Record<string, unknown>).expired = date.getTime() < Date.now();
            }
        }

        return { result: JSON.stringify(output, null, 2) };
    } catch (e) {
        return { result: token, error: 'Invalid JWT: cannot decode base64/JSON' };
    }
}
