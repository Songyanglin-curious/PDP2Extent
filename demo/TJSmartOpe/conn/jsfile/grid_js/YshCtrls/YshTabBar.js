var YshTabBar = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "tabbar";
        o.datasource = { db: "", src: "", col: "", type: "sql", options: { db: "", sql: "" } };
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        YshSelect.ApplyOption(o); //Gud 20120418修改，改成和YshSelect一样
        o.GetHtml = function () {
            var tagname = "YshTabBar";
            var ascxname = "标签卡";
            return GetSpan(tagname, ascxname);
        }
        o.SetValue = function (v) {
            var tabId = o.id + "Tab";
            eval(tabId + ".SetTab('" + v + "')");
        }
        o.GetValue = function () {
            var tabId = o.id + "Tab";
            return eval(tabId + ".GetTab('" + o.id + "').getAttribute('customvalue')");
        }
        o.GetText = function () {
            var tabId = o.id + "Tab";
            return eval(tabId + ".GetTab('" + o.id + "').innerText;");
        }
        o.Select = function (idx) {
            var tabId = o.id + "Tab";
            eval(tabId + ".Select(" + idx + ")");
        }
        o.GetAllTab = function () {
            var tabId = o.id + "Tab";
            return eval(tabId + ".GetAllTab('" + o.id + "')");
        }
    }
}