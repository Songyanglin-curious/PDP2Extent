function CellShow(strCellName, oCell) {
    this.cllName = strCellName;
    this.objCell = oCell;
    this.IDNormal = false;

    this.parseCell = function(str, strType) {
        var objID = this.IDNormal ? str : "ctl00_cBody_" + str;

        if ($(objID) || $(str)) {//如果有这个控件，服务端的会变掉ID，客户端的不会
            var arrdte = ["-", "-", " ", ":", ":", " "];
            var arrdtc = ["年", "月", "日 ", "时", "分", "秒"];
            var strTemp = "";

            switch (str.substr(0, 3)) {
                case "dte":
                    strTemp = "arrdte";
                case "dtc":
                    var arrDate = $(str).value.replace("/", "-").replace("/", "-").split(" ")[0].split("-");
                    var arrTime = $(str).value.split(" ")[1].split(":");
                    strTemp = strTemp == "" ? "arrdtc" : strTemp;
                    arrDate[0] = strType.substr(0, 1) == "1" ? arrDate[0] + eval(strTemp + "[0]") : "";
                    arrDate[1] = strType.substr(1, 1) == "1" ? arrDate[1] + eval(strTemp + "[1]") : "";
                    arrDate[2] = strType.substr(2, 1) == "1" ? arrDate[2] + eval(strTemp + "[2]") : "";
                    arrTime[0] = strType.substr(3, 1) == "1" ? arrTime[0] + eval(strTemp + "[3]") : "";
                    arrTime[1] = strType.substr(4, 1) == "1" ? arrTime[1] + eval(strTemp + "[4]") : "";
                    arrTime[2] = strType.substr(5, 1) == "1" ? arrTime[2] + eval(strTemp + "[5]") : "";

                    var strDateTime = arrDate[0] + arrDate[1] + arrDate[2] + arrTime[0] + arrTime[1] + arrTime[2];
                    if (strTemp == "arrdte")
                        strDateTime = strDateTime.substring(0, strDateTime.length - 1);

                    return strDateTime;
                case "ddl":
                    return ($(objID).value == "-1" || $(objID).value == "") ? "" : $(objID).options[$(objID).selectedIndex].text;
                case "lab":
                    return $(objID).innerText;
                case "spa":
                    return $(str).innerText;
                default:
                    return $(objID).value;
            }
        }
        else
            return "";
    };

    this.trim = function(str) {
        return str.replace(/<<</g, '').replace(/>>>/g, '');
    };

    this.BindData = function() {
        with (this) {
            objCell.OpenFile(cllName, "");
            initCell(objCell);
            for (var x = 0; x < objCell.GetTotalSheets(); x++) {
                for (var y = 1; y < objCell.GetRows(x); y++) {
                    for (var z = 1; z < objCell.GetCols(x); z++) {
                        var strValue = objCell.GetCellString(z, y, x);
                        if (strValue.indexOf("<<<") > -1) {
                            strValue = parseString(strValue);
                            objCell.S(z, y, x, strValue);
                        }
                    }
                }
            }
        }
        if (typeof (OnCellBind) != 'undefined')
            OnCellBind();
    };

    this.parseString = function(strData) {
        with (this) {
            var strTemp = "";
            var strNode = "";
            while (strData.indexOf("<<<") > -1) {
                strTemp += strData.substring(0, strData.indexOf(">>>") + 3);
                strNode = strTemp.substring(strTemp.indexOf("<<<"), strTemp.indexOf(">>>") + 3)
                strData = strData.substring(strData.indexOf(">>>") + 3);
                var strNodeID = trim(strNode).split(",")[0];
                var strNodeType = trim(strNode).split(",")[1];

                strTemp = strTemp.replace(strNode, parseCell(strNodeID, strNodeType));
            }
            strTemp += strData.substring(0, strData.length);
            return strTemp;
        }
    }
}


var CellAssist =
{
    load: function(objCell) {
        function MakeTable() {
            var tblCell = document.createElement("TABLE");
            return tblCell.outerHTML;


        }


        this.$ = function(id) { document.getElementById(id); };
        this.oCell = this.$(objCell);
        this.parseString = function(strCellName) {
            //LoadCell(strCellName);
            document.write(MakeTable());
            //ViewData();
        };
        this.Print = function(type) {
            ViewData();
            this.oCell.PrintPreview(1, this.oCell.GetCurSheet());
        }
        this.Export = function() {
            ViewData();
            Ysh.CC2000.exportExcel(this.oCell);
        }
    }
};

