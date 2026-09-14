import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Commands } from './registry';
import { registerRepeatCommand } from '../utils/history';

interface CatalogEntry {
    command: string;
    title: string;
    keybinding?: string;
}

interface Category {
    id: string;
    label: string;
    entries: CatalogEntry[];
}

interface ManifestItem {
    command?: string;
    submenu?: string;
    label?: string;
    key?: string;
    mac?: string;
}

interface Manifest {
    contributes?: {
        commands?: { command: string; title: string }[];
        submenus?: { id: string; label: string }[];
        keybindings?: ManifestItem[];
        menus?: Record<string, ManifestItem[]>;
    };
}

export function registerMenuCommands(context: vscode.ExtensionContext): void {
    registerRepeatCommand(context);
    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.SHOW_MENU, () => showMenu(context))
    );
}

function findManifest(): Manifest | undefined {
    const extension = vscode.extensions.getExtension('undaniels.pancho-plus-plus')
        ?? vscode.extensions.all.find(ext => ext.packageJSON?.name === 'pancho-plus-plus');
    return extension?.packageJSON as Manifest | undefined;
}

function readNls(context: vscode.ExtensionContext): Record<string, string> {
    const language = vscode.env.language || 'en';
    const candidates = [`package.nls.${language}.json`];
    const base = language.split('-')[0];
    if (base !== language) candidates.push(`package.nls.${base}.json`);
    candidates.push('package.nls.json');

    for (const candidate of candidates) {
        try {
            const fullPath = path.join(context.extensionPath, candidate);
            if (fs.existsSync(fullPath)) {
                return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            }
        } catch {
            // Try the next candidate.
        }
    }
    return {};
}

function localize(value: string | undefined, nls: Record<string, string>): string {
    if (!value) return '';
    return value.replace(/%([^%]+)%/g, (match, key) => nls[key] ?? match);
}

export function buildCategories(manifest: Manifest | undefined, nls: Record<string, string>): Category[] {
    const contributes = manifest?.contributes;
    if (!contributes) return [];

    const titles = new Map<string, string>();
    for (const command of contributes.commands ?? []) {
        titles.set(command.command, localize(command.title, nls));
    }

    const submenuLabels = new Map<string, string>();
    for (const submenu of contributes.submenus ?? []) {
        submenuLabels.set(submenu.id, localize(submenu.label, nls));
    }

    const keybindings = new Map<string, string>();
    for (const binding of contributes.keybindings ?? []) {
        if (binding.command) keybindings.set(binding.command, binding.mac || binding.key || '');
    }

    const categories: Category[] = [];
    for (const item of contributes.menus?.panchoMenu ?? []) {
        if (!item.submenu) continue;
        const entries: CatalogEntry[] = (contributes.menus?.[item.submenu] ?? [])
            .filter(entry => entry.command)
            .map(entry => ({
                command: entry.command!,
                title: titles.get(entry.command!) ?? entry.command!,
                keybinding: keybindings.get(entry.command!),
            }));
        if (entries.length === 0) continue;
        categories.push({
            id: item.submenu,
            label: submenuLabels.get(item.submenu) ?? item.submenu,
            entries,
        });
    }
    return categories;
}

async function showMenu(context: vscode.ExtensionContext): Promise<void> {
    const categories = buildCategories(findManifest(), readNls(context));
    if (categories.length === 0) {
        vscode.window.showWarningMessage(vscode.l10n.t('Pancho: No commands available'));
        return;
    }

    const categoryPick = await vscode.window.showQuickPick(
        categories.map(category => ({
            label: category.label,
            description: `${category.entries.length}`,
            category,
        })),
        { placeHolder: vscode.l10n.t('Pancho: Choose a category') }
    );
    if (!categoryPick) return;

    const commandPick = await vscode.window.showQuickPick(
        categoryPick.category.entries.map(entry => ({
            label: entry.title,
            description: entry.keybinding,
            command: entry.command,
        })),
        { placeHolder: categoryPick.category.label, matchOnDescription: true }
    );
    if (!commandPick) return;

    await vscode.commands.executeCommand(commandPick.command);
}
