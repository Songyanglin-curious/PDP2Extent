"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.designFormat = void 0;
const xml_1 = require("../utils/xml");
const vscode = require("vscode");
// import cssFormat from "./cssformat";
const jsformat_1 = require("./jsformat");
function designFormat() {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return; // 检查编辑器是否激活
    const document = editor.document;
    if (!document)
        return;
    const text = editor.document.getText();
    const xmlDomObj = new xml_1.XmlDocument(text);
    (0, jsformat_1.default)(xmlDomObj);
    // cssFormat();
}
exports.designFormat = designFormat;
//# sourceMappingURL=index.js.map