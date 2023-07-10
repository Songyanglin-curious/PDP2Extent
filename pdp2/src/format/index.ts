
import { XmlDocument } from '../utils/xmldoc'
import * as vscode from 'vscode';
import cssFormat from "./cssformat";
import jsFormat from "./jsformat";
export function designFormat() {

    const editor = vscode.window.activeTextEditor;
    if (!editor) return; // 检查编辑器是否激活
    const document = editor.document;
    if (!document) return;

    const text = editor.document.getText();
    const xmlDomObj = new XmlDocument(text);
    const edit = new vscode.WorkspaceEdit();
    jsFormat(edit, xmlDomObj);
    cssFormat(edit, xmlDomObj);

    vscode.workspace.applyEdit(edit).then(() => {
        document.save();
        return edit;
    });
}