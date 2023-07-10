
Ysh.Object.addHandle(this, "resize",
function () {
    this.h0 = $(this.$el).height() - 22;
    var r = parseFloat(this.$el.style.zoom || 1);
    //var hRow =
    this.hRow = parseInt(($(window.document).height() - 240) / 13, 10) + "px";
});
var zblist='';
this.Num = Ysh.Time.diff('d', new Date(Ysh.Time.parseDate("2022-02-02")), Ysh.Time.getTime("d")) + 2;
this.init = function () {
    var tData = {};
    //var owg = {imgPath:"/i/sgc/hbowg/" };
    zblist = owg.matchzblist;
    this.lstLegends = [
        [owg.imgPath + "match/binghu2.png", "冰壶"],
        [owg.imgPath + "match/dongjiliangxiang2.png", "冬季两项"],
        [owg.imgPath + "match/bingqiu2.png", "冰球"],
        [owg.imgPath + "match/beiouliangxiang2.png", "北欧两项"],
        [owg.imgPath + "match/danbanhuaxue2.png", "单板滑雪"],
        [owg.imgPath + "match/duandaosuhua2.png", "短道速滑"],
        [owg.imgPath + "match/ziyoushihuaxue2.png", "自由式滑雪"],
        [owg.imgPath + "match/huayanghuabing2.png", "花样滑冰"],
        [owg.imgPath + "match/yueyehuaxue2.png", "越野滑雪"],
        [owg.imgPath + "match/tiaotaihuaxue2.png", "跳台滑雪"],
        [owg.imgPath + "match/suduhuabing2.png", "速度滑冰"],
        [owg.imgPath + "match/gangjiaxueche2.png", "钢架雪车"],
        [owg.imgPath + "match/xueqiao2.png", "雪橇"],
        [owg.imgPath + "match/xueche2.png", "雪车"],
        [owg.imgPath + "match/gaoshanhuaxue2.png", "高山滑雪"]
    ];
    var tSport = ["五棵松体育中心", "首都体育馆", "国家速滑馆", "首钢滑雪大跳台", "国家游泳中心", "国家体育馆", "国家越野滑雪中心", "云顶滑雪公园", "国家跳台滑雪中心", "国家冬季两项中心", "国家高山滑雪中心", "国家雪车雪橇中心"];
    var tPlace = ["北京赛区", "北京赛区", "北京赛区", "北京赛区", "北京赛区", "北京赛区", "张家口赛区", "张家口赛区", "张家口赛区", "张家口赛区", "延庆赛区", "延庆赛区"];
    var ds = this.ds_data;
    for (var i = 0; i < ds.length; i++) {
        var row = ds[i];
        var place = row[0];
        var sport = row[1];
        var dt = row[2];
        if (!(place in tData))
            tData[place] = ["", place, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
        tData[place][dt].push(row);
    }
    this.arr = [];
    this.arr.push(["", "鸟巢(国家体育场)", "", "", [["", "开幕式"]], "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", [["", "闭幕式"]]]);
    for (var i = 0; i < tSport.length; i++) {
        tData[tSport[i]][0] = tPlace[i];
        this.arr.push(tData[tSport[i]]);
    }
}

this.init();

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
}
this.getSpanArr(this.arr);
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
}
//获取图片的src
this.GetImg = function (arrData) {
    var arrSrc = [];
    var strSrc = "";
    for (var i = 0; i < arrData.length; i++) {
        switch (arrData[i]) {
            case "冰壶":
                strSrc = "match/binghu.png";
                break;
            case "冬季两项":
                strSrc = "match/dongjiliangxiang.png";
                break;
            case "冰球":
                strSrc = "match/bingqiu.png";
                break;
            case "北欧两项":
                strSrc = "match/beiouliangxiang.png";
                break;
            case "单板滑雪":
                strSrc = "match/danbanhuaxue.png";
                break;
            case "短道速滑":
                strSrc = "match/duandaosuhua.png";
                break;
            case "自由式滑雪":
                strSrc = "match/ziyoushihuaxue.png";
                break;
            case "花样滑冰":
                strSrc = "match/huayanghuabing.png";
                break;
            case "越野滑雪":
                strSrc = "match/yueyehuaxue.png";
                break;
            case "跳台滑雪":
                strSrc = "match/tiaotaihuaxue.png";
                break;
            case "速度滑冰":
                strSrc = "match/suduhuabing.png";
                break;
            case "钢架雪车":
                strSrc = "match/gangjiaxueche.png";
                break;
            case "雪橇":
                strSrc = "match/xueqiao.png";
                break;
            case "雪车":
                strSrc = "match/xueche.png";
                break;
            case "高山滑雪":
                strSrc = "match/gaoshanhuaxue.png";
                break;
            case "开幕式":
            case "闭幕式":
                strSrc = "match/start_end.png";
                break;
        }
        arrSrc.push(owg.imgPath + strSrc);
    }
    return arrSrc;
}
this.colClick = function (dtime) {
    var owg = ProjectSGC.Global.getMainObject("owg");
    var vMain = ProjectSGC.Global.getMainObject("vMain");
    if (owg.matchPage)
        vMain.destroyFloatPage(owg.matchPage);
    owg.matchPage = vMain.floatPage("sgc_owg_matchtime_aj", {
        css: { zoom: owg.sz, bottom: 0 }, top: owg.top + "px", height: "calc(100% - " + owg.top + "px)", gametime: dtime, main: {
            closeFloat: function () {
            }
        }
    }) ;
};
var _this = this;
var w1 = 27;
var w2 = 27;
var h1 = 30;
var h2 = 15;
var s1 = { width: w1 + "px", height: h1 + 'px' };
var s2 = { width: w2 + "px", height: h1 + 'px' };
var s3 = { width: w2 + "px", height: h2 + 'px' };
var s4 = { width: w2 + "px", height: h2 + 'px' };
this.GetRender = function (h, params) {
    var rowData = this.row[this.column.key];
    if (!rowData) return;
    if (rowData.length == 0) return;
    return h("owgsports", { props: { sports: rowData } });
    var arrData = rowData.split(";");
    var arrSrc = _this.x(arrData);
    switch (arrData.length) {
        case 0:
            return h('div', []);
        case 1:
            return h('div', [h('img', { domProps: { src: arrSrc[0], title: arrData[0] }, style: s1 })]);
            break;
        case 2:
            return h('div',
              {
                  style: {
                      display: 'flex',
                      "justify-content": "center"
                  }
              }, [
                  h('img', {
                      domProps: {
                          src: arrSrc[0], title: arrData[0]
                      },
                      style: s2
                  }),
                  h('img', {
                      domProps: {
                          src: arrSrc[1], title: arrData[1]
                      },
                      style: s2
                  })
              ]);
            break;
        case 3:
            return h('div',
            {
                style: {
                    display: 'flex',
                    'flex-wrap': 'wrap'
                }
            }, [
                  h('img', {
                      domProps: {
                          src: arrSrc[0], title: arrData[0]
                      },
                      style: s3
                  }),
                  h('img', {
                      domProps: {
                          src: arrSrc[1], title: arrData[1]
                      },
                      style: s3
                  }),
                  h('img', {
                      domProps: {
                          src: arrSrc[2], title: arrData[2]
                      },
                      style: s3
                  })
            ]);
            break;
        case 4:
            return h('div',
            {
                style: {
                    display: 'flex',
                    'flex-wrap': 'wrap'
                }
            }, [
                  h('img', {
                      domProps: {
                          src: arrSrc[0], title: arrData[0]
                      },
                      style: s4
                  }),
                  h('img', {
                      domProps: {
                          src: arrSrc[1], title: arrData[1]
                      },
                      style: s4
                  }),
                  h('img', {
                      domProps: {
                          src: arrSrc[2], title: arrData[2]
                      },
                      style: s4
                  }),
                  h('img', {
                      domProps: {
                          src: arrSrc[3], title: arrData[3]
                      },
                      style: s4
                  })
            ]);
            break;

    }

};

