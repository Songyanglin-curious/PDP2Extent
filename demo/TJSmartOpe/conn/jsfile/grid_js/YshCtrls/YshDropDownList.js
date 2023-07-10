var YshDropDownList = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "ysh_ddlbox";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            var tagname = "DropDownListControl";
            var ascxname = "下拉列表";
            return GetSpan(tagname, ascxname);
        }
        o.GetValue = function () {
            if (typeof (this.ctrl) == 'undefined') return '';
            var obj = $('#' + this.ctrl.id);
            if (obj.find('[t=true]').css('display') == 'block') {
                if (this.attrs['get-valuetype'].toLocaleLowerCase() == 'text') {
                    //return obj.find('[type=text]').val();
                    return $("#" + this.ctrl.id.replace("dvDropDownList", "txtText")).val()
                }
                else {
                    //return obj.find('[type=hidden]').val();
                    return $("#" + this.ctrl.id.replace("dvDropDownList", "txtValue")).val();
                }
            }
            else {
                return obj.find('[t=false]').text();
            }
        }
        o.GetText = function () {
            var obj = $('#' + this.ctrl.id);
            if (obj.find('[t=true]').css('display') == 'block') {
                return obj.find('[type=text]').val();
            }
            else {
                return obj.find('[t=false]').text();
            }
        }
        o.SetValue = function (v) {
            var obj = o.id;
            if (v == "" || v == "''" || v == null)
                return;
            eval(obj + ".setSelectedValue('" + v + "')");
        }
        o.Select = function (index) {
            var obj = o.id;
            if (index == "" || index == "''" || index == null)
                return;
            eval(obj + ".setSelected('" + index + "')");
        }
        o.AttachEvent = function (evt, act) {
            eval(o.id).evtchange.push(act);
        }
    }
}