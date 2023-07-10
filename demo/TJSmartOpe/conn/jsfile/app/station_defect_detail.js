_app.station_defect_detail = _app._dlg({
    name: function (args) {
        if (!args.name) return "变电站缺陷详情";
        return args.name;
    }, file: "sc_device_defect_station_deatil", width: "1000px", height: '800px', top: '160px', left: '100px',
});