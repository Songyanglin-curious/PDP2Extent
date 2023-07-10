_app.jigai_detail = _app._dlg({name:function(args) { 
    if (!args) return "技改详情";
    return "技改详情 - " +args.name;
}, file: "sc_jigai", width: "100%", height: "100%" });