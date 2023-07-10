{//station开始
 //导航下拉框数据
 var vm = this
 this.dropdownData = {
     swkz: {
         iconurl: '/i/sgc/swcjdh/swkz.png',
         title: '三维控制',
         type: "switch",
         size: { iconWidth: 26, iconHeight: 26, dropdownTop: 30 },
         menu: [
             { text: '自动显示名称', id: 1, value: true },
             { text: 'SF₆监测点显示', id: 4, value: true, label: 'sf6' },
             { text: '避雷器监测点显示', id: 5, value: true, label: 'blq' },
             { text: '局放监测点显示', id: 6, value: true, label: 'jbfd' },
             { text: '油色谱监测点显示', id: 7, value: true, label: 'ysp' },
             { text: '综合状态监测点显示', id: 8, value: true },
             { text: '铁芯夹件监测点显示', id: 9, value: true },
             { text: '油温监测点显示', id: 10, value: true },
             { text: '特高压套管监测点显示', id: 11, value: true },
         ]
     },
     dhkz: {
         iconurl: '/i/sgc/swcjdh/dhkz.png',
         title: '导航控制',
         type: "switch",
         size: { iconWidth: 26, iconHeight: 26, dropdownTop: 30 },
         menu: [
             { text: '快速导航', id: 12, value: false },
             { text: '全站地图显示', id: 13, value: false },
         ]
     },
     bhsj: {
         iconurl: '/i/sgc/swcjdh/bhsj.png',
         type: "text",
         size: { iconWidth: 26, iconHeight: 26, dropdownTop: 30 },
         menu: [
             { text: '主视角', id: 20, value: true },
             { text: '俯视角', id: 21, value: true },
         ]
     },
 }
 this.getDevIcon = function(alerts){

      var alertIcons = {
        '油色谱':["/textures/swstation/image/jiance/ysp_blue.png","/textures/swstation/image/jiance/ysp_yellow.png", "/textures/swstation/image/jiance/ysp_red.png",],
      }
      var icons = {};
      for(var i = 0 ; i < alerts.length ; i ++){
        var item = alerts[i];
        var iconIndex = 0;
        item.alertLevel ? iconIndex = item.alertLevel : iconIndex = 0;
        if(item.alertType){
          if(!icons[item.pmsId]){
            icons[item.pmsId] = [];
          }
          icons[item.pmsId].push(alertIcons[item.alertType][iconIndex])
        }
      }
      this.devIcon  = icons;
 }
 this.showZxjc = function(){
     vMain.gotoApp("station_monitor",{ id: 34 })
 }
 this.showJgdx = function(){
     vMain.gotoApp("jigai", { id: 34 });
 },
 this.showSbqd=function(){
     vMain.gotoApp("quanxidangan", { filter: { station: "34.保定站" } });
 },
 this.click3DOption=function(item,menu){
    vm.threeNavChange(item,menu)

 },
 this.exitThree = function(){
     vLayout.exitThree();
 }

 this.init3dNav = function(){
    
        var menu = vm.dropdownData.swkz.menu
        for(var i = 0 ; i < menu.length ; i++){
           vm.threeNavChange(menu[i], menu );
        }

 }


 this.threeNavChange =  function (item, menu) {
     if (!item.id) retuen;
     var id = Number(item.id);
     var value = item.value;
     switch (id) {
       case 1:
         console.log("自动显示名称");
         if (value) {
           ProjectSGC.Map.postMessage({
             eventType: "menuopeSW",
             menuname: "showAutoDeviceName",
             selstate: true,
             data: [
               {
                 importance: 2,
                 fontSize: 18,
                 fontFill: "#000",
                 bgdcolor: "rgba(37, 49, 62,0.9)",
               },
             ],
           });
         } else {
           ProjectSGC.Map.postMessage({
             eventType: "menuopeSW",
             menuname: "showAutoDeviceName",
             selstate: false,
             data: [],
           });
         }
         break;
       case 4:
         console.log("SF6监测点显示");
         vm.showMapIcon(menu);
         break;
       case 5:
         console.log("避雷器监测点显示");
         vm.showMapIcon(menu);
         break;
       case 6:
         console.log("局放监测点显示");
         vm.showMapIcon(menu);
         break;
       case 7:
         console.log("油色谱监测点显示");
         vm.showMapIcon(menu);
         break;
       case 8:
         console.log("综合状态监测点显示");
         break;
       case 9:
         console.log("铁芯夹件监测点显示");
         break;
       case 10:
         console.log("油温监测点显示");
         break;
       case 11:
         console.log("特高压套管监测点显示");
         break;
       case 12:
         console.log("快速导航");
         if (value) {
           ProjectSGC.Map.postMessage({
             eventType: "menuopeSW",
             menuname: "showIndoorDiv",
             selstate: true,
           });
         } else {
           ProjectSGC.Map.postMessage({
             eventType: "menuopeSW",
             menuname: "showIndoorDiv",
             selstate: false,
           });
         }
         break;
       case 13:
         console.log("全站地图显示");
         if (value) {
           ProjectSGC.Map.postMessage({
             eventType: "menuopeSW",
             menuname: "funcshowMap",
             selstate: true,
           });
         } else {
           ProjectSGC.Map.postMessage({
             eventType: "menuopeSW",
             menuname: "funcshowMap",
             selstate: false,
           });
         }
         break;
       case 20:
         console.log("主视角");
         ProjectSGC.Map.postMessage({
           eventType: "menuopeSW",
           menuname: "GoToPosition",
           selstate: true,
           data: { flyType: 1 },
         });
         break;
       case 21:
         console.log("俯视角");
         ProjectSGC.Map.postMessage({
           eventType: "menuopeSW",
           menuname: "GoToPosition",
           selstate: true,
           data: { flyType: 2 },
         });
         break;
       default:
         console.log("未知选项");
     }
   },
   //获取要设置的数据
   this.showMapIcon = function(menu) {
     var monitorType = [];
     menu.forEach((item) => {
       if (item.value && item.label) {
         monitorType.push(item.label);
       }
     });
     vm.showMapIconByMonitorType(monitorType, true);
   },
   //油色谱，避雷器等监测点的开关展现的数据
   this.showMapIconByMonitorType = function (monitorType, isSwitch) {
     var arr = [];
     var imports = [];
     var tip = [];
     var widthHeight = [];
     var iconUrls = [];
     var idInfo = this.devIcon;
    //  var idInfo = {
    //    "04M72000030722740": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030722741": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030722742": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030722863": ["/textures/swstation/image/jiance/blq_yellow.png"],
    //    "04M72000030722864": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030722865": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030722748": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030722769": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030722770": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030722907": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030722908": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030722909": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000031839829": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000031839830": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000031839831": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000031839820": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000031839821": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000031839822": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030510767": ["/textures/swstation/image/jiance/blq_yellow.png"],
    //    "04M72000030510768": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030510789": ["/textures/swstation/image/jiance/blq_yellow.png"],
    //    "04M72000030510863": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030510864": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030510865": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030510871": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030510872": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030510873": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030510901": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030510902": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030510903": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000031839823": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000031839824": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000031839825": ["/textures/swstation/image/jiance/blq_red.png"],
    //    "04M72000031839856": ["/textures/swstation/image/jiance/blq_red.png"],
    //    "04M72000031839857": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000031839858": ["/textures/swstation/image/jiance/blq_blue.png"],
    //    "04M72000030343186": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030709641": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000031839716": [
    //      "/textures/swstation/image/jiance/sf6_blue.png",
    //      "/textures/swstation/image/jiance/jbfd_blue.png",
    //    ],
    //    "04M72000031839702": [
    //      "/textures/swstation/image/jiance/sf6_yellow.png",
    //      "/textures/swstation/image/jiance/jbfd_yellow.png",
    //    ],
    //    "04M72000030709642": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030709699": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030722744": [
    //      "/textures/swstation/image/jiance/sf6_blue.png",
    //      "/textures/swstation/image/jiance/jbfd_red.png",
    //      "/textures/swstation/image/jiance/ysp_red.png",
    //    ],
    //    "04M72000030722745": [
    //      "/textures/swstation/image/jiance/sf6_blue.png",
    //      "/textures/swstation/image/jiance/jbfd_blue.png",
    //      "/textures/swstation/image/jiance/ysp_yellow.png",
    //    ],
    //    "04M72000030722746": [
    //      "/textures/swstation/image/jiance/sf6_red.png",
    //      "/textures/swstation/image/jiance/jbfd_blue.png",
    //      "/textures/swstation/image/jiance/ysp_blue.png",
    //    ],
    //    "04M72000030343204": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030367048": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030709724": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030709726": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030709725": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030343187": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030709842": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030709840": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030367069": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030709841": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030367070": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030343216": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711064": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711062": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711065": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711063": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711066": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030343208": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030867902": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030831127": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030367071": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711113": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030343210": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711114": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030367072": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711115": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030367073": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030343173": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711151": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711150": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711148": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711149": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030367075": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030343171": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030367081": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711161": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711160": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711162": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711163": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030343194": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711165": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711167": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711166": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711168": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030343202": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711216": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711218": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711217": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711219": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711220": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030722891": [
    //      "/textures/swstation/image/jiance/sf6_blue.png",
    //      "/textures/swstation/image/jiance/jbfd_blue.png",
    //      "/textures/swstation/image/jiance/ysp_blue.png",
    //    ],
    //    "04M72000030722892": [
    //      "/textures/swstation/image/jiance/sf6_blue.png",
    //      "/textures/swstation/image/jiance/jbfd_blue.png",
    //      "/textures/swstation/image/jiance/ysp_blue.png",
    //    ],
    //    "04M72000030722893": [
    //      "/textures/swstation/image/jiance/sf6_blue.png",
    //      "/textures/swstation/image/jiance/jbfd_yellow.png",
    //      "/textures/swstation/image/jiance/ysp_blue.png",
    //    ],
    //    "04M72000030711139": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030711138": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030366458": ["/textures/swstation/image/jiance/sf6_yellow.png"],
    //    "04M72000030368132": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030368133": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030368136": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030346115": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030424058": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030424059": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030366477": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030367044": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030492807": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030495740": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030367045": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030496813": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030497803": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030366451": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030497799": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030497800": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030366463": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030505638": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030505639": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030366456": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030505860": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030367046": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030505869": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030505870": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030366467": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030505883": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030505885": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030505888": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030366427": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030505935": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030506246": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030506247": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030366449": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030507058": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030507059": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030366483": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030507092": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030507093": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030366474": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030507099": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030507100": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030366486": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030507117": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030496816": ["/textures/swstation/image/jiance/sf6_blue.png"],
    //    "04M72000030830782": ["/textures/swstation/image/jiance/ysp_blue.png"],
    //    "04M72000030830783": ["/textures/swstation/image/jiance/ysp_blue.png"],
    //    "04M72000030830784": ["/textures/swstation/image/jiance/ysp_blue.png"],
    //    "04M72000030832337": ["/textures/swstation/image/jiance/ysp_blue.png"],
    //    "04M72000030832338": ["/textures/swstation/image/jiance/ysp_blue.png"],
    //    "04M72000030832339": ["/textures/swstation/image/jiance/ysp_blue.png"],
    //    "04M72000031838947": ["/textures/swstation/image/jiance/ysp_blue.png"],
    //    "04M72000031838948": ["/textures/swstation/image/jiance/ysp_blue.png"],
    //    "04M72000031839009": ["/textures/swstation/image/jiance/ysp_blue.png"],
    //  };
     var ysp = [],
       blq = [],
       sf6 = [],
       jbfd = [];
 
     var indexNum = 0;
     ProjectSGC.Map.postMessage({
       eventType: "menuopeSW",
       menuname: "showImageIcon",
       selstate: false,
       data: {
         type: "alarm",
         paddingtop: 0,
         paddingleft: 0,
         images: { imgUrl: "", width: 30, height: 30 },
         ids: arr,
       },
     });
     for (var key in idInfo) {
       indexNum++;
 
       for (var i = 0; i < idInfo[key].length; i++) {
         if (idInfo[key][i].indexOf("blue") != -1) {
           imports[i] = 3; //优先显示顺序
         } else if (idInfo[key][i].indexOf("yellow") != -1) {
           imports[i] = 2;
         } else if (
           idInfo[key][i].indexOf("red") != -1 &&
           monitorType === "ysp"
         ) {
           imports[i] = 1;
           tip[i] = "油温过高（100°）"; //显示文字
         } else {
           imports[i] = 3;
         }
         if (
           idInfo[key][i].indexOf("ysp") != -1 ||
           idInfo[key][i].indexOf("blq") != -1
         ) {
           widthHeight[i] = [15, 30]; //图标宽高
         } else {
           widthHeight[i] = null;
         }
 
         if (
           idInfo[key][i].indexOf("blq") != -1 &&
           monitorType.indexOf("blq") != -1
         ) {
           //避雷器
           iconUrls.push(idInfo[key][i]);
           arr.push({
             id: key,
             urls: iconUrls,
             imports: imports,
             tip: tip,
             widthHeight: widthHeight,
           });
           continue;
         }
         if (
           idInfo[key][i].indexOf("sf6") != -1 &&
           monitorType.indexOf("sf6") != -1
         ) {
           //sf6
           iconUrls.push(idInfo[key][i]);
           arr.push({
             id: key,
             urls: iconUrls,
             imports: imports,
             tip: tip,
             widthHeight: widthHeight,
           });
           continue;
         }
         if (
           idInfo[key][i].indexOf("jbfd") != -1 &&
           monitorType.indexOf("jbfd") != -1
         ) {
           //局部放电
           iconUrls.push(idInfo[key][i]);
           arr.push({
             id: key,
             urls: iconUrls,
             imports: imports,
             tip: tip,
             widthHeight: widthHeight,
           });
           continue;
         }
         if (
           idInfo[key][i].indexOf("ysp") != -1 &&
           monitorType.indexOf("ysp") != -1
         ) {
           //油色谱
           iconUrls.push(idInfo[key][i]);
           arr.push({
             id: key,
             urls: iconUrls,
             imports: imports,
             tip: tip,
             widthHeight: widthHeight,
           });
           continue;
         }
         // if (monitorType === 'all') {//全部
         //     arr.push({ id: key, urls: idInfo[key], imports: imports, tip: tip, widthHeight: widthHeight });
         // }
       }
       imports = [];
       tip = [];
       widthHeight = [];
       iconUrls = [];
     }
 
     ProjectSGC.Map.postMessage({
       eventType: "menuopeSW",
       menuname: "showImageIcon",
       selstate: isSwitch,
       data: {
         type: "alarm",
         paddingtop: 0,
         paddingleft: 0,
         images: { imgUrl: "", width: 30, height: 30 },
         ids: arr,
       },
     });
   }
}//station结束