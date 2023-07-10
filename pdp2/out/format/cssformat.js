"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const format_1 = require("../utils/format");
const prettier = require("prettier");
function cssFormat(edit, xmlDomObj) {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return; // 检查编辑器是否激活
    const document = editor.document;
    if (!document)
        return;
    const CssNodes = xmlDomObj.getElementsByTagName('css');
    let cdatas = [];
    CssNodes.forEach((css) => {
        var subCdatas = css.GetAllCdata();
        cdatas = cdatas.concat(subCdatas);
    });
    // 创建一个WorkspaceEdit对象
    // const edit = new vscode.WorkspaceEdit();
    const tabSize = editor.options.tabSize ? Number(editor.options.tabSize) : 4;
    for (let i = 0; i < cdatas.length; i++) {
        const cdata = cdatas[i];
        const value = cdata.value;
        const cdataParent = cdata.parent;
        // 开始标签开始位置
        let startTagPosition = document.positionAt(cdataParent.startTag.startPosition);
        // 替换的范围
        // 开始标签结束位置
        let startPosition = document.positionAt(cdataParent.startTag.endPosition);
        // 结束标签开始位置
        let endPosition = document.positionAt(cdataParent.endTag.startPosition);
        let range = new vscode.Range(startPosition, endPosition); // 创建一个范围对象
        let formatStr = formatCsssString(value, startTagPosition, endPosition, tabSize);
        edit.replace(document.uri, range, formatStr);
    }
    return edit;
    // 使用工作区应用编辑器对象来执行TextEdit数组中的所有操作
    // vscode.workspace.applyEdit(new vscode.WorkspaceEdit().set(document.uri, textEdits));
    // vscode.workspace.applyEdit(edit).then(() => {
    //     return edit;
    // });
}
exports.default = cssFormat;
function formatCsssString(text, startPosition, endPosition, tabSize) {
    try {
        const isOneLine = startPosition.line === endPosition.line;
        const formatted = prettier.format(text.trim(), {
            parser: "css",
            // 设置使用空格而不是制表符来缩进
            // useTabs: false
        }).trim();
        if (isOneLine) {
            return ` <![CDATA[ ${formatted} ]]> `;
        }
        // cdata偏移量
        //格式化内容每一行偏移量
        const tagStartColumn = startPosition.character;
        const cdataOffset = tagStartColumn + tabSize;
        const formatedOffset = tagStartColumn + 2 * tabSize;
        // 其他情况
        // 在格式化后的字符串前面加上10个空格
        const indented = formatted.split("\n").map((line, index, array) => {
            return (0, format_1.generateEmptyString)(formatedOffset) + line;
        }).join("\n");
        const cdataStart = `\n${(0, format_1.generateEmptyString)(cdataOffset)}<![CDATA[\n`;
        const cdataEnd = `\n${(0, format_1.generateEmptyString)(cdataOffset)}]]>\n${(0, format_1.generateEmptyString)(tagStartColumn)}`;
        return cdataStart + indented + cdataEnd;
    }
    catch (error) {
        vscode.window.showErrorMessage(error.message);
        return ` <![CDATA[ ${text} ]]> `;
    }
}
//# sourceMappingURL=cssformat.js.map