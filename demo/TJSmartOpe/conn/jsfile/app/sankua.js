_app.sankua = _app._page({
    getArgs: function (data) {
        if (data && data.lineid) return data;
        return {};
    },
    compatible: function () {
        return false;
    },
    getPage: function (data) {
        if (data&&data.lineid) return "sgc_3k_gt";
        return "sgc_3k_xl";
    },
    name: "三跨", page: "sgc_3k_xl", width: 0.6, //legend: "/i/sgc/legend/tingdian.png"
});