var PDPObject = {
    allWrapper: [
        { desc: "基本控件" },
        { desc: "按钮" }
    ],
    all: [
        {
            desc: "基本控件",
            list: [
                {
                    tag: "label", desc: "文字",
                    html: "<span class = 'pdpLabel'>文字</span>",
                    create: function () { return { tag: this.tag, desc: this.desc, a: { class: "pdpLabel", value: "文字" } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: true }
                },
                {
                    tag: "href", desc: "超链接", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: false, canEnlarge: true }
                },
                {
                    tag: "div", desc: "容器", create: function () { return { tag: this.tag, desc: this.desc, s: { padding: "5px" } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: false, width: true, height: true, canEnlarge: true}
                },
                {
                    tag: "hr", desc: "横线", create: function () { return { tag: this.tag, desc: this.desc, s: { width: "100%" } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: false }
                },
                {
                    tag: "iframe", desc: "内嵌窗口", create: function () { return { tag: this.tag, desc: this.desc, a: { class: "pdpIframe" } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: false, width: true, height: true }
                },
                {
                    tag: "image", desc: "图片", create: function () { return { tag: this.tag, desc: this.desc, a: { src: '/i/design/noimg.jpg' } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: false, width: true, height: true }
                },
                {
                    tag: "p", desc: "段落", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: false, canEnlarge: true }
                },
                {
                    tag: "span", desc: "内联容器", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: false, canEnlarge: true }
                },
                {
                    tag: "subfile", desc: "子文件", create: function () { return { tag: this.tag, desc: this.desc, a: { file: "" } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: false }
                },
                {
                    tag: "loop", desc: "循环显示", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: true, canEnlarge: true },
                    isLogic: true
                },
                {
                    tag: "group", desc: "分组显示", create: function () {
                        return { tag: this.tag, desc: this.desc, a: { groupcol: "" } };
                    },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: true, canEnlarge: true },
                    isLogic: true
                },
                {
                    tag: "yaxis", desc: "纵坐标", create: function () { return { tag: this.tag, desc: this.desc, a: { type: 'line' } }; },
                    beAccept: function (tag) { return tag == "echart"; },
                    accept: function (tag) { return false },
                    args: { needData: true }
                },
                {
                    tag: "echart", desc: "图表", create: function () { return { tag: this.tag, desc: this.desc, sa: { xaxis: '未绑定' } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return tag == "yaxis"; },
                    args: { needData: true },
                    prop: "echart"
                },
                {
                    tag: "ecalendarchart", desc: "日历图", create: function () { return { tag: this.tag, desc: this.desc, sa: { xaxis: '未绑定' } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: true }
                },
                {
                    tag: "yshtab", desc: "标签卡", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return tag == "yshtab"; },
                    args: { needData: true, needSource: true }
                },
                {
                    tag: "time", desc: "时间", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: true }
                },
                {
                    tag: "dynfile", desc: "动态文件", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: false }
                },
                {
                    tag: "divmore", desc: "折叠文本容器", create: function () { return { tag: this.tag, desc: this.desc, s: { padding: "5px" } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: false, width: true, height: true, canEnlarge: true }
                },
                {
                    tag: "listshow", desc: "列表", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: false }
                },
                {
                    tag: "gudupload", desc: "简单上传", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: false }
                },
                {
                    tag: "foldbar", desc: "折叠条", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: false }
                },
                {
                    tag: "reportshow", desc: "报表", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: false }
                }
            ]
        },
        {
            desc: "表单控件",
            list: [
                {
                    tag: "text", desc: "文本框",
                    html: "<input type='text' placeholder='请输入文字' class='pdpText'>",
                    create: function () { return { tag: this.tag, desc: this.desc, a: { placeholder: "请输入文字", class: "pdpText" } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: true, width: true, height: true }
                },
                {
                    tag: "password", desc: "密码框", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: true, width: true, height: true }
                },
                {
                    tag: "radio", desc: "单选框", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: true }
                },
                {
                    tag: "checkbox", desc: "复选框", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: true }
                },
                {
                    tag: "file", desc: "文件上传", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: false }
                },
                {
                    tag: "select", desc: "下拉框",
                    html: "<select class='pdpSelect'></select>",
                    create: function () { return { tag: this.tag, desc: this.desc, a: { class: "pdpSelect" } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: true, needSource: true }
                },
                {
                    tag: "textarea", desc: "多行文本", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: true, width: true, height: true }
                },
                {
                    tag: "itemoperator", desc: "流程处理", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { width: true, height: true }
                },
                {
                    tag: "flowitem", desc: "流程表单", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { width: false, height: false }
                }
            ]
        },
        {
            desc: "表格控件",
            list: [
                {
                    tag: "table", desc: "表格", create: function () { return { tag: this.tag, desc: this.desc, a: { class: "pdpTable" }, s: { width: "100%", height: "100%" }, c: [{ tag: 'tr', desc: '表行', c: [{ tag: "td", desc: '单元格' }] }] }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return tag == "tr"; },
                    args: { needData: false }
                },
                {
                    tag: "tr", desc: "表行", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return tag == "table"; },
                    accept: function (tag) { return tag == "td"; },
                    args: { needData: false }
                },
                {
                    tag: "td", desc: "单元格", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return tag == "tr"; },
                    accept: function (tag) { return true; },
                    args: { needData: false, canEnlarge: true }
                },
                {
                    tag: "spread", desc: "类Excel表格", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: true }
                }
            ]
        },
        {
            desc: "按钮",
            list: [
                {
                    tag: "button", desc: "默认按钮",
                    html: "<input type='button' value='按钮' class='pdpBtnDefault'>",
                    create: function () { return { tag: this.tag, desc: this.desc, a: { value: "按钮", class: "pdpBtnDefault" }, e: { onclick: { list: [] } } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: false }
                },
                {
                    tag: "button", desc: "按钮1",
                    html: "<input type='button' value='按钮' class='pdpBtn1'>",
                    create: function () { return { tag: this.tag, desc: this.desc, a: { value: "按钮", class: "pdpBtn1" }, e: { onclick: { list: [] } } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: false }
                },
                {
                    tag: "button", desc: "按钮2",
                    html: "<input type='button' value='按钮' class='pdpBtn2'>",
                    create: function () { return { tag: this.tag, desc: this.desc, a: { value: "按钮", class: "pdpBtn2" }, e: { onclick: { list: [] } } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: false }
                },
                {
                    tag: "button", desc: "按钮3",
                    html: "<input type='button' value='按钮' class='pdpBtn3'>",
                    create: function () { return { tag: this.tag, desc: this.desc, a: { value: "按钮", class: "pdpBtn3" }, e: { onclick: { list: [] } } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: false }
                },
                {
                    tag: "button2", desc: "容器按钮",
                    create: function () { return { tag: this.tag, desc: this.desc, a: { text: "容器按钮" } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: false, canEnlarge: true }
                },
                {
                    tag: "richbutton", desc: "带图按钮",
                    create: function () { return { tag: this.tag, desc: this.desc, a: { text: "带图按钮" } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: false }
                },
                {
                    tag: "sliderbuttons", desc: "滑块式按钮组",
                    create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: false }
                },
                {
                    tag: "buttongroup", desc: "按钮组",
                    create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: true, needSource: true }
                }
            ]
        }, {
            desc: "IView",
            list: [
                {
                    tag: "itable", desc: "iview表格", create: function () { return { tag: this.tag, desc: this.desc, sa: { stripe: 'true' } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return tag == "icol"; },
                    args: { needData: true }
                },
                {
                    tag: "scrolltable", desc: "滚动表格", create: function () { return { tag: this.tag, desc: this.desc, sa: { stripe: 'true' } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return tag == "icol"; },
                    args: { needData: true }
                },
                {
                    tag: "icol", desc: "iview表列", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return tag == "itable" || tag == "scrolltable"; },
                    accept: function (tag) { return true; },
                    args: { needData: true, canEnlarge: true }
                },
                {
                    tag: "imodal", desc: "对话框", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true },
                    args: { needData: true, canEnlarge: true }
                },
                {
                    tag: "iupload", desc: "上传控件", create: function () { return { tag: this.tag, desc: this.desc, c: [{ tag: 'label', a: { value: "点此上传" }, s: { padding: "5px" } }] }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true },
                    args: { needData: false }
                },
                {
                    tag: "iinput", desc: "文本框", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false },
                    args: { needData: true }
                },
                {
                    tag: "idate", desc: "日期", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false },
                    args: { needData: true }
                },
                {
                    tag: "itime", desc: "时间", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false },
                    args: { needData: true }
                },
                {
                    tag: "iradio", desc: "单选框", create: function () { return { tag: this.tag, desc: this.desc, a: { label: '单选框' } }; },
                    beAccept: function (tag) { return tag == "iradiogroup"; },
                    accept: function (tag) { return true; },
                    args: { needData: true }
                },
                {
                    tag: "iradiogroup", desc: "单选框组", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return tag == "iradio"; },
                    args: { needData: true, needSource: true, canEnlarge: true }
                },
                {
                    tag: "icheckbox", desc: "复选框", create: function () { return { tag: this.tag, desc: this.desc, a: { label: '复选框' } }; },
                    beAccept: function (tag) { return tag == "icheckboxgroup"; },
                    accept: function (tag) { return true; },
                    args: { needData: true }
                },
                {
                    tag: "icheckboxgroup", desc: "复选框组", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return tag == "icheckbox"; },
                    args: { needData: true, needSource: true, canEnlarge: true }
                },
                {
                    tag: "itree", desc: "树控件", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: false, needSource: true }
                },
                {
                    tag: "itooltip", desc: "提示框", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: false, needSource: false, canEnlarge: true }
                },
                {
                    tag: "ipoptip", desc: "气泡", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: false, needSource: false, canEnlarge: true }
                },
                {
                    tag: "idivider", desc: "分隔符", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: false, needSource: false }
                },
                {
                    tag: "iaffix", desc: "图钉", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: false, needSource: false, canEnlarge: true }
                },
                {
                    tag: "iselect", desc: "下拉框", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false },
                    args: { needData: true, needSource: true }
                },
                {
                    tag: "itag", desc: "标签", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false },
                    args: { needData: true, needSource: true }
                },
                {
                    tag: "itimeline", desc: "时间轴", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: false }
                },
                {
                    tag: "itimelineitem", desc: "时间点", create: function () { return { tag: this.tag, desc: this.desc }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true; },
                    args: { needData: false }
                }]
        }, {
            desc: "研发内部使用",
            list: [
                {
                    tag: "html", desc: "html块",
                    create: function () { return { tag: this.tag, desc: this.desc, a: { html: "html" } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return false; },
                    args: { needData: false }
                },
                {
                    tag: "esimplechart", desc: "基础图表", create: function () { return { tag: this.tag, desc: this.desc, sa: { xAxis: [], series: [] } }; },
                    beAccept: function (tag) { return true; },
                    accept: function (tag) { return true },
                    args: { needData: true }
                }]
        }],
    get: function (tag) {
        var arr = this.all;
        for (var a = 0; a < arr.length; a++) {
            var list = arr[a].list;
            for (var i = 0; i < list.length; i++) {
                if (list[i].tag == tag)
                    return list[i];
            }
        }
        //return null;
        return {
            tag: tag, desc: tag, create: function () { return { tag: this.tag, desc: this.desc }; },
            beAccept: function (tag) { return true; },
            accept: function (tag) { return true; }
        };
    },
    getCtrlConfig: function (tag, cfg) {
        var ctrl = this.get(tag);
        if (!ctrl)
            return null;
        if (ctrl[cfg])
            return ctrl[cfg];
        var ret = PDP.read('Design', 'PDPDesignSql:ConfigEdit2/GetCtrlConfig', [tag, cfg]);
        if (!ret.check('获取控件配置信息', true))
            return null;
        var ds = ret.value;
        var list = {
            has: function (a) { return this.__keys.indexOf(a) >= 0; }
        };
        ctrl[cfg] = list;
        var keys = [];
        for (var i = 0; i < ds.length; i++) {
            var row = ds[i];
            keys.push(row[0]);
            list[row[0]] = { desc: row[1], defvalue: row[2], type: row[3], common: row[4] == "1", text: row[5] };
        }
        list.__keys = keys;
        return list;
    }
}