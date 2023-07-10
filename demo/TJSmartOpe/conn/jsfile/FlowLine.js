// JScript File -- Edit by Gud

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj)
                return i;
        }
        return -1;
    }
}

var nNodeWidth = 300;
var nNodeHeight = 200;
        
function LineNode() {
    this.arrPrev = [];
    this.arrNext = [];
    this.AddNext = function (item) {
        this.arrNext.push(item);
        item.arrPrev.push(this);
    }
    this.RemoveNext = function (item) {
        for (var i = 0; i < this.arrNext.length; i++) {
            if (this.arrNext[i] == item) {
                this.arrNext.splice(i, 1);
                return;
            }
        }
        for (var i = 0; i < item.arrPrev.length; i++) {
            if (item.arrPrev[i] == this) {
                item.arrPrev.splice(i, 1);
                break;
            }
        }
    }
    this.GetPrevList = function () {
        return this.arrPrev;
    }
    this.GetNext = function (idx) {
        if (idx < 0) return null;
        if (idx >= this.arrNext.length) return null;
        return this.arrNext[idx];
    }
    this.GetNextCount = function () {
        return this.arrNext.length;
    }
    this.step = null;
    this.state = 1;
    this.record = [];
    this.GetLastTime = function () {
        if (this.record.length == 0)
            return false;
        var tm = Date.parse(this.record[this.record.length - 1].time.replace("-", "/").replace("-", "/"));
        if (isNaN(tm))
            return false;
        return tm;
    }
    this.width = nNodeWidth;
    this.height = nNodeHeight;
    this.deep = -1;
    this.GetDeep = function () {
        if (this.deep < 0) {
            if (this.arrPrev.length == 0) {
                this.deep = 0;
            } else {
        var deep = 0;
        for (var i = 0; i < this.arrPrev.length; i++) {
            var deepPrev = this.arrPrev[i].GetDeep();
            if (deepPrev >= deep)
                deep = deepPrev + 1;
        }
                this.deep = deep;
            }
        }
        return this.deep;
    }
    this.GetMinDeep = function () {
        if (this.arrPrev.length == 0) return 0;
        var deep = this.arrPrev[0].GetDeep() + 1;
        for (var i = 1; i < this.arrPrev.length; i++) {
            var deepPrev = this.arrPrev[i].GetDeep() + 1;
            if (deepPrev < deep)
                deep = deepPrev + 1;
        }
        return deep;
    }
    this.GetStayTimes = function () {
        var tmLast;
        if (this.arrPrev.length == 0) {
            if (this.record.length <= 1)
                return "";
            tmLast = this.record[0].time;
        } else {
            tmLast = this.arrPrev[0].GetLastTime();
        }
        for (var i = 1; i < this.arrPrev.length; i++) {
            var tm = this.arrPrev[i].GetLastTime();
            if (tm === false)
                continue;
            if (tmLast === false) {
                tmLast = tm;
                continue;
            }
            if (tm > tmLast)
                tmLast = tm;
        }
        if (tmLast === false)
            return "";
        var tmThis = this.GetLastTime();
        if (tmThis === false)
            return "";
        var ss = parseInt((tmThis - tmLast) / 1000, 10);
        var dd = parseInt(ss / 86400, 10);
        var hh = parseInt((ss % 86400) / 3600, 10);
        var mm = parseInt((ss % 3600) / 60, 10);
        ss = ss % 60;
        var str = "";
        if (dd > 0)
            str += dd + "天";
        if (hh > 0)
            str += hh + "小时";
        if (mm > 0)
            str += mm + "分";
        //if (ss > 0)
        //    str += ss + "秒";
        if (str == "")
            return "不足1分";
        return str;
    }
}

