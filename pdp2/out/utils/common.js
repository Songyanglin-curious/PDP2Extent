"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootPath = exports.getActiveVscodeObj = void 0;
const xmldoc_1 = require("../utils/xmldoc");
const vscode = require("vscode");
const path = require("path");
function getActiveVscodeObj() {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return; // 检查编辑器是否激活
    const document = editor.document;
    if (!document)
        return;
    const text = editor.document.getText();
    const xmlDomObj = new xmldoc_1.XmlDocument(text);
    const edit = new vscode.WorkspaceEdit();
    return { editor, document, text, xmlDomObj, edit };
}
exports.getActiveVscodeObj = getActiveVscodeObj;
function getRootPath() {
    const config = vscode.workspace.getConfiguration('pdp2Config');
    const rootText = config.get('root');
    const rootName = rootText.trim();
    if (!rootName) {
        vscode.window.showErrorMessage('请先配置网站根目录节点');
        return;
    }
    const { document } = getActiveVscodeObj();
    const fileUri = document.uri;
    const filePath = fileUri.fsPath;
    const appDataPath = findUpFolderByName(filePath, rootName);
    if (!appDataPath) {
        vscode.window.showInformationMessage(`未找到${rootName}目录，请检查配置`);
        return null;
    }
    return appDataPath;
}
exports.getRootPath = getRootPath;
function findUpFolderByName(filePath, folderName) {
    const pathSegments = filePath.split(path.sep);
    for (let i = pathSegments.length - 1; i >= 0; i--) {
        const currentPathName = pathSegments[i];
        if (currentPathName == folderName) {
            const slicedArray = pathSegments.slice(0, i + 1);
            const floderPath = slicedArray.join(path.sep);
            return floderPath;
        }
    }
    return null;
}
//# sourceMappingURL=common.js.map