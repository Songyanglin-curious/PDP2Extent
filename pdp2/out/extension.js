"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const index_1 = require("./format/index");
function activate(context) {
    let disposable = vscode.commands.registerCommand('pdp2.designFormat', () => {
        (0, index_1.designFormat)();
        return;
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map