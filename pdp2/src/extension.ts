import * as vscode from 'vscode';
import { designFormat } from './format/index';
export function activate(context: vscode.ExtensionContext) {


    let disposable = vscode.commands.registerCommand('pdp2.designFormat', () => {
        designFormat();

        return;
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
