var YshRadio = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "ysh_radio";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        function Get(type) {//获取值或文字，type为0时返回值，type为1时返回文字
            var radioGroup = $(':radio[t=ysh_radio][group=' + o.name + ']');
            var val = "", text = "";
            $.each(radioGroup, function (i, n) {
                if ($(n).attr('checked')) {
                    val = n.value;
                    text = n.nextSibling.innerText;
                }
            });
            return type == 0 ? val : text;
        }
        o.GetHtml = function () {
            if (this.attrs.text == undefined)
                return StringPP.format("<input type='radio' {0} />", this.GetAttributesHtml());
            else
                return StringPP.format("<span><input type='radio' {0} />{1}</span>", this.GetAttributesHtml(), this.attrs.text);
        }
        o.GetValue = function () {
            return Get(0);
        }
        o.SetValue = function (v) {
            this.ctrl.value = v;
            var radioGroup = $(':radio[t=ysh_radio][group=' + this.name + ']');
            $.each(radioGroup, function (i, n) {
                var _n = $(n);
                if (_n.val() == v)
                    _n.attr('checked', true);
                else
                    _n.attr('checked', false);
            });
        }
        o.GetText = function () {
            return Get(1);
        }
        o.SetReadOnly = function (b) {
            var array = g_yshFactory.GetYshByName(o.name);
            if (b && o.GetEditable()) {
                for (var i = 0; i < array.length; i++) {
                    var obj = $(array[i].ctrl).next();
                    if (!obj.attr("checked")) {
                        obj.hide();
                        obj.next().hide();
                    }
                    array[i].IsEditable = !b;
                }
            }
            else if (!b && !o.GetEditable()) {
                for (var i = 0; i < array.length; i++) {
                    var obj = $(array[i].ctrl).next();
                    if (!obj.attr("checked")) {
                        obj.show();
                        obj.next().show();
                    }
                    array[i].IsEditable = !b;
                }
            }
        }
    }
};