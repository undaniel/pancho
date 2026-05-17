import { getSelection, getDocumentText } from './editor';

export function analyzeText(): { hasSelection: boolean; text: string } {
    const selection = getSelection();
    if (selection !== undefined && selection.length > 0) {
        return { hasSelection: true, text: selection };
    }
    return { hasSelection: false, text: getDocumentText() };
}

export function getTextForAnalysis(): string {
    const selection = getSelection();
    return selection !== undefined && selection.length > 0 ? selection : getDocumentText();
}

export function getTextForTransform(): string | undefined {
    return getSelection();
}