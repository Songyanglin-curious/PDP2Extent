var YshUpdownCtrl = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "updown";
        return o;
    },
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return GetSpan(this.tag, "上传下载控件");
        }
        o.GetValue = function () {
            return document.getElementById("YshUpHid" + this.id).value
        }
        o.SetValue = function (v) {
            var arrId;
            if (v instanceof Array)
                arrId = v;
            else
                arrId = v.toString().split(",");
            var strHTML = YshUploader.GetFileHTML(arrId, true).value;
            this.ctrl.nextSibling.firstChild.innerHTML = strHTML;
            document.getElementById("YshUpHid" + this.id).value = v;
        }
    }
}