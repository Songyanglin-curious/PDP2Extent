Vue.component('listshow', {
    data: function () {
        return { ls: null };
    },
    props: {
        "id": String, "file": String, "args": Array,
        "trevent": { type: String, "default": "" },
        "buttonhtml": { type: String, "default": "" },
        "resetlink": { type: Function },
        "sort": { type: Boolean, "default": true }
    },
    methods: {
        refresh: function () {
            if (!this.ls)
                return;
            this.ls.filename = this.file;
            this.ls.trEvent = this.trevent;
            this.ls.buttonHTML = this.buttonhtml;
            this.ls.id = this.id;
            this.ls.fResetLink = this.resetlink;
            this.ls.ifSort = this.sort ? "true" : "false";
        }
    },
    mounted: function () {
        var ls = new ListShow2();
        this.ls = ls;
        this.refresh();
        ls.tblobj = this.$el.children[0];
        ls.ctrl = ls;
        //ls.pageNum="<%=strIndexPerPage %>";
        //ls.selectType="<%=strSelectType %>";
        //ls.ifPage="<%=strIfPage %>";
        //ls.ifSort="<%=strIfSort %>";
        ls.divPage = this.$el.children[1];
        //ls.pageEventBefore="<%=strPageEventBefore%>";
        //ls.pageEventAfter="<%=strPageEventAfter%>";
        //ls.titleFixed="<%=strTitleFixed%>";
        //ls.orderCol="<%=strOrderCol%>";
        ls.IsUseHTML = "1";
        //add by jjw//
        //ls.cbfilter="<%=strFilter %>";
        //ls.tblobj.style.width="<%=strWidth %>";
        //zy20140729
        //ls.ifdrag="<%=strIfDrag %>";

        ls.returnValue = function (filename, lstCondition, lstPage, lstFlowCondition, flag) {
            var ret = PDP.dll("PDP2.0:PDP2.ListShow.GetAllList", [filename, lstCondition, lstPage, lstFlowCondition, this.extra, this.db, this.IsUseHTML]);
            if (!ret.check("获取列表数据:" + filename, true))
                return "";
            var returnValue = ret.value[0];
            if (flag == 0)
                returnValue = returnValue.split("@@@@")[0];
            else {
                this.data = returnValue.split("@@@@")[0];
                returnValue = returnValue.split("@@@@")[1];
            }
            return returnValue;
        }
        
        ls.getSaveTemplate = function (filename) {
            var ret = PDP.dll("PDP2.0:PDP2.ListShow.GetTemplateHTML", [filename]);
            if (ret.check("获取列表模板:" + filename, true))
                return ret.value[0];
            return "";
        }
        window[this.id] = ls;
    },
    template: '<div style="width:100%;height:100%;overflow-y:auto"><table style="border-collapse: collapse;border: 1px solid #cbdada;" width="100%" cellspacing="0" cellpadding="0"></table><div style="text-align: center"></div></div>',
    watch: {
        args: function () {
            if (!this.ls)
                return;
            this.refresh();
            this.ls.SetFlowConditions(undefined, this.args);
        }
    }
});