import * as vscode from 'vscode';
import { Session } from './models/session';
import { getConfig } from './utils';

export function activate(context: vscode.ExtensionContext) {
	const session = new Session({});

	context.subscriptions.push(session.ui);

	context.subscriptions.push(
		vscode.commands.registerCommand('stopwatch.toggle', () => {
			session.toggle();
		})
	);

	session.ui.command = 'stopwatch.toggle';

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(() => {
			session.init(getConfig());
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {
	return null;
}
