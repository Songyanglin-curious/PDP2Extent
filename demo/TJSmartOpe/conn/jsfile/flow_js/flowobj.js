// JScript File -- Edit by Gud
function findById(arr, id) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == id)
            return arr[i];
    }
    return null;
}

function findByRef(arr, el) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == el)
            return i;
    }
    return -1;
}

function removeElement(arr, el) {
    for (var i = 0, n = 0; i < arr.length; i++) {
        if (arr[i] != el)
            arr[n++] = arr[i];
    }
    arr.length = n;
}

function f_Point() {
    this.x = 0;
    this.y = 0;

    this.parse = function (str) {
        var idx = str.indexOf(",");
        if (idx < 0) {
            this.x = 0;
            this.y = 0;
        } else {
            this.x = parseInt(str.slice(0, idx));
            this.y = parseInt(str.slice(idx + 1, str.length));
        }
    }

    this.toString = function () {
        return this.x + "," + this.y;
    }
}

function f_GnrObject() {
    this.getEPXML = function () {
        var xml = "<EP>";
        for (var key in this.eps) {
            if (key == "")
                continue;
            xml += "<" + key + "><![CDATA[" + this.eps[key] + "]]></" + key + ">";
        }
        return xml + "</EP>";
    }
    this.getEP = function (key) {
        return this.eps[key];
    }
    this.setEP = function (key, value) {
        this.eps[key] = value;
    }
    this.loadFromXml = function (nd) {
        /*
        for (var key in this.eps) {
        if (key == "")
        continue;
        this.eps[key] = getFirstTagAttr(nd, "EP", key);
        }*/
        var ndEP = getFirstTag(nd, "EP");
        for (var key in this.eps) {
            if (key == "")
                continue;
            var ndField = getFirstTag(ndEP, key);
            if (ndField != null) {
                if ((ndField.childNodes.length > 0) && (ndField.childNodes.item(0).nodeType == 4)) {
                    this.eps[key] = ndField.childNodes.item(0).data;
                } else {
                    this.eps[key] = getInnerXml(ndField);
                }
            }
        }
    }
}

function f_FlowGnrStep() {
    this.eps = function () { };
    this.eps["statesetting"] = "";
    this.eps["outtimeinfo"] = "";
    this.eps["dealtype"] = "";
    this.eps["alldone"] = "";
    this.eps["groupname"] = "";
    this.eps["pagefile"] = "";
    this.eps["listfile"] = "";
    this.eps["printfile"] = "";
    this.eps["backend"] = "";
    this.eps["invalidend"] = "";
    this.eps["passend"] = "";
    this.type = "2";
    this.isBack = "0";
    this.backNode = "";
    this.isGetBack = "0";
    this.isDelete = "0";
    this.isInvalid = "0";
    this.outTime = "";
    this.bits = "";
    this.users = "";
    this.userLimit = "";
    this.dataIDs = "";
    this.title = "";
    this.showIndex = "0";
    this.outTimeDeal = "";
    this.recvTime = "";
    this.alertInfo = "";
    this.subFlowId = "";
    this.skipRest = "";

    this.getXML = function (subnodes) {
        return "<FP flowStep='" + this.type + "' isback='" + this.isBack + "' backnode='" + this.backNode
			+ "' isgetback='" + this.isGetBack + "' isdelete='" + this.isDelete + "' isinvalid='" + this.isInvalid
			+ "' outtime='" + this.outTime + "' subnodes='" + subnodes + "' showindex='" + this.showIndex + "' outtimedeal='" + this.outTimeDeal
			+ "' recvtime='" + this.recvTime + "' alertinfo='" + this.alertInfo + "' subflowid='" + this.subFlowId + "' skiprest='" + this.skipRest
			+ "' /><UP bits='" + this.bits + "' users='" + this.users + "' userlimit='" + this.userLimit + "' dataids='" + this.dataIDs + "' />" + this.getEPXML();
    }

    this.getVML = function (text, styleHTML, textStyleHTML, shadowHTML, gradientHTML, step3DHTML, textColor, eventstr) {
        var shape = (this.type == "2") ? "v:RoundRect" : "v:Oval";
        var title = this.title;
        if (title == "") title = text;
        if ((this.showIndex != "") && (this.showIndex != "0"))
            text = this.showIndex + "." + text;
        var strVML = '<' + shape + ' ' + styleHTML + ' ' + eventstr + ' title="' + title + '">' + shadowHTML + step3DHTML + gradientHTML
			+ '<v:TextBox inset="1pt,5pt,1pt,5pt" ' + textStyleHTML + '>'
			+ '<table style="width:100%;height:100%"><tr><td style="';
        if (this.subFlowId != "") {
            strVML += 'background-image:url(\'/i/subflow.jpg\');background-repeat:no-repeat;background-position:center center';
        }
        strVML += 'text-align:center;text-valign:middle;color:' + textColor + '">' + text;
        strVML += '</td></tr></table></v:TextBox></' + shape + '>';
        return strVML;
    }
}
f_FlowGnrStep.prototype = new f_GnrObject();

