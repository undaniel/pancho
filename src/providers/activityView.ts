import * as vscode from 'vscode';
import { Commands } from '../commands/registry';
import { buildCommandCatalog, CatalogCommand } from '../commands/menu';
import { readPipelines } from '../pipelines/store';
import { onDidChangeCommandLists } from '../utils/events';
import { t } from '../utils/i18n';

type ViewKind = 'favorites' | 'recent' | 'pipelines';

interface CommandNode {
    type: 'command';
    command: string;
    label: string;
    description?: string;
}

interface PipelineNode {
    type: 'pipeline';
    name: string;
    steps: number;
}

interface InfoNode {
    type: 'info';
    label: string;
}

type TreeNode = CommandNode | PipelineNode | InfoNode;

const FAVORITES_KEY = 'pancho.favoriteCommands';
const RECENT_KEY = 'pancho.recentCommands';

class PanchoViewProvider implements vscode.TreeDataProvider<TreeNode> {
    private readonly emitter = new vscode.EventEmitter<TreeNode | undefined>();
    readonly onDidChangeTreeData = this.emitter.event;

    constructor(
        private readonly context: vscode.ExtensionContext,
        private readonly kind: ViewKind
    ) {}

    refresh(): void {
        this.emitter.fire(undefined);
    }

    dispose(): void {
        this.emitter.dispose();
    }

    getTreeItem(node: TreeNode): vscode.TreeItem {
        if (node.type === 'info') {
            const item = new vscode.TreeItem(node.label, vscode.TreeItemCollapsibleState.None);
            item.contextValue = 'pancho.info';
            item.accessibilityInformation = { label: node.label };
            return item;
        }

        if (node.type === 'pipeline') {
            const item = new vscode.TreeItem(node.name, vscode.TreeItemCollapsibleState.None);
            const steps = t('{0} step(s)', String(node.steps));
            item.description = steps;
            item.iconPath = new vscode.ThemeIcon('play');
            item.tooltip = t('Run pipeline');
            item.command = { command: Commands.RUN_PIPELINE, title: node.name, arguments: [node.name] };
            item.accessibilityInformation = { label: `${node.name}, ${t('Run pipeline')}, ${steps}` };
            return item;
        }

        const item = new vscode.TreeItem(node.label, vscode.TreeItemCollapsibleState.None);
        if (node.description) item.description = node.description;
        item.iconPath = new vscode.ThemeIcon('symbol-method');
        item.command = { command: node.command, title: node.label };
        item.accessibilityInformation = {
            label: node.description ? `${node.label}, ${node.description}` : node.label,
        };
        return item;
    }

    getChildren(): TreeNode[] {
        if (this.kind === 'pipelines') {
            const pipelines = readPipelines(this.context);
            if (pipelines.length === 0) return [{ type: 'info', label: t('No saved pipelines yet') }];
            return pipelines.map(pipeline => ({ type: 'pipeline', name: pipeline.name, steps: pipeline.steps.length }));
        }

        const catalog = new Map<string, CatalogCommand>(
            buildCommandCatalog(this.context).map(entry => [entry.command, entry])
        );
        const key = this.kind === 'favorites' ? FAVORITES_KEY : RECENT_KEY;
        const ids = this.context.globalState.get<string[]>(key, []);
        const nodes: CommandNode[] = [];
        for (const id of ids) {
            const entry = catalog.get(id);
            if (entry) nodes.push({ type: 'command', command: entry.command, label: entry.title, description: entry.categoryLabel });
        }
        if (nodes.length === 0) {
            return [{ type: 'info', label: this.kind === 'favorites' ? t('No favorites yet') : t('No recent commands') }];
        }
        return nodes;
    }
}

export function registerActivityView(context: vscode.ExtensionContext): void {
    const views: Array<[string, ViewKind]> = [
        ['pancho.favorites', 'favorites'],
        ['pancho.recent', 'recent'],
        ['pancho.pipelines', 'pipelines'],
    ];

    const providers: PanchoViewProvider[] = [];
    for (const [id, kind] of views) {
        const provider = new PanchoViewProvider(context, kind);
        providers.push(provider);
        context.subscriptions.push(
            vscode.window.createTreeView(id, { treeDataProvider: provider }),
            provider
        );
    }

    context.subscriptions.push(
        onDidChangeCommandLists(() => providers.forEach(provider => provider.refresh()))
    );
}
