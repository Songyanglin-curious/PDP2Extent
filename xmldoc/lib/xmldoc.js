(function () {
    var sax;
    console.log("xmldoc开始加载")
    if (
        typeof module !== "undefined" &&
        module.exports &&
        !global.xmldocAssumeBrowser
    ) {
        // We're being used in a Node-like environment
        sax = require("sax");
    } else {
        // assume it's attached to the Window object in a browser
        sax = this.sax;

        if (!sax) {
            // no sax for you!
            throw new Error(
                "Expected sax to be defined. Make sure you're including sax.js before this file.",
            );
        }
    }

    /**
     * XmlElement is our basic building block. Everything is an XmlElement; even XmlDocument
     * behaves like an XmlElement by inheriting its attributes and functions.
     * XmlElement是我们的基本构建块。一切都是XmlElement;甚至XmlDocument
        通过继承其属性和函数，*的行为类似于XmlElement。
     */
    function XmlElement(tag, parser) {
        // If you didn't hand us a parser (common case) see if we can grab one
        // from the current execution stack.
        //如果你没有给我们一个解析器(通常情况下)，看看我们是否可以抓取一个
        //从当前执行堆栈。
        if (!parser) {
            var delegate = delegates[delegates.length - 1];

            if (delegate.parser) {
                parser = delegate.parser;
            }
        }

        this.name = tag.name;
        this.attr = tag.attributes;
        this.val = "";
        this.children = [];
        this.firstChild = null;
        this.lastChild = null;
        // parent
        this.parent = null;

        // Assign parse information
        this.line = parser ? parser.line : null;
        this.column = parser ? parser.column : null;
        this.position = parser ? parser.position : null;
        this.startTagPosition = parser ? parser.startTagPosition : null;

        // 自定义添加属性
        this.closeLine = null;
        this.closeColumn = null;
        this.closePosition = null;
        this.closeStartTagPosition = null;
    }

    // Private methods

    XmlElement.prototype._addChild = function (child) {
        // add to our children array
        this.children.push(child);

        // update first/last pointers
        if (!this.firstChild) this.firstChild = child;
        this.lastChild = child;
    };

    // SaxParser handlers
    var currentNode = null;
    XmlElement.prototype._opentag = function (tag) {
        var child = new XmlElement(tag);
        child.parent = currentNode;
        // currentNode = child;
        this._addChild(child);
        delegates.unshift(child);
        currentNode = child;
    };

    XmlElement.prototype._closetag = function (tag) {
        let toCloseNode = delegates.shift();
        toCloseNode.closeLine = currentParser.line;
        toCloseNode.closeColumn = currentParser.column;
        toCloseNode.closePosition = currentParser.position;
        toCloseNode.closeStartTagPosition = currentParser.startTagPosition;

        currentNode = delegates[0];
    };

    XmlElement.prototype._text = function (text) {
        if (typeof this.children === "undefined") return;

        this.val += text;

        this._addChild(new XmlTextNode(text));
    };

    XmlElement.prototype._cdata = function (cdata) {
        currentNode.cdata += cdata;
    };
    XmlElement.prototype._opencdata = function (cdata) {
        var child = new XmlCDataNode(cdata)
        child.parent = currentNode;
        child.line = currentParser.line;
        child.column = currentParser.column;
        child.position = currentParser.position;
        child.startTagPosition = currentParser.startTagPosition;
        this._addChild(child);
        delegates.unshift(child);
        currentNode = child;

    };
    XmlElement.prototype._closecdata = function (cdata) {
        let toCloseNode = delegates.shift();
        toCloseNode.closeLine = currentParser.line;
        toCloseNode.closeColumn = currentParser.column;
        toCloseNode.closePosition = currentParser.position;
        toCloseNode.closeStartTagPosition = currentParser.startTagPosition;

        currentNode = delegates[0];
    };

    XmlElement.prototype._comment = function (comment) {
        if (typeof this.children === "undefined") return;

        this._addChild(new XmlCommentNode(comment));
    };

    XmlElement.prototype._error = function (err) {
        throw err;
    };

    // Useful functions
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

    XmlElement.prototype.eachChild = function (iterator, context) {
        for (var i = 0, l = this.children.length; i < l; i++)
            if (this.children[i].type === "element")
                if (
                    iterator.call(context, this.children[i], i, this.children) === false
                )
                    return;
    };

    XmlElement.prototype.childNamed = function (name) {
        for (var i = 0, l = this.children.length; i < l; i++) {
            var child = this.children[i];
            if (child.name === name) return child;
        }
        return undefined;
    };

    XmlElement.prototype.childrenNamed = function (name) {
        var matches = [];

        for (var i = 0, l = this.children.length; i < l; i++)
            if (this.children[i].name === name) matches.push(this.children[i]);

        return matches;
    };

    XmlElement.prototype.childWithAttribute = function (name, value) {
        for (var i = 0, l = this.children.length; i < l; i++) {
            var child = this.children[i];
            if (
                child.type === "element" &&
                ((value && child.attr[name] === value) || (!value && child.attr[name]))
            )
                return child;
        }
        return undefined;
    };

    XmlElement.prototype.descendantsNamed = function (name) {
        var matches = [];

        for (var i = 0, l = this.children.length; i < l; i++) {
            var child = this.children[i];
            if (child.type === "element") {
                if (child.name === name) matches.push(child);
                matches = matches.concat(child.descendantsNamed(name));
            }
        }

        return matches;
    };

    XmlElement.prototype.descendantWithPath = function (path) {
        var descendant = this;
        var components = path.split(".");

        for (var i = 0, l = components.length; i < l; i++)
            if (descendant && descendant.type === "element")
                descendant = descendant.childNamed(components[i]);
            else return undefined;

        return descendant;
    };

    XmlElement.prototype.valueWithPath = function (path) {
        var components = path.split("@");
        var descendant = this.descendantWithPath(components[0]);
        if (descendant)
            return components.length > 1
                ? descendant.attr[components[1]]
                : descendant.val;
        else return undefined;
    };

    // String formatting (for debugging)

    XmlElement.prototype.toString = function (options) {
        return this.toStringWithIndent("", options);
    };

    XmlElement.prototype.toStringWithIndent = function (indent, options) {
        var s = indent + "<" + this.name;
        var linebreak = options && options.compressed ? "" : "\n";
        var preserveWhitespace = options && options.preserveWhitespace;

        for (var name in this.attr)
            if (Object.prototype.hasOwnProperty.call(this.attr, name))
                s += " " + name + '="' + escapeXML(this.attr[name]) + '"';

        if (this.children.length === 1 && this.children[0].type !== "element") {
            s += ">" + this.children[0].toString(options) + "</" + this.name + ">";
        } else if (this.children.length) {
            s += ">" + linebreak;

            var childIndent = indent + (options && options.compressed ? "" : "  ");

            for (var i = 0, l = this.children.length; i < l; i++) {
                s +=
                    this.children[i].toStringWithIndent(childIndent, options) + linebreak;
            }

            s += indent + "</" + this.name + ">";
        } else if (options && options.html) {
            var whiteList = [
                "area",
                "base",
                "br",
                "col",
                "embed",
                "frame",
                "hr",
                "img",
                "input",
                "keygen",
                "link",
                "menuitem",
                "meta",
                "param",
                "source",
                "track",
                "wbr",
            ];
            if (whiteList.indexOf(this.name) !== -1) s += "/>";
            else s += "></" + this.name + ">";
        } else {
            s += "/>";
        }

        return s;
    };

    // Alternative XML nodes

    function XmlTextNode(text) {
        this.text = text;
    }

    XmlTextNode.prototype.toString = function (options) {
        return formatText(escapeXML(this.text), options);
    };

    XmlTextNode.prototype.toStringWithIndent = function (indent, options) {
        return indent + this.toString(options);
    };

    function XmlCDataNode(cdata) {
        this.cdata = cdata ? cdata : "";
        // this.children = [];
        // parent
        this.parent = null;

        // Assign parse information
        this.line = null;
        this.column = null;
        this.position = null;
        this.startTagPosition = null;

        // 自定义添加属性
        this.closeLine = null;
        this.closeColumn = null;
        this.closePosition = null;
        this.closeStartTagPosition = null;
    }

    XmlCDataNode.prototype.toString = function (options) {
        return "<![CDATA[" + formatText(this.cdata, options) + "]]>";
    };

    XmlCDataNode.prototype.toStringWithIndent = function (indent, options) {
        return indent + this.toString(options);
    };

    function XmlCommentNode(comment) {
        this.comment = comment;
    }

    XmlCommentNode.prototype.toString = function (options) {
        return "<!--" + formatText(escapeXML(this.comment), options) + "-->";
    };

    XmlCommentNode.prototype.toStringWithIndent = function (indent, options) {
        return indent + this.toString(options);
    };


    /**
    * XmlDocument是我们向用户公开的类;它使用sax解析器创建层次结构
    *的XmlElements。
     */
    var currentParser = null;
    function XmlDocument(xml) {
        xml && (xml = xml.toString().trim());

        if (!xml) throw new Error("No XML to parse!");

        //存储文档类型(如果有定义)
        this.doctype = "";

        // 在解析器运行时将解析器公开给其他委托
        this.parser = sax.parser(true); // strict
        addParserEvents(this.parser);
        currentParser = this.parser;
        //我们将使用文件作用域的"delegate "变量来记住我们当前是什么元素
        //解析;当我们深入到XML层次结构时，它们将从堆栈中推入和弹出。
        //使用全局变量是安全的，因为JS是单线程的。
        delegates = [this];

        try {
            // 将xml字符串写入流
            this.parser.write(xml);
        } finally {
            // Remove the parser as it is no longer needed and should not be exposed to clients
            // 删除解析器，因为它不再需要并且不应该向客户端公开
            delete this.parser;
        }
    }

    // make XmlDocument inherit XmlElement's methods
    extend(XmlDocument.prototype, XmlElement.prototype);
    extend(XmlCDataNode.prototype, XmlElement.prototype);


    // Node type tag

    XmlElement.prototype.type = "element";
    XmlTextNode.prototype.type = "text";
    XmlCDataNode.prototype.type = "cdata";
    XmlCommentNode.prototype.type = "comment";

    XmlDocument.prototype._opentag = function (tag) {

        if (typeof this.children === "undefined") {
            // 清空
            currentNode = null;
            // the first tag we encounter should be the root - we'll "become" the root XmlElement
            XmlElement.call(this, tag);
            currentNode = this;
        }

        // all other tags will be the root element's children
        else XmlElement.prototype._opentag.apply(this, arguments);
    };
    // 文档解析结束标签
    XmlDocument.prototype._closetag = function (tag) {
        let toCloseNode = delegates.shift();

        toCloseNode.closeLine = currentParser.line;
        toCloseNode.closeColumn = currentParser.column;
        toCloseNode.closePosition = currentParser.position;
        toCloseNode.closeStartTagPosition = currentParser.startTagPosition;
    };

    XmlDocument.prototype._doctype = function (doctype) {
        this.doctype += doctype;
    };

    // file-scoped global stack of delegates
    var delegates = null;

    /*
     * Helper functions
     */

    function addParserEvents(parser) {
        parser.onopentag = parser_opentag;
        parser.onclosetag = parser_closetag;
        parser.ontext = parser_text;
        parser.oncdata = parser_cdata;
        parser.onopencdata = parser_opencdata;
        parser.onclosecdata = parser_closecdata;
        parser.oncomment = parser_comment;
        parser.ondoctype = parser_doctype;
        parser.onerror = parser_error;
    }

    // create these closures and cache them by keeping them file-scoped
    function parser_opentag() {
        delegates[0] && delegates[0]._opentag.apply(delegates[0], arguments);
    }
    function parser_closetag() {
        delegates[0] && delegates[0]._closetag.apply(delegates[0], arguments);
    }
    function parser_text() {
        delegates[0] && delegates[0]._text.apply(delegates[0], arguments);
    }
    function parser_cdata() {
        delegates[0] && delegates[0]._cdata.apply(delegates[0], arguments);
    }
    function parser_opencdata() {
        delegates[0] && delegates[0]._opencdata.apply(delegates[0], arguments);
    }
    function parser_closecdata() {
        delegates[0] && delegates[0]._closecdata.apply(delegates[0], arguments);
    }
    function parser_comment() {
        delegates[0] && delegates[0]._comment.apply(delegates[0], arguments);
    }
    function parser_doctype() {
        delegates[0] && delegates[0]._doctype.apply(delegates[0], arguments);
    }
    function parser_error() {
        delegates[0] && delegates[0]._error.apply(delegates[0], arguments);
    }


    // a relatively standard extend method
    function extend(destination, source) {
        for (var prop in source)
            if (source.hasOwnProperty(prop)) destination[prop] = source[prop];
    }

    // escapes XML entities like "<", "&", etc.
    function escapeXML(value) {
        return value
            .toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/'/g, "&apos;")
            .replace(/"/g, "&quot;");
    }

    // formats some text for debugging given a few options
    function formatText(text, options) {
        var finalText = text;

        if (options && options.trimmed && text.length > 25) {
            finalText = finalText.substring(0, 25).trim() + "…";
        }

        if (!(options && options.preserveWhitespace)) {
            finalText = finalText.trim();
        }

        return finalText;
    }

    // Are we being used in a Node-like environment?
    if (
        typeof module !== "undefined" &&
        module.exports &&
        !global.xmldocAssumeBrowser
    ) {
        module.exports.XmlDocument = XmlDocument;
        module.exports.XmlElement = XmlElement;
        module.exports.XmlTextNode = XmlTextNode;
        module.exports.XmlCDataNode = XmlCDataNode;
        module.exports.XmlCommentNode = XmlCommentNode;
    } else {
        this.XmlDocument = XmlDocument;
        this.XmlElement = XmlElement;
        this.XmlTextNode = XmlTextNode;
        this.XmlCDataNode = XmlCDataNode;
        this.XmlCommentNode = XmlCommentNode;
    }
})();
