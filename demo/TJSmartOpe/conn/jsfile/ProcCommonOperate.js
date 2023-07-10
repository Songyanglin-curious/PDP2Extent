// 图形断面状态常用变量
var bDelProc = true;//是否需要删除断面，如果是改图或模拟，则无需删除
var m_bImitate = false; //是否模拟状态

function ImitateToNow() {
    m_pPsgpActive.SetTypeItem("_StateNetSlice", 0);
    var tempGraphID = m_pPsgpActive.GetCurrGraphId();
    m_pPsgpActive.UpdateWndByData("<_d><_graphId>-1</_graphId><_fromDb>3</_fromDb><_updtype>2</_updtype></_d>");
    m_bImitate = false;
}
function ViewImitate() {//切换模拟断面和当前断面
    if (m_bImitate) {
        ImitateToNow();
        return false;
    }
    else {
        if (m_iProcID == "0") {
//            var iUseredSlice = GraphAjax.GetWebServiceReturn("35").value;
//            iUseredSlice = iUseredSlice.replace("0#~!", "");
//            iUseredSlice = iUseredSlice.replace("#~!0", "");
//            if (iUseredSlice != "" && iUseredSlice != "0" && confirm("当前有模拟断面正在运行，是否进入"))
//            {
//                bDelProc = false;
//                m_iProcID = iUseredSlice.split("#~!")[0];
//            }
            //            else {
            var runwayInform = GraphAjax.GetWebServiceReturn("31").value;
            if (runwayInform == "") {
                alert("生成模拟断面出错");
                ImitateToNow();
                return false;
            }
            else {
                m_iProcID = runwayInform; //断面ID
            }
//}
        }
        m_pPsgpActive.SetTypeItem("_StateNetSlice", m_iProcID);
        m_pPsgpActive.UpdateWndByData("<_d><_graphId>-1</_graphId><_fromDb>3</_fromDb><_updtype>2</_updtype></_d>");
        m_bImitate = true;
    }
    return true;
}

function DelProcTable() {//删除当前存在的断面
    if(isNaN(m_iProcID))
        return;
    if (m_iProcID != "0")
        m_pPsgpActive.CloseGraphic("<_d><_graphId>-1</_graphId></_d>");
    if (m_iProcID == "0" || bDelProc == false)
        return;
    var delInform = GraphAjax.DeleteProc(m_iProcID.toString()).value;
    if (delInform[0] == "0") {
        alert(delInform[1] + "断面表删除失败,请自行删除");
        return;
    }
    if (delInform[1] == "0") {
        alert("远程删除断面表失败,请自行删除");
    }
}

function SetSliceGraph() {//切换断面时的图形变换
    var tempGraphID = m_pPsgpActive.GetCurrGraphId();
    var factorValue = "";
    if(tempGraphID != -1)
        factorValue = m_pPsgpActive.GetViewTypeItem(tempGraphID, "_ZoomFactor");
    m_pPsgpActive.CloseGraphic("<_d><_graphId>-1</_graphId></_d>");
    m_pPsgpActive.SetTypeItem("_DataNetSlice", m_iProcID);
    m_pPsgpActive.SetTypeItem("_StateNetSlice", m_iProcID);
    GetTreeView();
    if (tempGraphID != -1) {
        m_pPsgpActive.OpenGraphic("<_d><_graphId>" + tempGraphID + "</_graphId></_d>");
        OnZoomfactor(factorValue);
    }
}
