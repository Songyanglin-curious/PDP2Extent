// JScript File -- Edit by Gud
function FlowGnrSetting() {
    this.IsValid = function () { return this.ok; }
    this.SetValid = function (b) { this.ok = b; }
    this.ReadInt = function (v) { var n = parseInt(v, 10); if (isNaN(v)) return ""; return v; }
    this.GetXml = function () {
        if (!this.IsValid())
            return "";
        return "<" + this.GetTagName() + ">" + this.GetInnerXml() + "</" + this.GetTagName() + ">";
    }
    this.ReadXml = function (nd) {
        this.SetValid(false);
        if (nd.tagName != this.GetTagName())
            return;
        if (!this.LoadDataFromXml(nd))
            return;
        this.SetValid(true);
    }
}

function ExtendObject(o, e) {
    for (var k in e) {
        o[k] = e[k];
    }
}

function FlowTimeSetting() {
    this.ok = true;
    this.rst = {
        ok: false, nDays: "", nHour: "", nMinute: ""
        , GetTagName: function () { return "rt"; }
        , GetInnerXml: function () { return "1," + this.nDays + "," + this.nHour + "," + this.nMinute;}
        , LoadDataFromXml: function (nd) {
            var arrInfo = nd.text.split(",");
            if (arrInfo.length != 4)
                return false;
            this.nDays = this.ReadInt(arrInfo[1]);
            this.nHour = this.ReadInt(arrInfo[2]);
            this.nMinute = this.ReadInt(arrInfo[3]);
            return true;
        }
    };
    this.cst = {
        ok: false
        , absJudge: {
            ok: false, nType: 1, nDays: "", nHour: "", nMinute: ""
            , GetTagName: function () { return "aj"; }
            , GetInnerXml: function () { return this.nType + "," + this.nDays + "," + this.nHour + "," + this.nMinute; }
            , LoadDataFromXml: function (nd) {
                var arrInfo = nd.text.split(",");
                if (arrInfo.length != 4)
                    return false;
                this.nType = this.ReadInt(arrInfo[0]);
                this.nDays = this.ReadInt(arrInfo[1]);
                this.nHour = this.ReadInt(arrInfo[2]);
                this.nMinute = this.ReadInt(arrInfo[3]);
                return true;
            }
        }
        , relJudge: {
            ok: false, nDays: "", nHour: "", nMinute: ""
            , GetTagName: function () { return "rj"; }
            , GetInnerXml: function () { return this.nDays + "," + this.nHour + "," + this.nMinute; }
            , LoadDataFromXml: function (nd) {
                var arrInfo = nd.text.split(",");
                if (arrInfo.length != 3)
                    return false;
                this.nDays = this.ReadInt(arrInfo[0]);
                this.nHour = this.ReadInt(arrInfo[1]);
                this.nMinute = this.ReadInt(arrInfo[2]);
                return true;
            }
        }
        , deal: {
            ok: false, type: "0", info: ""
            , GetTagName: function () { return "dl"; }
            , GetInnerXml: function () { return this.type + "," + this.info; }
            , LoadDataFromXml: function (nd) {
                var arrInfo = nd.text.split(",");
                if (arrInfo[0] != "") {
                    this.type = parseInt(arrInfo[0], 10);
                    if (isNaN(this.type))
                        return false;
                } else {
                    this.type = "0";
                }
                if (arrInfo.length > 1)
                    this.info = arrInfo[1];
                return true;
            }
        }
        , bSkipRest: false
        , GetTagName: function () { return "ct"; }
        , GetInnerXml: function () {
            var xml = this.absJudge.GetXml();
            xml += this.relJudge.GetXml();
            xml += this.deal.GetXml();
            xml += "<sr>" + (this.bSkipRest ? "1" : "0") + "</sr>";
            return xml;
        }
        , LoadDataFromXml: function (nd) {
            for (var i = 0; i < nd.childNodes.length; i++) {
                var ndChild = nd.childNodes.item(i);
                if (ndChild.tagName == this.absJudge.GetTagName()) {
                    this.absJudge.ReadXml(ndChild);
                } else if (ndChild.tagName == this.relJudge.GetTagName()) {
                    this.relJudge.ReadXml(ndChild);
                } else if (ndChild.tagName == this.deal.GetTagName()) {
                    this.deal.ReadXml(ndChild);
                } else if (ndChild.tagName == "sr") {
                    this.bSkipRest = (ndChild.text == "1");
                }
            }
            return true;
        }
    };
    this.ast = {
        ok: false, arrAlertInfo: ["", "", "", ""]
        , GetTagName: function () { return "at" }
        , GetInnerXml: function () {
            var str = "";
            for (var i = 0; i < this.arrAlertInfo.length; i++) {
                if (str != "") str += ",";
                if (this.arrAlertInfo[i] != "")
                    str += this.arrAlertInfo[i] + "," + (i + 1);
            }
            return str;
        }
        , LoadDataFromXml: function (nd) {
            var arrAlertInfoSetting = nd.text.split(',');
            for (var i = 0; (i + 1) < arrAlertInfoSetting.length; i += 2) {
                var nAlertLevel = parseInt(arrAlertInfoSetting[i + 1]);
                if (isNaN(nAlertLevel))
                    return false;
                if ((nAlertLevel <= 0) || (nAlertLevel > this.arrAlertInfo.length))
                    return false;
                this.arrAlertInfo[nAlertLevel - 1] = arrAlertInfoSetting[i];
            }
            return true;
        }
    };
    this.GetTagName = function () { return "d"; }
    this.GetInnerXml = function () {
        var xml = this.rst.GetXml();
        xml += this.cst.GetXml();
        xml += this.ast.GetXml();
        return xml;
    }
    this.LoadDataFromXml = function (nd) {
        for (var i = 0; i < nd.childNodes.length; i++) {
            var ndChild = nd.childNodes.item(i);
            if (ndChild.tagName == this.rst.GetTagName()) {
                this.rst.ReadXml(ndChild);
            } else if (ndChild.tagName == this.cst.GetTagName()) {
                this.cst.ReadXml(ndChild);
            } else if (ndChild.tagName == this.ast.GetTagName()) {
                this.ast.ReadXml(ndChild);
            }
        }
        return true;
    }
    //this.rst.prototype = new FlowGnrSetting();
    ExtendObject(this.rst, new FlowGnrSetting());
    //this.cst.prototype = new FlowGnrSetting();
    ExtendObject(this.cst, new FlowGnrSetting());
    //this.cst.absJudge.prototype = new FlowGnrSetting();
    ExtendObject(this.cst.absJudge, new FlowGnrSetting());
    //this.cst.relJudge.prototype = new FlowGnrSetting();
    ExtendObject(this.cst.relJudge, new FlowGnrSetting());
    //this.cst.deal.prototype = new FlowGnrSetting();
    ExtendObject(this.cst.deal, new FlowGnrSetting());
    //this.ast.prototype = new FlowGnrSetting();
    ExtendObject(this.ast, new FlowGnrSetting());
}
FlowTimeSetting.prototype = new FlowGnrSetting();