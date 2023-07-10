function XmlParsing(id, options) {
    //私有属性
    var defaults = {//默认值，显示延迟和执行间隔
        xmlPath: "",
        width: 800,//宽度
        height: 600,//高度
        mode: 0//默认模式，0为普通模式，1为专家模式
    };
    var options = $.extend(defaults, options);
    var xmlHtml = "";//xml的html格式
    var xmlTxt = "";//xml的文本格式
    var head = "";//xml头元素
    var encoding = "";//xml编码格式
    var root = "";//xml根节点
    var level = 0;
    //私有方法
    //普通模式Xml遍历方法
    //获取节点的全部属性
    var GetAttr = function (node) {
        var next = node.next();
        var attrs = new Array();
        if (next.text() == "属性") {
            do {
                next = next.next();
                if (next.attr("xml") == "attr")
                    attrs.push(next);
                else
                    break;
            } while (true)
            return attrs;
        }
        else
            return null;
    };
    //获取节点后的属性二字
    var GetAttrText = function (node) {
        var next = node.next();
        if (next.text() == "属性") {
            return next;
        } else
            return null;
    }
    //获取节点的值
    var GetValue = function (node) {
        var next = node.next();
        var level = parseInt(node.attr("level"), 10);
        var value;
        do {
            levelNext = parseInt(next.attr("level"), 10);
            xml = next.attr("xml");
            if (xml == "node" || next.length == 0) {
                return null;
            }
            else if (xml == "cdata" || xml == "txt") {
                return next;
            }
            next = next.next();
        } while (true)
    };
    //创建Xml
    var CreateXml = function (str, type) {
        if (type == 0) {
            str = str.replace(/\r\n/g, "\\r\\n");//对换行符进行html化
            var rdr = new ActiveXObject("MSXML2.SAXXMLReader.4.0");
            var wrt = new ActiveXObject("MSXML2.MXXMLWriter.4.0");
            wrt.indent = true;
            rdr.contentHandler = wrt;
            str = IndentXml(str, 0);
            rdr.parse(str);
            return wrt.output;
        } else if (type == 1) {
            if (document.all) {
                var xmlDom = new ActiveXObject("Microsoft.XMLDOM");
                xmlDom.loadXML(str);
                return xmlDom;
            }
            else
                return new DOMParser().parseFromString(str, "text/xml");
        }
    };
    //格式化Xml，在Xml与Html间转换
    var IndentXml = function (str, type) {
        var result = str;
        if (type == 0) {//xml生成预处理
            result = result.replace(/\]><\//g, "]>♢▷○×</");//对]></填充♢▷○×，以与></进行区分
            result = result.replace(/><\//g, ">♢▷○×</");//对></填充♢▷○×
            result = result.replace(/\]♢▷○×<\//g, "]></");//取消]></中填充的♢▷○×
            result = result.replace(/<!\[/g, "&lt;![");//对CDATA的开头进行html化
            result = result.replace(/\]\]>/g, "]]&gt;");//对CDATA的结尾进行html化
            return result;
        }
        else if (type == 1) {//xml转化html预处理
            result = result.replace("standalone=\"no\"", "");//去掉xml头中多余的属性
            result = result.replace(/♢▷○×/g, "");//删除♢▷○×填
            result = result.replace(/</g, "&lt;");//对<进行html化
            result = result.replace(/>/g, "&gt;");//对>进行html化
            result = result.replace(/\\r\\n/g, "<br /><!--\\r\\n-->");//将换行符html化，并留下标记
            result = result.replace(/\r\n/g, "<br />");//对换行符进行html化
            result = result.replace(/\t/g, "&nbsp;&nbsp;&nbsp;");//对制表符进行html化
            //result = result.replace(/\"/g, "\\\"");//对\"填充转义符
            return result;
        } else if (type == 2) {//html转化xml预处理
            result = result.replace(/&lt;/g, "<");//对<进行xml化
            result = result.replace(/&gt;/g, ">");//对>进行xml化
            result = result.replace(/<br \/>/g, "");//删除换行符
            result = result.replace(/<BR>/g, "");//删除大写换行符
            //result = result.replace(/\\\"/g, "\"");//删除\"的转义符
            result = result.replace(/&nbsp;/g, "");//删除空格
            result = result.replace(/<!--\\r\\n-->/g, "\r\n");//将换行符xml化
            result = result.replace(/\?>/g, " " + encoding + "?>");//给xml头加上编码格式
            return result;
        }
    }
    //遍历子节点，生成Html
    var SearchNodes = function (parent) {
        for (var i = 0; i < parent.childNodes.length; i++) {
            for (var j = 0; j < level; j++)
                xmlHtml += "<span level='" + level + "'>&nbsp;&nbsp;&nbsp;</span>";
            if (parent.childNodes[i].baseName != "") {
                if (parent.childNodes[i].childNodes.length > 0) {
                    xmlHtml += "<img src='../../i/plus.gif' title='展开' alt='展开' style='cursor:pointer;' level='" + level + "'/>";
                } else {
                    xmlHtml += "<span level='" + level + "'>&nbsp;</span>";
                }
                xmlHtml += "<span level='" + level + "' class='xmlNode'>节点</span><input type='text' value='" + parent.childNodes[i].baseName + "' level='" + level + "' xml='node'/>";
            }
            if (parent.childNodes[i].attributes) {
                if (parent.childNodes[i].attributes.length > 0) {
                    xmlHtml += "<span level='" + level + "'>属性</span>";
                    for (var j = 0; j < parent.childNodes[i].attributes.length; j++) {
                        xmlHtml += "<input type=\"text\" value=\"" + parent.childNodes[i].attributes[j].baseName + "='" + parent.childNodes[i].attributes[j].nodeValue + "'\" xml=\"attr\" level='" + level + "'/>";
                    }
                }
            }
            else {
                if (parent.childNodes[i].nodeName == "#cdata-section") {
                    if (parent.childNodes[i].data.indexOf("\"") > 0)
                        xmlHtml += "<span level='" + level + "'>值</span><input type='text' value=\'" + parent.childNodes[i].data + "\' level='" + level + "' xml='cdata'/>";
                    else
                        xmlHtml += "<span level='" + level + "'>值</span><input type='text' value=\"" + parent.childNodes[i].data + "\" level='" + level + "' xml='cdata'/>";
                }
                else if (parent.childNodes[i].nodeName == "#text") {
                    if (parent.childNodes[i].data.indexOf("\"") > 0)
                        xmlHtml += "<span level='" + level + "'>值</span><input type='text' value=\'" + parent.childNodes[i].data + "\' level='" + level + "' xml='txt'/>";
                    else
                        xmlHtml += "<span level='" + level + "'>值</span><input type='text' value=\"" + parent.childNodes[i].data + "\" level='" + level + "' xml='txt'/>";
                }
            }
            xmlHtml += "<br level='" + level + "' />";
            if (parent.childNodes[i].childNodes.length > 0) {
                level++;
                SearchNodes(parent.childNodes[i]);
                level--;
            }
        }
    };
    //初始化normal以及normalattr
    var InitAttr = function () {
        var head = "<tr><td style='width:30%;'>属性: ";
        head += "<img src='../../i/copy_24.gif' title='添加' alt='添加' style='cursor:pointer;width:18px;height:18px;' />";
        head += "<img src='../../i/delete_24.gif' title='删除' alt='删除' style='cursor:pointer;width:18px;height:18px;' />";
        head += "<img src='../../i/edit_24.png' title='编辑' alt='编辑' style='cursor:pointer;width:18px;height:18px;' />";
        head += "<img src='../../i/allcheck.gif' title='更新' alt='更新' style='cursor:pointer;width:18px;height:18px;' />";
        head += "</td><td style='width:70%;'>节点:<input style='width:80%;' id='" + id + "nodeName' readonly='readonly' value=''/></td></tr>"
        $("#" + id + "normalattr .xmlAttrHead").html(head);
        var table = "<tr><th style='width:30%;'>名称</th><th style='width:100%;'>值</th></tr>";
        $("#" + id + "normalattr .xmlAttrTable").html(table);

        $("#" + id + "normal input").attr("readonly", "readonly");//初始化normal中input不能被点击
        $("#" + id + "normal .xmlNode").click(function () {//普通模式选择节点
            $("#" + id + " .xmlSelected").removeClass("xmlSelected");
            $(this).addClass("xmlSelected");
            var node = $(this).next();
            $("#" + id + "nodeName").val(node.val().toString());
            var str = table;//初始化str
            var nodes = GetAttr(node);
            if (nodes != null) {//遍历属性拼接html
                for (var i = 0; i < nodes.length;) {
                    var attr = nodes.shift();
                    var name = attr.val().split('=')[0];
                    var value = attr.val().split('=')[1];
                    value = value.substring(1, value.length - 1);
                    str += "<tr><td style='width:30%;'>" + name + "</td><td style='width:100%;'>" + value + "</td></tr>";
                }
            }
            nodes = GetValue(node);
            if (nodes != null) {
                var value = nodes.val();
                $("#" + id + "normaledit").html(value);
            } else {
                $("#" + id + "normaledit").html();
            }
            $("#" + id + "normalattr .xmlAttrTable").html(str);//用str填充属性区

            $("#" + id + "normalattr .xmlAttrTable tr").click(function () {
                if ($(this).children().get(0).nodeName != "TH") {
                    $(".xmlInputSelected").removeClass("xmlInputSelected");
                    $($(this).children().get(0)).addClass("xmlInputSelected");
                }
            });
        });
        $("#" + id + "normalattr img").click(function () {//编辑、添加、删除功能
            switch ($(this).attr("title")) {
                case "添加":
                    if ($("#" + id + " .xmlSelected").length > 0) {
                        var node = $("#" + id + " .xmlSelected").next();
                        var level = node.attr("level");
                        var attrs = GetAttr(node);
                        if (attrs != null) {//如果已有属性
                            var nodeLast = attrs[attrs.length - 1];
                            var result = prompt("请输入属性的名称和值：", "name='value'");
                            if (result != null) {
                                var name = result.split("=")[0];
                                var value = result.split("=")[1];
                                var str = "<input type=\"text\" value=\"" + name + "='" + value + "'\" xml=\"attr\" level='" + level + "'/>";
                                nodeLast.after(str);
                            }
                        } else {//如果还没有属性
                            var str = "<span level='" + level + "'>  属性</span>";
                            var result = prompt("请输入属性的名称和值：", "name='value'");
                            if (result != null) {
                                var name = result.split("=")[0];
                                var value = result.split("=")[1];
                                str += "<input type=\"text\" value=\"" + name + "='" + value + "'\" xml=\"attr\" level='" + level + "'/>";
                                node.after(str);
                            }
                        }
                    }
                    break;
                case "删除":
                    if ($("#" + id + " .xmlInputSelected").length > 0) {
                        var target = $("#" + id + " .xmlInputSelected");
                        var node = $("#" + id + " .xmlSelected").next();
                        var attrs = GetAttr(node);
                        for (var i = 0; i < attrs.length; i++) {
                            var name = attrs[i].val().split('=')[0];
                            if (name == target.html()) {
                                attrs[i].remove();
                                if (attrs.length == 1) {
                                    var txt = GetAttrText(node);
                                    txt.remove();
                                }
                                target.parent().remove();
                            }
                        }
                    } else
                        alert("没有选中属性");
                    break;
                case "编辑":
                    if ($("#" + id + " .xmlInputSelected").length > 0) {
                        var target = $("#" + id + " .xmlInputSelected");
                        var node = $("#" + id + " .xmlSelected").next();
                        var name = target.text();
                        var value = target.next().text();
                        var result = prompt("请输入属性的名称和值：", StringPP.format("{0}='{1}'", name, value));
                        if (result != null) {
                            name = result.split("=")[0];
                            value = result.split("=")[1];
                            target.text(name);
                            target.next.text(value);
                        }
                    }
                    else
                        alert("请先选中属性");
                    break;
                case "更新":
                    if ($("#" + id + " .xmlSelected").length > 0) {
                        var node = GetValue($("#" + id + " .xmlSelected").next());
                        if (node != null)
                            node.val($("#" + id + "normaledit").html());
                        else
                            alert("该节点不包含值");
                    }
                    else
                        alert("请先选中节点");
                    break;
                default: break;
            }
        });
    }
    //初始化折叠
    var InitImg = function () {
        $("#" + id + "normal [level]").each(function () {//初始化全部折叠
            if (parseInt($(this).attr("level"), 10) > 0)
                $(this).hide();
        });
        $("#" + id + "normal img").click(function () {//展开和折叠功能
            var level = parseInt($(this).attr("level"), 10);
            var next = $(this).next();
            var nextLevel = parseInt(next.attr("level"), 10);
            do {
                next = next.next();
                nextLevel = parseInt(next.attr("level"), 10);
            } while (nextLevel == level);

            if ($(this).attr("title") == "展开") {//展开，只展开一层
                $(this).attr("src", "../../i/minus.gif");
                $(this).attr("title", "折叠");
                $(this).attr("alt", "折叠");
                do {
                    if (nextLevel == (level + 1))
                        next.show();
                    next = next.next();
                    nextLevel = parseInt(next.attr("level"), 10);
                } while (nextLevel > level);
            } else if ($(this).attr("title") == "折叠") {//折叠，子节点全部折叠
                $(this).attr("src", "../../i/plus.gif");
                $(this).attr("title", "展开");
                $(this).attr("alt", "展开");
                do {
                    next.hide();
                    if (next[0].nodeName == "IMG" && next.attr("title") == "折叠") {
                        next.attr("src", "../../i/plus.gif");
                        next.attr("title", "展开");
                        next.attr("alt", "展开");
                    }
                    next = next.next();
                    nextLevel = parseInt(next.attr("level"), 10);
                } while (nextLevel > level);
            }
        });
    }
    //根据元素的Html生成Xml
    var GetXml = function (text, type, a) {
        var str = "";
        switch (type) {
            case "node":
                if (a == 0)
                    str = "<" + text + ">";
                else if (a == 1)
                    str = "</" + text + ">";
                else if (a == 2)
                    str = "<" + text + " ";
                break;
            case "cdata":
                if (a == 0)
                    str = "<![CDATA[" + text + "]]>";
                break;
            case "txt":
                if (a == 0)
                    str = " " + text + " ";
                break;
            case "attr":
                if (a == 0)
                    str += text + " ";
                else if (a == 1)
                    str += text + ">";
                break;
            default: break;
        }
        return str;
    };
    //保存
    var Save = function () {
        if (defaults.mode == 0) {
            var xmlTmp = head;
            xmlTmp += GetXml(root, "node", 0);
            var xmlEnd = new Array();
            var inputs = $("#" + id + "normal input");
            for (var i = 0; i < inputs.length; i++) {
                var node = $("#" + id + "normal input:eq(" + i + ")");
                var level = parseInt(node.attr("level"), 10);
                var type = node.attr("xml");
                var value = node.attr("value");
                if (i < (inputs.length - 1)) {//如果不是最后一个，那么判断下一个节点是什么
                    var next = i + 1;
                    var nodeNext = $("#" + id + "normal input:eq(" + next + ")");
                    var levelNext = parseInt(nodeNext.attr("level"), 10);
                    var typeNext = nodeNext.attr("xml");
                    var valueNext = nodeNext.attr("value");
                    if (type == "node") {//本节点是node
                        if (typeNext == "attr") {//下一节点是attr
                            xmlTmp += GetXml(value, type, 2);
                        } else {//下一节点是node或cdata或txt
                            xmlTmp += GetXml(value, type, 0);
                        }
                        xmlEnd.push(GetXml(value, type, 1));
                    } else if (type == "attr") {//本节点是attr
                        if (typeNext == "attr") {//下一节点attr
                            xmlTmp += GetXml(value, type, 0);
                        } else {//下一节点是node或cdata或txt
                            xmlTmp += GetXml(value, type, 1);
                        }
                    } else if (type == "cdata" || type == "txt") {//本节点是cdata或txt
                        xmlTmp += GetXml(value, type, 0);
                    }
                    if (level > levelNext) {
                        if (type == "attr")
                            for (var j = 0; j < (level - levelNext + 1) ; j++)
                                xmlTmp += xmlEnd.pop();
                        else
                            for (var j = 0; j < (level - levelNext) ; j++)
                                xmlTmp += xmlEnd.pop();
                    }
                    else if (level == levelNext && typeNext != "attr") {
                        while (xmlEnd.length > 0)
                            xmlTmp += xmlEnd.pop();
                    }
                } else {
                    if (type == "node") {//本节点是cdata
                        xmlTmp += GetXml(value, type, 0);
                        xmlEnd.push(GetXml(value, type, 1));
                    } else if (type == "attr") {//本节点是attr
                        xmlTmp += GetXml(value, type, 1);
                    }
                    else if (type == "cdata" || type == "txt") {//本节点是cdata或txt
                        xmlTmp += GetXml(value, type, 0);
                    }
                    for (var j = 0; j < xmlEnd.length ;) {
                        xmlTmp += xmlEnd.pop();
                    }
                }
            }
            xmlTmp += GetXml(root, "node", 1);
            xmlTmp = xmlTmp.replace(/<BR>/g, "\n");//删除大写换行符
            xmlTmp = xmlTmp.replace(/\?>/g, " " + encoding + "?>");
            var b = UserControl_XmlParsing.SaveXml(defaults.xmlPath, xmlTmp).value;
            alert("保存" + (b ? "成功" : "失败"));
            if (b) {
                xmlTxt = xmlTmp;
            }
        }
        else {
            var xmlTmp = $("#" + id + "expert").html();
            xmlTmp = IndentXml(xmlTmp, 2);
            var b = UserControl_XmlParsing.SaveXml(defaults.xmlPath, xmlTmp).value;
            alert("保存" + (b ? "成功" : "失败"));
            if (b) {
                xmlTxt = xmlTmp;
            }
        }
    }
    //公共方法
    //初始化
    this.Init = function () {
        var orgXml = UserControl_XmlParsing.GetXml(defaults.xmlPath).value;
        xmlTxt = IndentXml(CreateXml(orgXml, 0), 1);
        xml = CreateXml(orgXml, 1);
        $(xml).each(function () {
            var content = this.childNodes[1];
            head = this.childNodes[0].xml;
            encoding = this.childNodes[0].attributes[1].xml;
            root = content.baseName;
            SearchNodes(content);
            xmlHtml = xmlHtml.replace(/\n/g, "<BR>");//将换行符html化，并留下标记
        });
        $("#" + id + "normal").html(xmlHtml);
        $("#" + id + "expert").html(xmlTxt);
        $("#" + id + "normaledit")[0].contentEditable = true;
        $("#" + id + "expert")[0].contentEditable = true;
        if (defaults.mode == 0) {//初始化模式
            $("#" + id + "expert").hide();
            $("#" + id + "shown").hide();
        }
        else {
            $("#" + id + "normal").hide();
            $("#" + id + "normaledit").hide();
            $("#" + id + "normalattr").hide();
            $("#" + id + "showe").hide();
            $("#" + id + "update").hide();
        }
        //普通模式
        $("#" + id + "showe").click(function () {//切换为专家模式
            defaults.mode = 1;
            $("#" + id + "normal").hide();
            $("#" + id + "normaledit").hide();
            $("#" + id + "normalattr").hide();
            $("#" + id + "expert").show();
            $("#" + id + "showe").hide();
            $("#" + id + "shown").show();
            $("#" + id + "update").hide();
        });
        $("#" + id + "normal,#" + id + "normalattr").keydown(function (e) {//禁止普通模式的退格键
            if (e.keyCode == 8)
                window.event.returnValue = false;
        });
        InitImg();//初始化全部折叠
        InitAttr();//初始化normalattr
        //专家模式
        $("#" + id + "shown").click(function () {//切换为普通模式
            defaults.mode = 0;
            $("#" + id + "expert").hide();
            $("#" + id + "normal").show();
            $("#" + id + "normaledit").show();
            $("#" + id + "normalattr").show();
            $("#" + id + "shown").hide();
            $("#" + id + "showe").show();
            $("#" + id + "update").show();
        });
        //通用
        $("#" + id + "expert,#" + id + "normaledit").keypress(function (e) {//将回车改为Shift+回车
            if (e.keyCode == 13) {
                window.event.returnValue = false;
                pos = document.selection.createRange();
                pos.pasteHTML("<BR>");
            }
        });
        $("#" + id + "reset").click(function () {//重置Xml
            var b = confirm("要重置xml信息为初始状态吗？(未保存的改动将会消失)")
            if (b) {
                if (defaults.mode == 0) {
                    $("#" + id + "normal").html(xmlHtml);
                    InitImg();
                    InitAttr();
                }
                else $("#" + id + "expert").html(xmlTxt);
            }
        });
        $("#" + id + "save").click(function () {//保存Xml
            Save();
        });
    }
};
