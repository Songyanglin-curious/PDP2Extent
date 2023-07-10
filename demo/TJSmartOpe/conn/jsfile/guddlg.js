function GGetWndWidth() { var rect = document.body.getBoundingClientRect();return rect.right - rect.left; }
function GGetWndHeight() { var rect = document.body.getBoundingClientRect();return rect.bottom - rect.top; }

var G_DLGBK = null;
var G_DLG = null;
var G_MSG = null;
//    <div id="divBK" style="position:absolute;z-index:1000;left:0px;top:0px;filter:alpha(opacity=50);background:#ffffff;display:none"></div>
//    <div id="divDlg" style="position:absolute;z-index:1001;display:none;border:1px">
//        <table style="background-color:#cccccc" cellspacing="1" cellpadding="0" border="0">
//            <tr style="background-Color:#EBEFF9;height:25px;vertical-align:middle"><td style="text-align:left" id="tdDlgTitle"></td></tr>
//            <tr style="background-Color:#ffffff;"><td style="text-align:center" id="tdDlgContent"></td></tr>
//            <tr style="background-Color:#ffffff;height:25px;vertical-align:middle"><td style="text-align:center"><a id="aDlgOK" href="javascript:void(0)">确定</a>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="CloseDialog(function(p) { return true; });return false;">关闭</a></td></tr>
//        </table>
//    </div>
function GCreateBK() {
    if (G_DLGBK === null) {
        G_DLGBK = document.createElement("DIV");
        with (G_DLGBK.style) { position = "absolute"; zIndex = 1000; left = 0; top = 0; backgroundColor = "#FFFFFF"; display = "none"; filter = "alpha(opacity=50)"; }
        document.body.appendChild(G_DLGBK);
    }
}
function GCreateMSG() {
    if (G_MSG === null) {
        G_MSG = document.createElement("DIV");
        with (G_MSG.style) { position = "absolute"; zIndex = 1001; display = "none"; border = "1px"; verticalAlign = "middle"; textAlign = "center"; }
        G_MSG.innerHTML = '<table cellpadding="0" cellspacing="0" border="0" style="width:330;height:105;background:url(\'/i/wait_bg.gif\')"><tr><td style="text-align:center;margin:0px;"><p align="center" style="color: #444444; font-size: 12px;"><span>操作中</span>，请稍候．．．</p><img alt="0" src="/i/waiting_blue.gif" width="168px" height="18px" /></td></tr></table>';
        document.body.appendChild(G_MSG);
    }
}
function GCreateDialog() {
    if (G_DLG === null) {
        G_DLG = document.createElement("DIV");
        with (G_DLG.style) { position = "absolute"; zIndex = 1002; display = "none"; border = "1px"; }
        document.body.appendChild(G_DLG);
        G_DLG.innerHTML = '<table style="background-color:#cccccc" cellspacing="1" cellpadding="0" border="0"><tr style="background-Color:#EBEFF9;height:25px;vertical-align:middle"><td style="text-align:left" id="tdDlgTitle"></td></tr><tr style="background-Color:#ffffff;"><td style="text-align:center" id="tdDlgContent"></td></tr><tr style="background-Color:#ffffff;height:25px;vertical-align:middle"><td style="text-align:center"><a id="aDlgOK" href="javascript:void(0)">确定</a>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="GCloseDialog(function(p) { return true; });return false;">关闭</a></td></tr></table>';
    }
}
function GOpenDialog(name, html, fClose, l, t) {
    GCreateBK();
    GCreateDialog();
    G_DLG.children[0].rows[0].cells[0].innerHTML = name;
    G_DLG.children[0].rows[1].cells[0].innerHTML = html;
    G_DLG.children[0].rows[2].cells[0].children[0].onclick = function () {
        GCloseDialog(fClose);
        return false;
    }
    G_DLGBK.style.width = GGetWndWidth();
    G_DLGBK.style.height = GGetWndHeight();
    G_DLGBK.style.display = "";
    G_DLG.style.display = "";

    G_DLG.style.left = (typeof l === "undefined") ? Math.max(0, (GGetWndWidth() - G_DLG.offsetWidth) / 2) : l;
    G_DLG.style.top = (typeof t === "undefined") ? Math.max(0, (GGetWndHeight() - G_DLG.offsetHeight) / 2) : t;
    return G_DLG.children[0].rows[1].cells[0];
}
function GCloseDialog(f) {
    if (!f(G_DLG.children[0].rows[1].cells[0]))
        return;
    G_DLGBK.style.display = "none";
    G_DLG.style.display = "none";
}
function GShowWorking(msg) {
    GCreateBK();
    GCreateMSG();
    if (msg == "")
    		msg = "操作进行中";
    var w = GGetWndWidth();
    var h = GGetWndHeight();
    G_DLGBK.style.width = w;
    G_DLGBK.style.height = h;
    G_DLGBK.style.display = "";
    G_MSG.style.display = "";
    G_MSG.children[0].rows[0].cells[0].children[0].children[0].innerHTML = msg;
    G_MSG.style.left = Math.max(0, (w - G_MSG.offsetWidth) / 2);
    G_MSG.style.top = Math.max(0, (h - G_MSG.offsetHeight) / 2);
}
function GHideWorking() {
    if (G_MSG === null)
        return;
    G_DLGBK.style.display = "none";
    G_MSG.style.display = "none";
}