function f_FlowJdgStep() {
    this.eps = function () { };
    this.eps["dealtype"] = "";
    this.defValue = "1";
    this.isAlwaysJudge = "0";

    this.getXML = function (subnodes) {
        return "<FP defaultvalue='" + this.defValue + "' isalwaysjudge='" + this.isAlwaysJudge + "' subnodes='" + subnodes + "' />" + this.getEPXML();
    }

    this.getVML = function (text, styleHTML, textStyleHTML, shadowHTML, gradientHTML, step3DHTML, textColor, eventstr) {
        return '<v:Shape ' + styleHTML + ' coordsize = "2,2" path=" m 0 1 l 1 0,2 1,1,2 x e" ' + eventstr + '>'
			+ shadowHTML + step3DHTML + gradientHTML + '<v:TextBox inset="2pt,5pt,2pt,5pt" ' + textStyleHTML + '>'
			+ '<table style="width:100%;height:100%"><tr><td style="text-align:center;text-valign:middle;color:'
			+ textColor + '">' + text + '</td></tr></table></v:TextBox></v:Shape>';
    }
}
f_FlowJdgStep.prototype = new f_GnrObject();

function f_Step(id, name, type) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.textWeight = "";
    this.strokeColor = "";
    this.strokeWeight = "";
    this.isFocused = "";
    this.width = "200";
    this.height = "150";
    this.x = "0";
    this.y = "0";
    this.show = "1";
    this.zIndex = "";
    if (type == "1")
        this.flowStep = new f_FlowGnrStep();
    else
        this.flowStep = new f_FlowJdgStep();

    this.shape = null;
    this.getShape = function (cfg) {
        var scale = 1;
        if (this.shape == null)
            if (this.type == "1")
                this.shape = {
                    "type": "roundRect",
                    "orderType": 2,
                    "roundRadius": 20,
                    "color": cfg.stepClr2
                };
            else
                this.shape = {
                    "type": "diamond",
                    "orderType": 3,
                    "color": cfg.stepClr2
                };
        this.shape.id = this.id;
        this.shape.name = this.name;
        this.shape.width = parseInt(this.width);
        this.shape.height = parseInt(this.height);
        this.shape.position_X = parseInt(this.x);
        this.shape.position_Y = parseInt(this.y);
        this.shape.scale = scale;
        this.shape.flowobj = this;
        return this.shape;
    }

    this.entryActions = new Array();
    this.exitActions = new Array();

    this.getEntryCount = function () { return this.entryActions.length; }
    this.getExitCount = function () { return this.exitActions.length; }
    this.entry = function (i) { return this.entryActions[i]; }
    this.exit = function (i) { return this.exitActions[i]; }
    this.addEntry = function (action) { this.entryActions.push(action); }
    this.addExit = function (action) { this.exitActions.push(action); }
    this.delEntry = function (Action) { removeElement(this.entryActions, Action); }
    this.delExit = function (Action) { removeElement(this.exitActions, Action); }

    this.getSubNodes = function (subNodes) {
        for (var i = 0; i < this.entryActions.length; i++) {
            var sub = this.entryActions[i].fromStep;
            if (findByRef(subNodes, sub) < 0) {
                subNodes.push(sub);
                sub.getSubNodes(subNodes);
            }
        }
    }
    
    this.getNextNodes = function (nextNodes) {
        for (var i = 0;i < this.exitActions.length;i++) {
            var next = this.exitActions[i].toStep;
            if (next.type == "1") {
                if (findByRef(nextNodes,next) < 0)
                    nextNodes.push(next);
            } else {
                next.getNextNodes(nextNodes);
            }
        }
    }

    this.getXML = function () {
        var subNodes = new Array();
        this.getSubNodes(subNodes);
        var subnodestr = "";
        if (subNodes.length != 0) {
            subnodestr = ",";
            for (var i = 0; i < subNodes.length; i++)
                subnodestr += subNodes[i].id + ",";
        }
        return "<Step><BP id='" + this.id + "' text='" + this.name + "' stepType='" + this.type + "'/><VP textWeight='"
		+ this.textWeight + "' strokeWeight='" + this.strokeWeight + "' isFocused='" + this.isFocused + "' width='"
		+ this.width + "' height='" + this.height + "' x='" + this.x + "' y='" + this.y + "' show='" + this.show + "' zIndex='"
		+ this.zIndex + "'/>" + this.flowStep.getXML(subnodestr) + "</Step>";
    }

    this.getBorderClr = function (cfg) {
        if (this.type == "1") {
            if (this.flowStep.type != "2")
                return cfg.sStepBorderClr;
        }
        return cfg.stepBorderClr;
    }

    this.getCoreVML = function (eventstr, cfg, txt, id, x, y, z, w, h, borderColor, textColor, borderWeight, textWeight) {
        var stepBorderClr = cfg.stepBorderClr;
        var stepTxtClr = cfg.stepTxtClr;
        var stepClr1 = cfg.stepClr1;
        var stepClr2 = cfg.stepClr2;
        if (this.type == "1") {
            if (this.flowStep.type != "2") {
                stepBorderClr = cfg.sStepBorderClr;
                stepTxtClr = cfg.sStepTxtClr;
                stepClr1 = "#30610b";
                stepClr2 = "#a2c329";
            }
        } else {
            stepBorderClr = "#ff9a00";
            stepClr1 = "#ff6f00";
            stepClr2 = "#ff9a00";
        }
        if (borderColor != "")
            stepBorderClr = borderColor;
        if (textColor != "")
            stepTxtClr = textColor;
        var styleHTML = 'id=' + id + ' style="z-index:' + z
			+ ';position_dump:absolute;width:' + w + ';height:' + h + ';left:' + x + ';top:' + y
			+ ';" strokeweight="' + borderWeight + '" strokecolor="' + stepBorderClr + '"';
        var textStyleHTML = 'style="text-align:center; color:' + stepTxtClr + '; font-size:' + textWeight + ';"';
        var shadowHTML = '<v:shadow on="' + cfg.isStepShadow + '" type="single" color="' + cfg.stepShadowClr + '" offset="5px,5px"/>'
            + ((this.flowStep.eps["dealtype"] == "1") ? '<v:stroke dashstyle="LongDash" />' : '');
        var gradientHTML = '<v:fill type="gradient" color="' + stepClr1 + '" color2="' + stepClr2 + '" />';
        var step3DHTML = '<v:extrusion on="' + cfg.isStep3D + '" backdepth="' + cfg.step3DDepth + '" />';
        return this.flowStep.getVML(txt, styleHTML, textStyleHTML, shadowHTML, gradientHTML, step3DHTML, stepTxtClr, eventstr);
    }

    this.getVML = function (eventstr, cfg) {
        var nShowState = parseInt(this.show);
        if (isNaN(nShowState) || (nShowState <= 0))
            return "";
        return this.getCoreVML(eventstr, cfg, this.name, this.id, this.x, this.y, this.zIndex, this.width, this.height, this.strokeColor, "", this.strokeWeight, this.textWeight);
    }
}

