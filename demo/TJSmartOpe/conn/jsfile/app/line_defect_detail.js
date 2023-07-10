_app.line_defect_detail = _app._dlg({
    name: function (args) {
        if (!args.name) return "线路缺陷详情";
        return args.name;
    }, file: "sc_device_defect_line_deatil", width: "1000px", height: '800px', top: '160px', left: '100px', 'background': '#11424B'
});