/// <reference path="../../jsfile/vue.js" />
/// <reference path="../../jsfile/jquery.min.1.7.2.js" />
/// <reference path="../../../Scripts/ViewsJs/jsTools.js" />
/// <reference path="../../../Scripts/ViewsJs/AnalysisReportField.js" />
/// <reference path="../../../ReportDetail/scripts/SpreadJsHelper.js" />
/// <reference path="../../../Scripts/ViewsJs/AnalysisReportField.js" />

//传入的conditions格式：[{Id:"",CurrentVal:""}]
Vue.component("reportshow", {
    props: ["report_id", "file_name", "conditions", "ssjson"],
    template: "<div></div>",
    data: function () {
        return {
            mySsjson:"",
            isReSearch: false,
            spMy: new SpreadJs(),
            reportAnalysisField: new Object(),
            defaultConditions: [],
            guid: "",
            socketIsClose: false
        }
    },
    computed:{
        tempSsjson:function() {
            return this.ssjson|this.mySsjson;
        }
    },
    methods: {
        /**
         * 查询报表
         * @returns {} 
         */
        search: function () {
            var _this = this;
            jsTools.$ajax({
                url: '/ReportAnalyse/GetReportResult',
                data: {
                    report_id: _this.report_id,
                    file_name: _this.file_name,
                    listSearchCon: _this.conditions,
                    isReSearch: false,
                    guid: _this.guid
                },
                success: function (data) {
                    var j = JSON.parse(_this.tempSsjson);
                    _this.spMy.LoadData_ssjsonByString(j);
                    _this.reportAnalysisField.SetAllField(j.ReportField);
                    if (data.type === "search") {
                        _this.reportAnalysisField.Analysis(data.content);
                    } else if (data.type === "old") {
                        _this.spMy.LoadData_ssjsonByString(JSON.parse(data.content));
                    } else if (data.type === "socket") {
                        return;
                    }
                }
            });
        },
        /**
         * 获取报表的查询条件
         * @returns {conditions数组} 
         */
        getDefaultConditions: function () {
            return this.defaultConditions;
        },
        /**
         * 导出excel
         * @param {string} fileName 导出文件名
         * @returns {} 
         */
        exportExcel:function(fileName) {
            this.spMy.ExportExcel(fileName);
        },
        /**
         * 打印当前页签
         * @returns {} 
         */
        print: function () {
            var sheetIndex = this.spMy.GetSheetIndex();
            this.spMy.PrintExcelSetting.showBorder(sheetIndex, false);
            this.spMy.PrintExcelSetting.showRowHeader(sheetIndex, this.spMy.Enum.PrintVisibilityType.hide);
            this.spMy.PrintExcelSetting.showColumnHeader(sheetIndex, this.spMy.Enum.PrintVisibilityType.hide);
            this.spMy.PrintExcelSetting.centering(sheetIndex, this.spMy.Enum.PrintCentering.both);
            this.spMy.PrintExcelSetting.bestFitColumns(sheetIndex, true);
            this.spMy.PrintExcelSetting.bestFitRows(sheetIndex, true);
            this.spMy.PrintExcelSetting.print(sheetIndex);
        }
    },
    mounted: function () {
        var _this = this;
        var spread = new GC.Spread.Sheets.Workbook(this.$el, {
            sheetCount: 1
        });
        this.spMy.SetSpread(spread);
        this.reportAnalysisField = new ReportFieldAnalysis(this.spMy);
        jsTools.$ajax({
            url: '/ReportAnalyse/LoadAnalyse',
            async: false,
            data: {
                report_id: _this.report_id,
                file_name: _this.file_name
            },
            success: function (data) {
                if (data.socketstatus == "1") {
                    var wsImpl = window.WebSocket || window.MozWebSocket;
                    // 创建新的websocket新连接端口为1991  从数据库读
                    var ws = new wsImpl(data.socketip);
                    // 当数据从服务器服务中心发送后，继续向下运行过程
                    ws.onmessage = function (evt) {
                        if (evt.data === "ping") {
                            console.log("come on");
                            return;
                        }
                        var wdata = JSON.parse(evt.data);
                        if (wdata.guid !== _this.guid) return;

                        if (wdata.error) {
                            alert(wdata.error);
                            return;
                        }
                        _this.reportAnalysisField.Analysis(wdata.fields);
                    };
                    //每隔30秒，发送一次心跳，保持连接
                    var sendPing = setInterval(function () {
                        ws.send("ping");
                    }, 30000);
                    ws.onopen = function () {
                        console.log("连接正常");
                        _this.socketIsClose = false;
                    };
                    // 当链接对象未找找到服务端成功对接后，提示打开失败，别切单项关闭
                    ws.onclose = function () {
                        console.log("连接关闭");
                        _this.socketIsClose = true;
                        clearInterval(sendPing);
                    }
                    ws.onerror = function (err) {
                        console.log('websocket发生错误:');
                        console.log(err);
                        _this.socketIsClose = true;
                        clearInterval(sendPing);
                    }
                }
                _this.guid = data.guid;
                _this.defaultConditions = data.con;
                _this.mySsjson = data.ssjson;
                
            }
        });
    },
    watch:{
        conditions: function () {
            this.search();
        }
    }
})