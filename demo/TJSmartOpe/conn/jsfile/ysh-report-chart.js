(function ($) {
    var chartEntity = {
        caption: '',
        subCaption: '',
        type: '0',
        xAxisName: '',
        pYAxisName: '',
        sYAxisName: '',
        yAxisMinValue: '',
        yAxisMaxValue: '',
        labelStep: 1,
        group: [],
        pie: [],
        line: [],
        column: []
    }
    var methods = {
        init: function (options) {
            var defaults = {
                url: "/",
                xmlfile: "",
                ashxHandler: "conn/ashx/ChartHandler.ashx",
                searchBox: "search-box",
                searchObj: [],
                searchData: []
            }
            var options = $.extend(defaults, options);
            //初始化查询控件列表
            init_search = function () {
                var postData = "&postType=GetSearchBox&pFile=" + options.xmlfile + "";
                var url = location.href;
                var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&"); //URL所有参数
                var paraObj = {}
                for (i = 0; j = paraString[i]; i++) {
                    postData += "&" + j.substring(0, j.indexOf("=")).toLowerCase() + "=" + j.substring(j.indexOf("=") + 1, j.length);
                }
                options.searchObj = [];
                $.ajax({
                    url: options.ashxHandler,
                    type: "post",
                    data: postData,
                    cache: false,
                    success: function (data) {
                        if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                            alert(data.msg);
                            return false;
                        }
                        chartEntity.caption = data.caption;
                        chartEntity.subCaption = data.subCaption;
                        chartEntity.type = data.type;
                        chartEntity.xAxisName = data.xAxisName;
                        chartEntity.pYAxisName = data.pYAxisName;
                        chartEntity.sYAxisName = data.sYAxisName;
                        chartEntity.yAxisMinValue = data.yAxisMinValue;
                        chartEntity.yAxisMaxValue = data.yAxisMaxValue;
                        chartEntity.labelStep = 1;
                        $("#" + options.searchBox).html(data.html);
                        $.each(data.ids, function (i, n) {
                            options.searchObj.push(n);
                            if (n.type == CONST_SEARCH_DROPDOWNLIST) {
                                $('#' + n.id).live('change', function () {
                                    var out = $(this).attr('out');
                                    if (out != '') {
                                        ref_option(out, $(this).val());
                                    }
                                })
                                $('#' + n.id).change();
                            }
                        });
                        $("select[k=quarter]").bind('change', function () {
                            var year = $("#" + $(this).attr("y") + " option:selected").val();
                            var quarter = $("#" + $(this).attr("q") + " option:selected").val();
                            $("#" + $(this).attr("v")).val(year + "-" + quarter);
                        });
                    },
                    error: function (data, status, e) {
                        alert(e);
                        return false;
                    }
                });
            }
            //刷新下拉列表关联项
            ref_option = function (o, v) {
                var postData = "&postType=GetOption&pFile=" + ReportShow.xmlfile + "&pOut=" + out + "";
                for (var i = 0; i < options.searchObj.length; i++) {
                    var sn = options.searchObj[i];
                    postData += "&" + sn.id + "=" + $.GetValueBySearch(sn.id, sn.type)
                }
                $('#' + out).empty();
                $.ajax({
                    url: options.ashxHandler,
                    data: postData,
                    type: "post",
                    cache: false,
                    success: function (data) {
                        if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                            alert(data.msg);
                            return false;
                        }
                        $.each(data, function (i, n) {
                            $("<option value='" + n.val + "'>" + n.text + "</option>").appendTo("#" + out);
                        })
                    },
                    error: function (data, status, e) {
                        alert(e);
                        return false;
                    }
                });
            }
            init_search();
            $(this).data[$(this).attr('id')] = options;
        },
        search: function (fn, cs) {
            var _self = $(this);
            if (typeof fn == 'undefined') { fn = '0'; }
            fn = fn == '1' ? 'getAscxPostData' : 'getPostData';
            var postData = _self.chart(fn, cs);
            postData += '&pid=' + $(this).attr('id');
            var contentObj = $('#' + $(this).attr('id'));
            $.ajax({
                url: _self.data[$(this).attr('id')].ashxHandler,
                data: postData,
                type: "post",
                cache: false,
                success: function (data) {
                    if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                        alert(data.msg);
                        return false;
                    }
                    contentObj.html(data.chart);
                },
                error: function (data, status, e) {
                    alert(e);
                    return false;
                }
            });
        },
        getPostData: function () {//智能报表获取查询参数值的方法
            var _self = $(this);
            _self.data[$(this).attr('id')].searchData = [];
            var postData = "&postType=Search&pFile=" + _self.data[$(this).attr('id')].xmlfile + "";
            for (var i = 0; i < _self.data[$(this).attr('id')].searchObj.length; i++) {
                var sn = _self.data[$(this).attr('id')].searchObj[i];
                var v = $.GetValueBySearch(sn.id, sn.type);
                postData += "&" + sn.id + "=" + v
                _self.data[$(this).attr('id')].searchData.push([sn.id, v]);
            }
            return postData;
        },
        getAscxPostData: function (cs) {
            if (typeof (cs) == "undefined")
                cs = [];
            var _self = $(this);
            _self.data[$(this).attr('id')].searchData = [];
            var postData = "&postType=GetChart&pFile=" + _self.data[$(this).attr('id')].xmlfile + "";
            for (var i = 0; i < cs.length; i++) {
                var sn = cs[i];
                var result = "";
                var bAdd = false;
                switch (sn[1]) {
                    case "Val":
                    case "Back":
                        result = sn[0].GetValue();
                        break;
                    case "Sel":
                        result = "{\"Val\":\"" + sn[0].GetValue() + "\",\"Text\":\"" + $("#" + sn[0].ctrl.id + " option:selected").text() + "\"}";
                        break;
                    default:
                        bAdd = true;
                        postData += "&" + sn[0] + "=" + sn[1];
                        break;
                }
                if (!bAdd)
                    postData += "&" + sn[0].doc.GetDesignID(sn[0].id) + "=" + result
            }
            return postData;
        },
        load: function (options) {
            var options = $.extend(chartEntity, options);
            var chartXML = "<chart animation='1' caption='" + options.caption + "' subCaption='" + options.subCaption + "'  ";
            chartXML += " xAxisName='" + options.xAxisName + "' PYAxisName='" + options.pYAxisName + "' SYAxisName='" + options.sYAxisName + "' labelStep='" + options.labelStep + "'";
            if ($.trim(options.yAxisMinValue) != '') {
                chartXML += " yAxisMinValue='" + options.yAxisMinValue + "' ";
            }
            if ($.trim(options.yAxisMaxValue) != '') {
                chartXML += " yAxisMaxValue='" + options.yAxisMaxValue + "' ";
            }
            chartXML += " >";
            var swf = "";
            var categoriesXML = '';
            var dataXML = '';
            switch (options.type) {
                case "0":
                    swf = "FusionCharts/MSColumn3DLineDY.swf";
                    categoriesXML = "<categories>";
                    $.each(options.group, function (i, n) {
                        categoriesXML += "<category label='" + n + "' /> ";
                    });
                    categoriesXML += "</categories>";
                    if (typeof options.column != 'undefined') {
                        $.each(options.column, function (i, n) {
                            dataXML += " <dataset color='" + ((typeof n.color == 'undefined') ? '000000' : n.color) + "' parentYAxis='S' >";
                            $.each(n.data, function (j, c) {
                                dataXML += " 	<set value='" + c + "' /> ";
                            });
                            dataXML += " </dataset>";
                        });
                    }
                    if ($.trim(dataXML) == '') {
                        swf = "FusionCharts/MSLine.swf";
                    } if (typeof options.line != 'undefined') {
                        $.each(options.line, function (i, n) {
                            dataXML += " <dataset color='" + ((typeof n.color == 'undefined') ? '000000' : n.color) + "' >";
                            $.each(n.data, function (j, c) {
                                dataXML += " 	<set value='" + c + "' /> ";
                            });
                            dataXML += " </dataset>";
                        });
                    }
                    break;
                case "1":
                    swf = "FusionCharts/Pie3D.swf";
                    $.each(options.pie, function (i, n) {
                        dataXML += "<set value='" + n.value + "' ";
                        dataXML += (typeof n.label == 'undefined') ? "" : " label='" + n.label + "' ";
                        dataXML += (typeof n.color == 'undefined') ? "color='000000'" : " color='" + n.color + "' ";
                        dataXML += " /> ";
                    });
                    break;
                default:
                    alert('未知的图表类型');
                    return false;
            }
            var chart = new FusionCharts(swf, $(this).attr('id') + 'render', "90%", "90%", "0", "0");
            chartXML += categoriesXML;
            chartXML += dataXML;
            chartXML += " </chart>";
            chart.setXMLData(chartXML);
            chart.render($(this).attr('id'));
        }
    }

    $.fn.chart = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            return methods.init.apply(this, arguments);
        }
    };

})(jQuery);