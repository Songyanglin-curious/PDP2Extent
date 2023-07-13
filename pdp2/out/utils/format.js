"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatByCdata = exports.generateEmptyString = void 0;
// 根据长度生成空字符串的函数
function generateEmptyString(length) {
    // 定义空字符串用于存放结果
    let result = '';
    // 定义循环计数器
    let counter = 0;
    // 循环指定的长度次
    while (counter < length) {
        // 将一个空格字符拼接到结果字符串上
        result += ' ';
        // 增加计数器的值
        counter++;
    }
    // 返回结果字符串
    return result;
}
exports.generateEmptyString = generateEmptyString;
function formatByCdata(text, startColumn, tabSize) {
    let trimText = text.trim();
    const CDATA_START = "<![CDATA[".length;
    // 如果内容没有换行
    if (trimText.indexOf("\n") === -1) {
        return `${generateEmptyString(startColumn + tabSize)}<![CDATA[${trimText}]]>`;
    }
    else {
        // // 如果内容有换行
        const textList = trimText.split("\n");
        const formatList = [];
        textList.forEach((sqlTextLine, index) => {
            let trimText = sqlTextLine.trim();
            if (index === 0) {
                formatList.push(`${generateEmptyString(startColumn + tabSize)}<![CDATA[${trimText}`);
            }
            else if (index === textList.length - 1) {
                formatList.push(`${generateEmptyString(startColumn + tabSize + CDATA_START)}${trimText}\n${generateEmptyString(startColumn + tabSize)}]]>`);
            }
            else {
                formatList.push(`${generateEmptyString(startColumn + tabSize + CDATA_START)}${trimText}`);
            }
        });
        return formatList.join("\n").trimEnd();
    }
}
exports.formatByCdata = formatByCdata;
//# sourceMappingURL=format.js.map