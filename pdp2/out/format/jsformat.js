"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const xmldoc = require('../../../xmldoc/index.js');
// 引入prettier库
const prettier = require("prettier/standalone");
// 引入js解析器插件
const parserBabel = require("prettier/parser-babel");
function jsFormat() {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return; // 检查编辑器是否激活
    const document = editor.document;
    const text = editor.document.getText();
    const xmlDomObj = new xmldoc.XmlDocument(text);
    const scripts = xmlDomObj.getElementsByTagName('scripts');
    let cdatas = [];
    scripts.forEach((script) => {
        var subCdatas = script.GetCdataByElementTagName('value');
        cdatas = cdatas.concat(subCdatas);
    });
    const editCallbacks = [];
    for (let i = 0; i < cdatas.length; i++) {
        const cdata = cdatas[i];
        const value = cdata.cdata;
        const formatted = prettier.format(value, {
            // 使用js解析器
            parser: "babel",
            // 使用引入的插件parserBabel格式化
            plugins: [parserBabel],
        });
        // 在格式化后的字符串前面加上10个空格
        const indented = formatted;
        let startPosition = new vscode.Position(cdata.line, cdata.column);
        let endPosition = new vscode.Position(cdata.closeLine, cdata.closeColumn - 3);
        let range = new vscode.Range(startPosition, endPosition); // 创建一个范围对象
        // // 调用edit方法，传入一个回调函数
        editCallbacks.push((editBuilder) => {
            console.log("执行替换", range.c.c, range.c.e, range.e.c, range.e.e);
            console.log(indented);
            editBuilder.replace(range, indented);
        });
        // editor.edit(function (editBuilder) {
        //     // 在回调函数中，调用replace方法，传入范围和新的文本
        //     editBuilder.replace(range, indented);
        // });
        // doEdits(editor, editCallbacks);
    }
    editCallbacks.map((editCallback) => { editor.edit(editCallback); });
}
exports.default = jsFormat;
async function doEdits(editor, editCallbacks) {
    if (editCallbacks.length === 0) {
        return;
    }
    const editCallback = editCallbacks.shift();
    await new Promise(resolve => {
        editor.edit((editBuilder) => {
            editCallback(editBuilder);
        }).then(() => {
            resolve();
        });
    });
    await doEdits(editor, editCallbacks);
}
//# sourceMappingURL=jsformat.js.map