"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
// const xml2js = require('../../xmldoc/index.js');
// import { XMLParser, XMLBuilder, XMLValidator, X2jOptions } from "fast-xml-parser"; // 引入fast-xml-parser模块
function activate(context) {
    console.log('Congratulations, your extension "pdp2" is now active!');
    let disposable = vscode.commands.registerCommand('pdp2.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from pdp2!');
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return; // 检查编辑器是否激活
        const text = editor.document.getText();
        if (!text)
            return; // 检查文档是否有文本
        const document = editor.document;
        // 获取当前的选择对象
        let selection = editor.selection;
        // 获取当前的光标位置
        let current = selection.active;
        // 打印出行号和列号
        console.log('line:', current.line); // 行号从0开始
        console.log('column:', current.character); // 列号从0开始
        // 假设你想要获取第100个字节的位置
        let offset = 39;
        // 调用positionAt方法，返回一个Position对象
        let position = document.positionAt(offset);
        // 打印出行号和列号
        console.log('line:', position.line); // 行号从0开始
        console.log('column:', position.character); // 列号从0开始
        let start = new vscode.Position(0, 0); // 起始位置，行号从0开始，列号从0开始
        let end = new vscode.Position(position.line, position.character); // 结束位置，行号从0开始，列号从0开始
        let range = new vscode.Range(start, end); // 创建一个范围对象
        // 调用edit方法，传入一个回调函数
        editor.edit(function (editBuilder) {
            // 在回调函数中，调用replace方法，传入范围和新的文本
            editBuilder.replace(range, '这是新的内容');
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map