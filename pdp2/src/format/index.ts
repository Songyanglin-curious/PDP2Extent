
import { XmlDocument } from '../utils/xml'
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
    console.log(xmlDomObj)
    jsFormat(xmlDomObj);
    cssFormat(xmlDomObj);
}