function FlowLine() {
    this.FindFlowNode = function (id) { var step = g_Flow.getStep(id); if (null != step) return step;return new f_Step("", id, 1); }
    this.arrNodes = [];
    this.NewNode = function () {
        var node = new LineNode();
        node.x = 0;
        node.y = 0;
        node.strokeWeight = "1";
        node.textWeight = "1";
        node.GetActionVML = function (n0, n1) {
            var nTextWidth = 200;
            var nTextHeight = 90;
            var xStart = n0.x + parseInt(n0.width, 10) / 2;
            var yStart = n0.y + parseInt(n0.height, 10);
            var xEnd = n1.x + parseInt(n1.width, 10) / 2;
            var yEnd = n1.y;
            var pts = [xStart, yStart, xStart, yEnd - 50, xEnd, yEnd - 50, xEnd, yEnd];
            if (yStart < yEnd) {
                pts[5] -= 5;
                pts[7] -= 5;
            } else if (yStart > yEnd) {
                pts[5] += 5;
                pts[7] += 5;
            }
            var actionStr = "";
            var actionClr = "green";
            switch (n0.record[n0.record.length - 1].state) {
                case "-1":
                    actionStr = "创建";
                    break;
                case "1":
                    actionStr = "提交";
                    break;
                case "2":
                    actionStr = "打回";
                    if (n0.record[n0.record.length - 1].info)
                        actionStr += "<BR>(" + n0.record[n0.record.length - 1].info + ")";
                    actionClr = "gray";
                    break;
                case "3":
                    actionStr = "作废";
                    actionClr = "red";
                    break;
                case "4":
                    actionStr = "归档";
                    actionClr = "red";
                    break;
                case "5":
                    actionStr = "取回";
                    actionClr = "yellow";
                    break;
                default:
                    actionStr = "保存";
                    break;
            }
            return '<v:PolyLine filled="false" Points="' + getPointsStr(pts) + '" strokecolor="' + actionClr + '" strokeweight="1"><v:stroke EndArrow="Classic"/></v:PolyLine>'
            //+ '<v:Rect strokecolor="white" style="background-Color:Transparent;left:' + (xStart + 5) + ';top:' + (yStart - nTextHeight - 5) + ';width:' + (nTextWidth - 10) + 'px;height:' + nTextHeight + 'px"><v:textbox inset="1,1,1,1">' + n0.record[n0.record.length - 1].time + '</v:textbox></v:Rect>'
                + '<v:Rect strokecolor="white" style="background-Color:Transparent;left:' + (xStart - nTextWidth - 5) + ';top:' + (yStart + 20) + ';width:' + (nTextWidth - 10) + 'px;height:' + nTextHeight + 'px"><v:textbox inset="1,1,1,1">' + n0.record[n0.record.length - 1].time + '</v:textbox></v:Rect>'
                //+ '<v:Rect strokecolor="white" style="background-Color:Transparent;left:' + (xStart + 5) + ';top:' + (yStart + 5) + ';width:' + (nTextWidth - 10) + 'px;height:' + (nTextHeight + 35) + 'px"><v:textbox inset="1,1,1,1">' + n0.record[n0.record.length - 1].username + "<br>" + actionStr + '</v:textbox></v:Rect>';
                +'<v:Rect strokecolor="white" style="background-Color:Transparent;left:' + (xStart + 5) + ';top:' + (yStart + 20) + ';width:' + (nTextWidth - 10) + 'px;height:' + (nTextHeight + 35) + 'px"><v:textbox inset="1,1,1,1">' + n0.record[n0.record.length - 1].username + "<br>" + actionStr + '</v:textbox></v:Rect>';
        }
        node.IsOuttime = function () {
            if (this.record.length == 0)
                return false;
            return this.record[this.record.length - 1].outtime;
        }
        node.GetVML = function () {
            var txt = this.step.name;
            var strStay = this.GetStayTimes();
            if (strStay != "") {
                if (this.IsOuttime())
                    strStay += '<BR><font color=\'red\'>超时' + this.IsOuttime() + '</font>';
                txt += "<BR>" + strStay;
            }
            var str = this.step.getCoreVML("", g_Flow.cfg, txt, this.step.id + this.GetDeep(), this.x, this.y, 1, this.width, this.height, "", "", this.strokeWeight, this.textWeight);
            for (var i = 0; i < this.GetNextCount(); i++)
                str += this.GetActionVML(this, this.GetNext(i));
            return str;
        }
        this.arrNodes.push(node);
        return node;
    }
    this.root = null;
    this.arrLast = [];
    this.Load = function (arrHisNode) {
        if (arrHisNode.length == 0)
            return null;
        var n = arrHisNode[0];
        this.root = this.NewNode();
        this.root.step = this.FindFlowNode(n.node);
        this.root.state = n.state;
        this.root.record.push(n);
        this.arrLast = [this.root];
        for (var i = 1; i < arrHisNode.length; i++) {
            var n = arrHisNode[i];
            switch (n.type) {
                case "2":
                    this.LoadJudgeNode(n);
                    break;
                case "1":
                    this.LoadAction(n);
                    break;
                default: //"0"
                    this.LoadStepNode(n);
                    break;
            }
        }
    }
    this.FindLastNode = function (id) {
        for (var i = 0; i < this.arrLast.length; i++) {
            var n = this.arrLast[i];
            if (n.step != null) {
                if (n.step.id == id)
                    return n;
            }
        }
        return null;
    }
    this.RemoveLastNode = function (obj) {
        for (var i = 0; i < this.arrLast.length; i++) {
            if (this.arrLast[i] == obj)
                break;
        }
        if (i != this.arrLast.length)
            this.arrLast.splice(i, 1);
    }
    this.LoadStepNode = function (n) {
        switch (n.state) {
            case "-1": //Create
                return;
            case "1": //Pass
                var node = this.FindLastNode(n.node);
                if (node == null)
                    return;
                node.record.push(n);
                this.RemoveLastNode(node);
                var arrNext = n.data.split(',');
                for (var j = 0; j < arrNext.length; j++) {
                    if (arrNext[j] == "")
                        continue;
                    var thisNode = this.FindLastNode(arrNext[j]);
                    if (thisNode != null) {
                        var tempNode = node;
                        while (tempNode != null) {
                            if (tempNode == thisNode) {
                                thisNode = null;
                                break;
                            }
                            if (tempNode.GetPrevList().length == 0)
                                tempNode = null;
                            else
                                tempNode = tempNode.GetPrevList()[0]; //这儿有问题
                        }
                        node.AddNext(thisNode);
                        //this.arrLast.push(thisNode);
                    } else {
                        thisNode = this.NewNode();
                        thisNode.step = this.FindFlowNode(arrNext[j]);
                        node.AddNext(thisNode);
                        this.arrLast.push(thisNode);
                    }
                }
                break;
            case "2": //Kickback
                var node = this.FindLastNode(n.node);
                if (node == null)
                    return;
                node.record.push(n);
                this.RemoveLastNode(node);
                var thisNode = this.NewNode();
                thisNode.step = this.FindFlowNode(n.data);
                node.AddNext(thisNode);
                this.arrLast.push(thisNode);
                return;
            case "3": //Invalid
                var node = this.FindLastNode(n.node);
                if (node == null)
                    return;
                node.record.push(n);
                var thisNode = this.NewNode();
                thisNode.step = new f_Step("flownode_invalid", "作废", 1);
                node.AddNext(thisNode);
                return;
            case "4": //Finish
                break;
            case "5": //Getback
                for (var j = 0; j < this.arrLast.length; j++) {
                    var thisLast = this.arrLast[j];
                    for (var k = 0; k < thisLast.GetPrevList().length; k++) {
                        var thisPrev = thisLast.GetPrevList()[k];
                        if (thisPrev.step.id == n.node) {
                            var node = this.arrLast[j];
                            var thisNode = this.NewNode();
                            thisNode.step = this.FindFlowNode(n.node);
                            thisNode.state = n.state;
                            //thisNode.record.push(n);
                            node.record.push(n);
                            node.AddNext(thisNode);
                            this.RemoveLastNode(node);
                            this.arrLast.push(thisNode);
                            break;
                        }
                    }
                }
                break;
            default: //Save
                var node = this.FindLastNode(n.node);
                if (node == null)
                    return;
                node.record.push(n);
                return;
        }
    }
    this.LoadAction = function (n) {
    }
    this.LoadJudgeNode = function (n) {
    }
    this.GetDeepPoints = function () {
        var arrDeep = [];
        for (var i = 0; i < this.arrNodes.length; i++) {
            var n = this.arrNodes[i];
            var deepMin = n.GetMinDeep();
            var deepMax = n.GetDeep();
            for (var deep = deepMin; deep <= deepMax; deep++) {
                if (arrDeep.length <= deep) {
                    for (var j = arrDeep.length; j <= deep; j++)
                        arrDeep.push([0, []]);
                }
                arrDeep[deep][0]++;
                arrDeep[deep][1].push(n);
            }
        }
        return arrDeep;
    }
    this.ResetNodePosition = function () {
        var arrDeep = this.GetDeepPoints();
        if (arrDeep.length == 0)
            return;
        var nYOffset = 230;
        var m = 0;
        for (var i = 0; i < arrDeep.length; i++) {
            if (arrDeep[i][0] > m)
                m = arrDeep[i][0];
        }
        for (var i = 0; i < arrDeep.length; i++) {
            var n = arrDeep[i][0];
            var a = (2 * m - n + 1) / (n + 1) * nNodeWidth;
            var nodes = arrDeep[i][1];
            for (var j = 0; j < nodes.length; j++) {
                var o = nodes[j];
                //o.x = i * nXOffset + (i + 1) * nNodeWidth; //(2 * i + 1) * 200;
                //o.y = (j + 1) * a + j * nNodeHeight;
                o.x = (j + 1) * a + j * nNodeWidth;
                o.y = i * nYOffset + (i + 1) * nNodeHeight; 
            }
        }
    }
    this.MoveToMiddle = function (yMax) {
        var vShowMax = 0;
        for (var i = 0; i < this.arrNodes.length; i++) {
            var n = this.arrNodes[i];
            if (n.y > vShowMax)
                vShowMax = n.y;
        }
        if (vShowMax + 200 > yMax) //超出
            return;
        var offset = (yMax - vShowMax) / 2 - 100;
        for (var i = 0; i < this.arrNodes.length; i++)
            this.arrNodes[i].y += offset;
    }
    this.GetVML = function () {
        var strVML = "";
        for (var i = 0; i < this.arrNodes.length; i++) {
            strVML += this.arrNodes[i].GetVML();
        }
        return strVML;
    }
}