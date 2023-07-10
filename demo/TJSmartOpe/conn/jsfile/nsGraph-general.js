; (function (nsGraph, undefined) {
    nsGraph.CommonCmdValue = {
        Separator: 0xDFFF, SelectZoomIn: 0xDFFE, ZoomBack: 0xDFFD, DispAll: 0xDFFC, Move: 0xDFFB, GraphicPaperStyle: 0xDFFA,
        DevDefine: 0xDFF9, GraphStyle: 0xDFF8, Copy: 0xDFF7, Mirror: 0xDFF6, Rotate: 0xDFF5, Rotate90: 0xDFF4,
        Delete: 0xDFF3, NotValid: 0xDFF2, Valid: 0xDFF1, NotDefined: 0xDFF0, GridSnap: 0xDFEF, TypeManager: 0xDFEE,
        SetAllType: 0xDFED, SetViewType: 0xDFEC, HideGraph: 0xDFEB, GetLinkDev: 0xDFEA, OutUser: 0xDFE9, ChangeGraph: 0xDFE8,
        ChangeGraphStart: 0xDFD5, ChangeGraphEnd: 0xDFE5, //切换设备图形，需要一定数目的ID供使用，用一个范围，暂定16
        MenuDefineMulDevice: 0xDFE7, MenuShowLineGroup: 0xDFE6
    };
    nsGraph.initCallbacks = {
        addZoomMenusOnMenuStart: function () {
            this.attachEvent(nsGraph.eventNames.MenuStart, function (xml) {
                var x = nsGraph.getXMLDocument(xml);
                if (x.selectSingleNode('//d/r') == null) {
                    nsGraph(this).addPopMenu(nsGraph.CommonCmdValue.SelectZoomIn, '选取放大')
                                .addPopMenu(nsGraph.CommonCmdValue.ZoomBack, '显示回退')
                                .addPopMenu(nsGraph.CommonCmdValue.DispAll, '显示全图')
                                .addPopMenu(nsGraph.CommonCmdValue.Move, '平移');
                }
            });
        },
        handleZoomOnMenuCommand: function () {
            this.attachEvent(nsGraph.eventNames.MenuCommand, function (x, y, z) {
                var g = nsGraph(this);
                switch (y) {
                    case nsGraph.CommonCmdValue.SelectZoomIn:
                        g.zoomView('zoomrect');
                        break;
                    case nsGraph.CommonCmdValue.ZoomBack:
                        g.zoomView('zoomback');
                        break;
                    case nsGraph.CommonCmdValue.DispAll:
                        g.zoomView('zoomall');
                        break;
                    case nsGraph.CommonCmdValue.Move:
                        g.zoomView('TOOL_SCROLL');
                        break;
                    default:
                        break;
                }
            });
        },
        SetGraphLocal: function () {
            this.initCrossNodeStyle(true)
            .initDrawingNatureTamplatesList(['配电所', '厂站资料', '人员资料', '标示牌', '检修标示牌', '站内地线牌', '分接箱'])
            .initAutoDescDevList(['普通开关'])
            .initAutoDescChildrenDevList(['分解箱', '普通开关'])
            .initSelectTextsWithRect(false)
            .initAutoHideChildrenDevList(['分接箱']);
        }
    };
    //加入Initializer队列
    for (fn in nsGraph.initCallbacks) {
        nsGraph.onInitialize(nsGraph.initCallbacks[fn]);
    }
})(window.nsGraph);