"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceSchema = void 0;
const xmldoc_1 = require("../utils/xmldoc");
const vscode = require("vscode");
const prettier = require("prettier");
const sqlParser = require('prettier-plugin-sql');
function replaceSchema() {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return; // 检查编辑器是否激活
    const document = editor.document;
    if (!document)
        return;
    const text = editor.document.getText();
    const xmlDomObj = new xmldoc_1.XmlDocument(text);
    const edit = new vscode.WorkspaceEdit();
    // 获取当前光标所在位置的文档位置
    const position = editor.selection.active;
    const activeChart = editor.document.offsetAt(position);
    const selectionStart = editor.selection.start;
    const selectionEnd = editor.selection.end;
    console.log("position", position);
    console.log("selectionStart", selectionStart);
    console.log("selectionEnd", selectionEnd);
    let nodeByPosition = xmlDomObj.getElementByPosition(activeChart);
    console.log("nodeByPosition", nodeByPosition);
    let sqlText = "select Id from User wher name like '%a%'";
    try {
        const formatted = prettier.format(sqlText, {
            parser: "sql",
            plugins: [sqlParser]
        });
        console.log("formatted", formatted);
    }
    catch (error) {
        console.log("error", error);
    }
}
exports.replaceSchema = replaceSchema;
//# sourceMappingURL=replace.js.map