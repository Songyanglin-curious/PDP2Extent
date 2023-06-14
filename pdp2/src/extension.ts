
import * as vscode from 'vscode';
const prettier = require('prettier');
const { DOMParser, Node } = require("xmldom");
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('pdp2.helloWorld', () => {
        console.log('Hello World!');
        // 获取当前激活的编辑器
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            // 获取当前编辑器的文档
            let document = editor.document;
            // 获取当前编辑器的选中范围
            let selection = editor.selection;
            // 如果没有选中任何内容，就选中整个文档
            if (selection.isEmpty) {
                selection = new vscode.Selection(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            }
            // 获取选中内容的文本
            let text = document.getText(selection);
            var test = `<list type="script">
            <value>
      <![CDATA[
        this.areaIndex = {};
                                        for(var i = 0; i < this.col73.length; i++){
          this.areaIndex[this.col73[i]] = i;
        }                    
      ]]>
    </value>
        </list>`
            parseXML(test)
            return;
            // 使用正则表达式匹配value子节点中cdata里面的JS代码
            const regex = /<value><!\[CDATA\[([\s\S]*?)\]\]><\/value>/g;
            let match;
            // 创建一个编辑操作
            let edit = new vscode.WorkspaceEdit();
            // 遍历所有匹配结果
            let index = 0;
            while ((match = regex.exec(text)) !== null) {
                index++;
                console.log(`第${index}个匹配结果：${match[0]}`);
                // 获取JS代码的内容和位置
                let jsCode = match[1];
                let jsStart = match.index + match[0].indexOf(jsCode);
                let jsEnd = jsStart + jsCode.length;
                // 获取cdata最开始缩进的空格数量
                let indent = 0;
                if (match[0] !== null) {
                    indent = match[0].match(/^\s*/)[0].length + 2;
                }
                // 使用prettier提供的格式化函数来格式化JS代码，根据package.json中的配置，并添加缩进空格
                let formattedJsCode = prettier.format(jsCode, {
                    "singleQuote": true,
                    "trailingComma": "es5",
                    "semi": false,
                    parser: 'babel',
                });
                formattedJsCode = formattedJsCode.replace(/^/gm, ' '.repeat(indent));
                // 用格式化后的JS代码替换原来的JS代码
                edit.replace(document.uri, new vscode.Range(document.positionAt(jsStart), document.positionAt(jsEnd)), formattedJsCode);
            }
            // 应用编辑操作
            vscode.workspace.applyEdit(edit);
        }

    });

    context.subscriptions.push(disposable);
}
function parseXML(xmlString: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const values = xmlDoc.getElementsByTagName("value");

    const results = [];
    for (let i = 0; i < values.length; i++) {
        const valueNode = values[i].childNodes[0];
        // if (valueNode.nodeType === Node.CDATA_SECTION_NODE) {
        const cdataContent = valueNode.textContent;
        const lineNumber = valueNode.lineNumber;
        const columnNumber = valueNode.columnNumber;
        console.log(`第${i}个:`, cdataContent, lineNumber, columnNumber)
        results.push({ content: cdataContent, line: lineNumber, column: columnNumber });
        // }
    }

    return results;
}
// This method is called when your extension is deactivated
export function deactivate() { }
