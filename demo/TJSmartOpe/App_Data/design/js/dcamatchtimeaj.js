
Ysh.Object.addHandle(this, "resize",
function () {
    this.h0 = $(this.$el).height() - 22;
    var r = parseFloat(this.$el.style.zoom || 1);
    //this.hRow = parseInt(($(window.document).height() - 440*r) / 12 / r, 10) + "px";
    this.hRow = parseInt(($(window.document).height() - 350) / 6, 10) + "px";
});

this.zoom =  owg.sz;
this.zbr = owg.matchzblist["2022-03-"+this.gametime];
this.zbr.push( owg.matchzblist["2022-03-"+( parseInt(this.gametime)-1 <10 ? '0'+ (parseInt(this.gametime)-1).toString() : (parseInt(this.gametime)-1).toString() )][3]);
this.Num = Ysh.Time.diff('h', Ysh.Time.getTime("d"), Ysh.Time.getTime("h"));
this.init = function () {
    var tData = {};
    var tSport = [ "国家游泳中心", "国家体育馆", "云顶滑雪公园",  "国家冬季两项中心", "国家高山滑雪中心"];
    var tPlace = [ "北京赛区", "北京赛区", "张家口赛区", "张家口赛区", "延庆赛区"];
    var ds = this.ds_data;
    var newdate = '2022-03-';
    for (var i = 0; i < ds.length; i++) {
        var row = ds[i];
        var place = row[0];
        var stime = row[7];
        var etime = row[8];
        var hst = new Date(stime).getHours();
        var mst = new Date(stime).getMinutes();
        var het = new Date(etime).getHours();
        var met = new Date(etime).getMinutes();
        if(Ysh.Time.formatString(stime,'001000') < this.gametime) {
            //stime = newdate + this.gametime +' 00:00:00';
            hst = 0 ;
        }
        if(Ysh.Time.formatString(etime,'001000') > this.gametime) {
            //etime = newdate + this.gametime +' 23:59:59';
            het = 23 ;
        }
        //if(stime==etime)
        //   continue;
        if (!(place in tData))
            tData[place] = ["", place, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","","","","",""]
        for (var j = 2; j < tData[place].length; j++) {
            if( j== (hst + 2))  {
                if(!tData[place][j]){
                    //Ysh.Time.formatString(etime,'000110')
                    if(!tData[place][het+2]){
                         
                    }else{
                        if(tData[place][het+2][2]>etime){
                            etime = tData[place][het+2][2]; 
                            het = new Date(etime).getHours();  
                        }    
                    } 
                    tData[place][j] = [-1,stime,etime,[row]];
                }else{
                    //if(stime < tData[place][j][1]){
                    //if(Ysh.Time.formatString(stime,'000100') >= Ysh.Time.formatString(tData[place][j][1],'000100')){
                     //   if(stime < tData[place][j][1])
                    //    stime = tData[place][j][1]; 
                    //    hst = new Date(stime).getHours();
                    //}
                    
                    //if(Ysh.Time.formatString(etime,'000100') >= Ysh.Time.formatString(tData[place][j][2],'000100')){
                    //    if(etime < tData[place][j][2])
                    //    etime = tData[place][j][2] ;
                    //    stime = tData[place][j][1];
                    //    hst = new Date(stime).getHours(); 
                        
                    //}
                    if(stime > tData[place][j][1])
                        stime = tData[place][j][1]; 
                    if(etime < tData[place][j][2])
                        etime = tData[place][j][2] ;
                    hst = new Date(stime).getHours();
                    het = new Date(etime).getHours();
                    if(Ysh.Time.formatString(stime,'001000') < this.gametime) {
                        //stime = newdate + this.gametime +' 00:00:00';
                        hst = 0 ;
                    }
                    if(Ysh.Time.formatString(etime,'001000') > this.gametime) {
                        //etime = newdate + this.gametime +' 23:59:59';
                        het = 23 ;
                    }
                    for(var k = hst+2; k <= j; k++){
                        if(k == hst+2) tData[place][k][3].push(row);
                        tData[place][k][1] = stime;
                        tData[place][k][2] = etime;
                    }
                    
                }
               
            }
            if( j> (hst + 2)&&j< (het + 2)) tData[place][j] = [0,stime,etime,[row]];
            if( j== (het + 2)&&met>0)  tData[place][j] = [1,stime,etime,[row]];
            
        }
    }
    this.arr = [];
    this.arr.push(["", "鸟巢(国家体育场)", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","", "", "", "" ,""]);
    if(this.gametime == '04'||this.gametime == '13'){
        var name = (this.gametime == '04'?'开幕式':'闭幕式');
        for (var j = 18+2; j < 25; j++) {
            if(j>1) this.arr[0][j] = ["0",newdate + this.gametime+' 18:00:00',newdate + this.gametime+' 23:00:00' ,
            [['',name,'',name,'',newdate + this.gametime+' 18:00:00',newdate + this.gametime+' 23:00:00']]
            ];
        }
    }
    for (var i = 0; i < tSport.length; i++) {
        if(!tData[tSport[i]])
        tData[tSport[i]] = [tPlace[i], tSport[i], "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","","","","",""];
        else
        tData[tSport[i]][0] = tPlace[i];
        this.arr.push(tData[tSport[i]]);
    }
}



//第0列相同的合并第0列
var IsHb = [[0]];//合并判断数据源的列
var HbCol = [[0]];//要合并的表格列   
this.getSpanArr = function (data) {
    for (var i = 0; i < data.length; i++) {
        if (i === 0) {
            this.HbData = [];
            this.pos = [];
            for (var j = 0; j < HbCol.length; j++) {
                this.HbData.push([1]);
                this.pos.push(0);
            }
        }
        else {
            for (var j = 0; j < IsHb.length; j++) {
                var isSame = true;
                for (var k = 0; k < IsHb[j].length; k++)//全部的列都相等时合并
                {
                    if (data[i][IsHb[j][k]] != data[i - 1][IsHb[j][k]])
                        isSame = false;
                }
                if (isSame) {
                    this.HbData[j][this.pos[j]] += 1;
                    this.HbData[j].push(0);
                }
                else {
                    this.HbData[j].push(1);
                    this.pos[j] = i;
                }
            }
        }
    }
    this.HbData1 = [];
    this.pos1 = [];
    for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                if(j==0){
                  this.HbData1.push([1]);
                  this.pos1.push(0);  
                }
                else if(j<=2){
                    this.HbData1[i].push(1);
                    this.pos1[i]= j; 
                }else{
                    var isSame = true;
                    //for (var k = 0; k < IsHb[j].length; k++)//全部的列都相等时合并
                    //{
                        if (data[i][j] == ""|| data[i][j -1] ==""||data[i][j][2] != data[i][j -1][2])
                            isSame = false;
                    //}
                    if (isSame) {
                        this.HbData1[i][this.pos1[i]] += 1;
                        this.HbData1[i].push(0);
                    }
                    else {
                        this.HbData1[i].push(1);
                        this.pos1[i] = j;
                    }
                }
                
                
            }
    }
}
//this.init();
//this.getSpanArr(this.arr);
var _this = this;
this.handleSpan = function (o) {
    var row = o.row;
    var column = o.column;
    var rowIndex = o.rowIndex;
    var columnIndex = o.columnIndex;
    if (rowIndex === 0 && columnIndex === 0) {
        return [0, 0];
    } else if (rowIndex === 0 && columnIndex === 1) {
        return [1, 2];
    }
    for (var i = 0; i < HbCol.length; i++) {
        for (var j = 0; j < HbCol[i].length; j++) {
            if (columnIndex === HbCol[i][j] && _this.HbData.length != 0) {
                const _row = _this.HbData[i][rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }

        }
    }
    if (columnIndex >= 2) {
            const _col = _this.HbData1[rowIndex][columnIndex];
            const _row = _col > 0 ? 1 : 0;
            return {
                rowspan: _row,
                colspan: _col
        
    }
    }
    
}
//获取图片的src
this.GetImg = function (arrData) {
    var arrSrc = [];
    var strSrc = "";
    for (var i = 0; i < arrData.length; i++) {
        switch (arrData[i]) {
            case "冰壶":
                strSrc = "/i/sgc/hbowg/match/binghu.png";
                break;
            case "冬季两项":
                strSrc = "/i/sgc/hbowg/match/dongjiliangxiang.png";
                break;
            case "冰球":
                strSrc = "/i/sgc/hbowg/match/bingqiu.png";
                break;
            case "北欧两项":
                strSrc = "/i/sgc/hbowg/match/beiouliangxiang.png";
                break;
            case "单板滑雪":
                strSrc = "/i/sgc/hbowg/match/danbanhuaxue.png";
                break;
            case "短道速滑":
                strSrc = "/i/sgc/hbowg/match/duandaosuhua.png";
                break;
            case "自由式滑雪":
                strSrc = "/i/sgc/hbowg/match/ziyoushihuaxue.png";
                break;
            case "花样滑冰":
                strSrc = "/i/sgc/hbowg/match/huayanghuabing.png";
                break;
            case "越野滑雪":
                strSrc = "/i/sgc/hbowg/match/yueyehuaxue.png";
                break;
            case "跳台滑雪":
                strSrc = "/i/sgc/hbowg/match/tiaotaihuaxue.png";
                break;
            case "速度滑冰":
                strSrc = "/i/sgc/hbowg/match/suduhuabing.png";
                break;
            case "钢架雪车":
                strSrc = "/i/sgc/hbowg/match/gangjiaxueche.png";
                break;
            case "雪橇":
                strSrc = "/i/sgc/hbowg/match/xueqiao.png";
                break;
            case "雪车":
                strSrc = "/i/sgc/hbowg/match/xueche.png";
                break;
            case "高山滑雪":
                strSrc = "/i/sgc/hbowg/match/gaoshanhuaxue.png";
                break;
            case "开幕式":
            case "闭幕式":
                strSrc = "/i/sgc/hbowg/match/start_end.png";
                break;
        }
        arrSrc.push(strSrc);
    }
    return arrSrc;
}
var _this = this;
var w1 = 27;
var w2 = 27;
var h1 = 40;
var h2 = 20;
var s1 = { width: w1 + "px", height: h1 + 'px' };
var s2 = { width: w2 + "px", height: h1 + 'px' };
var s3 = { width: w2 + "px", height: h2 + 'px' };
var s4 = { width: w2 + "px", height: h2 + 'px' };
this.GetRender = function (h, params) {
    if(params.index == 0|| ((_this.gametime=='04'||_this.gametime=='13')&&params.index == 1) ){
        //if(this.column.className != "ivu-first3")
            this.column.className = "ivu-first3";
        if ((params.column._index - 2 <= _this.Num && "2022-03-"+_this.gametime == Ysh.Time.formatString(new Date(), '111000')) || ("2022-03-"+_this.gametime < Ysh.Time.formatString(new Date(), '111000')))
            this.column.className = "ivu-first5";
    }
    var rowData = this.row[this.column.key];
    if (!rowData)  return ;
    //var arrData = rowData.split(";");
    //var arrSrc = _this.GetImg(arrData);
    var color = '#da823d';
    if(this.index == 0)  color ='red';
    var hnum = new Date(rowData[2]).getHours() - new Date(rowData[1]).getHours() + 1; 
    var left =new Date(rowData[1]).getMinutes()*100/(60*hnum)+'%';
    var right = (60-new Date(rowData[2]).getMinutes())*100/(60*hnum)+'%';
        return h('div',
        {
            style: {
                //'margin-left':left,
                //'margin-right':right,
                'background-color': color,
                display: 'flex',
                height:_this.hRow,
                'align-items': 'center',
                'justify-content': 'center',
                'flex-wrap': 'wrap'
            }
        }, [h("owgsports", { props: { sports: rowData[3] } }),
            h('span', {
                style: {
                    display: 'block',
                    'font-size': '14px'
                }
            }, Ysh.Time.formatString(rowData[1],'000110')+' - '+Ysh.Time.formatString(rowData[2],'000110')),
                            
        ]);
    
    
};


for (var i = 0; i < 25; i++) {
    var title1 = "";
    var title2 = "";
    if (i == 0) {
        this.itable1_columns[1].renderHeader = function(h, params) {
            return h('div', [
                   h('span', {
                       style: {
                           display: 'block',
                           'line-height':'50px',
                           'font-size': '14px'
                       }, attrs: {
                           id: 145,
                           colspan: 1
                       },
                       colspan: 1
                   })

            ]);
        }
    }

    //if (this.itable1_columns[i + 1].title.indexOf("$") > -1) {
    if (i != 24) {
        this.itable1_columns[i + 1].renderHeader = function(h, params) {
            return h('div', [
               h('span', {
                   style: {
                       display: 'block',
                       'line-height':'50px',
                       'font-size': '14px'
                   }
               }, params.column.title),
                                 h('span', {
                                     style: {
                                         'font-size': '14px'

                                     }
                                 }),
            ]);

        }

        //if (i == this.Num) {
        //    this.itable1_columns[i + 1].className = "ivu-first4";
        //}
        //if ((i <= this.Num && "2022-03-"+this.gametime == Ysh.Time.formatString(new Date(), '111000')) || ("2022-03-"+this.gametime < Ysh.Time.formatString(new Date(), '111000')))
        //                this.itable1_columns[i + 1].className = "ivu-first5";
        this.itable1_columns[i + 1].render = _this.GetRender;
    }

}
this.init();
this.getSpanArr(this.arr);