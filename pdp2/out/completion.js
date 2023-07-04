"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlWithJsCompletionItemProvider = void 0;
const vscode = require("vscode");
class XmlWithJsCompletionItemProvider {
    provideCompletionItems(document, position, token, context) {
        const completionItems = [];
        // 添加具体的补全项
        completionItems.push(new vscode.CompletionItem('console.log()', vscode.CompletionItemKind.Method));
        return completionItems;
    }
}
exports.XmlWithJsCompletionItemProvider = XmlWithJsCompletionItemProvider;
//# sourceMappingURL=completion.js.map