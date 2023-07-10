"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const format_1 = require("./format");
const debug_1 = require("./debug");
const sql_1 = require("./sql");
function activate(context) {
    const format = vscode.commands.registerCommand('pdp2.designFormat', () => {
        (0, format_1.designFormat)();
        return;
    });
    // debugger  console  整个文件注释或者取消注释
    const debug = vscode.commands.registerCommand('pdp2.debug', () => {
        (0, debug_1.changeDebug)();
        return;
    });
    // 替换SQL
    const sql = vscode.commands.registerCommand('pdp2.sql', () => {
        (0, sql_1.replaceSchema)();
    });
    context.subscriptions.push(format);
    context.subscriptions.push(debug);
    context.subscriptions.push(sql);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map