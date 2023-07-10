//配置报表高级设置
function ReportAdvancedConfig() {
    //私有属性
    var thisC = this;
    //菜单的三种类型
    var menus = ["conditions", "sources", "fields"];
    //按钮样式1
    var btnStyle_16 = "margin:2px 0 0 2px;width:16px;height:16px;cursor:pointer;";
    var icnDelete_16 = StringPP.format("<img style='{0}' src='../i/delete_24.gif' alt='删除' title='删除' onclick=\"rac.DeleteI($(this));\"/>", btnStyle_16);
    var icnAdd_16 = StringPP.format("<span><img style='{0}' src='../i/copy_24.gif' alt='增加' title='增加' onclick=\"rac.AddI($(this));\"/></span>", btnStyle_16);
    //按钮样式2
    var btnStyle_24 = "margin:2px 0 0 2px;width:24px;height:24px;cursor:pointer;";
    var icnDelete_24 = StringPP.format("<img style='{0}' src='../i/delete_24.gif' alt='删除' title='删除' onclick=\"rac.Delete($(this));\"/>", btnStyle_24);
    var icnAdd_24 = StringPP.format("<span><img style='{0}' src='../i/copy_24.gif' alt='增加' title='增加' /></span>", btnStyle_24);

    //公共属性
    //xml文件名（.cll后缀名）
    this.xmlFileName = "";
    //xml文本
    this.xml;
    //根据xml文本生成的xml对象
    this.xmlNodes;

    //私有方法
    //根据值类型获取html
    var GetHtmlByValueType = function (type) {
        var html = "";
        var menuName = GetMenuName();
        if (menuName == "conditions") {
            html += "默认值类型:<select id='ddlDefaultType'><option selected='selected'>string</option><option>decimal</option><option>date</option></select>&nbsp;";
            html += "默认值:<input type='text' id='txtDefault' />&nbsp;";
            switch (type) {
                case "time":
                    html += "<br /><br />时间类型:<select id='ddlTimeType'><option>yy</option><option>mm</option><option>ww</option><option>dd</option><option>hh</option><option>mi</option><option>ss</option></select>";
                    html += "<br /><br />时间设置:<select id='ddlSet'><option>point</option><option>range</option></select>";
                    html += "<br /><br />时间精度:<input id='txtPrecision' type='text' />";
                    break;
                case "if":
                case "list":
                    break;
                case "text":
                    break;
                case "virtual":
                    html += "Depend:<select id='ddlDepend'><option selected='selected'>sql</option><option></option></select><br /><br />";
                    break;
                default: break;
            }
        } else if (menuName == "sources") {
            switch (type) {
                case "single":
                    html += "数据源:<input type='text' id='txtDb' />&nbsp;";
                    html += "表名:<input type='text' id='txtSrc' />&nbsp;";
                    html += "<br /><br />条件:<input id='txtCondition' type='text' style='width:620px;'/>";
                    break;
                case "Sql":
                    html += "数据源:<input type='text' id='txtDb' />&nbsp;";
                    html += "<br /><br />Sql:<textarea id='txtSql' style='width:620px;height:205px;'></textarea>";
                    break;
                case "time":
                    html += "数据源:<input type='text' id='txtDb' />&nbsp;";
                    html += "<br /><br />分隔长度:<input type='text' id='txtOffset' /><select id='ddlOffset'><option value='yy'>年</option><option value='mm'>月</option><option value='ww'>周</option><option value='dd'>天</option><option value='hh'>小时</option><option value='mi'>分钟</option><option value='ss'>秒钟</option></select>";
                    html += "<br /><br />排序:<select id='ddlOrderby'><option value='asc'>正序</option><option value='desc'>倒序</option></select>";
                    break;
                case "fix":
                    html += "数据源:<input type='text' id='txtDb' />&nbsp;";
                    html += "<br /><br />分隔长度:<input type='text' id='txtOffset' />";
                    html += "<br /><br />数据格式:<select id='ddlFixType'><option value='date'>时间</option><option value='decimal'>浮点数</option><option value='int'>整数</option><%--<option value='data'>数据</option>--%></select>";
                    break;
                case "memory":
                    html += "数据源:<input type='text' id='txtDb' />&nbsp;";
                    html += "<br /><br />Sql:<textarea id='txtSql' style='width:620px;height:205px;'></textarea>";
                    break;
                case "sub":
                    html += "数据源:<input type='text' id='txtDb' />&nbsp;";
                    html += "<br /><br />开始行条件ID:<input type='text' id='txtStart' />&nbsp;";
                    html += "<br /><br />长度条件ID:<input type='text' id='txtLength' />&nbsp;";
                    break;
                case "join":
                    html += "连接类型:<select id='ddlJoin'><option value='left'>left</option><option value='right'>right</option><option value='inner'>inner</option><option value='full'>full</option></select>;";
                    html += "<br /><br />左连接表:<input type='text' id='txtLsrc' />&nbsp;";
                    html += "右连接表:<input type='text' id='txtRsrc' />&nbsp;";
                    html += "<br /><br />连接条件:<input type='text' style='width:400px;' id='txtOn' />&nbsp;";
                    html += "<br /><br />过滤条件:<input type='text' id='txtIf' />&nbsp;";
                    html += "排序:<input type='text' id='txtOrderby' />&nbsp;";
                    break;
                default: break;
            }
        } else if (menuName == "fields") {
            html += "数据源（条件）:<input type='text' id='txtDb' />&nbsp;";
            html += "列名（条件值索引）:<input type='text' id='txtCol' />&nbsp;";
            html += "<br /><br />过滤条件:<input type='text' id='txtFilter' />&nbsp;";
        }
        return html;
    }
    //根据值类型设置值
    var SetValueByValueType = function (type, node) {
        var menuName = GetMenuName();
        if (menuName == "conditions") {
            var defaultType = GetAttr(node, "defaulttype");
            if (defaultType == "")
                defaultType = "string";
            var defaultValue = GetAttr(node, "default");
            $("#ddlDefaultType").val(defaultType);
            $("#txtDefault").val(defaultValue);
            switch (type) {
                case "time":
                    $("#ddlDefaultType").prop("disabled", "true");
                    $("#ddlTimeType").val(GetAttr(node, "timetype"));
                    $("#ddlSet").val(GetAttr(node, "set"));
                    $("#txtPrecision").val(GetAttr(node, "precision"));
                    break;
                case "if":
                case "list":
                    break;
                case "text":
                    break;
                case "virtual":
                    //ddlDepend值变更事件
                    $("#ddlDepend").change(function () {
                        //设置dvOthers
                        SetDvOthersByType($("#ddlDepend").val());
                        $("#dvValue").html(icnAdd_16);
                    });
                    var depend = GetAttr(node, "depend");
                    $("#ddlDepend").val(depend);
                    SetDvOthersByType(depend);
                    switch (depend) {
                        case "sql":
                            $("#txtValue").val(node.nodeTypedValue);
                            break;
                        case "":
                            var html = "";
                            for (var i = 0; i < node.childNodes.length; i++) {
                                var cNode = node.childNodes[i];
                                html += StringPP.format("<span>{0}&nbsp;{1}{2}</span>", GetTypeHtmlByValue(GetAttr(cNode, "type")), GetInputHtmlByValue(GetAttr(cNode, "value")), icnDelete_16);
                            }
                            html += icnAdd_16;
                            $("#dvValue").html(html);
                            break;
                    }
                    break;
                default: break;
            }
        } else if (menuName == "sources") {
            switch (type) {
                case "single":
                    $("#txtDb").val(GetAttr(node, "db"));
                    $("#txtSrc").val(GetAttr(node, "src"));
                    $("#txtCondition").val(GetAttr(node, "if"));
                    break;
                case "Sql":
                    $("#txtDb").val(GetAttr(node, "db"));
                    $("#txtSql").val(node.nodeTypedValue);
                    break;
                case "time":
                    $("#txtDb").val(GetAttr(node, "src"));
                    var offset = GetAttr(node, "offset");
                    var number = offset.substring(0, offset.length - 2);
                    var unit = offset.substring(offset.length - 2, offset.length);
                    $("#txtOffset").val(number);
                    $("#ddlOffset").val(unit);
                    $("#ddlOrderby").val(GetAttr(node, "orderby"));
                    break;
                case "fix":
                    $("#txtDb").val(GetAttr(node, "src"));
                    $("#txtOffset").val(GetAttr(node, "offset"));
                    $("#ddlFixType").val(GetAttr(node, "fixtype"));
                    break;
                case "memory":
                    $("#txtDb").val(GetAttr(node, "src"));
                    $("#txtSql").val(node.nodeTypedValue);
                    break;
                case "sub":
                    $("#txtDb").val(GetAttr(node, "src"));
                    $("#txtStart").val(GetAttr(node, "start"));
                    $("#txtLength").val(GetAttr(node, "length"));
                    break;
                case "join":
                    $("#ddlJoin").val(GetAttr(node, "join"));
                    $("#txtLsrc").val(GetAttr(node, "lsrc"));
                    $("#txtRsrc").val(GetAttr(node, "rsrc"));
                    $("#txtOn").val(GetAttr(node, "on"));
                    $("#txtIf").val(GetAttr(node, "if"));
                    $("#txtOrderby").val(GetAttr(node, "orderby"));
                    break;
                default: break;
            }
        } else if (menuName == "fields") {
            $("#ddlType").val("无");
            SetDvOthersByType("");
            if ($("#dvValue").length == 0)
                $("#dvOthers").append("<div id='dvValue' style='width:685px;height:205px;background-color:white;border:1px solid black;overflow-y:auto;'></div>");
            var html = "";
            for (var i = 0; i < node.childNodes.length; i++) {
                var cNode = node.childNodes[i];
                html += StringPP.format("<span>数据源:{0}&nbsp;列名:{1}&nbsp;过滤条件:{2}{3}</span>", GetInputHtmlByValue(GetAttr(cNode, "src")), GetInputHtmlByValue(GetAttr(cNode, "col")), GetInputHtmlByValue(GetAttr(cNode, "if"), 250), icnDelete_16);
            }
            html += icnAdd_16;
            $("#dvValue").html(html);
            $("#txtDb").val(GetAttr(node, "src"));
            $("#txtCol").val(GetAttr(node, "col"));
            $("#txtFilter").val(GetAttr(node, "filter"));
        }
    }
    //根据depend设置dvOthers里的控件
    var SetDvOthersByType = function (type) {
        switch (type) {
            case "sql":
                $("#dvValue").remove();
                if ($("#txtValue").length == 0)
                    $("#dvOthers").append("<textarea id='txtValue' style='width:685px;height:205px;'></textarea>");
                break;
            case "":
                $("#txtValue").remove();
                if ($("#dvValue").length == 0)
                    $("#dvOthers").append("<div id='dvValue' style='width:685px;height:205px;background-color:white;border:1px solid black;overflow-y:auto;'></div>");
                break;
        }
    }
    //根据值类型获取值
    var GetXmlByValueType = function (type) {
        var xml = "";
        var menuName = GetMenuName();
        if (menuName == "conditions") {
            var defaultType = $("#ddlDefaultType").val();
            var defaultValue = $("#txtDefault").val();
            switch (type) {
                case "time":
                    var timeType = $("#ddlTimeType").val();
                    var set = $("#ddlSet").val();
                    var precision = $("#txtPrecision").val();
                    xml += StringPP.format("timetype=\"{0}\" set=\"{1}\" precision=\"{2}\" default=\"{3}\" defaulttype=\"{4}\">", timeType, set, precision, defaultValue, defaultType);
                    break;
                case "if":
                case "list":
                    break;
                case "text":
                    xml += StringPP.format("default=\"{0}\" defaulttype=\"{1}\">", defaultValue, defaultType);
                    break;
                case "virtual":
                    var depend = $("#ddlDepend").val();
                    xml += StringPP.format("depend=\"{0}\" default=\"{1}\" defaulttype=\"{2}\">", depend, defaultValue, defaultType);
                    switch (depend) {
                        case "sql":
                            var value = $("#txtValue").val();
                            xml += StringPP.format("<![CDATA[{0}]]>", value);
                            break;
                        case "":
                            var length = $("#dvValue span").length - 1;
                            if (length > 0) {
                                $("#dvValue span").each(function (i) {
                                    if (i != length) {
                                        var type = $(this).find("select").val();
                                        var value = $(this).find("input").val();
                                        xml += StringPP.format("<i type=\"{0}\" value=\"{1}\" />", type, value);
                                    }
                                });
                            }
                            break;
                    }
                    break;
                default: break;
            }
        } else if (menuName == "sources") {
            switch (type) {
                case "single":
                    var db = $("#txtDb").val();
                    var src = $("#txtSrc").val();
                    var condition = $("#txtCondition").val();
                    xml += StringPP.format("src=\"{0}\" db=\"{1}\" if=\"{2}\">", src, db, condition);
                    break;
                case "Sql":
                    var db = $("#txtDb").val();
                    var sql = $("#txtSql").val();
                    xml += StringPP.format("db=\"{0}\">{1}", db, StringPP.format("<![CDATA[{0}]]>", sql));
                    break;
                case "time":
                    var src = $("#txtDb").val();
                    var offset = $("#txtOffset").val() + $("#ddlOffset").val();
                    var orderby = $("#ddlOrderby").val();
                    xml += StringPP.format("src=\"{0}\" offset=\"{1}\" orderby=\"{2}\">", src, offset, orderby);
                    break;
                case "fix":
                    var src = $("#txtDb").val();
                    var offset = $("#txtOffset").val();
                    var fixtype = $("#ddlFixType").val();
                    xml += StringPP.format("src=\"{0}\" offset=\"{1}\" fixtype=\"{2}\" datacols=\"{3}\">", src, offset, fixtype, "");
                    break;
                case "memory":
                    var src = $("#txtDb").val();
                    var sql = $("#txtSql").val();
                    xml += StringPP.format("src=\"{0}\">{1}", src, StringPP.format("<![CDATA[{0}]]>", sql));
                    break;
                case "sub":
                    var src = $("#txtDb").val();
                    var start = $("#txtStart").val();
                    var length = $("#txtLength").val();
                    xml += StringPP.format("src=\"{0}\" start=\"{1}\" length=\"{2}\">", src, start, length);
                    break;
                case "join":
                    var join = $("#ddlJoin").val();
                    var lsrc = $("#txtLsrc").val();
                    var rsrc = $("#txtRsrc").val();
                    var on = $("#txtOn").val();
                    var _if = $("#txtIf").val();
                    var orderby = $("#txtOrderby").val();
                    xml += StringPP.format("join=\"{0}\" lsrc=\"{1}\" rsrc=\"{2}\" on=\"{3}\" if=\"{4}\" orderby=\"{5}\">", join, lsrc, rsrc, on, _if, orderby);
                    break;
                default: break;
            }
        } else if (menuName == "fields") {
            var src = $("#txtDb").val();
            var col = $("#txtCol").val();
            var filter = $("#txtFilter").val();
            xml += StringPP.format("src=\"{0}\" col=\"{1}\" filter=\"{2}\">", src, col, filter);
            var length = $("#dvValue span").length - 1;
            $("#dvValue span").each(function (i) {
                if (i != length) {
                    var cSrc = $(this).find("input:eq(0)").val();
                    var cCol = $(this).find("input:eq(1)").val();
                    var cIf = $(this).find("input:eq(2)").val();
                    xml += StringPP.format("<f src=\"{0}\" col=\"{1}\" if=\"{2}\"></f>", cSrc, cCol, cIf);
                }
            });
        }
        return xml;
    }
    //根据值类型检测值的合法性
    var CheckByValueType = function (type) {
        var b = true;
        var menuName = GetMenuName();
        if (menuName == "conditions") { }
        else if (menuName == "sources") {
            switch (type) {
                case "time":
                    var offset = $("#txtOffset").val();
                    if (isNaN(offset)) {
                        b = false;
                        ShowAlert("txtOffset", "是否是数值类型。");
                    }
                    break;
            }
        }
        else if (menuName == "fields") { }
        return b;
    }
    //根据menu名获取xml节点
    var GetXmlNodeByMenu = function (menuName) {
        if (menuName == undefined || menuName == "")
            menuName = GetMenuName();
        var childs = thisC.xmlNodes.childNodes;
        for (var i = 1; i < childs.length; i++) {
            if (menuName == childs[i].baseName)
                return childs[i];
        }
        return null;
    }
    //根据menu和id获取xml节点
    var GetXmlNodeById = function (id) {
        var menuName = GetMenuName();
        var node = GetXmlNodeByMenu(menuName);
        for (var i = 0; i < node.childNodes.length; i++)
            if (id == GetAttr(node.childNodes[i], "id"))
                return node.childNodes[i];
        return null;
    }
    //根据attr名获取属性
    var GetAttr = function (xmlNode, attr) {
        for (var i = 0; i < xmlNode.attributes.length; i++)
            if (attr == xmlNode.attributes[i].baseName)
                return xmlNode.attributes[i].nodeValue;
        return "";
    }
    //根据值获取Type的Html（下拉框）
    var GetTypeHtmlByValue = function (value) {
        var html = "<select><option>date</option><option>decimal</option><option>string</option></select>";
        var opt = StringPP.format("<option>{0}</option>", value);
        var optSelected = StringPP.format("<option selected='selected'>{0}</option>", value);
        return html.replace(opt, optSelected);
    }
    //根据值获取Input的Html（文本框）
    var GetInputHtmlByValue = function (value, width) {
        return StringPP.format("<input type='text' style='width:{1}px;' value='{0}'>", value, width == undefined ? 120 : width);
    }
    //显示警告并获得焦点
    var ShowAlert = function (id, info) {
        eval("document.all." + id + ".select();")
        eval("document.all." + id + ".focus();")
        alert("请检查该值，" + info);
    }
    //获取菜单名
    var GetMenuName = function () {
        return $(".liSelected").text();
    }
    //显示动画
    var ShowAnimate = function () {
        if ($("#dvAnimate").length < 1) {
            var animate = "<div id='dvAnimate' style='position:absolute;left:51px;top:302px;width:798px;height:399px;border:1px solid black;z-index:99;filter:alpha(opacity=50);background-color:#E0F7FC;'></div>"
            $("#dvEdit").after(animate);
            $("#dvAnimate").animate({ left: '151px', top: '402px', width: '698px', height: '299px' }, 'normal', function () {
                $(this).remove();
            });
        }
    }
    //公共方法
    //初始化
    this.Init = function (menuName) {
        thisC.xmlFileName = window.dialogArguments.CellObject.cllName;
        //if (thisC.xmlFileName == "")
        //    thisC.xmlFileName = "TestForList.cll";
        thisC.LoadXml();
        //初始化菜单
        thisC.SetMenu(menuName);
        //初始化内容
        thisC.SetContent(menuName);
        thisC.ResetEdit();
    }
    //读取Xml内容
    this.LoadXml = function () {
        thisC.xml = Report_ReportAdvancedConfig.LoadXml(thisC.xmlFileName).value;
        thisC.ResetXml(thisC.xml);
    }
    //重设Xml
    this.ResetXml = function (xml) {
        if (document.all) {
            var xmlDom = new ActiveXObject("Microsoft.XMLDOM");
            xmlDom.loadXML(xml);
            thisC.xmlNodes = xmlDom.childNodes[0];
        }
        else
            thisC.xmlNodes = new DOMParser().parseFromString(xml, "text/xml").childNodes[0];
    }
    //设置Menu内容
    this.SetMenu = function (menuName) {
        var html = "<ul class='menu'>";
        for (var i = 0; i < menus.length; i++)
            html += StringPP.format("<li><a>{0}</a></li>", menus[i]);
        html += "</ul>";
        html = html.replace(StringPP.format("<li><a>{0}</a></li>", menuName), StringPP.format("<li><a class='liSelected'>{0}</a></li>", menuName));
        $("#dvMenu").html(html);
        //点击事件
        $("#dvMenu .menu li a").click(function () {
            $(".liSelected").removeClass("liSelected")
            $(this).addClass("liSelected");
            thisC.SetContent($(this).text());
            thisC.ResetEdit();
        });
        $("#ddlType").change(function () {
            var type = $(this).val();
            var html = GetHtmlByValueType(type);
            $("#dvOthers").html(html);
            SetDvOthersByType($("#ddlDepend").val());
            $("#ddlDepend").change(function () {
                SetDvOthersByType($("#ddlDepend").val());
                $("#dvValue").html(icnAdd_16);
            });
            if (type == "time") {
                $("#ddlDefaultType").val("date");
                $("#ddlDefaultType").prop("disabled", "true");
            } else {
                $("#ddlDefaultType").val("string");
                $("#ddlDefaultType").removeProp("disabled");
            }
            if (type == "无") {
                if ($("#dvValue").length == 0)
                    $("#dvOthers").append("<div id='dvValue' style='width:685px;height:205px;background-color:white;border:1px solid black;overflow-y:auto;'></div>");
                $("#dvValue").html(icnAdd_16);
            }
        });
    }
    //设置Table内容
    this.SetContent = function (menuName) {
        var html = "";
        var xmlNode = GetXmlNodeByMenu(menuName);
        if (xmlNode != null) {
            html += StringPP.format("<table id='tbContent' class='{0}' cellspacing=0>", "bluetable");
            html += StringPP.format("<tr class='first'><th width='{0}%'>{1}</th><th width='{2}%'>{3}</th><th width='{4}%'>{5}</th><th width='{6}%'>{7}</th></tr>", 30, "ID", 45, "描述", 20, "类型", 5, "删除");
            for (var i = 0; i < xmlNode.childNodes.length; i++) {
                var subNode = xmlNode.childNodes[i];
                html += StringPP.format("<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td></tr>", GetAttr(subNode, "id"), GetAttr(subNode, "desc"), GetAttr(subNode, "type"), icnDelete_24);
            }
            html += StringPP.format("<tr class='last'><td colspan=4>{0}</td></tr>", icnAdd_24);
            html += StringPP.format("</table>");
        }
        $("#dvContent").html(html);
        thisC.ResetDdlType(menuName);
        thisC.SetColor();
        thisC.SetTrClick();
    }
    //重置ddlType内容
    this.ResetDdlType = function (type) {
        switch (type) {
            case "conditions":
                html = "<option>text</option><option>virtual</option><option>time</option><%--<option>if</option><option>list</option>--%>";
                break;
            case "sources":
                html = "<option>single</option><option>Sql</option><option>time</option><option>fix</option><%--<option>input</option>--%><option>memory</option><option>sub</option><option>join</option>";
                break;
            case "fields":
                html = "<option>无</option>";
                break;
            default: break;
        }
        $("#ddlType").html(html);
    }
    //重置dvEdit内容
    this.ResetEdit = function () {
        $("#txtID").val("");
        $("#txtDesc").val("");
        $("#ddlType").val("");
        $("#dvOthers").empty();
    }
    //设置隔行变色
    this.SetColor = function () {
        $("#tbContent tr").each(function (i) {
            if (i != 0) {
                if (i % 2 == 0) {
                    $(this).css("background-color", "#E0F0F5");
                }
            }
        })
    }
    //设置行点击事件
    this.SetTrClick = function () {
        $("#tbContent tr").click(function () {
            if ($(this).attr("class") == "last") {
                thisC.Add();
            }
            else if ($(this).attr("class") != "first") {
                var id = $(this).find("td:eq(0)").text();
                $("#tbContent .trSelected").removeClass("trSelected")
                $(this).addClass("trSelected");
                thisC.SetEdit(id);
            }
        });
    }
    //设置编辑区内容
    this.SetEdit = function (id) {
        var xmlNode = GetXmlNodeById(id);
        var type = GetAttr(xmlNode, "type");
        if (type == "" && GetMenuName() == "conditions")
            type = "virtual";
        $("#txtID").val(GetAttr(xmlNode, "id"));
        $("#txtDesc").val(GetAttr(xmlNode, "desc"));
        $("#ddlType").val(type);
        var html = GetHtmlByValueType(type);
        $("#dvOthers").html(html);
        SetValueByValueType(type, xmlNode);
    }
    //获取编辑区内容并返回xml
    this.GetXml = function (action) {
        var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        var idOld = $(".trSelected td:first").text();
        var xmlNew = "";
        var xmlOld = "";
        var menuName = GetMenuName();
        var nodeName = menuName.substr(0, menuName.length - 1);
        if (action == "update" || action == "delete") {//如果是更新或删除
            if (action == "update") {
                var idNew = $("#txtID").val();
                var desc = $("#txtDesc").val();
                var type = $("#ddlType").val();

                if (menuName != "fields")
                    xmlNew = StringPP.format("<{0} id=\"{1}\" desc=\"{2}\" type=\"{3}\" ", nodeName, idNew, desc, type);
                else
                    xmlNew = StringPP.format("<{0} id=\"{1}\" desc=\"{2}\" ", nodeName, idNew, desc);
                xmlNew += GetXmlByValueType(type);
                xmlNew += StringPP.format("</{0}>", nodeName);
            }
            var head = StringPP.format("<{0} id=\"{1}\"", nodeName, idOld);
            var root = StringPP.format("</{0}>", nodeName);
            var match = thisC.xml.match(StringPP.format("<{0} .*?id=\"{1}\" .*? />", nodeName, idOld));
            if (match != null)
                xmlOld = match[0];
            else
                xmlOld = StringPP.format("{0}{1}{2}", head, thisC.xml.split(head)[1].split(root)[0], root);
        } else if (action == "add") {
            var idNew = $("#txtID").val();
            var desc = $("#txtDesc").val();
            var type = $("#ddlType").val();

            if (menuName != "fields")
            xmlNew = StringPP.format("<{0} id=\"{1}\" desc=\"{2}\" type=\"{3}\" ", nodeName, idNew, desc, type);
            else
                xmlNew = StringPP.format("<{0} id=\"{1}\" desc=\"{2}\" ", nodeName, idNew, desc);
            xmlNew += GetXmlByValueType(type);
            xmlNew += StringPP.format("</{0}>\r\n</{1}>", nodeName, menuName);
            xmlOld = StringPP.format("</{0}>", menuName);
        }
        xml += thisC.xml.replace(xmlOld, xmlNew);
        return xml;
    }
    //添加一个i标签
    this.AddI = function (ctrl) {
        var menuName = GetMenuName();
        var html = "";
        if (menuName == "conditions")
            html += StringPP.format("<span>{0}&nbsp;{1}{2}</span>", GetTypeHtmlByValue(""), GetInputHtmlByValue(""), icnDelete_16);
        else
            html += StringPP.format("<span>数据源:{0}&nbsp;列名:{1}&nbsp;过滤条件:{2}{3}</span>", GetInputHtmlByValue(""), GetInputHtmlByValue(""), GetInputHtmlByValue("", 250), icnDelete_16);
        ctrl.parent().before(html);
    }
    this.DeleteI = function (ctrl) {
        ctrl.parent().remove();
    }
    //添加
    this.Add = function () {
        //此处是添加事件
        $(".trSelected").removeClass("trSelected");
        ShowAnimate();
        thisC.ResetEdit();
    }
    //更新
    this.Update = function () {
        var id = $("#txtID").val();
        if (id == "" || id == undefined) {
            alert("ID不能为空！");
            return false;
        }
        var type = $("#ddlType").val();
        if (type == "" || type == undefined || type == null) {
            alert("类型不能为空！");
            return false;
        }
        if (!CheckByValueType(type))
            return false;

        if ($(".trSelected").length > 0) {
            var xml = thisC.GetXml("update");
            thisC.Save(xml);
        } else {
            if (thisC.xml.indexOf(StringPP.format("id=\"{0}\"", id)) != -1) {
                alert(StringPP.format("ID\"{0}\"已存在！", id));
                return false;
            }
            var xml = thisC.GetXml("add");
            thisC.Save(xml);
        }
    }
    //删除
    this.Delete = function (btn) {
        var tr = btn.parent().parent();
        //变更选中项样式
        $("#tbContent .trSelected").removeClass("trSelected")
        tr.addClass("trSelected");
        //进行删除确认
        var id = tr.find("td:eq(0)").text();
        var b = confirm(StringPP.format("确定要删除ID=\"{0}\"的节点吗？", id));
        if (b) {
            var xml = thisC.GetXml("delete");
            thisC.Save(xml);
        }
    }
    //保存
    this.Save = function (xml) {
        var menuName = GetMenuName();
        var b = Report_ReportAdvancedConfig.SaveXml(thisC.xmlFileName, xml).value;
        if (b == true)
            thisC.Init(menuName);
        return false;
    }
};
//初始化对象
var rac = new ReportAdvancedConfig();
$(document).ready(function () {
    rac.Init("conditions");
})