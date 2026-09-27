import * as vscode from 'vscode';

export interface SavedPipeline {
    name: string;
    steps: string[];
}

const KEY = 'pancho.pipelines';

export function readPipelines(context: vscode.ExtensionContext): SavedPipeline[] {
    const stored = context.globalState.get<SavedPipeline[]>(KEY, []);
    if (!Array.isArray(stored)) return [];
    return stored.filter(
        item => item && typeof item.name === 'string' && Array.isArray(item.steps)
    );
}

export async function writePipelines(context: vscode.ExtensionContext, pipelines: SavedPipeline[]): Promise<void> {
    await context.globalState.update(KEY, pipelines);
}

/** Parses a pipeline JSON export; returns undefined when the payload is not valid. */
export function parsePipelines(raw: string): SavedPipeline[] | undefined {
    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return undefined;
    }
    if (!Array.isArray(parsed)) return undefined;

    const pipelines: SavedPipeline[] = [];
    for (const item of parsed) {
        const candidate = item as { name?: unknown; steps?: unknown };
        if (
            candidate &&
            typeof candidate.name === 'string' &&
            Array.isArray(candidate.steps) &&
            candidate.steps.every(step => typeof step === 'string')
        ) {
            pipelines.push({ name: candidate.name, steps: candidate.steps as string[] });
        }
    }
    return pipelines;
}
