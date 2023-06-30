import * as vscode from 'vscode';
import { designFormat } from './format';
export function activate(context: vscode.ExtensionContext) {


    let disposable = vscode.commands.registerCommand('pdp2.designFormat', () => {
        vscode.window.showInformationMessage('Hello World from pdp2!');
        designFormat();
        return;
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