/*this.itable1_columns[0] = {
    title: '安监值班负责人',
    align: 'center',
    width: 100,
    children: [
        {
            title: '安监值班负责人',
            align: 'center',
            width: 100,
            children: [
                {
                    title: '安监值班负责人',
                    align: 'center',
                    width: 100,
                    children: [
                        {
                            title: '场馆/日期',
                            key: 'arr_0',
                            width: 100,
                            align: 'center'

                        }
                    ]
                }
            ]
        }
    ]
}
this.itable1_columns[1] = {
    title: '带班领导',
    align: 'center',
    width: 100,
    children: [
        {
            title: '白班（8:30--17:30）',
            align: 'center',
            width: 100,
            children: [
                {
                    title: '夜班（17:30--8:30）',
                    width: 100,
                    align: 'center',
                    children: [
                        {
                            title: '场馆/日期',
                            key: 'arr_1',
                            width: 100,
                            align: 'center',
                            render: function (h, params) { return h('sgc_owg_match_itable1_1', { props: { params: params, page: page } }); }
                        }
                    ]
                }
            ]
        }
    ]
}*/

var page = this;
for (var i = 0; i < 21; i++) {
    var title1 = this.itable1_columns[i].title.split("$")[1];
    var title2 = "";
    if (this.itable1_columns[i].title.indexOf("$") > -1) {
        this.itable1_columns[i].renderHeader = function (h, params) {
            return h('div', [
                   h('span', {
                       style: {
                           display: 'block',
                           'font-size': '12px'
                       },
                       on: {
                        'click': (event) => {
                            //alert(params.column.title.split("$")[1]);
                            _this.colClick(params.column.title.split("$")[1]);//标题的click事件
                        }
                    }
                   }, params.column.title.split("$")[0]),
                h('span', {
                    style: {
                        'font-size': '14px'

                    },
                    on: {
                        'click': (event) => {
                            //alert(params.column.title.split("$")[1]);
                            _this.colClick(params.column.title.split("$")[1]);//标题的click事件
                        }
                    }
                }, params.column.title.split("$")[1])

            ]);

        }

        if (i == this.Num) {
            this.itable1_columns[i].className = "ivu-first4";
        }
        if (i < this.Num)
            this.itable1_columns[i].className = "ivu-first5";
        if (i != 0 && i != 1)
            this.itable1_columns[i].render = _this.GetRender;
    }
    switch (i) {
        case 0:
            this.itable1_columns[0] = {
                title: '值班负责人',
                align: 'center',
                width: 40,
                children: [
                    {
                        title: '值班负责人',
                        align: 'center',
                        width: 40,
                        children: [
                            {
                                title: '值班负责人',
                                align: 'center',
                                width: 40,
                                children: [
                                    {
                                        title: '场馆/日期',
                                        key: 'arr_0',
                                        className: 'ivu-first',
                                        width: 40,
                                        align: 'center'

                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
            break;
        case 1:
            this.itable1_columns[1] = {
                title: '带班领导',
                align: 'center',
                width: 110,
                children: [
                    {
                        title: '白班(8:30--17:30)',
                        align: 'center',
                        width: 110,
                        children: [
                            {
                                title: '夜班(17:30--8:30)',
                                width: 110,
                                align: 'center',
                                children: [
                                    {
                                        title: '场馆/日期',
                                        key: 'arr_1',
                                        width: 110,
                                        className: 'ivu-first2',
                                        align: 'center',
                                        render: function (h, params) { return h('sgc_owg_match_aj_itable1_1', { props: { params: params, page: page } }); }

                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
            break;
        default:
            var newCol = {
                title: zblist['2022-02-'+title1][1],//带班领导
                align: 'center',
                width: 80,
                children: [
                    {
                        title: zblist['2022-02-'+title1][2],//白班
                        align: 'center',
                        width: 120,
                        children: [
                            {
                                title: zblist['2022-02-'+title1][3],//夜班
                                width: 120,
                                align: 'center',
                                children: [this.itable1_columns[i]]//日期/场馆
                            }
                        ]
                    }
                ]
            }
            this.itable1_columns[i] = newCol;
            break;
    }
}
this.itable1_columns[1].renderHeader = function (h, params) {
    return h('div', [
       h('span', {
           style: {
               'font-size': '14px'
           }
       }, "带班领导"),
                         h('span', {
                             style: {
                                 'font-size': '14px'

                             }
                         }, "")

    ]);

}
this.itable1_columns[1].children[0].renderHeader = function (h, params) {
    return h('div', [
        h('span', {
            style: {
                'font-size': '14px'
            }
        }, "白班"),
        h('span', {
            style: {
                'font-size': '12px'

            }
        }, "(8:30--17:30)")

    ]);

}
this.itable1_columns[1].children[0].children[0].renderHeader = function (h, params) {
    return h('div', [
        h('span', {
            style: {
                'font-size': '14px'
            }
        }, "夜班"),
        h('span', {
            style: {
                'font-size': '12px'

            }
        }, "(17:30--8:30)")

    ]);

}