function f_Action(id, name, fromStep, toStep) {
    this.eps = function () { };
    this.eps["statejudge"] = "";
    this.eps["statesetting"] = "";
    this.eps["dealtype"] = "";
    this.eps["passend"] = "";
    this.id = id;
    this.name = name;
    this.fromStep = fromStep;
    this.toStep = toStep;
    this.type = "";
    this.drawDir = 1;
    this.startArrow = "";
    this.endArrow = "Classic";
    this.strokeColor = "";
    this.strokeWeight = "";
    this.isFocused = "";
    this.zIndex = "";
    this.judgeResult = "1";
    this.isRemark = "0";
    this.isToNext = "1";
    this.isOptional = "0";
    this.isAuto = "0";
    this.isToMen = "0";
    this.title = "";
    this.text = "";
    this.isWait = "0";
    this.css = "";

    this.getXML = function () {
        return "<Action><BP id='" + this.id + "' text='" + this.name + "' from='"
			+ this.fromStep.id + "' to='" + this.toStep.id + "'/><VP drawDir='" + this.drawDir + "' startArrow='" + this.startArrow + "' endArrow='"
			+ this.endArrow + "' strokeColor='" + this.strokeColor + "' strokeWeight='" + this.strokeWeight + "' isFocused='"
			+ this.isFocused + "' zIndex='" + this.zIndex + "'/><FP judgeresult='" + this.judgeResult + "' isremark='" + this.isRemark
			+ "' istonext='" + this.isToNext + "' isshow='" + (1 - parseInt(this.isAuto)) + "' istomen='" + this.isToMen
            + "' iswait='" + this.isWait + "' css='" + this.css + "' optional='" + this.isOptional + "' />" + this.getEPXML() + "</Action>";
    }

    this.getShape = function (cfg) {
        var actionClr = (this.strokeColor == "") ? cfg.actionClr : this.strokeColor;
        var scaleline = 5;
        return {
            flowobj:this,
            "type": "arrowLine",
            "id": this.id,
            "name": this.name,
            "start": this.fromStep.getShape(),
            "end": this.toStep.getShape(),
            "linePoints": "",
            "drawDir": parseInt(this.drawDir),
            "isWait": this.isWait,
            "color": actionClr,
            "scale": scaleline,
            "arrowWidth": 5,
            "arrowHeight": 5
        };
    }

    this.getActionPoints = function () {
        var linkType = this.drawDir;
        var actionType = this.actionType;
        if (this.fromStep == this.toStep)
            return [];
        if (linkType == -1) {
            var pts = this.css.split(",");
            pts.splice(0, 1);
            return pts;
        }
        var fromStepWidth = parseInt(this.fromStep.width);
        var fromStepHeight = parseInt(this.fromStep.height);
        var fromStepX = parseInt(this.fromStep.x);
        var fromStepY = parseInt(this.fromStep.y);
        var toStepWidth = parseInt(this.toStep.width);
        var toStepHeight = parseInt(this.toStep.height);
        var toStepX = parseInt(this.toStep.x);
        var toStepY = parseInt(this.toStep.y);
        return getPolyLineActionPoints(linkType, fromStepX, fromStepY, fromStepWidth, fromStepHeight, toStepX, toStepY, toStepWidth, toStepHeight);
    }

    this.getJudgeText = function () {
        var str = this.eps["statejudge"];
        if (str == "")
            return str;
        var arrReplace = [["\\|\\|", "或"], ["&&", "且"], ["==", "等于"], ["!=", "不等于"], ["<>", "不等于"], ["!", "不"], [">", "大于"], ["<", "小于"]];
        var arrStateStr = g_Flow.cfg.eps["states"].split(',');
        for (var i = 0; i < arrStateStr.length; i++) {
            var arr = arrStateStr[i].split(":");
            if (arr.length > 2) {
                arrReplace.push(["[" + arr[0] + "]", arr[2]]);
            }
        }
        for (var i = 0; i < arrReplace.length; i++) {
            var arr = arrReplace[i];
            eval("str = str.replace(/\\" + arr[0] + "/g,\"" + arr[1] + "\");");
        }
        return str;
    }

    this.getVML = function (eventstr, cfg) {
        var pts = this.getActionPoints();
        var id = this.id;
        var actionClr = (this.strokeColor == "") ? cfg.actionClr : this.strokeColor;
        var title = id;
        if (this.title != "") {
            title = this.title;
        }
        var showtext = "";
        if (this.text != "")
            showtext += this.text;
        if (this.eps["statejudge"] != "")
            showtext += this.getJudgeText(); // this.eps["statejudge"];
        if (showtext != "") {
            showtext = "<v:textbox>" + showtext + "</v:textbox>";
        }
        var html = (this.type == 'Line')
		    ? '<v:line id=' + id + ' title="' + title + '" style="z-index:' + this.zIndex + ';position_dump:absolute;" ' + getPointsStr(pts)
			    + ' strokecolor="' + actionClr + '" strokeweight="' + this.strokeWeight + '" ' + eventstr
			    + '><v:stroke StartArrow="' + ((this.isWait == "1") ? "Diamond" : this.startArrow) + '" EndArrow="' + this.endArrow + '"/>' + showtext + '</v:line>'
		    : '<v:PolyLine id=' + id + ' title="' + title + '" filled="false" Points="' + getPointsStr(pts) + '" style="z-index:'
			    + this.zIndex + ';position_dump:absolute;" strokecolor="' + actionClr + '" strokeweight="' + this.strokeWeight
			    + '" ' + eventstr + '><v:stroke StartArrow="' + ((this.isWait == "1") ? "Diamond" : this.startArrow) + '" EndArrow="' + this.endArrow + '" ' +
                ((this.eps["dealtype"] == "1") ? 'dashstyle="LongDash"' : '') + ' />' + showtext + '</v:PolyLine>';
        /*
        var showtext = "";
        if (this.text != "")
        showtext += this.text;
        if (this.eps["statejudge"] != "")
        showtext += this.getJudgeText(); // this.eps["statejudge"];
        if (showtext != "") {
        var width = showtext.length * 20 + 30;
        html += '<v:Rect id="text_' + id + '" strokecolor="white" style="background-Color:Transparent;position_dump:absolute;left:'
        + (pts[0] + 5) + ';top:' + (pts[1] + 5) + ';width:' + width + 'px;height:50px"><v:textbox style="background-Color:Transparent;" inset="1,1,1,1">' + showtext
        + '</v:textbox></v:Rect>';
        }*/
        if (this.fromStep.type != "2") {
            delete pts;
            return html;
        }
        var textpts = getTextPoints(pts);
        var x = 0, y = 0, txt = "";
        if (textpts.length != 0) {
            x = textpts[0];
            y = textpts[1];
            txt = (this.judgeResult == "1") ? "是" : "否";
        }
        delete textpts;
        delete pts;
        return html + '<v:Rect id="judgeresult' + id + '" strokecolor="white" style="background-Color:Transparent;position_dump:absolute;left:'
		    + x + ';top:' + y + ';width:30px;height:50px"><v:textbox inset="1,1,1,1">' + txt
		    + '</v:textbox></v:Rect>';
    }
}
f_Action.prototype = new f_GnrObject();

