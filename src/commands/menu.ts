import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Commands } from './registry';
import { registerRepeatCommand } from '../utils/history';
import { registerCommand } from '../utils/register';
import { t } from '../utils/i18n';
import { fireCommandListsChanged } from '../utils/events';

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
    registerCommand(context, Commands.SHOW_MENU, () => showMenu(context));
    registerCommand(context, Commands.FAVORITES_SHOW, () => showFavorites(context));
    registerCommand(context, Commands.FAVORITE_TOGGLE, () => toggleFavorites(context));
}

function findManifest(): Manifest | undefined {
    const extension = vscode.extensions.getExtension('undaniels.pancho-plus-plus')
        ?? vscode.extensions.all.find(ext => ext.packageJSON?.name === 'pancho-plus-plus');
    return extension?.packageJSON as Manifest | undefined;
}

const nlsCache = new Map<string, Record<string, string>>();

function readNls(context: vscode.ExtensionContext): Record<string, string> {
    const language = vscode.env.language || 'en';
    const cached = nlsCache.get(language);
    if (cached) return cached;

    const candidates = [`package.nls.${language}.json`];
    const base = language.split('-')[0];
    if (base !== language) candidates.push(`package.nls.${base}.json`);
    candidates.push('package.nls.json');

    let result: Record<string, string> = {};
    for (const candidate of candidates) {
        try {
            const fullPath = path.join(context.extensionPath, candidate);
            if (fs.existsSync(fullPath)) {
                result = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                break;
            }
        } catch {
            // Try the next candidate.
        }
    }
    nlsCache.set(language, result);
    return result;
}

function localize(value: string | undefined, nls: Record<string, string>): string {
    if (!value) return '';
    return value.replace(/%([^%]+)%/g, (match, key) => nls[key] ?? match);
}

const RECENT_KEY = 'pancho.recentCommands';
const FAVORITES_KEY = 'pancho.favoriteCommands';
const MAX_RECENTS = 5;

export function collectTitles(manifest: Manifest | undefined, nls: Record<string, string>): Map<string, string> {
    const titles = new Map<string, string>();
    for (const command of manifest?.contributes?.commands ?? []) {
        titles.set(command.command, localize(command.title, nls));
    }
    return titles;
}

export function buildCategories(manifest: Manifest | undefined, nls: Record<string, string>): Category[] {
    const contributes = manifest?.contributes;
    if (!contributes) return [];

    const titles = collectTitles(manifest, nls);

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

export interface CatalogCommand {
    command: string;
    title: string;
    categoryLabel: string;
    keybinding?: string;
}

/** Flat list of the commands shown in the menu, for the Activity Bar views. */
export function buildCommandCatalog(context: vscode.ExtensionContext): CatalogCommand[] {
    return flatten(buildCategories(findManifest(), readNls(context))).map(entry => ({
        command: entry.command,
        title: entry.title,
        categoryLabel: entry.categoryLabel,
        keybinding: entry.keybinding,
    }));
}

interface MenuEntry extends CatalogEntry {
    categoryLabel: string;
}

function flatten(categories: Category[]): MenuEntry[] {
    return categories.flatMap(category =>
        category.entries.map(entry => ({ ...entry, categoryLabel: category.label }))
    );
}

function toPickItem(entry: MenuEntry, recents: Set<string>, favorites: Set<string>): vscode.QuickPickItem & { command: string } {
    const tags: string[] = [];
    if (favorites.has(entry.command)) tags.push('★');
    if (recents.has(entry.command)) tags.push('↺');
    const description = [entry.categoryLabel, entry.keybinding].filter(Boolean).join('  ·  ');
    return {
        label: tags.length ? `${tags.join(' ')} ${entry.title}` : entry.title,
        description,
        command: entry.command,
    };
}

function readCommandSet(context: vscode.ExtensionContext, key: string, max = Number.MAX_SAFE_INTEGER): Set<string> {
    const values = context.globalState.get<string[]>(key, []).slice(0, max);
    return new Set(values);
}

async function executePick(
    entries: MenuEntry[],
    title: string,
    placeholder: string,
    recents: Set<string>,
    favorites: Set<string>
): Promise<void> {
    if (entries.length === 0) {
        vscode.window.showWarningMessage(t('Pancho: No commands available'));
        return;
    }
    const pick = await vscode.window.showQuickPick(
        entries.map(entry => toPickItem(entry, recents, favorites)),
        { placeHolder: placeholder, title, matchOnDescription: true }
    );
    if (!pick) return;
    await vscode.commands.executeCommand(pick.command);
}

async function showMenu(context: vscode.ExtensionContext): Promise<void> {
    const manifest = findManifest();
    const nls = readNls(context);
    const categories = buildCategories(manifest, nls);
    if (categories.length === 0) {
        vscode.window.showWarningMessage(t('Pancho: No commands available'));
        return;
    }

    const all = flatten(categories);
    const favorites = readCommandSet(context, FAVORITES_KEY);
    const recents = readCommandSet(context, RECENT_KEY, MAX_RECENTS);

    // Favourites and recents float to the top, then the full catalogue.
    const prioritized = [
        ...all.filter(entry => favorites.has(entry.command)),
        ...all.filter(entry => !favorites.has(entry.command) && recents.has(entry.command)),
        ...all.filter(entry => !favorites.has(entry.command) && !recents.has(entry.command)),
    ];

    const pick = await vscode.window.showQuickPick(
        prioritized.map(entry => toPickItem(entry, recents, favorites)),
        { placeHolder: t('Pancho: Choose a command'), matchOnDescription: true }
    );
    if (!pick) return;

    const nextRecents = [pick.command, ...context.globalState.get<string[]>(RECENT_KEY, []).filter(c => c !== pick.command)]
        .slice(0, MAX_RECENTS);
    await context.globalState.update(RECENT_KEY, nextRecents);

    await vscode.commands.executeCommand(pick.command);
    fireCommandListsChanged();
}

async function showFavorites(context: vscode.ExtensionContext): Promise<void> {
    const manifest = findManifest();
    const nls = readNls(context);
    const categories = buildCategories(manifest, nls);
    const favorites = readCommandSet(context, FAVORITES_KEY);
    const recents = readCommandSet(context, RECENT_KEY, MAX_RECENTS);
    const entries = flatten(categories).filter(entry => favorites.has(entry.command));

    if (entries.length === 0) {
        vscode.window.showWarningMessage(t('Pancho: No favorites yet. Use "Pancho: Edit favorites".'));
        return;
    }
    await executePick(entries, t('Pancho: Favorites'), t('Pancho: Choose a favorite'), recents, favorites);
}

async function toggleFavorites(context: vscode.ExtensionContext): Promise<void> {
    const manifest = findManifest();
    const nls = readNls(context);
    const categories = buildCategories(manifest, nls);
    const entries = flatten(categories);
    const current = readCommandSet(context, FAVORITES_KEY);

    const picks = await vscode.window.showQuickPick(
        entries.map(entry => ({
            label: entry.title,
            description: entry.categoryLabel,
            picked: current.has(entry.command),
            command: entry.command,
        })),
        { canPickMany: true, placeHolder: t('Pancho: Choose favorites'), matchOnDescription: true }
    );
    if (!picks) return;
    await context.globalState.update(FAVORITES_KEY, picks.map(p => p.command));
    fireCommandListsChanged();
    void vscode.window.showInformationMessage(
        t('Pancho: {0} favorite(s) saved', picks.length)
    );
}
