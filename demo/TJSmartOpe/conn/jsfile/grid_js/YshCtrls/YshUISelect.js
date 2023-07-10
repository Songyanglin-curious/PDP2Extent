var YshUISelect = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "uiselect";
        o.datasource = { src: "", col: "", type: "sql", options: "" };
        return o;
    }
    , ApplyYsh: function (o) {
        YshSelect.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetText = function () {
            return this.value;
        }
    }
}