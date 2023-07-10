var YshTabLI = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "tab-li";
        o.attrs["class"] = "tab-top-title";
        o.datasource = { db: "", src: "", col: "", type: "sql", options: { db: "", sql: "" } }; //Gud 20120413修改，改成和YshSelect一样
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshSelect.ApplyOption(o);//Gud 20120418修改，改成和YshSelect一样
        o.GetHtml = function () {
            return "<div " + this.GetAttributesHtml() + " onclick=TabEvent.change('" + this.parent.parent.id + "');>" + o.desc + "</div>";
        }
        YshObject.AttachContainer(o);
        o.AddContentMenus = function (menulist) {
            menulist.push(YSH_CreateContextMenu("add", "删除该页签", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.parent.parent.RemoveTab(\"" + this.id + "\");docDesign.Redraw();"));
        }
    }
}