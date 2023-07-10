_app.line_defect_search = _app._dlg({ name: "线路缺陷清单", file: "sc_device_line_defect_search", width: "100%", height: "100%" });
/*{
    legend: "none",
    state: 0,
    dlg:false,
    open: function () {
        this.state = 1;
        if (this.dlg) {
            this.dlg.show = true;
            return;
        }

        var dlg = Ysh.Vue.Dialog.show("设备清单", "sc_search_dev", {}, "", "100%", "100%");
        var _this = this;
        dlg.fclose = function () {
            _this.close();
        }
        this.dlg = dlg;
    },
    close: function () {
        this.state = 0;
        if (this.dlg&&this.dlg.show)
            this.dlg.close();
    }
    }
*/