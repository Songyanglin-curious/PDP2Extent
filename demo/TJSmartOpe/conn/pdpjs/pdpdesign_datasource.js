var vmDataSource = new Vue({
    el: "#divDataSource",
    data: {
        isShow: false,
        dataSource: { tag: '', desc: '', db: '', type: '', tbl: '', orderby: '', cols: [], sql: '', node: '' },
        /* { tag: 'datasource', desc: '用户表',  db: 'APPUSER', type: 'single', remark: '', tbl: 'dbUser', orderby: '',
        *  cols: {[
        *       { desc: '用户num', name='usernum', from: 'i0' },
        *       { desc: '用户id', name='userid' },
        *       { desc: '用户名', name='username' }
        *  ]}
        * }
        * { tag: 'datasource', desc: '间隔列表', db: 'ConnMain', type: 'simple', sql: 'select s.spaceid,s.spacenum,s.remark,t.stname from dbspace s left join dbspacetype t on s.stid=t.stid WHERE s.volid={0}',
        *   cols: {[
        *       { desc: '电压等级id', name='volid', from: 'i1' },
        *       { desc: '间隔id', name='spaceid' },
        *       { desc: '间隔编号', name='spacenum' },
        *       { desc: '备注', name='remark' },
        *       { desc: '间隔类型', name='stname' }
        *   ]}
        * }
        */
        tableData: { columns: [], data: [] },
        // { title: '列描述', key: '列名' }   { '列名1': '数据1', '列名2': '数据2' }
        ds: [],
        table: [],
        column: [],
        //自定义SQL语句条件列
        conditionCols: [],
        //自定义SQL语句数据列
        dataCols: [],
        //design页面datasources的index
        dataIndex: -1,
        //是否正在执行sql
        execLoading: false,
        //xml文件中的sql语句
        xmlSql: ''
    },
    computed: {
        dataSourceCols: {
            get: function () {
                var arrCols = [];
                for (var i = 0; i < this.dataSource.cols.length; i++) {
                    arrCols.push(this.dataSource.cols[i].name);
                }
                return arrCols;
            },
            set: function (arr) {
                var arrSelectCol = [];
                for (var i = 0; i < arr.length; i++) {
                    var bFind = false;
                    for (var j = 0; j < this.dataSource.cols.length; j++) {
                        if (this.dataSource.cols[j].name == arr[i]) {
                            bFind = true;
                            arrSelectCol.push(this.dataSource.cols[j]);
                            break;
                        }
                    }
                    if (!bFind) {
                        var colDesc = "";
                        for (var j = 0; j < this.column.length; j++) {
                            if (this.column[j][0] == arr[i]) {
                                colDesc = this.column[j][1];
                            }
                        }
                        if (colDesc == "")
                            colDesc = arr[i];
                        arrSelectCol.push({ name: arr[i], desc: colDesc });
                    }
                }
                this.dataSource.cols = arrSelectCol;
            }
        }
    },
    methods: {
        ok: function () {
            this.$Message.info('保存成功');
            PDPDesign.Assist.defineXml(this.dataSource, "datasource");
            if (!this.dataSource.id) {
                this.dataSource.id = PDPDesign.page.newId("ds");
                this.dataSource.__id = this.dataSource.id;
            }
            for (var i = 0; i < this.dataSource.cols.length; i++) {
                if (this.dataSource.cols[i].id)
                    continue;
                this.dataSource.cols[i].id = PDPDesign.page.newId("col");
                this.dataSource.cols[i].__id = this.dataSource.cols[i].id;
            }
            if (this.dataIndex == -1)
                vmCtrl.datasources.push(this.dataSource);
            else
                vmCtrl.$set(vmCtrl.datasources, this.dataIndex, this.dataSource);
            PDPDesign.Assist.defineParent(vmCtrl.datasources, null);
        },
        cancel: function () {
            this.$Message.info('取消保存');
        },
        show: function () {
            this.isShow = true;
            this.execLoading = false;
            if (!this.dataSource.tag)
                this.dataSource.tag = "dataSource";
            if (this.dataSource.cols === undefined)
                this.dataSource.cols = [];
            if (this.dataSource.db === undefined)
                this.dataSource.db = '';
            if (this.dataSource.type === undefined)
                this.dataSource.type = 'single';
            this.tableData = { columns: [], data: [] };
            this.conditionCols = [];
            this.dataCols = [];
            this.xmlSql = '';
            if (this.dataSource.db) {
                if (this.dataSource.type == "single") {
                    this.getTable(this.dataSource.db);
                    if (this.dataSource.tbl) {
                        this.getColumn(this.dataSource.db, this.dataSource.tbl);
                        this.getTableData(this.dataSource.db, this.dataSource.tbl);
                    }
                }
                else if (this.dataSource.type == "simple") {
                    if (this.dataSource.sql)
                        this.execSql();
                }
                else if (this.dataSource.type == "xml") {
                    if (this.dataSource.node)
                        this.execXmlSql();
                }
            }
        },
        hide: function () {

        },
        clickTab: function (name) {
            this.dataSource.type = name;
        },
        getDS: function () {
            var o = PDP.dll("PDP2.0:PDP2.Design.GetConnections", []);
            if (!o.check("获取数据源", true))
                return false;
            this.ds = o.value[0];
        },
        getTable: function (db) {
            if (!db) {
                this.table = [];
                return false;
            }
            var o = PDP.read("Design", "DllSQL:GetTable", [db]);
            if (!o.check("获取数据表", true))
                return false;
            this.table = o.value;
        },
        getColumn: function (db, table) {
            if (!db || !table) {
                this.column = [];
                return false;
            }
            var o = PDP.read("Design", "DllSQL:GetColumn", [db, table]);
            if (!o.check("获取数据表", true))
                return false;
            this.column = o.value;
        },
        selectDS: function (db) {
            if (this.dataSource.type != "single")
                return false;
            this.dataSource.table = '';
            this.getTable(db);
        },
        selectTable: function (table) {
            this.dataSource.cols = [];
            this.getColumn(this.dataSource.db, table);
            this.getTableData(this.dataSource.db, table);
        },
        selectColumn: function (value, text) {
            
        },
        getTableData: function (db, table) {
            if (!db || !table) {
                this.showTableData({ value: [{ col: [], data: [] }] });
                return false;
            }
            var o = PDP.dll("PDP2.0:PDP2.YshDataSource.GetTableData", [db, table]);
            if (!o.check("获取数据", true))
                return false;
            this.showTableData(o);
        },
        execSql: function () {
            this.execLoading = true;
            if (!this.dataSource.db || !this.dataSource.sql) {
                this.$Modal.error({
                    title: "错误",
                    content: "请选择数据源并输入SQL语句"
                });
                this.execLoading = false;
                return false;
            }
            var o = PDP.dll("PDP2.0:PDP2.YshDataSource.GetSqlData", [this.dataSource.db, this.dataSource.sql]);
            if (!o.check("获取数据", true)) {
                this.execLoading = false;
                return false;
            }
            this.showTableData(o, this.setDataCol);
            this.execLoading = false;
        },
        execXmlSql: function () {
            this.execLoading = true;
            if (!this.dataSource.db || !this.dataSource.node) {
                this.$Modal.error({
                    title: "错误",
                    content: "请选择数据源并输入XML节点"
                });
                this.execLoading = false;
                return false;
            }
            var o = PDP.dll("PDP2.0:PDP2.YshDataSource.GetXmlSqlData", [this.dataSource.db, this.dataSource.node]);
            if (!o.check("获取数据", true)) {
                this.execLoading = false;
                return false;
            }
            this.showTableData(o, this.setDataCol);
            this.xmlSql = o.value[0].sql;
            this.execLoading = false;
        },
        showTableData: function (o, fSet) {
            this.tableData.columns = [{ type: 'index', width: 60, align: 'center' }];
            this.tableData.data = [];
            var arrCol = [];
            var cols = o.value[0].col;
            if (fSet) {
                fSet(this, cols);
            }
            if (this.dataCols && this.dataCols.length > 0) {
                cols = [];
                for (var i = 0; i < this.dataCols.length; i++) {
                    cols.push([this.dataCols[i].name, this.dataCols[i].desc]);
                }
            }
            for (var i = 0; i < cols.length; i++) {
                arrCol.push({ key: cols[i][0], title: cols[i][1], sortable: true });
            }
            this.tableData.columns = this.tableData.columns.concat(arrCol);
            var arrData = [];
            var data = o.value[0].data;
            for (var i = 0; i < data.length; i++) {
                var oData = {};
                for (var j = 0; j < data[i].length; j++) {
                    oData[arrCol[j].key] = data[i][j];
                }
                arrData.push(oData);
            }
            this.tableData.data = arrData;
        },
        setDataCol: function (vm, cols) {
            var arrCols = [];
            for (var i = 0; i < cols.length; i++) {
                var colName = cols[i][0];
                var colDesc = cols[i][1];
                var colID = "";
                var colFrom = "";
                for (var j = 0; j < vm.dataSource.cols.length; j++) {
                    if (vm.dataSource.cols[j].name.toLowerCase() == colName.toLowerCase()) {
                        colDesc = vm.dataSource.cols[j].desc;
                        colID = vm.dataSource.cols[j].id;
                        colFrom = vm.dataSource.cols[j].from;
                        break;
                    }
                }
                var oCol = { name: colName, desc: colDesc };
                if (colID)
                    oCol["id"] = colID;
                if (colFrom)
                    oCol["from"] = colFrom;
                arrCols.push(oCol);
            }
            vm.dataSource.cols = arrCols;
            vm.conditionCols = vm.getConditionCols();
            vm.dataCols = vm.getDataCols();
        },
        getConditionCols: function () {
            var arrCol = [];
            for (var i = 0; i < this.dataSource.cols.length; i++) {
                if (this.dataSource.cols[i].name.indexOf("条件") == 0) {
                    arrCol.push(this.dataSource.cols[i]);
                }
            }
            return arrCol;
        },
        getDataCols: function () {
            var arrCol = [];
            for (var i = 0; i < this.dataSource.cols.length; i++) {
                if (this.dataSource.cols[i].name.indexOf("条件") != 0) {
                    arrCol.push(this.dataSource.cols[i]);
                }
            }
            return arrCol;
        }
    }
});
vmDataSource.getDS();