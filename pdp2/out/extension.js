"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const format_1 = require("./format");
function activate(context) {
    let disposable = vscode.commands.registerCommand('pdp2.designFormat', () => {
        vscode.window.showInformationMessage('Hello World from pdp2!');
        (0, format_1.designFormat)();
        return;
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map