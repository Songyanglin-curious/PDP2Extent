import * as vscode from 'vscode';
import { generateEmptyString } from '../utils/format';
import { XmlDocument } from '../utils/xml';
// const xmldoc = require("../utils/xmlParser/xmlParse.js");
// 引入prettier库
const prettier = require("prettier/standalone");
// 引入js解析器插件
const parserBabel = require("prettier/parser-babel");
export default function jsFormat(xmlDomObj: XmlDocument) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return; // 检查编辑器是否激活
    const document = editor.document;
    if (!document) return;
    const scripts = xmlDomObj.getElementsByTagName('scripts');
    let cdatas: any[] = [];
    scripts.forEach((script: any) => {
        var subCdatas = script.GetCdataByElementTagName('value');
        var subList = script.GetCdataByElementTagName('list');
        cdatas = cdatas.concat(subCdatas)
        cdatas = cdatas.concat(subList)
    })

    // 创建一个WorkspaceEdit对象
    const edit = new vscode.WorkspaceEdit();
    const tabSize = editor.options.tabSize ? Number(editor.options.tabSize) : 4;
    for (let i = 0; i < cdatas.length; i++) {
        const cdata = cdatas[i];
        const value = cdata.value;
        const cdataParent = cdata.parent
        // 开始标签开始位置
        let startTagPosition = document.positionAt(cdataParent.startTag.startPosition);
        // 替换的范围
        // 开始标签结束位置
        let startPosition = document.positionAt(cdataParent.startTag.endPosition);
        // 结束标签开始位置
        let endPosition = document.positionAt(cdataParent.endTag.startPosition);
        let range = new vscode.Range(startPosition, endPosition); // 创建一个范围对象
        let formatStr = formatJsString(value, startTagPosition, endPosition, tabSize)
        console.log(formatStr)
        edit.replace(document.uri, range, formatStr);
    }
    // 使用工作区应用编辑器对象来执行TextEdit数组中的所有操作
    // vscode.workspace.applyEdit(new vscode.WorkspaceEdit().set(document.uri, textEdits));
    vscode.workspace.applyEdit(edit).then(() => {
        return edit;
    });

}

function formatJsString(text: any, startPosition: vscode.Position, endPosition: vscode.Position, tabSize: number) {
    try {
        const isOneLine = startPosition.line === endPosition.line;
        const formatted = prettier.format(text.trim(), {
            // 使用js解析器
            parser: "babel",
            // 使用引入的插件parserBabel格式化
            plugins: [parserBabel],
            // 设置使用空格而不是制表符来缩进
            useTabs: false
        });
        if (isOneLine) {
            return ` <![CDATA[ ${formatted} ]]> `
        }
        // cdata偏移量
        //格式化内容每一行偏移量
        const tagStartColumn = startPosition.character;
        const cdataOffset = tagStartColumn + tabSize;
        const formatedOffset = tagStartColumn + 2 * tabSize;
        // 其他情况
        // 在格式化后的字符串前面加上10个空格
        const indented = formatted.split("\n").map((line: string, index: number, array: string[]) => {
            return generateEmptyString(formatedOffset) + line;
        }).join("\n");
        const cdataStart = `\n${generateEmptyString(cdataOffset)}<![CDATA[\n`
        const cdataEnd = `\n${generateEmptyString(cdataOffset)}]]>\n${generateEmptyString(tagStartColumn)}`
        return cdataStart + indented + cdataEnd
    } catch (error: any) {
        vscode.window.showErrorMessage(error.message);
        return ` <![CDATA[ ${text} ]]> `;
    }

}

