var txtFindDeviceKey = $("#txtKey");
var txtFindDeviceType = $("#ddlDevType");
var ddlFindDeviceDevice = $("#ddlDevice");
var ddlFindDeviceGraphic = $("#ddlGraphics");
var allFindDevice = [];

var ddlOption = new Array();
function SortFunc(var1, var2) {
    if (var1[0] == var2[0]) return 0;
    if (var1[0] > var2[0]) return 1;
    if (var1[0] < var2[0]) return -1;
}
function FindDdlOption(value) {
    for (var i = 0; i < ddlOption.length; i++)
        if (ddlOption[i][1] == value)
            return ddlOption[i][2];
    return null;
}

function SelDeviceByKey() {
    if (txtFindDeviceKey.val().replace(/ /g, "") == "")
        return false;
    ddlFindDeviceDevice.get(0).options.length = 1;
    allFindDevice = GraphAjax.GetDeviceByKey(txtFindDeviceKey.val()).value;
    if (allFindDevice[0] == "0") {
        alert(allFindDevice[1]);
        return false;
    }
    AddDeviceDDL();
    return false;
}
function SelDevice() {
    if (txtFindDeviceKey.val().replace(/ /g, "") != "") {
        return SelDeviceByKey();
    }
    if (ddlFindDeviceGraphic.val() == "")
        return false;
    ddlFindDeviceDevice.get(0).options.length = 1;
    allFindDevice = GraphAjax.GetDevice(ddlFindDeviceGraphic.val(), txtFindDeviceType.val()).value;
    if (allFindDevice[0] == "0") {
        alert(allFindDevice[1]);
        return false;
    }
    if (allFindDevice[1].length > 50) {
        parent.loadingDesc.innerText = '搜索数据过多，正在加载';
        parent.divLoading.style.display = '';
        setTimeout('AddDeviceDDL()', 1);
    }
    else
        AddDeviceDDL();
    return false;
}

function AddDeviceDDL() {
    try {
        ddlOption = new Array();
        for (var i = 0; i < allFindDevice[1].length; i++) {
            if (allFindDevice[1][i][2] == txtFindDeviceKey.val())
                ddlFindDeviceDevice.add(new Option(allFindDevice[1][i][2], allFindDevice[1][i][0]));
            ddlOption.push(new Array(allFindDevice[1][i][2], allFindDevice[1][i][0], allFindDevice[1][i][1]));
        }
        ddlOption.sort(SortFunc);
        for (var i = 0; i < ddlOption.length; i++) {
            if (ddlOption[i][0] != txtFindDeviceKey.val())
                ddlFindDeviceDevice.add(new Option(ddlOption[i][0], ddlOption[i][1]));
        }
    }
    catch (e) {
        alert(e.name + ":" + e.message);
        return false;
    }
    parent.divLoading.style.display = "none";
}
function Button1_onclick() {
    var igraphid = FindDdlOption(ddlFindDeviceDevice.val());
    if (igraphid) {
        parent.OpenOneGraphic(igraphid);
        m_pPsgpActive.OpenDeviceGraphic("<_d><_OpenType>1</_OpenType><_graphItemId>" + ddlFindDeviceDevice.val() + "</_graphItemId><_graphId>" + igraphid + "</_graphId><_Type>0</_Type></_d>");
    }
}