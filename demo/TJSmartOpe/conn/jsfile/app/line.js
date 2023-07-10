_app.line = _app._page({
    //name: "线路杆塔",
    //page: "sgc_line_gt",
    getName: function (data) {
        return data.bIsTLine ? "T接线杆塔" : "线路杆塔"
    },
    getPage: function (data) {
        return data.bIsTLine ? "sgc_tline_gt" : "sgc_line_gt"
    },
});

/*
    {
    click: function () {
        vMain.changePage("line", "线路杆塔", "sgc_line_gt");
    },
    open: function () {
        this.state = 1;
    }
}*/