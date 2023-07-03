"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function designLight(context) {
    // 注册自定义语言规范
    const provider = vscode.languages.registerDocumentSemanticTokensProvider({ language: 'xml' }, new XmlDocumentSemanticTokensProvider(), legend);
    context.subscriptions.push(provider);
    // 注册文本着色提供程序
    context.subscriptions.push(vscode.languages.registerDocumentHighlightProvider({ language: 'xml' }, new XmlDocumentHighlightProvider()));
}
exports.default = designLight;
class XmlDocumentSemanticTokensProvider {
    provideDocumentSemanticTokens(document, token) {
        const builder = new vscode.SemanticTokensBuilder();
        const text = document.getText();
        // 在<script>标签内识别CDATA文本，并将其标记为JavaScript
        const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/g;
        let match;
        while ((match = scriptRegex.exec(text)) !== null) {
            const start = document.positionAt(match.index + match[0].indexOf(match[1]));
            const end = document.positionAt(match.index + match[0].indexOf(match[1]) + match[1].length);
            builder.push(start.line, start.character, end.line, end.character, 'script');
        }
        return builder.build();
    }
}
class XmlDocumentHighlightProvider {
    provideDocumentHighlights(document, position, token) {
        const highlights = [];
        const text = document.getText();
        // 在<script>标签内的CDATA文本中高亮匹配的JavaScript代码
        const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/g;
        let match;
        while ((match = scriptRegex.exec(text)) !== null) {
            const start = document.positionAt(match.index + match[0].indexOf(match[1]));
            const end = document.positionAt(match.index + match[0].indexOf(match[1]) + match[1].length);
            if (position.isAfterOrEqual(start) && position.isBeforeOrEqual(end)) {
                highlights.push(new vscode.DocumentHighlight(new vscode.Range(start, end)));
            }
        }
        return highlights;
    }
}
const legend = new vscode.SemanticTokensLegend(['script']);
//# sourceMappingURL=designLight.js.map