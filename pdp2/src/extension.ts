import * as vscode from 'vscode';
import { designFormat } from './format';
import { changeDebug } from './debug';
import { adjustSql } from './sql';

export function activate(context: vscode.ExtensionContext) {

    const format = vscode.commands.registerCommand('pdp2.designFormat', () => {
        designFormat();
        return;
    });
    // debugger  console  整个文件注释或者取消注释
    const debug = vscode.commands.registerCommand('pdp2.debug', () => {
        changeDebug();
        return;
    })
    // 替换SQL
    const sql = vscode.commands.registerCommand('pdp2.sql', () => {
        adjustSql();
    })
    // 设置自定义配置

    context.subscriptions.push(format);
    context.subscriptions.push(debug);
    // context.subscriptions.push(sql);
    // context.subscriptions.push(config);

}

// This method is called when your extension is deactivated
export function deactivate() { }
