import * as vscode from 'vscode';

export interface I18nStrings {
    extensionName: string;
    extensionDescription: string;
    commands: {
        cleanWhitespace: string;
        cleanLineEndings: string;
        trimLines: string;
        toUpperCase: string;
        toLowerCase: string;
        toTitleCase: string;
        removeDuplicateLines: string;
        sortAscending: string;
        sortDescending: string;
        reverseLines: string;
        joinLines: string;
        removeEmptyLines: string;
        countWords: string;
        countCharacters: string;
        countLines: string;
        base64Encode: string;
        base64Decode: string;
        urlEncode: string;
        urlDecode: string;
    };
    menus: {
        pancho: string;
        edicion: string;
        lineas: string;
        caso: string;
        tabulaciones: string;
        finDeLinea: string;
        textoGeneral: string;
        codificacion: string;
        formateo: string;
        hashYBinario: string;
        insertar: string;
        comentarios: string;
        desarrolladores: string;
        escapar: string;
    };
    messages: {
        noEditor: string;
        fileTooLarge: string;
        operationSuccess: string;
        operationError: string;
    };
}

const esStrings: I18nStrings = {
    extensionName: 'Pancho',
    extensionDescription: 'Limpia y formatear texto como Notepad++',
    commands: {
        cleanWhitespace: 'Limpiar espacios en blanco',
        cleanLineEndings: 'Limpiar saltos de línea',
        trimLines: 'Recortar líneas',
        toUpperCase: 'Convertir a MAYÚSCULAS',
        toLowerCase: 'Convertir a minúsculas',
        toTitleCase: 'Convertir a Título',
        removeDuplicateLines: 'Eliminar líneas duplicadas',
        sortAscending: 'Ordenar A-Z',
        sortDescending: 'Ordenar Z-A',
        reverseLines: 'Revertir líneas',
        joinLines: 'Unir líneas',
        removeEmptyLines: 'Eliminar líneas vacías',
        countWords: 'Contar palabras',
        countCharacters: 'Contar caracteres',
        countLines: 'Contar líneas',
        base64Encode: 'Codificar Base64',
        base64Decode: 'Decodificar Base64',
        urlEncode: 'Codificar URL',
        urlDecode: 'Decodificar URL',
    },
    menus: {
        pancho: 'Pancho',
        edicion: 'Edición',
        lineas: 'Líneas',
        caso: 'Mayúsculas y minúsculas',
        tabulaciones: 'Tabulaciones',
        finDeLinea: 'Fin de línea',
        textoGeneral: 'Texto general',
        codificacion: 'Codificación',
        formateo: 'Formateo',
        hashYBinario: 'Hash y binario',
        insertar: 'Insertar',
        comentarios: 'Comentar / Descomentar',
        desarrolladores: 'Desarrolladores',
        escapar: 'Escapar',
    },
    messages: {
        noEditor: 'No hay editor activo',
        fileTooLarge: 'Archivo demasiado grande',
        operationSuccess: 'Operación completada',
        operationError: 'Error en la operación',
    },
};

const enStrings: I18nStrings = {
    extensionName: 'Pancho',
    extensionDescription: 'Clean and format text like Notepad++',
    commands: {
        cleanWhitespace: 'Clean whitespace',
        cleanLineEndings: 'Clean line endings',
        trimLines: 'Trim lines',
        toUpperCase: 'Convert to UPPERCASE',
        toLowerCase: 'Convert to lowercase',
        toTitleCase: 'Convert to Title Case',
        removeDuplicateLines: 'Remove duplicate lines',
        sortAscending: 'Sort A-Z',
        sortDescending: 'Sort Z-A',
        reverseLines: 'Reverse lines',
        joinLines: 'Join lines',
        removeEmptyLines: 'Remove empty lines',
        countWords: 'Count words',
        countCharacters: 'Count characters',
        countLines: 'Count lines',
        base64Encode: 'Encode Base64',
        base64Decode: 'Decode Base64',
        urlEncode: 'Encode URL',
        urlDecode: 'Decode URL',
    },
    menus: {
        pancho: 'Pancho',
        edicion: 'Editing',
        lineas: 'Lines',
        caso: 'Case',
        tabulaciones: 'Tabs',
        finDeLinea: 'Line endings',
        textoGeneral: 'General text',
        codificacion: 'Encoding',
        formateo: 'Formatting',
        hashYBinario: 'Hash and binary',
        insertar: 'Insert',
        comentarios: 'Comment / Uncomment',
        desarrolladores: 'Developers',
        escapar: 'Escape',
    },
    messages: {
        noEditor: 'No active editor',
        fileTooLarge: 'File too large',
        operationSuccess: 'Operation completed',
        operationError: 'Operation error',
    },
};

export function getStrings(): I18nStrings {
    const lang = vscode.env.language;
    if (lang.startsWith('es')) {
        return esStrings;
    }
    return enStrings;
}

export function t(key: keyof I18nStrings['commands']): string {
    return getStrings().commands[key] || key;
}