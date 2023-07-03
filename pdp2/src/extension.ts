import * as vscode from 'vscode';
import { designFormat } from './format';
import designLight from './tmLanguage/designLight';
export function activate(context: vscode.ExtensionContext) {
    designLight(context);
    /**
     * 
     */
    let disposable = vscode.commands.registerCommand('pdp2.designFormat', () => {
        vscode.window.showInformationMessage('Hello World from pdp2!');
        designFormat();

        return;
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
