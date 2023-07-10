/*
* nsGraph.js
* latest release by fu/2011/06/14
* Please try to keep the original nsGraph's code structure and style 
* when adding extensions on it.
*/
; (function (window, undefined) {
    var _Graph = null,
    _borderColor = '#D8A802',
    _borderWeight = 1,
    _fontColor = '#F55D00',
    _fontSize = 8,
    _fontStyle = '宋体',
    _graphLayerBase = 0x40000000/*此值为图形默认图层，在图形控件内部设定*/
    _eventMaps = {},
    _initialize = [],
    _backColor = '#000000';
    _xmlDoc = null,
    mergeDefultOps = function (options) {        
        options = options || {};
        options.graphId = options.graphId || nsGraph().getCurrGraphId();
        options.lineWeight = options.lineWeight || _borderWeight;
        options.lineColor = options.lineColor || _borderColor;
        options.graphOrder = options.graphOrder || _graphLayerBase;
        options.fontStyle = options.fontStyle || _fontStyle;
        options.fontSize = options.fontSize || _fontSize;
        options.fontColor = options.fontColor || _fontColor;
        options.imageSize = options.imageSize || [-1, -1];
        options.graphSize = options.graphSize || [1000, 1000];
        options.backColor = options.backColor || _backColor;
        return options;
    },
    nsGraph = function (m_pPsgpActive) {
        /// <summary>
        /// 初始化函数，包装图形控件，m_pPsgpActive应当是图形控件的引用
        /// </summary>
        if (m_pPsgpActive && m_pPsgpActive.tagName != 'OBJECT')
            throw new Error('nsGraph初始化失败，m_pPsgpActive应是图形控件的引用！')
        return new nsGraph.fn.init(m_pPsgpActive);
    };
    Array.prototype.hasValue = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj)
                return true;
        }
        return false;
    };
    Array.prototype.removeAt = function (i) {
        return this.slice(0, i).concat(this.slice(i + 1));
    };
    nsGraph.getGraphLayerBase = function () {
        return _graphLayerBase;
    };
    nsGraph.onInitialize = function (fn) {
        /// <summary>
        /// 使用此函数可以给nsGraph()的初始化过程注册若干回调函数&#10;
        /// 在回调函数内部this指针指向当前的nsGraph对象&#10;
        /// 因此，可以通过此函数更及时的注册控件的事件处理函数，或扩展nsGraph对象
        /// </summary>
        /// <param name="fn" type="callback"><param>
        if (typeof fn == 'function') {
            _initialize.push(fn);
        }
    };
    nsGraph.commonSetup = function (setups) {
        /// <summary>
        /// 全局设置
        /// </summary>
        /// <param name="setups" type="Object">{fontColor:'',&#10;
        ///fontSize:'',&#10;
        ///fontStyle:'',&#10;
        ///borderColor:'',&#10;
        ///borderWeight:'',&#10;
        ///}</param>    
        _fontColor = setups.fontColor ? setups.fontColor : _fontColor;
        _fontSize = setups.fontSize ? setups.fontSize : _fontSize;
        _fontStyle = setups.fontStyle ? setups.fontStyle : _fontStyle;
        _borderColor = setups.borderColor ? setups.borderColor : _borderColor;
        _borderWeight = setups.borderWeight ? setups.borderWeight : _borderWeight;
    };
    nsGraph.getXMLDocument = function (xml) {
        /// <summary>
        /// 获得XML文档对象
        /// </summary>   
        ///<param name="xml" type="String"></param>    
        if (!_xmlDoc) {
            _xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            _xmlDoc.async = "false";
        }
        _xmlDoc.loadXML(xml);
        tmp = _xmlDoc.documentElement;
        return tmp;
    };
    nsGraph.html_RGB = function (color) {
        /// <summary>
        /// 将html/RGB颜色转换为RGB/html颜色.
        /// </summary>
        /// <param name="color">RGB:接收数字，十进制形式字符串，十六进形式制字符串&#10;
        /// html:接收形如'#FA5d66'的字符串</param>            
        if (typeof color == 'string') {
            if (/^#[a-fA-F0-9]{6}$/.test(color)) {
                var x = color.toString().match(/^#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/);
                return parseInt(x[1], 16) | parseInt(x[2], 16) << 8 | parseInt(x[3], 16) << 16;
            }
            else if (/^[0-9]+$/.test(color) || /^0x[a-fA-F0-9]{6}$/.test(color))
                color = parseInt(color)
        }
        if (typeof color == 'number')
            return '#' + (color & 0xFF).toString(16) + ((color >> 8) & 0xFF).toString(16) + ((color >> 16) & 0xFF).toString(16);
        else
            return color.toString();
    };
    nsGraph.mouseEventFlags = {
        MK_LBUTTON: 0x0001, //以下数据来自WinUser.h，未实测
        MK_RBUTTON: 0x0002,
        MK_SHIFT: 0x0004,
        MK_CONTROL: 0x0008,
        MK_MBUTTON: 0x0010,
        MK_XBUTTON1: 0x0020,
        MK_XBUTTON2: 0x0040
    };
    nsGraph.drawTypes = {
        point:'DrawPointManual',
        circle:'DrawCircleManual',
        arc:'DrawArcManual',
        ellipse:'DrawEllipseManual',
        roundRect:'DrawRoundRectManual',
        triangle:'DrawTriAngleManual',
        rectangle:'DrawRectangleManual',
        polyLine:'DrawPolylineManual',
        polyLineClosed:'DrawPolylineClosedManual',
        polygon:'DrawPolygonManual',
        arrow:'DrawArrowManual',
        bezier:'DrawBezierManual',
        curve:'DrawCurveManual',
        curveClosed:'DrawCurveClosedManual',
        text:'DrawTextManual',
        dynimicText:'DrawDynimicTextManual',
        commondText:'DrawCommandTextManual',
        btnText:'DrawBtnTextManual',
        cutLine:'DrawCutLineManual',
        Image:'DrawImageManual',
        line :'DrawLineManual'
    };
    nsGraph.mouseUpDown = {
        up: 0,
        down: 1
    };
    nsGraph.eventNames = {
        ChangeCell: 'ChangeCell',
        GraphicChged: 'GraphicChged',
        GraphicViewChged: 'GraphicViewChged',
        KeyDown: 'KeyDown',
        MenuCommand: 'MenuCommand',
        MenuStart: 'MenuStart',
        MouseDClickExt: 'MouseDClickExt',
        MouseDblClick: 'MouseDClick',
        MouseLClick: 'MouseLClick',
        MouseRClick: 'MouseRClick',
        MouseMoving: 'MouseMoving',
        ActiveGraph: 'OnActiveGraph',
        CutLine: 'OnCutLine',
        Tooltip: 'OnTooltip',
        OutCalled: 'OutCalled',
        SelChanged: 'SelChanged',
        MouseDClickImage: 'MouseDClickImage',
        OpenGraphic: 'OnOpenGraphic',
        CloseGraphic: 'OnCloseGraphic',
        AddGraph: 'OnAddGraph',
        KeyPress: 'OnKeyPress',
        Connect: 'OnConnect'
    };
    nsGraph.popmenuStyle =
    {
        none: 0,
        grayed : 1,
        disabled : 2,
        checked : 8
    };
    nsGraph.prototype.isRuning = function () {
        return _Graph.GetTypeItem('_RunEditMode')=='0';
    };    
    nsGraph.prototype.isEditing = function () {
        return _Graph.GetTypeItem('_RunEditMode')=='1';
    };
    nsGraph.prototype.isFlashing =function (){
        return _Graph.GetTypeItem("_FlashDevGraph")=='1';
    };
    nsGraph.prototype.zoomView = function (zoomType, options) {
        /// <summary>
        /// 进入某种缩放状态
        /// </summary>   
        ///<param name="zoomType" type="String"></param>            
        options = mergeDefultOps(options);
        _Graph.ZoomView("<_d><_graphId>" + options.graphId + "</_graphId><_pointX>0</_pointX><_pointY>0</_pointY><_zoomtype>"
            + zoomType + "</_zoomtype></_d>");
        return this;
    };
    nsGraph.prototype.zoomFactor = function (factor, options) {    
        options = mergeDefultOps(options);
        _Graph.ZoomView("<_d><_graphId>" + options.graphId
	        + "</_graphId><_pointX>0</_pointX><_pointY>0</_pointY><_zoomtype>ZoomFactor</_zoomtype><_Value>"
	        + factor + "</_Value></_d>");
        return this;
    };
    nsGraph.prototype.addPopMenu = function (cmdValue, desc,options) {
        /// <summary>
        /// 添加弹出菜单
        /// </summary>   
        ///<param name="cmdValue" type="Number"></param>    
        ///<param name="desc" type="String"></param>    
        ///<param name="options" type="Object">
        /// options.img:使用图片的url &#10;
        /// options.style:菜单风格(nsGraph.popmenuStyle) &#10;
        /// options.parent:父菜单
        ///</param>    
        options = mergeDefultOps(options);
        _Graph.AddPopMenu(cmdValue, (options.img?'<img src="'+options.img+'"':'<d ')
                                    +(options.parent?' _mainmenu="'+options.parentMenu+'" ':'')
                                    +(options.style?' _option="'+options.style+'" ':'')
                                    +'>' + desc 
                                    + (options.img?'</img>':'</d>'));
        return this;
    };
    nsGraph.prototype.startFlashing = function () {
        _Graph.SetTypeItem("_FlashDevGraph",  "1");
        return this;
    };
    nsGraph.prototype.endFlashing = function () {
        _Graph.SetTypeItem("_FlashDevGraph",  "0");
        return this;
    };
    nsGraph.prototype.setFlashDevLists = function(devList){
        /// <summary>
        /// 设置需要在潮流图上闪烁的设备列表.todo
        /// </summary>
        /// <param name="devList" type="[devId,graphId,itemId,graphName][]"></param>
        var xml = '<flashDevList>';
        for(var i=0;i<devList.length;++i){
            xml+='<graphdevitem><graphitemid>'+devList[i][2]+'</graphitemid><graphdevid>'
                +devList[i][0]+'</graphdevid><graphicid>'+devList[i][1]+'</graphicid><graphicname>'
                +devList[i][3]+'</graphicname>'+'</graphdevitem>'
        }
        xml += '</flashDevList>';
        return _Graph.SubmitGraphDevList('flashdevlist',xml);
    };
    nsGraph.prototype.getGraphName = function (graphId) {
        return _Graph.GetGraphicProperty(graphId,'graphicName');
    };
    nsGraph.prototype.getGraphItemIdByDevId = function (devId, options) {
        /// <summary>
        /// 从设备ID获取图元ID
        /// </summary>
        options = mergeDefultOps(options);
        var itemList = this.getGraphItemList(options.graphId);
        for(var i=0;i<itemList.length;++i){
            if(this.getDevIdByGraphItemId(itemList[i],options)==devId)
                return itemList[i];
        }
        return '';
    };
    nsGraph.prototype.getGraphItemList = function(graphId){
        var xml = _Graph.GetGraphicProperty(graphId, 'GraphItemList');
        xml = nsGraph.getXMLDocument(xml);
        var ids = xml.selectNodes('//d/r/id');     
        var res = [];   
        for (var i = 0; i < ids.length; ++i) {
            res.push(ids[i].text);
        }
        return res;
    };
    nsGraph.prototype.getGraphDevKeyList = function (graphId) {
        var il = this.getGraphItemList(graphId);
        var res = [];
        for(var i = 0; i < il.length; ++i){
            var dk = this.getDevIdByGraphItemId(il[i],{'graphId':graphId});
            if(dk)
                res.push(dk);
        }
        return res;
    };
    nsGraph.prototype.getDevIdByGraphItemId = function (graphItemId, options) {
        /// <summary>
        /// 从图元ID获取设备ID
        /// </summary>
        ///<param name="graphItemId" type="Number"></param>  
        options = mergeDefultOps(options);
        return _Graph.GetGraphItemProperty(options.graphId, -1, graphItemId, "key");
    };
    nsGraph.prototype.getDevkeyByGraphitemId = function(graphItemId, options){    
        return this.getDevIdByGraphItemId(graphItemId, options);
    };
    nsGraph.prototype.getDevnameByGraphitemId = function (graphItemId, options) {
        /// <summary>
        /// 获得设备名称
        /// </summary>   
        ///<param name="graphItemId" type="Number"></param>    
        return this.getDevdescByGraphitemId(graphItemId, options);
    };
    nsGraph.prototype.getDevdescByGraphitemId = function (graphItemId, options) {
        /// <summary>
        /// 获得设备描述
        /// </summary>   
        ///<param name="graphItemId" type="Number"></param>    
        options = mergeDefultOps(options);
        return _Graph.GetGraphItemProperty(options.graphId, -1, graphItemId, "name");
    };
    nsGraph.prototype.getDevtypeByGraphitemId = function (graphItemId, options) {
        /// <summary>
        /// 获得设备类型
        /// </summary>   
        ///<param name="graphItemId" type="Number"></param>    
        options = mergeDefultOps(options);
        return _Graph.GetGraphItemProperty(options.graphId, -1, graphItemId, "devType");
    };
    nsGraph.prototype.getDevtypeDescByGraphitemId = function (graphItemId, options) {
        /// <summary>
        /// 获得设备类型描述
        /// </summary>   
        ///<param name="graphItemId" type="Number"></param>    
        options = mergeDefultOps(options);
        return _Graph.GetGraphItemProperty(options.graphId, -1, graphItemId, "templateTypeName");
    };
    nsGraph.prototype.getGraphitemCenterPos = function (graphItemId, isPhysical, options) {
        /// <summary>
        /// 获得图元中心点坐标
        /// </summary>   
        ///<param name="isPhysical" type="Boolean">是否获取物理坐标</param>    
        options = mergeDefultOps(options);
        var xml = _Graph.GetGraphItemProperty(options.graphId, -1, graphItemId, isPhysical ? "centerPhyPos" : "centerPos");
        return xml.replace("<d><x>", "").replace("</y></d>", "").split("</x><y>");
    };
    nsGraph.prototype.getGraphTamplateList = function(graphId){
        var xml = _Graph.GetGraphicProperty(graphId, "gettemplatenamelist");
        var doc = nsGraph.getXMLDocument(xml);
        var ele = doc.selectNodes('/d/devname');
        var res = [];
        for(var i = 0 ;i<ele.length;++i){
            res.push(ele[i].text);
        }
        return res;
    };
    nsGraph.prototype.getZoomFactor = function (options) {
        options = mergeDefultOps(options);
        return _Graph.GetViewTypeItem(options.graphId, "_ZoomFactor");
    };
    nsGraph.prototype.getGraphicBase64String = function (graphId) {
        return _Graph.GetGraphicBase64String(graphId,0);
    };
    nsGraph.prototype.openGraph = function (graphId) {
        /// <summary>
        /// 打开图形，调用此函数前，应当设置init**系列的函数
        /// </summary>   
        ///<param name="graphId" type="Number">图形ID</param>           
        var options = mergeDefultOps(null);
        var factor = this.getZoomFactor(options);
        _Graph.OpenGraphic("<_d><_graphId>" + graphId + "</_graphId></_d>");
        this.zoomFactor(factor, options);       
        return this;
    };
    nsGraph.prototype.createNewGraph = function(name,desc,options){
        /// <summary>
        /// 创建新图形，此操作会将新图形入库
        /// </summary>   
        ///<param name="name" type="String">名称</param>
        ///<param name="desc" type="String">描述</param>
        ///<param name="options" type="Object">
        ///options.graphSize : [width,height] &#10;
        ///options.backColor : #000000
        ///</param>   
        ///<returns type = "Number">新创建的图形ID</returns>     
        var options = mergeDefultOps(options);  
        return _Graph.GetServerDataTest('CreateNewGraphic#~!0#~!'+name+'#~!'+desc+'#~!3#~!0#~!1#~!255#~!10#~!10#~!'
                                            +options.graphSize[0]+'#~!'+options.graphSize[1]+'#~!'+
                                            nsGraph.html_RGB(options.backColor)+'#~!-1#~!0');
    }
    nsGraph.prototype.closeGraph = function (graphId) {
        /// <summary>
        /// 关闭指定id的图形
        /// </summary>   
        ///<param name="graphId" type="Number">图形ID，为空则关闭所有图形</param>    
        graphId=graphId?graphId:'-1';
        _Graph.CloseGraphic('<_d><_graphId>'+graphId+'</_graphId></_d>');
        return this;
    };
    nsGraph.prototype.createDynGraph = function (graphicName,graphicContent,ifnew) {
        /// <summary>
        /// 创建动态图
        /// </summary>   
        ///<param name="graphicName" type="String">新建图形名称，此参数在ifnew为true时需要传入有效的图形名称</param>   
        ///<param name="graphicContent" type="String">图形二进制内容，此参数在ifnew为false时需要传入有效的二进制内容</param>   
        ///<param name="ifnew" type="Boolean">是否创建新图形或打开已有图形</param>  
        ///<returns type = "Number">新创建的图形ID</returns>
        return _Graph.CreateDynamicGraphic(graphicName,graphicContent,ifnew?0:1);
    };
    nsGraph.prototype.setGraphSize = function (graphId,height,width) {
        _Graph.SetGraphicProperty(graphId,"setgraphicsize", "<d><_width>" + width+ "</_width><_height>" + height+ "</_height></d>");
        return this;
    };
    nsGraph.prototype.export2Jpeg = function(graphId,width,quality){
        /// <summary>
        /// 到处图形到jqp文件
        /// </summary>   
        ///<param name="graphId" type="Number">图形ID</param>   
        ///<param name="width" type="Number">jpg宽度</param>   
        ///<param name="quality" type="Number">品质，1-100</param>  
        ///<returns type = "Number">新创建的图形ID</returns>
        if(quality<1)
            quality=1;
        if(quality>100)
            quality=100;
        return _Graph.GetGraphicFullPicture(graphId,width,quality,2)
    }
    nsGraph.prototype.addDynPlugin = function (pluginName, pluginFileName) {
        /// <summary>
        /// 添加插件
        /// </summary>   
        ///<param name="pluginName" type="String"></param>    
        ///<param name="pluginFileName" type="String"></param>    
        return _Graph.AddDynPlugin(pluginName, pluginFileName);
    };
    nsGraph.prototype.initWebService = function (url) {
        /// <summary>
        /// 设置WebService地址
        /// </summary>   
        ///<param name="url" type="String"></param>    
        _Graph.SetTypeItem("_WebServerAddr", url);
        return this;
    };
    nsGraph.prototype.initCrossNodeStyle = function (autoArc) {
        /// <summary>
        /// 设置是否将跨接线显示为圆弧
        /// </summary>   
        ///<param name="autoArc" type="Boolean"></param>    
        _Graph.SetTypeItem("_AutoCrossNode", autoArc ? "1" : "0");
        return this;
    };
    nsGraph.prototype.initDrawingNatureTamplatesList = function (tamplates) {
        /// <summary>
        /// 设置不按电压等级涂色的设备列表
        /// </summary>   
        ///<param name="tamplates" type="String[]"></param>    
        var xml = '<d>';
        for (var i = 0; i < tamplates.length; ++i) {
            xml += '<a>' + tamplates[i] + '</a>';
        }
        xml += '</d>';
        _Graph.SetTypeItem("_DrawWithNatureColor", xml);
        return this
    };
    nsGraph.prototype.initAutoDescDevList = function (devs) {
        /// <summary>
        /// 设置自动添加描述的设备列表
        /// </summary>   
        ///<param name="devs" type="String[]"></param> 
        var xml = '<d>';
        for (var i = 0; i < devs.length; ++i) {
            xml += '<a>' + devs[i] + '</a>';
        }
        xml += '</d>';
        _Graph.SetTypeItem("_AutoAddTextDevList", xml);
        return this
    };
    nsGraph.prototype.initAutoDescChildrenDevList = function (devs) {
        /// <summary>
        /// 设置自动给子设备添加描述的设备列表
        /// </summary>   
        ///<param name="devs" type="String[]"></param>    
        var xml = '<d>';
        for (var i = 0; i < devs.length; ++i) {
            xml += '<a>' + devs[i] + '</a>';
        }
        xml += '</d>';
        _Graph.SetTypeItem("_AddNameToChildNameDevList", xml);
        return this
    };
    nsGraph.prototype.initAutoHideChildrenDevList = function (devs) {
        /// <summary>
        /// 设置自动隐藏子设备的设备列表
        /// </summary>   
        ///<param name="devs" type="String[]"></param>    
        var xml = '<d>';
        for (var i = 0; i < devs.length; ++i) {
            xml += '<a>' + devs[i] + '</a>';
        }
        xml += '</d>';
        _Graph.SetTypeItem("_AutoHideChildDevList", xml);
        return this
    };
    nsGraph.prototype.initSelectTextsWithRect = function (willSelect) {
        /// <summary>
        /// 设置是否在全选图形时选中文本。
        /// </summary>   
        ///<param name="willSelect" type="Boolean"></param>    
        _Graph.SetTypeItem("_SelectWithinRectText", willSelect ? "1" : "0");
        return this
    };    
    nsGraph.prototype.enableEditHandle = function () {
        _Graph.SetTypeItem('_EditHandle',1);
        return this;
    };
    nsGraph.prototype.disableEditHandle = function () {
        _Graph.SetTypeItem('_EditHandle',0);
        return this;
    };    
    nsGraph.prototype.startEdit = function () {
        /// <summary>
        /// 图形进入编辑态
        /// </summary>        
        _Graph.SetTypeItem("_RunEditMode", "1");
        return this;
    };
    nsGraph.prototype.endEdit = function () {
        /// <summary>
        /// 图形退出编辑态
        /// </summary>        
        _Graph.SetTypeItem("_RunEditMode", "0");
        return this;
    };
    nsGraph.prototype.showEditBar = function () {
        _Graph.SetTypeItem("_ShowEditDevBar", "1");
        return this;
    };
    nsGraph.prototype.hideEditBar = function () {
        _Graph.SetTypeItem("_ShowEditDevBar", "0");
        return this;
    };
    nsGraph.prototype.startManualDrawing = function (drawType,options) {
        options = mergeDefultOps(options);
        _Graph.EditDrawGraph(options.graphId,drawType,'');
        return this;
    };
    nsGraph.prototype.drawLineManual = function (options) {
        return this.startManualDrawing(nsGraph.drawTypes.line,options);
    };
    nsGraph.prototype.getGraph = function () {
        /// <summary>
        /// 获得图形控件引用
        /// </summary>   
        return _Graph;
    };
    nsGraph.prototype.eraseDynGraphItem = function (id, options) {
        /// <summary>
        /// 删除动态图元,eraseDynGraph()的内部函数
        /// </summary>   
        ///<param name="id" type="Number">图元ID</param>    
        ///<param name="options" type="Object">options.graphId 图形ID</param>    
        options = mergeDefultOps(options);
        return _Graph.EditDrawGraph(options.graphId, 'deldyngraph', id); ;
    };
    nsGraph.prototype.getCurrGraphId = function () {
        return _Graph.GetCurrGraphId();
    };
    nsGraph.prototype.getGraphItemRect = function (graphItemId, options) {
        options = mergeDefultOps(options);
        var xml = _Graph.GetGraphItemProperty(options.graphId, -1, graphItemId, 'graphRect');
        xml = nsGraph.getXMLDocument(xml);
        return { 'l': xml.selectSingleNode('//d/l').text
                , 'r': xml.selectSingleNode('//d/r').text
                , 't': xml.selectSingleNode('//d/t').text
                , 'b': xml.selectSingleNode('//d/b').text
        };
    };
    nsGraph.prototype.drawDynRect = function (position, width, height, options) {
        /// <summary>
        /// 画动态矩形区域
        /// </summary>        
        ///<param name="position" type="[x,y]">文字</param>
        ///<param name="width" type="Number">宽度</param>
        ///<param name="height" type="Number">高度</param>
        ///<param name="options" type="Object">options.lineWeight:边框宽度&#10;options.lineColor：边框颜色&#10;options.fillColor：填充色
        ///&#10;options.graphOrder：图层，可从nsGraph.getGraphLayerBase()获取默认值&#10;options.graphId ：图形ID</param>        
        ///<returns type="rectId"></returns>
        options = mergeDefultOps(options);
        var needFill = 1;
        if (!options.fillColor) {
            options.fillColor = _borderColor;
            needFill = 0;
        }
        var xml = '<rect><topleftpoint>' + position[0] + '#' + position[1] + '</topleftpoint><width>' + width + '</width><height>'
            + height + '</height><lineweight>' + options.lineWeight + '</lineweight><linecolor>' + nsGraph.html_RGB(options.lineColor)
            + '</linecolor><needfill>' + needFill + '</needfill><fillcolor>' + nsGraph.html_RGB(options.fillColor) + '</fillcolor><graphorder>'
            + options.graphOrder + '</graphorder></rect>';
        return _Graph.EditDrawGraph(options.graphId, 'adddynrect', xml);
    };
    nsGraph.prototype.drawDynText = function (text, relaGraphItemId, relaPos, options) {
        /// <summary>
        /// 画动态文字
        /// </summary>        
        ///<param name="text" type="String">文字</param>
        ///<param name="relaGrapgItemId" type="Number">相对图元ID</param>
        ///<param name="relaPos" type="[x,y]">相对位置</param>
        ///<param name="options" type="Object">options.fontStyle &#10; options.fontSize &#10; options.fontColor &#10; 
        /// options.graphOrder &#10;options.graphId  </param>
        ///<returns type="textId"></returns>
        relaPos = relaPos ? relaPos : [0,0];
        options = mergeDefultOps(options);
        var xml = '<d><relagraph>' + relaGraphItemId + '</relagraph><text>' + text + '</text><relapos>' + Number(relaPos[0]).toString()
            + ',' + Number(relaPos[1]).toString() + '</relapos><font>' + options.fontStyle + ',' + options.fontSize + ','
            + nsGraph.html_RGB(options.fontColor).toString() + '</font><graphorder>' + options.graphOrder + '</graphorder></d>';
        return _Graph.EditDrawGraph(options.graphId, "AddDynText", xml);

    };
    nsGraph.prototype.drawDynImage = function (imageUrl, relaGraphItemId, relaPos, options) {
        relaPos = relaPos ? relaPos : [0,0];
        options = mergeDefultOps(options);
        var xml = '<d><relagraph>' + relaGraphItemId + '</relagraph><relapos>' + Number(relaPos[0]).toString() + ','
            + Number(relaPos[1]).toString() + '</relapos><filename>' + imageUrl + '</filename><imgsize>' + options.imageSize[0] + ','
            + options.imageSize[1] + '</imgsize></d>';        
        return _Graph.EditDrawGraph(options.graphId, 'AddDynImage', xml);
    };
    nsGraph.prototype.drawDynPolyline = function (points, options) {
        /// <summary>
        /// 画折线，points均为绝对坐标
        /// </summary>        
        ///<param name="points" type="[x,y][]">坐标数组</param>
        ///<param name="options" type="Object">options.lineWeight:折线宽度 &#10;options.lineColor:折线颜色&#10;
        ///options.graphOrder图层位置，可从nsGraph.getGraphLayerBase()获取默认值&#10; options.graphId:图形ID</param>
        ///<returns type="polyId"></returns>
        
        options = mergeDefultOps(options);
        var xml = '<polyline><points>';
        for (var i = 0; i < points.length; ++i) {
            xml += '<item>' + points[i][0] + '#' + points[i][1] + '</item>';
        }
        xml += '</points><lineweight>' + options.lineWeight + '</lineweight><linecolor>' + nsGraph.html_RGB(options.lineColor).toString()
            + '</linecolor><graphorder>' + options.graphOrder + '</graphorder></polyline>';
        return _Graph.EditDrawGraph(options.graphId, 'adddynpolyline', xml);
    };
    nsGraph.prototype.init = function (m_pPsgpActive) {
        if (!_Graph) {
            _Graph = m_pPsgpActive;
            for (var i = 0; i < _initialize.length; ++i) {
                _initialize[i].call(this);
            }
        }
    };
    nsGraph.prototype.attachEvent = function (event, fn) {
        /// <summary>
        /// 所有事件绑定函数的内部函数。
        /// </summary>      
        /// <param name="event" type="String">事件名（nsGraph.eventNames）</param>
        /// <param name="fn" type="callback">事件处理函数</param>
        if (typeof fn == 'function') {
            if (!_eventMaps[event]) {
                _eventMaps[event] = [];
                eval('function _Graph::' + event + '(){for(var i=0;i<_eventMaps[event].length;++i){_eventMaps[event][i].apply(this,arguments);}}');
            }
            _eventMaps[event].push(fn);
        }
        return this;
    };
    nsGraph.prototype.onMouseRClick = function (fn) {
        /// <summary>
        /// 绑定右键事件
        /// </summary>      
        /// <param name="fn" type="callback">要绑定的函数，参数依次为触发事件的图元ID、&#10;
        ///鼠标flag（nsGraph.mouseEventFlags）、&#10;updn事件响应标志(nsGraph.mouseUpDown )。 </param>
        return this.attachEvent(nsGraph.eventNames.MouseRClick, fn);
    };
    nsGraph.prototype.onMouseLClick = function (fn) {
        /// <summary>
        /// 绑定左键事件
        /// </summary>      
        /// <param name="fn" type="callback">要绑定的函数，参数依次为触发事件的图元ID、&#10;
        ///鼠标flag（nsGraph.mouseEventFlags）、&#10;updn事件响应标志(nsGraph.mouseUpDown )。 </param>
        return this.attachEvent(nsGraph.eventNames.MouseLClick, fn);
    };
    nsGraph.prototype.onMouseDblClick = function (fn) {
        /// <summary>
        /// 绑定双击事件
        /// </summary>      
        /// <param name="fn" type="callback">要绑定的函数，参数依次为触发事件的图元ID、鼠标flag（nsGraph.mouseEventFlags）</param>        
        return this.attachEvent(nsGraph.eventNames.MouseDblClick, fn);
    };
    nsGraph.prototype.onMenuStart = function (fn) {
        /// <summary>
        /// 绑定菜单事件
        /// </summary>      
        /// <param name="fn" type="callback">要绑定的函数，参数为xml）</param>        
        return this.attachEvent(nsGraph.eventNames.MenuStart, fn);
    };
    nsGraph.prototype.onMenuCommand = function(fn){
        return this.attachEvent(nsGraph.eventNames.MenuCommand, fn);        
    };   
    
    nsGraph.fn = nsGraph.prototype;
    nsGraph.fn.init.prototype = nsGraph.fn;
    window.nsGraph = nsGraph;
})(window);