import { window, Range, TextDocument } from "vscode";
import { globalState } from "../store/GlobalState";


// 用于当前文件console  debugger  注释 和取消注释
export default function changeDebug() {

    const editor = window.activeTextEditor;
    if (!editor) return; // 检查编辑器是否激活
    const document = editor.document;
    if (!document) return;
    const text = editor.document.getText();
    // const debugs = getDebugPosition(text);
    const isComment = globalState.getDebug();
    // 改变状态
    globalState.setDebug(!globalState.getDebug());

    const wholeFileRange = document.validateRange(
        new Range(
            document.positionAt(0),
            document.positionAt(text.length)
        )
    );
    let newContent = "";
    if (isComment) {
        // 取消注释
        newContent = removeComment(document);
        window.showInformationMessage("取消 console debugger  注释");
    } else {
        // 添加注释
        newContent = addComment(document);
        window.showInformationMessage("注释 console debugger  成功");
    }

    editor.edit(editBuilder => {
        // 替换整个文件的内容
        editBuilder.replace(wholeFileRange, newContent);
    }).then(() => {
        // 保存文件
        document.save();
    });

}

function addComment(document: TextDocument): string {
    // 获取文档行数
    const lineCount = document.lineCount;
    const replaceTexts = []
    // 循环遍历每一行
    for (let lineNumber = 0; lineNumber < lineCount; lineNumber++) {
        // 获取行文本
        let lineText = document.lineAt(lineNumber).text;
        // 检查是否包含关键字
        if (lineText.includes("console.") || lineText.includes("debugger")) {
            // 获取关键字的开始位置
            const keywordStartIndex = lineText.indexOf("console.") !== -1 ? lineText.indexOf("console.") : lineText.indexOf("debugger");
            // 判断行中是否存在 "//"
            const lineCommentIndex = lineText.indexOf("//");
            if (lineCommentIndex !== -1) {
                //已经有注释了，不做处理

                // 存在 "//"，获取注释的开始和结束位置
                const commentStartIndex = lineCommentIndex;
                const commentEndIndex = lineText.length - 1;
            } else {
                //没有注释的添加注释
                lineText = lineText.substring(0, keywordStartIndex) + "//" + lineText.substring(keywordStartIndex);
            }
        }
        replaceTexts.push(lineText);
    }
    return replaceTexts.join("\n");
}

function removeComment(document: TextDocument): string {
    // 获取文档行数
    const lineCount = document.lineCount;
    const replaceTexts = []
    // 循环遍历每一行
    for (let lineNumber = 0; lineNumber < lineCount; lineNumber++) {
        // 获取行文本
        let lineText = document.lineAt(lineNumber).text;
        // 检查是否包含关键字
        if (lineText.includes("console.") || lineText.includes("debugger")) {
            // 获取关键字的开始位置
            const keywordStartIndex = lineText.indexOf("console.") !== -1 ? lineText.indexOf("console.") : lineText.indexOf("debugger");
            // 判断行中是否存在 "//"
            const lineCommentIndex = lineText.indexOf("//");
            if (lineCommentIndex !== -1) {
                //已经有注释了，获取开始结束位置进行删除
                const commentStartIndex = lineCommentIndex;
                const commentEndIndex = lineCommentIndex + 2;
                lineText = lineText.substring(0, commentStartIndex) + lineText.substring(commentEndIndex);
            } else {
                //没有注释的不作处理
            }
        }
        replaceTexts.push(lineText);
    }
    return replaceTexts.join("\n");
}
