var YshIframe = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "iframe";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "iframe";
            var ascxname = "iframe";
            return GetSpan(tagname, ascxname);
        }
        o.SetValue = function (v) {
            this.value = v;
            if (this.ctrl) {
                var url = this.attrs["src"];
                if (url.indexOf('?') < 0)
                    url += "?abc=1";
                var temp = {};
                var str = this.selfattr["urlarg"];
                if ((str != "") && (typeof str != "undefined")) {
                    var arr = str.split(',');
                    for (var j = 0; j < arr.length - 1; j += 2) {
                        temp[arr[j]] = arr[j + 1];
                    }
                }
                for (var i = 0; i < v.length; i++) {
                    var item = v[i];
                    temp[item.id] = item.value;
                }
                url += this.LinkObject(temp, function (k, v) { return "&" + k + "=" + v; });
                this.ctrl.src = url;
            }
        }
    }
}