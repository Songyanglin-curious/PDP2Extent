import * as vscode from 'vscode';
import { designFormat } from './format';

export function activate(context: vscode.ExtensionContext) {

    let format = vscode.commands.registerCommand('pdp2.designFormat', () => {
        vscode.window.showInformationMessage('Hello World from pdp2!');
        designFormat();

        return;
    });
    context.subscriptions.push(format);

}

// This method is called when your extension is deactivated
export function deactivate() { }