function f_FlowCfg() {
    this.eps = function () { };
    this.eps["exceptrelated"] = "0";
    this.eps["states"] = "";
    this.eps["pagefile"] = "";
    this.eps["listfile"] = "";
    this.eps["printfile"] = "";
    this.stepTxtClr = "black";
    this.stepBorderClr = "blue";
    this.stepFocusClr = "#ea7918"; //"yellow";
    this.actionClr = "blue";
    this.actionFocusClr = "green";
    this.sStepTxtClr = "#123456";
    this.sStepBorderClr = "red";
    this.stepClr1 = "white";
    this.actionTxtClr = "black";
    this.stepShadowClr = "#b3b3b3";
    this.isStepShadow = 0;
    this.stepClr2 = "#74bed4";
    this.isStep3D = 1;
    this.step3DDepth = 20;
    this.bits = "";
    this.users = "";
    this.dataIDs = "";
    this.watchBits = "";
    this.watchUsers = "";

    this.getXML = function () {
        return "<VP stepTextColor='" + this.stepTxtClr + "' stepStrokeColor='" + this.stepBorderClr
			+ "' stepFocusedStrokeColor='" + this.stepFocusClr + "' actionStrokeColor='" + this.actionClr
			+ "' actionFocusedStrokeColor='" + this.actionFocusClr + "' sStepTextColor='" + this.sStepTxtClr
			+ "' sStepStrokeColor='" + this.sStepBorderClr + "' stepColor1='" + this.stepClr1 + "' actionTextColor='"
			+ this.actionTxtClr + "' stepShadowColor='" + this.stepShadowClr + "' isStepShadow='" + this.isStepShadow
			+ "' stepColor2='" + this.stepClr2 + "' isStep3D='" + this.isStep3D + "' step3DDepth='" + this.step3DDepth
			+ "' dataIDs='" + this.dataIDs + "' bits='" + this.bits + "' users='" + this.users
			+ "' watchbits='" + this.watchBits + "' watchusers='" + this.watchUsers + "'/><FP />" + this.getEPXML();
    }
}
f_FlowCfg.prototype = new f_GnrObject();

