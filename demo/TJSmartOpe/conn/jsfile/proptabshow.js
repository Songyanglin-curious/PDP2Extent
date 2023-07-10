/*
此部分为控制控件的属性设置各标签的显示
2013-3-6
*/
/*
$(function () {
    TabManage.init();
    $.ajax({
        url: "/conn/ashx/Tab.ashx",
        type: "get",
        cache: false,
        data: ctrltag,
        success: function (data) {
            var tagname = "";
            var tabjson = $.parseJSON(data);
            var tabnum = 0;
            for (var cfg in tabjson) {
                tabnum++;
                if (tabjson[cfg] != "0") {
                    var tabobj = TabManage.tab_tagname();
                    for (var tag in tabobj) {
                        if (tag == cfg) {
                            tagname = tabobj[tag];
                            break;
                        }
                    }
                    $("#" + tagname).show();
                }
            }
            $(".tabspacer").attr("width", (900 - tabnum * 70) + "px");
        }
    });
})


var TabManage = (function () {
    return {
        init: function () {
            $(".tab").each(function () {
                $(this).hide();
                $("#tab1").show();
            })
        },
        tab_tagname: function () {
            return { a: "tab1", s: "tab2", e: "tab3", ce: "tab_commonevent", sa: "tab5", dc: "tab_datacheck", d: "tab4", p: "tab_setPri"};
        }
    }
})();




*/

