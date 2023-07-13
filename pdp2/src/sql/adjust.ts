import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as vscode from 'vscode';
import { getActiveVscodeObj, getRootPath } from "../utils/common";
import { XmlDocument } from '../utils/xmldoc';

export async function adjustSql() {
    const { editor, document, text, xmlDomObj, edit } = getActiveVscodeObj();
    const cdataList = getActiveCdataList(editor, xmlDomObj);
    const position = editor.selection.active;

    // 弹出一个 QuickPick 弹窗
    vscode.window.showQuickPick(['Option 1', 'Option 2', 'Option 3']).then((selectedOption) => {
        if (selectedOption) {
            // // 在光标位置插入文本
            // editor.edit((editBuilder) => {
            //     editBuilder.insert(position, selectedOption);
            // });
        }
    });
    // console.log('adjustSql')
    // const schemas = await getSchema();
    // console.log(schemas)
}
// 获取当前光标所在节点的cdata节点
function getActiveCdataList(editor, xmlDomObj) {
    const position = editor.selection.active;
    const activeChart = editor.document.offsetAt(position);
    //获取当前光标所在节点
    const currentNode = xmlDomObj.getElementByPosition(activeChart);
    const cdataList = currentNode.children.filter(item => item.type === "cdata");
    return cdataList;
}

const readFileAsync = util.promisify(fs.readFile);
async function getSchema() {
    // const config = vscode.workspace.getConfiguration('pdp2Config');
    // const searchCommonText: string = config.get('searchCommon');
    // const searchCommonName = searchCommonText.trim();
    // if (!searchCommonName) {
    //     vscode.window.showErrorMessage('请先配置搜索的公共模式名');
    //     return;
    // }
    const rootPath = getRootPath()
    if (!rootPath) return;
    // const schemaPath = `${rootPath}${path.sep}App_Data${path.sep}${searchCommonName}.xml`;
    // try {
    //     const data = await readFileAsync(schemaPath, 'utf8');
    //     const xmlDomObj = new XmlDocument(data);
    //     return xmlDomObj;
    // } catch (err) {
    //     console.error(err);
    // }
}