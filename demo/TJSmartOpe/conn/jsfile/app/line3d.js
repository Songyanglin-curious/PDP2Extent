_app.line3d = {
    lineId: "",
    open: function (data) {
        this.lineId = data.lineItemId;
        if (data.showPage) {
            //vLayout.showZXJC = true;
            vMain.setMenuBar("top_nav_line", { lineName3D: data.lineName })
            vLayout.lineName3D = data.lineName;
            //ProjectSGC.Map.postMessage({ eventType: "menuopeLine", menuname: 'ShowLine3D', selstate: true, data: { lineid: this.lineId } });
            vMain.showPage("line3d", data.lineName + "杆塔监测", "dev_tower_monitor", { id: this.lineId });
            /*if (this.floatPage)
                vMain.destroyFloatPage(this.floatPage);
            this.floatPage = vMain.floatPage("dev_tower_slide", {
                id: this.lineId, left: 0, top: 0,data:[]
            });*/
            this.state = 1;
            vLayout.showChangeMode = false;
            vLayout.$nextTick(function () { this.leftWidth = 0.7; });
        } else {
            ProjectSGC.Map.postMessage({ eventType: "menuopeLine", menuname: 'ShowLine3D', selstate: true, data: { lineid: this.lineId } });
        }
    },
    close: function () {
        // vLayout.showZXJC = false;
        vMain.setMenuBar("", {})
        ProjectSGC.Map.postMessage({ eventType: "menuopeLine", menuname: 'ShowLine3D', selstate: false, data: { lineid: this.lineId } });
        vMain.closePage("line3d", true);
        //vMain.destroyFloatPage(this.floatPage);
        this.state = 0;
        vLayout.showChangeMode = true;
        vLayout.lineName3D = "";
    }
}