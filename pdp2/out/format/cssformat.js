"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const format_1 = require("../utils/format");
// const xmldoc = require('../utils/xmldoc');
const xmldoc = require('../utils/xmldoc/xmldoc.js');
const prettier = require("prettier");
function cssFormat() {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return; // 检查编辑器是否激活
    const document = editor.document;
    if (!document)
        return;
    const text = editor.document.getText();
    const xmlDomObj = new xmldoc.XmlDocument(text);
    const CssNodes = xmlDomObj.getElementsByTagName('css');
    let cdatas = [];
    CssNodes.forEach((css) => {
        var subCdatas = css.GetCdataByElementTagName('css');
        cdatas = cdatas.concat(subCdatas);
    });
    // 创建一个WorkspaceEdit对象
    const edit = new vscode.WorkspaceEdit();
    for (let i = 0; i < cdatas.length; i++) {
        const cdata = cdatas[i];
        const value = cdata.cdata;
        let startPosition = new vscode.Position(cdata.line, cdata.column);
        let endPosition = new vscode.Position(cdata.closeLine, cdata.closeColumn);
        let range = new vscode.Range(startPosition, endPosition); // 创建一个范围对象
        const formatedJs = formatCsssString(value, cdata.column, editor);
        edit.replace(document.uri, range, formatedJs);
    }
    // 使用工作区应用编辑器对象来执行TextEdit数组中的所有操作
    // vscode.workspace.applyEdit(new vscode.WorkspaceEdit().set(document.uri, textEdits));
    vscode.workspace.applyEdit(edit).then(() => {
        return edit;
    });
}
exports.default = cssFormat;
function formatCsssString(text, baseColumn, editor) {
    let tabSize = editor.options.tabSize;
    tabSize = tabSize ? Number(tabSize) : 4;
    try {
        const formatted = prettier.format(text, {
            // 使用js解析器
            parser: "css",
            // // 使用引入的插件parserBabel格式化
            // plugins: [parserBabel],
            // 设置使用空格而不是制表符来缩进
            useTabs: false
        });
        const cdataLength = "<![CDATA[".length;
        const lineLast = baseColumn - cdataLength;
        const lineFirst = baseColumn - (cdataLength - tabSize);
        // 在格式化后的字符串前面加上10个空格
        const indented = "\n" + formatted.split("\n").map((line, index, array) => {
            // 检查是否是最后一行
            if (index === array.length - 1) {
                // 如果是最后一行，就使用generateEmptyString(baseColumn - 4)来生成少4个空格的字符串
                return (0, format_1.generateEmptyString)(lineLast) + line;
            }
            else {
                // 如果不是最后一行，就使用generateEmptyString(baseColumn)来生成正常的空格字符串
                return (0, format_1.generateEmptyString)(lineFirst) + line;
            }
        }).join("\n") + "]]>";
        return indented;
    }
    catch (e) {
        vscode.window.showErrorMessage(e.message);
        return text + "]]>";
    }
}
//# sourceMappingURL=cssformat.js.map