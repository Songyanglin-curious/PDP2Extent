var xmldoc = require('./index');
const fs = require('fs');
// 读取文档内容
var xml = fs.readFileSync('test1.xml', 'utf8');

// // 替换制表符和换行符为一个空格
// xml = xml.replace(/\t|\n/g, ' ');

// // 开始解析文档
// parser.write(xml).close();

var document = new xmldoc.XmlDocument(xml);
// var document1 = new xmldoc.XmlDocument(xml);
// var value = document.getElementsByTagName(document, 'value')

var cdata = document.GetCdataByElementTagName('css')
console.log("结束")