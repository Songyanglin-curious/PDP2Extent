//下拉列表控件脚本文件。
//wanglei add
function DropDownList($, textControl, valueControl, labelControl) {
    this.tControl = $('#' + textControl);
    this.vControl = $('#' + valueControl);
    this.lControl = $('#' + labelControl);
    this.selectListID = textControl + "List";
    this.cov = HanziToPinyin.Create();
    this.data = null;
    this.cols = null;
    this.url = '/conn/ashx/DropDownListHandler.ashx';
    this.property = {
        enableText: false, // 是否可输入内容
        enableFilter: false, //是否开启过滤功能
        enablePage: false, //是否开启分页
        getValueType: 'id',
        textField: '',
        valueField: '',
        db: '',
        dataFilter: [],
        originDataFilter: '',
        dataSource: '',
        dataType: 'sql',
        containerWidth: 'auto',
        containerHeight: 'auto',
        listType: 'single',
        text: '',
        value: '',
        width: '',
        pageSize: 10,
        pageIndex: 1,
        finishScript: '',
        selectedScript: '',
        saveType: 'none',
        dataSourceAll: '',
        textAlign: '', // modified by kang
        selectedIndex: 0,
        multiSelect: 1 //add by wangbinbin 2013-03-25
    }
    this.evtchange = []; //add by ljj
    this.InvokeChange = function () {
        for (var i = 0; i < this.evtchange.length; i++) {
            var f = this.evtchange[i];
            if (f == "")
                continue;
            if (typeof f == "string")
                eval(f);
            else
                f();
        }
    }   //add by gud
    this.evtblur = "";
    var enabled = true; //add by subo
    this.init = function () {

        var obj = this;

        if (this.common.isOpen(this.property.enableText)) { this.tControl.removeAttr('readonly'); } else { this.tControl.attr('readonly', 'readonly'); }
        if (this.common.isOpen(this.property.enableFilter)) {
            this.tControl.bind('keyup', function (e) {
                var key = (e.keyCode) || (e.which) || (e.charCode);
                if (key != "38" && key != "40" && key != "13") {
                    obj.keySearch();
                }
            });
        }

        if ($.trim(this.property.width) != '') {
            this.tControl.width(this.property.width);
        }

        //5794bf
        this.tControl.css('border-right-width', '0px');
        this.tControl.css('border-left', '1px solid #5794bf');
        this.tControl.css('border-top', '1px solid #5794bf');
        this.tControl.css('border-bottom', '1px solid #5794bf'); //.css('height', '20px');//modified
        this.tControl.attr("AutoComplete", "off");
        this.tControl.css('text-align', this.property.textAlign); // modified by kang  设置输入框的文本对齐方式      
        // add by ljj       
        this.tControl.change = function () {
            // alert(0);
        };

        var selectList = $('<div id=' + this.selectListID + ' t=selectPanel></div>')
                .css('position', 'absolute')
                .css('height', (this.property.containerHeight == 'auto' ? this.tControl.height() : this.property.containerHeight) + 'px')
                .css('width', (this.property.containerWidth == 'auto' ? this.tControl.width() + 20 : parseInt(this.property.containerWidth, 10) + 17) + 'px')
                .css('z-index', '10000')
                .css('background-color', '#ffffff')
                .css('border', '1px solid #286a9b')
                .css('display', 'none')
                .css('clear', 'both');

        this.tControl.parent().parent().after(selectList);

        this.bindEvent(this);

        //初始化当前控件的文本
        if ($.trim(this.property.value) != '') {
            if (this.property.getValueType.toLocaleLowerCase() == 'id') {
                $.executeAjax(obj.url, 'postType=GetValueText&val=' + this.property.value + obj.getFilterValue(), function (result) {
                    if (result.flag == 0 && typeof result.flag != 'undefined') {
                        alert(result.msg);
                        return false;
                    }
                    obj.tControl.val(result.text);
                    obj.lControl.text(result.text);
                });
            }
        }
        else {
            this.refresh('postType=GetDataList' + this.getFilterValue(), false, true);
        }
    };
    this.bindEvent = function (obj) {

        var selectList = $('#' + obj.selectListID);

        $(obj).ajaxStart(function () {
            selectList.html("<span style='float:left;line-height:16px;height:16px; padding:5px 0px 5px 5px; color:silver;'><img align=absmiddle src=/i/loading.gif /> 正在查询数据...</span>");
        });

        $(document).mouseup(function (event) {
            if (event.target == obj.tControl.parent().parent().find('[tp=select]').get(0)) {
                if (enabled) {
                    $('div[t=selectPanel]').not('[id=' + obj.selectListID + ']').hide();
                    if (selectList.css('display') == 'none') {
                        obj.refresh('postType=GetDataList' + obj.getFilterValue(), true, false);
                        selectList.show();
                    }
                    else {
                        selectList.hide();
                    }
                }
            }
            else if (event.target == obj.tControl.get(0)) {
                if (enabled) {
                    if (!obj.common.isOpen(obj.property.enableText)) {
                        $('div[t=selectPanel]').not('[id=' + obj.selectListID + ']').hide();
                        if (selectList.css('display') == 'none') {
                            obj.refresh('postType=GetDataList' + obj.getFilterValue(), true, false);
                            selectList.show();
                        }
                        else {
                            selectList.hide();
                        }
                    }
                    //add by wangbinbin 2013-03-25
                    if (obj.property.multiSelect == 1)
                        obj.tControl.get(0).select();
                }
            }
            else if (event.target == selectList.find('[tp=pager]').get(0)) { }
            else if (event.target == selectList.find("[t=menu]").get(0)) { }
            else {
                if (enabled) {
                    if ($(event.target).parent().attr('t') != 'menu' && $(event.target).parent().attr('id') != 'page_currentPage_allPage') {
                        //add by wangbinbin 2013-03-25
                        var bHide = true;
                        if (obj.property.multiSelect == 1) {
                            selectList.find('[tp=selecttd]').each(function () {
                                if ($(this).get(0) == event.target) {
                                    bHide = false;
                                    return false;
                                }
                            });
                            if (bHide) {
                                selectList.find('[tp=selectbox]').each(function () {
                                    if ($(this).get(0) == event.target) {
                                        bHide = false;
                                        return false;
                                    }
                                });
                            }
                            if (event.target == selectList.find('[tp=table]').get(0))
                                bHide = false;
                        }
                        if (bHide) {
                            selectList.hide();
                            obj.selectDefault();
                        }
                    }
                }
            }
        });

        $(document).keydown(function (e) {
            if (enabled) {
                var key = (e.keyCode) || (e.which) || (e.charCode);
                if (key == "38") {
                    obj.prevSelected();
                }
                if (key == "40") {
                    obj.nextSelected();
                }
                if (key == "13") {
                    var selectList = $('#' + obj.selectListID);
                    if (selectList.css('display') == 'block') { //update by wangbinbin 20131015
                        var tableRows = $("#" + obj.selectListID).find('table').find('tr');
                        var rs = tableRows.length;
                        if (rs == 0) { return false; }
                        var cIndex = 0;
                        for (var i = 0; i < rs; i++) {
                            if (tableRows.eq(i).find('td').eq(0).attr('v') == obj.vControl.val()) {
                                selectList.hide();
                            }
                        }
                    }
                }
            }
        });

        //控件的样式时间绑定
        function bindControlEvent() {

            var img = obj.tControl.parent().parent().find('[tp=select]');

            img.mouseover(function () { setControlState(2); });
            img.mouseout(function () { setControlState(1); });
            img.mousedown(function () { setControlState(3); });

            obj.tControl.mouseover(function () { setControlState(2); });
            obj.tControl.mouseout(function () { setControlState(1); });
            obj.tControl.mousedown(function () { setControlState(3); });

            function setControlState(state) {
                if (enabled) {
                    switch (state) {
                        case 1:
                            img.attr('src', '/i/select_01.gif');
                            obj.tControl.css('background-color', '#ffffff');
                            break;
                        case 2:
                            img.attr('src', '/i/select_02.gif');
                            obj.tControl.css('background-color', '#f5f5f5');
                            break;
                        case 3:
                            img.attr('src', '/i/select_03.gif');
                            obj.tControl.css('background-color', '#e9ebf4');
                            break;
                        default:
                            return;
                    }
                }
            }
        }
        bindControlEvent();
    };
    this.prevSelected = function () {
        var obj = this;
        var selectList = $('#' + obj.selectListID);
        if (selectList.css('display') != 'block') { return false; }
        var tableRows = $("#" + obj.selectListID).find('table').find('tr');
        var rs = tableRows.length;
        if (rs == 0) { return false; }
        var cIndex = 0;
        for (var i = 0; i < rs; i++) {
            if (tableRows.eq(i).find('td').eq(0).attr('v') == obj.vControl.val()) {
                cIndex = i;
                obj.clearSelected();
            }
        }
        if ((rs - 1) <= 0) { cIndex = 1; }
        if (cIndex == (rs - 1)) { cIndex = rs - 1; }
        if (cIndex == 0) { cIndex = 1; }
        cIndex -= 1;
        obj.setSelected(cIndex);
        obj.tControl.val(tableRows.eq(cIndex).children("td").eq(0).text());
        obj.vControl.val(tableRows.eq(cIndex).children("td").eq(0).attr('v'));
        var cPage = parseInt("" + (((cIndex + 1) + parseInt(obj.property.pageSize) - 1) / parseInt(obj.property.pageSize)), 10);
        $("#" + obj.selectListID).find('[t=go]').val(cPage);
        $("#" + obj.selectListID).find('[id=go]').click();
    };
    this.nextSelected = function () {
        var obj = this;
        var selectList = $('#' + obj.selectListID);
        if (selectList.css('display') != 'block') { return false; }
        var tableRows = $("#" + obj.selectListID).find('table').find('tr');
        var rs = tableRows.length;
        if (rs == 0) { return false; }
        var cIndex = 0;
        for (var i = 0; i < rs; i++) {
            if (tableRows.eq(i).find('td').eq(0).attr('v') == obj.vControl.val()) {
                cIndex = i;
                obj.clearSelected();
            }
        }
        if ((rs - 1) <= 0) { cIndex = -1; }
        if (cIndex == (rs - 1)) { cIndex = rs - 2; }
        cIndex += 1;
        obj.setSelected(cIndex);
        obj.tControl.val(tableRows.eq(cIndex).children("td").eq(0).text());
        obj.vControl.val(tableRows.eq(cIndex).children("td").eq(0).attr('v'));
        var cPage = parseInt("" + (((cIndex + 1) + parseInt(obj.property.pageSize) - 1) / parseInt(obj.property.pageSize)), 10);
        $("#" + obj.selectListID).find('[t=go]').val(cPage);
        $("#" + obj.selectListID).find('[id=go]').click();
    };
    this.selectDefault = function () {
        if (this.property.saveType == 'none' && this.vControl.val() == '' && this.tControl.val() != '') {
            var rs = $("#" + this.selectListID).find('table').find('tr').length;
            if (rs == 0) {
                this.clearControl();
            } else {
                //add by wangbinbin 2013-03-25
                var r = 0;
                if (this.property.multiSelect == 1)
                    r = 1;
                this.tControl.val($("#" + this.selectListID).find('table').find('tr').eq(r).children("td").eq(0).text());
                this.vControl.val($("#" + this.selectListID).find('table').find('tr').eq(r).children("td").eq(0).attr('v'));
                if ($.trim(this.property.selectedScript) != '') {
                    eval(this.property.selectedScript);
                }
                this.InvokeChange(); //eval(this.evtchange);
            }
        }
        //add by wangbinbin 2013-03-25
        if (this.property.multiSelect == 1) {
            if (this.property.getValueType.toLocaleLowerCase() == 'id' && this.vControl.val() != "") {
                var obj = this;
                $.executeAjax(obj.url, 'postType=GetValueText&val=' + obj.vControl.val() + obj.getFilterValue(), function (result) {
                    if (result.flag == 0 && typeof result.flag != 'undefined') {
                        alert(result.msg);
                        return false;
                    }
                    obj.tControl.val(result.text);
                    obj.lControl.text(result.text);
                });
            }
        }
    };
    this.GetText = function () {
        if (typeof this.tControl.css('display') != 'undefined') {
            return this.tControl.val();
        }
        else {
            return this.lControl.text();
        }
    };
    //add by subo 2013-01-30，获取选中项值的接口
    this.GetValue = function () {
        return this.vControl.val();
    };
    this.getFilterValue = function () {
        var paramString = "&ds=" + this.property.dataSource + "&db=" + this.property.db + "&tk=" + this.property.textField + "&dt=" + this.property.dataType;
        paramString += "&vk=" + this.property.valueField + "&lp=" + this.property.listType + "&df=" + this.property.originDataFilter + "&dsa=" + this.property.dataSourceAll;
        var pstr = "&wp=[";
        for (var i = 0; i < this.property.dataFilter.length; i++) {
            var dc = this.property.dataFilter[i][0];
            var mt = this.property.dataFilter[i][1] != '1' ? false : true;
            var key = this.property.dataFilter[i][0].doc.GetDesignID(this.property.dataFilter[i][0].id);
            var value = this.property.dataFilter[i][0].GetValue() == null ? '' : this.property.dataFilter[i][0].GetValue();
            var p = "{ key:'" + key + "', value: '" + value + "', must:" + mt + "}";
            //paramString += "&" + this.property.dataFilter[i].doc.GetDesignID(this.property.dataFilter[i].id) + "=" + this.property.dataFilter[i].GetValue();
            pstr += p;
            if (i < this.property.dataFilter.length - 1) {
                pstr += ",";
            }
        }
        pstr += "]";
        return paramString + pstr;
    };
    this.keySearch = function () {
        var obj = this;
        //update by wangbinbin 2013-03-25
        if (obj.property.multiSelect != 1)
            obj.vControl.val(''); //SearchKey            
        obj.data = null;
        obj.cols = [];
        var postType = 'SearchKey';
        if ($.trim(obj.tControl.val()) == '') {
            postType = 'GetDataList';
        }
        obj.refresh('postType=' + postType + '&text=' + obj.tControl.val() + obj.getFilterValue(), true, false, function () {
            if (obj.property.saveType == 'none') {
                var rs = $("#" + obj.selectListID + " tbody tr:has(td)").length;
                if (rs == 0) {
                    this.clearControl();
                } else {
                    obj.setSelected(0);
                }
            }
        });
        this.InvokeChange();
    };
    this.change = function (s) {
        var pstr = this.getFilterValue();
        this.clearControl();
        this.refresh('postType=GetDataList' + pstr, s, true);
    };

    //查询数据并显示列表
    this.refresh = function (d, s, it, f) {
        var obj = this;
        var selListContent = $('#' + obj.selectListID);
        var textField = obj.property.textField;
        var valueField = obj.property.valueField;
        $('div[t=selectPanel]').not('[id=' + obj.selectListID + ']').find('[tp=pager]').empty();
        $('div[t=selectPanel]').not('[id=' + obj.selectListID + ']').hide();
        if (selListContent.css('display') == 'none' && s) {
            selListContent.show();
        }
        selListContent.html("");
        //obj.data = null; //Add by wangbinbin 清空选项，重新加载数据
        if (obj.data == null) {//update by subo 2013-01-24 由于上一行的操作，导致这一行的判断永远为true，每次都会执行降低效率，所以注释掉
            $.executeAjax(obj.url, d, function (result) {
                if (result.flag == 0 && typeof result.flag != 'undefined') {
                    alert(result.msg);
                    return false;
                }
                obj.data = result.data;
                obj.cols = result.col;
            });
        }
        if (obj.data.length == 0) {
            var o = new Array();
            o[obj.property.textField] = "";
            o[obj.property.valueField] = "";
            obj.data[0] = o;
            //obj.vControl.val('');
            //selListContent.hide();
        } //else {update by subo 2013-01-24 始终执行下边的方法，如果结果为0，那么填充一个空行
        //计算是否强制分页
        var openPage = obj.common.isOpen(obj.property.enablePage);
        if (!openPage && obj.data.length > 20) {
            obj.property.enablePage = true;
            obj.property.pageSize = 20;
        }
        obj.property.pageIndex = 1;
        var allPage = parseInt("" + ((obj.data.length + parseInt(obj.property.pageSize) - 1) / parseInt(obj.property.pageSize)), 10);
        for (var i = 0; i < obj.data.length; i++) {
            if (obj.data[i][textField] == obj.tControl.val() && obj.data[i][valueField] == obj.vControl.val()) {
                obj.vControl.val(obj.data[i][valueField]);
                for (var p = 1; p <= allPage; p++) {
                    if ((i + 1) > (p - 1) * parseInt(obj.property.pageSize) && (i + 1) < p * parseInt(obj.property.pageSize)) {
                        obj.property.pageIndex = p;
                    }
                }
            }
        }
        var htmlContent = "";
        if (obj.property.containerHeight != 'auto') {
            htmlContent = "<div tp=table style='height:" + (parseInt(obj.property.containerHeight) + 2) + "px; overflow-y:auto;'>" + htmlContent;
        }
        else {
            htmlContent = "<div tp=table>" + htmlContent;
        }
        htmlContent += "</div>";
        if (obj.common.isOpen(obj.property.enablePage) && parseInt(obj.property.pageSize) < obj.data.length) {
            var pageHtml = "<div tp=pager style='height:22px;line-height:22px;width:100%; background: url(/i/select_04.gif) repeat-x; ";
            pageHtml += "'></div>";
            htmlContent += pageHtml;
        }
        selListContent.html(htmlContent);
        //add by gud 20130106
        var frmFilter = document.createElement("<iframe scrolling='no' frameborder='0' src='' style=\"position:absolute;visibility:inherit;top:0;left:0; z-index: -1;'filter='progid:dximagetransform.microsoft.alpha(style=0,opacity=0)';\"></iframe>");
        selListContent.append(frmFilter);
        if (null != frmFilter.parentNode) {
            frmFilter.style.height = frmFilter.parentNode.offsetHeight;
            frmFilter.style.width = Math.max(frmFilter.parentNode.offsetWidth - 2, 1);
        }
        //add end
        jQuery.page(obj.selectListID, parseInt(obj.property.pageSize), parseInt(obj.property.pageIndex), obj.data,
                                textField, valueField, obj);
        //} update by subo 2013-01-24
        //初始化选中项
        if (it) {
            if (obj.property.selectedIndex > 0) {
                var rs = $("#" + obj.selectListID).find('table').find('tr').length;
                if (rs < obj.property.selectedIndex) {
                    obj.property.selectedIndex = 1;
                }
                obj.setSelected(obj.property.selectedIndex - 1);
                obj.tControl.val($("#" + obj.selectListID).find('table').find('tr').eq(obj.property.selectedIndex - 1).children("td").eq(0).text());
                obj.vControl.val($("#" + obj.selectListID).find('table').find('tr').eq(obj.property.selectedIndex - 1).children("td").eq(0).attr('v'));
            } else {
                obj.clearControl();
            }
        }
        selListContent.hide();
    }

    this.setSelected = function (rIndex) {
        var obj = this;
        obj.clearSelected();
        $("#" + obj.selectListID).find('table tr:eq(' + rIndex + ')').children("td").css('background-color', '#e1eeff').css('color', '#000000').css('cursor', 'default');
    };
    this.setSelectedValue = function (v) {
        var obj = this;
        obj.vControl.val(v);
        if (obj.property.getValueType.toLocaleLowerCase() == 'id') {
            $.executeAjax(obj.url, 'postType=GetValueText&val=' + v + obj.getFilterValue(), function (result) {
                if (result.flag == 0 && typeof result.flag != 'undefined') {
                    alert(result.msg);
                    return false;
                }
                //updata by wangbinbin 20130905 单选时具有相同id的选项只会出现第一个
                if (obj.property.multiSelect != 1) {
                    obj.tControl.val(result.text.split(',')[0]);
                    obj.lControl.text(result.text.split(',')[0]);
                }
                else {
                    obj.tControl.val(result.text);
                    obj.lControl.text(result.text);
                }
            });
        }
        else {
            obj.tControl.val(v);
            obj.lControl.text(v);
        }
    };
    this.clearSelected = function () {
        var obj = this;
        $("#" + obj.selectListID).find('table').find('tr').css('background-color', '').css('color', '#000000');
        $("#" + obj.selectListID).find('table').find('tr td').css('background-color', '').css('color', '#000000');
    };
    this.clearControl = function () {
        this.vControl.val('');
        this.tControl.val('');
        this.lControl.text('');
    };
    this.common = {
        //验证是否开启某个标识，验证是否为true
        isOpen: function (val) {

            if (val && ($.trim(val) == 'true' || $.trim(val) == 'True')) {
                return true;
            }
            return false;
        }
    }
    this.SetEnabled = function (b) {//add by subo 2013-01-28，设置是否启用控件
        enabled = b;
        b ? this.tControl.removeAttr("disabled") : this.tControl.attr("disabled", "true"); //add by wangbinbin 2013-09-04 设置文本不可用
    }
    this.GetPinYin = function (val, str_) {
        var str = "";
        if (/^[\u4e00-\u9fa5]{0,}$/.test(str_)) {
            for (var i = 0; i < str_.length; i++) {
                str += this.cov(str_.substr(i, 1)).substr(0, 1);
            }
            if (str.toLowerCase() == val) {
                return true;
            }
            return false;
        }
        return false;
    };
    $.extend({
        page: function (divId, pagesize, pageindex, data, textField, valueField, obj) {
            var data = data;
            var div = divId;
            var x = "#" + div + " tbody tr:has(td)";
            var y = "#" + div;
            var mid = "menu" + divId;
            var m = "#" + mid;
            var table = $(x);
            var row = data.length;
            var pageSize = pagesize;
            var allPage = parseInt("" + ((row + pageSize - 1) / pageSize), 10);
            var currentPage = pageindex;
            //$(table).hide();
            $(y).find('[tp=pager]').empty();
            $(y).find('[tp=pager]').html("<div id='" + mid + "' t=menu style='text-align:center;'></div>");
            bar(); showRow(currentPage);
            function bar() {
                var left = 1;
                var right = allPage;
                $(m).empty();
                $(m).append("<span id='fir'><<</span>");
                $(m).append("<span id='pre'><</span>");
                $(m).append("<span id='next'>></span>");
                $(m).append("<span id='lat'>>></span>");

                $("#fir").css("width", "15px");
                $("#next").css("width", "15px");
                $("#pre").css("width", "15px");
                $("#lat").css("width", "15px");

                $(m).append("<span id='page_currentPage_allPage'></span>");
                $("#page_currentPage_allPage").html("<input t=go type=input value=" + currentPage + " style='width:25px;margin:0px 0px 0px 10px; border:solid 1px silver; height:18px;color:green;' />");

                $(m).append("<span id='go' style='margin-left:5px;'>Go</span>");
                $("#go").css("width", "15px");

                //$(m).find('[t=page]').bind("click", function () { showRow($(this).attr("id")); });
                $("span").bind("mouseover", {}, function () { $(this).css("cursor", "hand"); });
                $("#fir").bind("click", {}, function () { showFir(); });
                $("#pre").bind("click", {}, function () { showPre(); });
                $("#next").bind("click", {}, function () { showNext(); });
                $("#lat").bind("click", {}, function () { showLast(); });
                $("#go").bind("click", {}, function () { showGo(); });
            }

            function showGo() {
                var type = "^[0-9]*[0-9][0-9]*$";
                var re = new RegExp(type);
                if ($(m).find('[t=go]').val().match(re) == null) {
                    alert("请输入合法整数页码!");
                    return false;
                }
                var pg = parseInt($(m).find('[t=go]').val());
                if (pg > allPage) {
                    pg = allPage;
                }
                if (pg < 1) {
                    pg = 1;
                }
                currentPage = pg;
                showRow(currentPage);
                $(m).find('[t=go]').val(currentPage)
            }

            function showRow(page) {

                var selListContent = $('#' + obj.selectListID);
                $(y).find('[tp=table]').empty();
                currentPage = page - 0;
                var first = (currentPage - 1) * pageSize;
                var last = pageSize * currentPage;
                if (last > row) last = row;

                if (!obj.common.isOpen(obj.property.enablePage)) {
                    first = 0;
                    last = row;
                }
                var htmlContent = "<table id='tb+" + div + "' width='100%' cellpadding=0 cellspacing=0 border=0 style='text-align:" + obj.property.textAlign + ";'>"; //modified by kang
                //add by wangbinbin 2013-03-25 2013-03-25
                var arrValue = new Array();
                if (obj.property.multiSelect == 1) {
                    htmlContent += "<tr height=18><td colSpan=2 align='right'><a tp=selecta>关闭</a></td></tr>";
                    arrValue = obj.vControl.val().split(",");
                }
                for (var i = first; i < last; i++) {
                    if (obj.data[i][textField] == obj.tControl.val() && obj.data[i][valueField] == obj.vControl.val()) {
                        htmlContent += "<tr height=18 style='background-color:#e1eeff;color:#000000'>";
                    }
                    else {
                        htmlContent += "<tr height=18>";
                    }
                    //add by wangbinbin 2013-03-25 2013-03-25
                    var strCheck = "";
                    if (obj.property.multiSelect == 1) {
                        strCheck = "<input type='checkbox' tp=selectbox";
                        for (var k = 0; k < arrValue.length; k++) {
                            if (data[i][valueField] != "" && data[i][valueField] == arrValue[k]) {
                                strCheck += " checked='checked' ";
                                break;
                            }
                        }
                        strCheck += "></input>";
                    }
                    htmlContent += "<td  tp='selecttd' v=" + data[i][valueField] + ">" + strCheck + data[i][textField] + "</td>";
                    if (obj.property.listType.toLocaleLowerCase() == 'table') {
                        for (var c = 0; c < obj.cols.length; c++) {
                            if (obj.cols[c].cname.toLocaleLowerCase() != obj.property.valueField.toLocaleLowerCase() &&
                                obj.cols[c].cname.toLocaleLowerCase() != obj.property.textField.toLocaleLowerCase()) {
                                htmlContent += "<td>" + (obj.data[i][obj.cols[c].cname] == '' ? '&nbsp;' : obj.data[i][obj.cols[c].cname]) + "</td>";
                            }
                        }
                    }
                    htmlContent += "</tr>";
                }
                htmlContent += "</table>";
                selListContent.find('[tp=table]').html(htmlContent);
                bar();
                if (obj.property.listType.toLocaleLowerCase() == 'table') {
                    $(y).find('table tr td')
                    .css('border-right', 'solid 1px #f0f0f0')
                    .css('border-bottom', 'solid 1px #f0f0f0');
                }

                selListContent.find('table tr td').css('padding', '3px 3px 0px 3px'); //modified by kang设置下拉列表的内边距

                selListContent.find('table').find('tr').hover(function () {
                    selListContent.find('table').find('tr').css('background-color', '').css('color', '#000000');
                    $(this).children("td").css('background-color', '#e1eeff').css('color', '#000000').css('cursor', 'default');
                }, function () {
                    //if ($(this).children("td").eq(0).attr('v') != obj.vControl.val()) {
                    $(this).children("td").css('background-color', '').css('color', '#000000');
                    //}
                });
                //add by wangbinbin 2013-03-25
                if (obj.property.multiSelect == 1) {
                    selListContent.find('table').find('tr').find('td').find('[tp=selectbox]').click(function () {
                        if ($(this).attr("checked") == true) {
                            obj.tControl.val(obj.tControl.val() == "" ? ($(this).parent().text()) : (obj.tControl.val() + "," + $(this).parent().text()));
                            obj.vControl.val(obj.vControl.val() == "" ? ($(this).parent().attr('v')) : (obj.vControl.val() + "," + $(this).parent().attr('v')));
                        }
                        else {
                            var text = obj.tControl.val();
                            text = (text + ',').replace($(this).parent().text() + ',', '');
                            if (text != "")
                                text = text.substr(0, text.length - 1);
                            obj.tControl.val(text);
                            text = obj.vControl.val();
                            text = (text + ',').replace($(this).parent().attr('v') + ',', '');
                            if (text != "")
                                text = text.substr(0, text.length - 1);
                            obj.vControl.val(text);
                        }
                    })
                    selListContent.find('table').find('tr').find('td').find('[tp=selecta]').click(function () {
                        $('div[t=selectPanel]').hide();
                        if ($.trim(obj.property.selectedScript) != '') {
                            eval(obj.property.selectedScript);
                        }
                        obj.InvokeChange(); //eval(obj.evtchange);
                    })
                }
                else {
                    selListContent.find('table').find('tr').click(function () {
                        obj.tControl.val($(this).children("td").eq(0).text());
                        obj.vControl.val($(this).children("td").eq(0).attr('v'));
                        $('div[t=selectPanel]').hide();
                        if ($.trim(obj.property.selectedScript) != '') {
                            eval(obj.property.selectedScript);
                        }
                        obj.InvokeChange(); //eval(obj.evtchange);
                    })
                }

                if ($(obj.tControl).offset() != null) {
                    var A_top = 0, A_left = 0;
                    if ($("#dvDropDownList").parent().css("position") != "absolute") {
                        A_top = $(obj.tControl).offset().top + $(obj.tControl).outerHeight();  //  1
                        A_left = $(obj.tControl).offset().left;
                    } else
                        A_top = $(obj.tControl).outerHeight() + 1;
                    if ($("#tdButton").length > 0) {
                        A_top -= $("#tdButton").outerHeight();
                        A_top += parseInt($("#divAlert").next().scrollTop(), 10);
                    }
                    var A_toprev = A_top - $(obj.tControl).outerHeight() - selListContent.height();
                    // selListContent.bgiframe();//ie6下有问题时加这段代码及相应js。目前不用。       
                    if (typeof obj.tControl.css('display') != 'undefined') {
                        if ($.IsExceedRange(obj.tControl.parent().parent().parent().position().top + obj.tControl.height(), selListContent.height())) {
                            selListContent.css({ "top": A_toprev + "px", "left": A_left + "px" });
                        } else {
                            selListContent.css({ "top": A_top + "px", "left": A_left + "px" });
                        }
                    }
                }
            }

            function showFir() {
                var p = 1;
                if (currentPage - 0 >= 1) {
                    p = 1;
                }
                showRow(p);
            }

            function showPre() {
                var p;
                if (currentPage - 0 == 1) {
                    p = 1;
                }
                else {
                    p = currentPage - 1;
                }
                showRow(p);

            }

            function showNext() {
                var p;
                if (currentPage == allPage) {
                    p = allPage;
                }
                else {
                    p = currentPage + 1;
                }
                showRow(p);
            }

            function showLast() {
                var p;
                if (currentPage != allPage) {
                    p = allPage;
                }
                else {
                    p = allPage;
                }
                showRow(p);
            }
        },
        IsExceedRange: function (ch, lh) {
            if ($.GetClientHeight(document) < (ch + lh)) {
                return true;
            }
            return false;
        }
    });
}


