var targetmode;//记录mode，决定离开时是否保存模式
function SavePageInfo(url, username) {
    //if (targetmode == parent.GetMode() || (targetmode != parent.GetMode() && !confirm("页面查看模式有变化，是否保存变化？"))) {
        parent.SetDivHidden();
        return;
    //}
    var arrPageInfo = new Array();
    arrPageInfo.push(url);
    arrPageInfo.push(username);
    var mode;
    switch (parent.GetMode()) {
        case 0:
            if (parent.m_bIfMainLeft == true && parent.m_bIfMainTable == false)
                mode = 3;
            else if (parent.m_bIfMainLeft == true && parent.m_bIfMainTable == true)
                mode = 4;
            else if (parent.m_bIfMainLeft == false && parent.m_bIfMainTable == false)
                mode = 5;
            else if (parent.m_bIfMainLeft == false && parent.m_bIfMainTable == true)
                mode = 6;
            break;
        case 1:
            mode = 1;
            break;
        case 2:
            mode = 2;
            break;
        default:
            break;
    }
    arrPageInfo.push(mode);
    var isMinorMax = 0;
    if (parent.m_bIfMainMin) {
        isMinorMax += 1;
        if (parent.m_bIfMainMax) {//如果最大化了，取最大化前的值
            arrPageInfo.push(parent.m_iCurrentlMainTop);
            arrPageInfo.push(parent.m_iCurrentlMainLeft);
            arrPageInfo.push(parent.m_iCurrentlMainHeight);
            arrPageInfo.push(parent.m_iCurrentlMainWidth);
            isMinorMax += 2;
        }
        else {//光最小化，取最小化前的值
            arrPageInfo.push(parent.m_iCurrentMainTop);
            arrPageInfo.push(parent.m_iCurrentMainLeft);
            arrPageInfo.push(parent.m_iCurrentMainHeight);
            arrPageInfo.push(parent.m_iCurrentMainWidth);
        }
    }
    else {
        if (parent.m_bIfMainMax) {//如果最大化了，取最大化前的值
            arrPageInfo.push(parent.m_iCurrentlMainTop);
            arrPageInfo.push(parent.m_iCurrentlMainLeft);
            arrPageInfo.push(parent.m_iCurrentlMainHeight);
            arrPageInfo.push(parent.m_iCurrentlMainWidth);
            isMinorMax += 2;
        }
        else {//既没有最大也没有最小化，取当前值
            arrPageInfo.push(getIEAbsTop(parent.mainDiv).toString());
            arrPageInfo.push(getIEAbsLeft(parent.mainDiv).toString());
            if (parent.GetMode() == 0)//如果是嵌入式，取嵌入之前的高度
                arrPageInfo.push(parent.m_iCurrentMainHeight);
            else
                arrPageInfo.push(parent.mainDiv.offsetHeight.toString());
            arrPageInfo.push(parent.mainDiv.offsetWidth.toString());
        }
    }
    arrPageInfo.push(isMinorMax.toString());
    GraphAjax.SaveInfo(arrPageInfo);
    parent.SetDivHidden();
}
function LoadPageInfo(pgAry) {
    if (pgAry.length > 0 && false) { //confirm("是否恢复您上次离开时的查看样式？")) {
        if (pgAry[2] == "1" || pgAry[2] == "2") {//如果是浮动状态
            parent.SetMode(parseInt(pgAry[2])); //设置为浮动，并且设置以图/表为主
            parent.trMain.style.display = "block";
            parent.SetMainPos(parseInt(pgAry[4]), parseInt(pgAry[3]) + 15, parseInt(pgAry[6]), parseInt(pgAry[5]));
            if (parseInt(pgAry[7]) > 1)
                parent.maxmain();
            if (parseInt(pgAry[7]) == 1 || parseInt(pgAry[7]) == 3)
                setTimeout("parent.hidemain()", 100);
        }
        else {//嵌入状态
            var ifGraphMainRead;
            if (pgAry[2] == "3" || pgAry[2] == "5")
                ifGraphMainRead = false;
            else if (pgAry[2] == "4" || pgAry[2] == "6")
                ifGraphMainRead = true;
            var ifSertLeftRead; //是否mainDiv在左侧
            if (pgAry[2] == "3" || pgAry[2] == "4")
                ifSertLeftRead = true;
            else if (pgAry[2] == "5" || pgAry[2] == "6")
                ifSertLeftRead = false;

            parent.m_bIfMainLeft = ifSertLeftRead;
            parent.SetMode(0);//先显示图形
            parent.trMain.style.display = parent.trMain_other.style.display = "block";
            if (ifGraphMainRead != parent.m_bIfMainTable)
                parent.ChangeGraphMain();//修正父界面的图形表格关系
            parent.m_iCurrentMainHeight = parseInt(pgAry[5]);
            if (ifSertLeftRead) {//main在左
                parent.mainDiv.style.left = "0";
                parent.mainDiv.style.width = pgAry[6];
                parent.tblMain.rows(0).cells(1).style.display = "block";
                parent.tblMain_other.rows(0).cells(1).style.display = "none";
                parent.mainDiv_other.style.left = pgAry[6];
                parent.mainDiv_other.style.width = (parent.document.body.clientWidth - parseInt(pgAry[6])).toString();
            }
            else {
                parent.mainDiv.style.left = pgAry[6];
                parent.mainDiv.style.width = (parent.document.body.clientWidth - parseInt(pgAry[6])).toString();
                parent.tblMain_other.rows(0).cells(1).style.display = "block";
                parent.tblMain.rows(0).cells(1).style.display = "none";
                parent.mainDiv_other.style.left = "0";
                parent.mainDiv_other.style.width = pgAry[6];
            }
        }
    }
    else {
        if (window.DefaultView)
            DefaultView();
    }
    targetmode = parent.GetMode();
}