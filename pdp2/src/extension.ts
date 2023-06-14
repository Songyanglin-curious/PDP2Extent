import * as vscode from 'vscode';
const xml2js = require('xml2js');
// import { XMLParser, XMLBuilder, XMLValidator, X2jOptions } from "fast-xml-parser"; // 引入fast-xml-parser模块
export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "pdp2" is now active!');

    let disposable = vscode.commands.registerCommand('pdp2.helloWorld', () => {

        vscode.window.showInformationMessage('Hello World from pdp2!');
        const editor = vscode.window.activeTextEditor;
        if (!editor) return; // 检查编辑器是否激活
        const text = editor.document.getText();
        if (!text) return; // 检查文档是否有文本
        const parser = new xml2js.Parser({ locator: {} });

        parser.parseString(text, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }

            const scriptsNode = result.root.scripts[0];
            if (scriptsNode && scriptsNode.script) {
                scriptsNode.script.forEach((script, index) => {
                    const cdataContent = script.value[0];
                    const lineNumber = script.$.start.line;
                    const columnNumber = script.$.start.column;

                    console.log(`Script ${index + 1}:`);
                    console.log('Content:', cdataContent);
                    console.log('Line:', lineNumber);
                    console.log('Column:', columnNumber);
                    console.log('----------------------');
                });
            }
        });








        // const validationResult = XMLValidator.validate(text); // 验证文本是否是合法的XML
        // if (validationResult !== true) { // 使用类型断言来判断返回值是否是true
        //     console.error(validationResult.err); // 打印错误信息
        //     return;
        // }
        // try {
        //     const options: Partial<X2jOptions> = { attributeNamePrefix: "@_", ignoreAttributes: false, cdataPropName: "__cdata", ignoreDeclaration: true }; // 声明一个Partial<X2jOptions>类型的选项对象
        //     const parserObject = new XMLParser(options); // 创建一个解析器对象，并传入选项对象
        //     const traversalObj = parserObject.parse(text, true); // 解析XML并获取一个遍历对象
        //     const rootNode = parserObject.getFirstNode(traversalObj); // 获取根节点
        //     console.log(rootNode); // { tagname: 'root', parent: '', child: [ 'a' ], attrsMap: {}, position: 1, startOffset: 0, endOffset: 34, line: 1, col: 1 }
        //     const aNode = parserObject.getFirstChild(rootNode); // 获取a节点
        //     console.log(aNode); // { tagname: 'a', parent: 'root', child: [ '#cdata' ], attrsMap: {}, position: 3, startOffset: 6, endOffset: 28, line: 1, col: 7 }
        //     const cdataNode = parserObject.getFirstChild(aNode); // 获取CDATA节点
        //     console.log(cdataNode); // { tagname: '#cdata', parent: 'a', val: 'hello', position: 4, startOffset: 11, endOffset: 23, line: 1, col: 12 }
        // } catch (err) {
        //     console.error(err); // 捕获可能抛出的异常
        // }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
