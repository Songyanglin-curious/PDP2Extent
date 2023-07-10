var YshDialog = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "ysh_dialog";
        o.attrs["class"] = "design-Dialog-box";
        o.attrs["width"] = "500";
        o.attrs["height"] = "500";
        o.attrs["title"] = "新建窗口";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o);
        o.GetHtml = function () {
            return "<div class='design-Dialog-box' style='width:" + o.attrs["width"] + "px;height:" + o.attrs["height"] + "px;'>" + this.GetChildrenHtml() + "</div>";
        }
        o.AddContentMenus = function (menulist) {
            menulist.push(YSH_CreateContextMenu("add", "添加控件", "", "g_yshFactory.CreateNewCtrl(\"" + this.id + "\");docDesign.Redraw();"));
        }/*
        o.Open = function () {
            $('#' + o.id).show();
        }
        o.Close = function () {
            $('#' + o.id).hide();
        }*/
        o.Open = function () {
            $('#' + o.id).yshdialog('open');
        }
        o.Close = function () {
            $('#' + o.id).yshdialog('close');
        }
        o.SetWidth = function (w) {
            $('#' + o.id).yshdialog('setWidth', w);
        }
        o.SetHeight = function (h) {
            $('#' + o.id).yshdialog('setHeight', h);
        }
        o.Size = function () {
            return $('#' + o.id).yshdialog('getSize');
        }
        o.HiddenHead = function (showHead) {
            $('#' + o.id).yshdialog('hiddenHead', showHead);
        }
        o.FullScreen = function (showHead) {
            $('#' + o.id).yshdialog('fullScreen', showHead);
        }
        o.MoveScreen = function (x, y) {
            $('#' + o.id).yshdialog('moveScreent', x, y);
        }
    }
}