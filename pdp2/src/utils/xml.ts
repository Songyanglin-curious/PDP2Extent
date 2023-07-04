const sax = require('sax');
// import sax from 'sax';

// 定义XmlElement类表示XML元素
class XmlElement {
    [x: string]: any;
    constructor(name, attributes, parent) {
        this.name = name; // 标签名
        this.attributes = attributes; // 属性
        this.parent = parent; // 父节点
        this.startTag = {
            startPosition: 0, //|<value>
            endPosition: 0,//<value>|
        }; // 开始标签位置信息
        this.endTag = {
            startPosition: 0, //|</value>
            endPosition: 0,//</value>|
        }; // 结束标签位置信息
        this.children = []; // 子节点
        this.type = "element"; // 节点类型
    }
}

// 定义XmlCDataNode类表示CDATA节点
class XmlCDataNode {
    parent: any;
    value: any;
    startTag: {};
    endTag: {};
    type: string;
    constructor(parent, value) {
        this.parent = parent; // 父节点
        this.value = value; // CDATA内容
        this.startTag = {
            startPosition: 0, //|<![CDATA[
            endPosition: 0,//<![CDATA[|
        }; // 开始标签位置信息
        this.endTag = {
            startPosition: 0, //|]]>
            endPosition: 0,//]]>|
        }; // 结束标签位置信息
        this.type = "cdata"; // 节点类型
    }
}

// 定义XmlTextNode类表示文本节点
class XmlTextNode {
    parent: any;
    value: any;
    type: string;
    constructor(parent, text) {
        this.parent = parent; // 父节点
        this.value = text; // 文本内容
        this.type = "text"; // 节点类型
    }
}

// 定义XmlCommentNode类表示注释节点
class XmlCommentNode {
    parent: any;
    value: any;
    startTag: {};
    endTag: {};
    type: string;
    constructor(parent, value) {
        this.parent = parent; // 父节点
        this.value = value; // 注释内容
        this.startTag = {
            startPosition: 0,
            endPosition: 0,
        }; // 开始标签位置信息
        this.endTag = {
            startPosition: 0,
            endPosition: 0,
        }; // 结束标签位置信息
        this.type = "comment"; // 节点类型
    }
}

// 定义XmlDocument类表示XML文档对象
export class XmlDocument {
    [x: string]: any;
    xml: any;
    name: any;
    attributes: any;
    startTag: { startPosition: any; endPosition: any; };
    constructor(xml) {
        this.xml = xml; // XML字符串
        // this.root = null; // 根节点
        this.parse(); // 解析XML并构建对象树
    }

    parse() {
        const parser = sax.parser(true); // 创建sax解析器
        let currentNode = null; // 当前节点
        // 监听sax事件
        parser.onopentag = (node) => {
            // currentParser = 
            const { name, attributes } = node;
            const { startTagPosition, position } = parser;

            if (!currentNode) {
                // 创建根节点
                currentNode = new XmlElement(name, attributes, null);
                currentNode.startTag = {
                    startPosition: startTagPosition - 1, //|<value>
                    endPosition: position,//<value>|
                };
                this.name = name;
                this.attributes = attributes;
                this.startTag = {
                    startPosition: startTagPosition - 1,
                    endPosition: position,
                };
                // this.root = currentNode;
            } else {
                // 创建子节点
                const element = new XmlElement(name, attributes, currentNode);
                element.startTag = {
                    startPosition: startTagPosition - 1,
                    endPosition: position,
                };
                currentNode.children.push(element);
                currentNode = element;
            }
        };

        parser.oncdata = (value) => {
            if (currentNode) {
                const cdataNode = new XmlCDataNode(currentNode, value);
                cdataNode.startTag = {
                    startPosition: parser.startTagPosition - 1,
                    endPosition: parser.startTagPosition + 8
                };
                cdataNode.endTag = {
                    startPosition: parser.position - 3,
                    endPosition: parser.position,
                };
                currentNode.children.push(cdataNode);
            }
        };

        parser.ontext = (text) => {
            if (currentNode) {
                const textNode = new XmlTextNode(currentNode, text);
                currentNode.children.push(textNode);
            }
        };

        parser.oncomment = (value) => {
            if (currentNode) {
                const commentNode = new XmlCommentNode(currentNode, value);
                commentNode.startTag = {
                    startPosition: parser.startTagPosition - 1,
                    endPosition: parser.startTagPosition + 3, // "<!--".length = 4, "-->".length = 3
                };
                commentNode.endTag = {
                    startPosition: parser.position - 2,
                    endPosition: parser.position + 1
                };
                currentNode.children.push(commentNode);
            }
        };

        parser.onclosetag = () => {
            if (currentNode && currentNode.parent) {
                currentNode.endTag = {
                    startPosition: parser.startTagPosition - 1,
                    endPosition: parser.position,
                };
                currentNode = currentNode.parent;
            }
        };

        // 开始解析XML
        parser.write(this.xml).close();

        // 将根节点赋值给this，成为直接访问的属性
        Object.assign(this, currentNode);
    }
    // 行和列都是从1开始数
    getLineAndColumnByPosition(position) {
        const lines = this.xml.substr(0, position).split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        return { line, column };
    }

}
// 暴露于外部使用的方法
XmlElement.prototype.getElementsByTagName = function (tagName) {
    var result = [];

    // 递归函数用于遍历子元素
    function traverse(element) {
        // 检查当前元素是否匹配指定的标签名称
        if (element.type === "element" && element.name === tagName) {
            result.push(element);
        }

        // 遍历子元素
        if (element.children) {
            for (var i = 0; i < element.children.length; i++) {
                traverse(element.children[i]);
            }
        }
    }

    // 调用递归函数开始遍历
    traverse(this);

    return result;
}
//获取某个节点下面所有的cdata
XmlElement.prototype.GetAllCdata = function () {
    var cdataList = [];

    // 递归函数用于遍历子元素
    function traverse(node) {
        // 检查当前元素是否为 CData 节点
        if (node.type === "cdata") {
            cdataList.push(node);
        }

        // 遍历子元素
        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                traverse(node.children[i]);
            }
        }
    }

    // 调用递归函数开始遍历
    traverse(this);

    return cdataList;
}
// 获取某个节点下符合条件的 CData 列表
XmlElement.prototype.GetCdataByElementTagName = function (tagName) {
    var cdataList = [];

    // 递归函数用于遍历子元素
    function traverse(node) {
        // 检查当前元素是否为 CData 节点且父节点的名称匹配指定的标签名称
        if (node.type === "cdata" && node.parent?.name === tagName && node.parent.type === "element") {
            cdataList.push(node);
        }

        // 遍历子元素
        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                traverse(node.children[i]);
            }
        }
    }

    // 调用递归函数开始遍历
    traverse(this);

    return cdataList;
}

//获取element的属性
XmlElement.prototype.getAttribute = function (attrName) {
    if (!this.attributes) return undefined;
    return this.attributes[attrName];
}


// 继承方法到原型链
function extend(destination, source) {
    for (var prop in source)
        if (source.hasOwnProperty(prop)) destination[prop] = source[prop];
}
extend(XmlDocument.prototype, XmlElement.prototype);
extend(XmlCDataNode.prototype, XmlElement.prototype);

