import * as vscode from 'vscode';

const COLOR_CONVERTER_URL = 'https://colorcollector.netlify.app';

export function activate(context: vscode.ExtensionContext) {
	const openCommand = vscode.commands.registerCommand(
		'colorConverter.open',
		() => {
			vscode.env.openExternal(vscode.Uri.parse(COLOR_CONVERTER_URL));
		}
	);
	context.subscriptions.push(openCommand);
}

export function deactivate() {}
