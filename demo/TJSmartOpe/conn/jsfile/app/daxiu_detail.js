_app.daxiu_detail = _app._dlg({name:function(args) { 
    if (!args) return "大修详情";
    return "大修详情 - " +args.name;
}, file: "sc_daxiu", width: "100%", height: "100%" });