//汉字取拼音
var HanziToPinyin = new function () {
    this.key = "吖哎安肮凹八挀扳邦勹陂奔伻皀边灬憋汃冫癶峬嚓偲参仓撡冊嵾噌叉犲辿伥抄车抻阷吃充抽出膗巛刅吹旾踔呲从凑粗汆镩蹿崔邨搓咑呆丹当刀恴揼灯仾嗲敁刁爹丁丟东吺剢耑叾吨多妸奀鞥仒发帆匚飞分丰覅仏垺夫旮侅干冈皋戈给根更工勾估瓜乖关光归丨呙妎咍兯夯茠诃黒拫亨乊叿齁乎花怀欢巟灰昏吙丌加戋江艽阶巾坕冂丩凥姢噘军咔开刊忼尻匼肎劥空廤扝夸蒯宽匡亏坤扩垃来兰啷捞仂雷塄唎俩嫾簗蹽咧厸伶溜咯龙娄噜驴孪掠抡捋嘸妈埋颟牤猫庅呅椚掹踎宀喵乜民名谬摸哞某母拏腉囡囔孬疒娞嫩莻妮拈娘鸟捏脌宁妞农羺奴女疟奻硸噢妑拍眅乓抛呸喷匉丕片剽氕姘乒钋剖仆七掐千呛悄切亲靑宆丘区峑炔夋亽呥穣荛惹人扔日戎厹嶿堧桵闰挼仨毢三桒掻色杀筛山伤弰奢申升尸収书刷衰闩双谁妁厶忪凁苏狻夊孙唆他囼坍汤仐忑膯剔天旫怗厅囲偷凸湍推吞乇屲歪乛尣危塭翁挝乌夕呷仙乡灱些忄兴凶休戌吅疶坃丫咽央幺倻膶一乚应哟佣优扜囦曰蒀帀災兂牂傮啫贼怎曽吒夈沾张佋蜇贞凧之中州朱抓拽专妆隹宒卓仔孖宗邹租劗厜尊昨".split("");
    this.pinyin = "AAiAnAngAoBaBaiBanBangBaoBeiBenBengBiBianBiaoBieBinBingBoBuCaCaiCanCangCaoCeCenCengChaChaiChanChangChaoCheChenChengChiChongChouChuChuaiChuanChuangChuiChunChuoCiCongCouCuCuanChuanCuanCuiCunCuoDaDaiDanDangDaoDeDenDengDiDiaDianDiaoDieDingDiuDongDouDuDuanDuiDunDuoEEnEngErFaFanFangFeiFenFengFiaoFoFouFuGaGaiGanGangGaoGeGeiGenGengGongGouGuGuaGuaiGuanGuangGuiGunGuoHaHaiHanHangHaoHeHeiHenHengHoHongHouHuHuaHuaiHuanHuangHuiHunHuoJiJiaJianJiangJiaoJieJinJingJiongJiuJuJuanJueJunKaKaiKanKangKaoKeKenKengKongKouKuKuaKuaiKuanKuangKuiKunKuoLaLaiLanLangLaoLeLeiLengLiLiaLianLiangLiaoLieLinLingLiuLoLongLouLuLvLuanLveLunLuoMMaMaiManMangMaoMeMeiMenMengMiMianMiaoMieMinMingMiuMoMouMeiMuNaNaiNanNangNaoNeNeiNenNNiNianNiangNiaoNieNinNingNiuNongNouNuNvNveNuanNuoOuPaPaiPanPangPaoPeiPenPengPiPianPiaoPiePinPingPoPouPuQiQiaQianQiangQiaoQieQinQingQiongQiuQuQuanQueQunRaRanRangRaoReRenRengRiRongRouRuRuanRuiRunRuoSaSaiSanSangSaoSeShaShaiShanShangShaoSheShenShengShiShouShuShuaShuaiShuanShuangShuiShuoSiSongSouSuSuanSuiSunSuoTaTaiTanTangTaoTeTengTiTianTiaoTieTingTongTouTuTuanTuiTunTuoWaWaiWanWangWeiWenWengWoWuXiXiaXianXiangXiaoXieXinXingXiongXiuXuXuanXueXunYaYanYangYaoYeYenYiYinYingYoYongYouYuYuanYueYunZaZaiZanZangZaoZeZeiZenZengZhaZhaiZhanZhangZhaoZheZhenZhengZhiZhongZhouZhuZhuaZhuaiZhuanZhuangZhuiZhunZhuoZaiZiZongZouZuZuanZuiZunZuo".split(/(?=[A-Z])/g);
    this.cache = {};
    this.tree = [];
    this.walk = function (a, b) {
        var c = Math.floor((a + b) / 2);
        if (c == b && b < a) {
            this.tree.push("r='", this.pinyin[c], "';");
            return;
        }
        this.tree.push("if(w.localeCompare('", this.key[c], "')<0)");
        this.walk(a, c - 1);
        this.tree.push("else ");
        this.walk(c + 1, b);
    }
    this.Create = function () {
        this.tree.push("var r=HanziToPinyin.cache[w];if(r) return r;");      //检查缓存  
        this.walk(0, this.key.length - 1);                              //-递归生成源码  
        this.tree.push("return HanziToPinyin.cache[w]=r;");                //-写入缓存  
        return new Function("w", this.tree.join(""));    //编译  
    }
}