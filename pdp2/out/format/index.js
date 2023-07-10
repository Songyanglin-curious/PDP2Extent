"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.designFormat = void 0;
const xmldoc_1 = require("../utils/xmldoc");
const vscode = require("vscode");
const cssformat_1 = require("./cssformat");
const jsformat_1 = require("./jsformat");
function designFormat() {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return; // 检查编辑器是否激活
    const document = editor.document;
    if (!document)
        return;
    const text = editor.document.getText();
    const xmlDomObj = new xmldoc_1.XmlDocument(text);
    const edit = new vscode.WorkspaceEdit();
    (0, jsformat_1.default)(edit, xmlDomObj);
    (0, cssformat_1.default)(edit, xmlDomObj);
    vscode.workspace.applyEdit(edit).then(() => {
        document.save();
        return edit;
    });
}
exports.designFormat = designFormat;
//# sourceMappingURL=index.js.map