function f_Flow() {
    this.isNew = "1";
    this.id = "";
    this.name = "";
    this.sign = "";
    this.cfg = new f_FlowCfg();

    this.Steps = new Array();
    this.Actions = new Array();

    this.getStepCount = function () { return this.Steps.length; }
    this.getActionCount = function () { return this.Actions.length; }
    this.step = function (i) { return this.Steps[i]; }
    this.action = function (i) { return this.Actions[i]; }
    this.getStep = function (id) { return findById(this.Steps, id); }
    this.getAction = function (id) { return findById(this.Actions, id); }
    this.addStep = function (id, name, type) { var Step = new f_Step(id, name, type); this.Steps.push(Step); return Step; }
    this.addGnrStep = function (id, name) { return this.addStep(id, name, 1); }
    this.addJdgStep = function (id, name) { return this.addStep(id, name, 2); }

    this.addAction = function (id, name, fromStep, toStep) {
        var Action = new f_Action(id, name, fromStep, toStep);
        this.Actions.push(Action);
        fromStep.addExit(Action);
        toStep.addEntry(Action);
        return Action;
    }

    this.delStep = function (Step) {
        if (null == Step)
            return;
        this.delActions(Step);
        removeElement(this.Steps, Step);
    }

    this.delAction = function (Action) {
        if (null == Action)
            return;
        Action.fromStep.delExit(Action);
        Action.toStep.delEntry(Action);
        removeElement(this.Actions, Action);
    }

    this.delActions = function (Step) {
        if (null == Step)
            return;
        while (Step.getEntryCount() > 0)
            this.delAction(Step.entry(0));
        while (Step.getExitCount() > 0)
            this.delAction(Step.exit(0));
    }

    this.getXML = function () {
        var xmlSteps = "";
        for (var i = 0; i < this.getStepCount(); i++)
            xmlSteps += this.step(i).getXML();
        var xmlActions = "";
        for (var j = 0; j < this.getActionCount(); j++)
            xmlActions += this.action(j).getXML();
        var xmlCfg = "<FlowConfig><BP flowId='" + this.id + "' flowText='" + this.name + "' flowSign='" + this.sign + "' isNew='" + this.isNew + "' />" + this.cfg.getXML() + "</FlowConfig>";
        return "<WebFlow>" + xmlCfg + "<Steps>" + xmlSteps + "</Steps><Actions>" + xmlActions + "</Actions></WebFlow>";
    }

    this.LoadFromXML = function (xmlRoot) {
        var Cfg = getFirstTag(xmlRoot, "FlowConfig");
        var Steps = getFirstTag(xmlRoot, "Steps");
        var Actions = getFirstTag(xmlRoot, "Actions");

        this.id = getFirstTagAttr(Cfg, "BP", "flowId");
        this.name = getFirstTagAttr(Cfg, "BP", "flowText");
        this.sign = getFirstTagAttr(Cfg, "BP", "flowSign");
        this.isNew = getFirstTagAttr(Cfg, "BP", "isNew");
        this.cfg.stepBorderClr = getFirstTagAttr(Cfg, "VP", "stepStrokeColor");
        this.cfg.stepTxtClr = getFirstTagAttr(Cfg, "VP", "stepTextColor");
        this.cfg.actionClr = getFirstTagAttr(Cfg, "VP", "actionStrokeColor");
        this.cfg.sStepBorderClr = getFirstTagAttr(Cfg, "VP", "sStepStrokeColor");
        this.cfg.sStepTxtClr = getFirstTagAttr(Cfg, "VP", "sStepTextColor");
        this.cfg.stepShadowClr = getFirstTagAttr(Cfg, "VP", "stepShadowColor");
        this.cfg.isStepShadow = getFirstTagAttr(Cfg, "VP", "isStepShadow");
        //this.stepFocusClr = getFirstTagAttr(Cfg, "VP", "stepFocusedStrokeColor");
        this.cfg.stepClr1 = getFirstTagAttr(Cfg, "VP", "stepColor1");
        //this.cfg.stepClr2 = getFirstTagAttr(Cfg, "VP", "stepColor2");
        this.cfg.isStep3D = getFirstTagAttr(Cfg, "VP", "isStep3D");
        this.cfg.step3DDepth = getFirstTagAttr(Cfg, "VP", "step3DDepth");
        this.cfg.actionFocusClr = getFirstTagAttr(Cfg, "VP", "actionFocusedStrokeColor");
        this.cfg.dataIDs = getFirstTagAttr(Cfg, "VP", "dataIDs");
        this.cfg.bits = getFirstTagAttr(Cfg, "VP", "bits");
        this.cfg.users = getFirstTagAttr(Cfg, "VP", "users");
        this.cfg.watchBits = getFirstTagAttr(Cfg, "VP", "watchbits");
        this.cfg.watchUsers = getFirstTagAttr(Cfg, "VP", "watchusers");
        this.cfg.loadFromXml(Cfg);

        for (var i = 0; i < Steps.childNodes.length; i++) {
            var StepNode = Steps.childNodes.item(i);
            var stepType = getFirstTagAttr(StepNode, "BP", "stepType");
            var Step = this.addStep(getFirstTagAttr(StepNode, "BP", "id"), getFirstTagAttr(StepNode, "BP", "text"), stepType);
            Step.textWeight = getFirstTagAttr(StepNode, "VP", "textWeight");
            Step.strokeWeight = getFirstTagAttr(StepNode, "VP", "strokeWeight");
            Step.isFocused = getFirstTagAttr(StepNode, "VP", "isFocused");
            Step.width = getFirstTagAttr(StepNode, "VP", "width");
            Step.height = getFirstTagAttr(StepNode, "VP", "height");
            Step.x = getFirstTagAttr(StepNode, "VP", "x");
            Step.y = getFirstTagAttr(StepNode, "VP", "y");
            Step.show = getFirstTagAttr(StepNode, "VP", "show");
            Step.zIndex = getFirstTagAttr(StepNode, "VP", "zIndex");
            if (stepType == "1") {
                Step.flowStep.type = getFirstTagAttr(StepNode, "FP", "flowStep");
                Step.flowStep.isBack = getFirstTagAttr(StepNode, "FP", "isback");
                Step.flowStep.backNode = getFirstTagAttr(StepNode, "FP", "backnode");
                Step.flowStep.isGetBack = getFirstTagAttr(StepNode, "FP", "isgetback");
                Step.flowStep.isDelete = getFirstTagAttr(StepNode, "FP", "isdelete");
                Step.flowStep.isInvalid = getFirstTagAttr(StepNode, "FP", "isinvalid");
                Step.flowStep.outTime = getFirstTagAttr(StepNode, "FP", "outtime");
                Step.flowStep.bits = getFirstTagAttr(StepNode, "UP", "bits");
                Step.flowStep.users = getFirstTagAttr(StepNode, "UP", "users");
                Step.flowStep.userLimit = getFirstTagAttr(StepNode, "UP", "userlimit");
                Step.flowStep.dataIDs = getFirstTagAttr(StepNode, "UP", "dataids");
                Step.flowStep.showIndex = getFirstTagAttr(StepNode, "FP", "showindex");
                Step.flowStep.outTimeDeal = getFirstTagAttr(StepNode, "FP", "outtimedeal");
                Step.flowStep.recvTime = getFirstTagAttr(StepNode, "FP", "recvtime");
                Step.flowStep.alertInfo = getFirstTagAttr(StepNode, "FP", "alertinfo");
                Step.flowStep.subFlowId = getFirstTagAttr(StepNode, "FP", "subflowid");
                Step.flowStep.skipRest = getFirstTagAttr(StepNode, "FP", "skiprest");
            } else {
                Step.flowStep.defValue = getFirstTagAttr(StepNode, "FP", "defaultvalue");
                Step.flowStep.isAlwaysJudge = getFirstTagAttr(StepNode, "FP", "isalwaysjudge");
            }
            Step.flowStep.loadFromXml(StepNode);
        }
        for (i = 0; i < Actions.childNodes.length; i++) {
            var ActionNode = Actions.childNodes.item(i);
            var fromStepId = getFirstTagAttr(ActionNode, "BP", "from");
            var toStepId = getFirstTagAttr(ActionNode, "BP", "to");
            var Action = this.addAction(getFirstTagAttr(ActionNode, "BP", "id")
				, getFirstTagAttr(ActionNode, "BP", "text"), this.getStep(fromStepId), this.getStep(toStepId));
            Action.type = getFirstTagAttr(ActionNode, "BP", "actionType");
            Action.startArrow = getFirstTagAttr(ActionNode, "VP", "startArrow");
            Action.endArrow = getFirstTagAttr(ActionNode, "VP", "endArrow");
            Action.strokeWeight = getFirstTagAttr(ActionNode, "VP", "strokeWeight");
            Action.isFocused = getFirstTagAttr(ActionNode, "VP", "isFocused");
            Action.zIndex = "42"; //getFirstTagAttr(ActionNode, "VP", "zIndex");
            Action.judgeResult = getFirstTagAttr(ActionNode, "FP", "judgeresult");
            Action.isRemark = getFirstTagAttr(ActionNode, "FP", "isremark");
            Action.isToNext = getFirstTagAttr(ActionNode, "FP", "istonext");
            Action.isAuto = 1 - parseInt(getFirstTagAttr(ActionNode, "FP", "isshow"));
            Action.isOptional = getFirstTagAttr(ActionNode, "FP", "optional");
            Action.isToMen = getFirstTagAttr(ActionNode, "FP", "istomen");
            Action.drawDir = getFirstTagAttr(ActionNode, "VP", "drawDir");
            Action.isWait = getFirstTagAttr(ActionNode, "FP", "iswait");
            Action.css = getFirstTagAttr(ActionNode, "FP", "css");
            Action.loadFromXml(ActionNode);
        }
    }
}