import { XmlDocument } from '../utils/xmldoc'
import * as vscode from 'vscode';
import { formatByCdata, generateEmptyString } from '../utils/format';
import { getActiveVscodeObj } from '../utils/common';
export function replaceSchema() {
    return;
    const { editor, document, text, xmlDomObj, edit } = getActiveVscodeObj();
    // const editor = vscode.window.activeTextEditor;
    // if (!editor) return; // 检查编辑器是否激活
    // const document = editor.document;
    // if (!document) return;

    // const text = editor.document.getText();
    // const xmlDomObj = new XmlDocument(text);
    // const edit = new vscode.WorkspaceEdit();
    // 获取当前光标所在位置的文档位置
    const position = editor.selection.active;
    const activeChart = editor.document.offsetAt(position);

    //获取当前光标所在节点
    const currentNode = xmlDomObj.getElementByPosition(activeChart);
    const cdataList = currentNode.children.filter(item => item.type === "cdata");
    const tabSize = editor.options.tabSize ? Number(editor.options.tabSize) : 4;
    const startColumn = document.positionAt(currentNode.startTag.startPosition).character;
    //当该节点下面只有一个cdata节点时，获取该cdata节点的内容，进行cdata.value sql格式化,成功则替换原有的，并且格式化cdata和闭合标签，失败啥都不干
    let sqlFormated = "";
    if (cdataList.length === 1) {
        let sqlText = cdataList[0].value;
        // sqlFormated = formatCdataSql(sqlText, startColumn, tabSize);
    } else {
        sqlFormated = formatCdataSqlList(cdataList, startColumn, tabSize)
    }


    const start = document.positionAt(currentNode.startTag.endPosition);
    const end = document.positionAt(currentNode.endTag.startPosition);
    let sqlRange = new vscode.Range(start, end);
    edit.replace(document.uri, sqlRange, sqlFormated);
    vscode.workspace.applyEdit(edit).then(() => {
        document.save();
        return edit;
    });


}
function formatCdataSql(sqlText: string, startColumn: number, tabSize: number) {
    let sqlFormated = formatSql(sqlText);
    return formatByCdata(sqlFormated, startColumn, tabSize);
}

function formatCdataSqlList(cdataList: any[], startColumn: number, tabSize: number) {
    let sqlFormated = "";
    const formatCdataList = [];

    cdataList.forEach(cdata => {
        let sqlText = cdata.value
        formatCdataList.push(formatByCdata(sqlText, startColumn, tabSize))
    })
    sqlFormated = formatCdataList.join("\n");
    sqlFormated = `\n` + sqlFormated + `\n${generateEmptyString(startColumn)}`;
    return sqlFormated;
}


function formatSql(sql) {
    // 将 FROM WHERE ORDER BY GROUP BY 前面的关键字换行
    sql = sql.replace(/(FROM|WHERE|ORDER BY|GROUP BY)/gi, '\n$1');

    // 将括号内的内容以左括号为基准线换行
    // sql = sql.replace(/\(([^)]+)\)/g, '(\n$1\n)');

    return sql;
}


