var YshMasterPage = {
    Create: function (attrs) {
        var o = YshObject.Create();
        o.tag = "yshmasterpage";
        o.attrs["xmlName"] = attrs.xmlName;
        return o;
    },
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "YshMasterPage";
            var ascxname = "母版页";
            var html = LoadMstPgHTML(o.attrs["xmlName"]);
            var itemsId = new Array();//存放母版页中的原始itemId
            $(html).find("[name='yshmasterpageitem']").each(function (i) {
                itemsId.push($(this).attr("id"));
            });
            var itemsHtml = new Array();//存放用来进行替换的item的Html
            for (var i = 0; i < o.children.length; i++) {
                itemsHtml.push(o.children[i].GetHtml().replace(/id='.*?'/, StringPP.format("id='{0}_{1}'", o.id, itemsId[i])));
            }
            for (var i = 0; i < o.children.length; i++) {//进行Html替换
                html = html.replace(html.match(StringPP.format("<span id='{0}'.*?></span>", itemsId[i])), itemsHtml[i]);
            }
            return StringPP.format("<span title='{0}'>[{0}]{1}</span>", ascxname, html);
        },
        YshObject.AttachContainer(o, function (dom, i) {
            var itemsId = new Array();//存放母版页中的原始itemId
            $(o.GetHtml()).find("[name='yshmasterpageitem']").each(function (i) {
                itemsId.push($(this).attr("id"));
            });
            return document.getElementById(itemsId[i]);
        });
        o.Edit = function () {
            var dialoagURL = "MasterPageSetDlg.aspx";
            var dialog = window.showModalDialog(dialoagURL, this, "dialogWidth:800px; dialogHeight:600px; center:yes; help:no; resizable:no; status:no");
            if (typeof dialog != "undefined") {
                this.doc.Redraw();
            }
        }
    }
}