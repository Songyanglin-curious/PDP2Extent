import { XmlDocument } from '../utils/xmldoc'
import * as vscode from 'vscode';
import * as path from 'path';
export function getActiveVscodeObj() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return; // 检查编辑器是否激活
    const document = editor.document;
    if (!document) return;

    const text = editor.document.getText();
    const xmlDomObj = new XmlDocument(text);
    const edit = new vscode.WorkspaceEdit();
    return { editor, document, text, xmlDomObj, edit }
}

export function getRootPath() {
    const config = vscode.workspace.getConfiguration('pdp2Config');
    const rootText: string = config.get('root');
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


function findUpFolderByName(filePath: string, folderName: string): string | undefined {
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