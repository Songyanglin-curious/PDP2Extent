/*v=1.20.628.2*/
var SGC3k = {
    getTypeName_3k: function (t) {
        switch (t) {
            case 4: return "河流";
            case 2: return "高速";
            case 3: return "铁路";
                return '/i/sgc/3k/rail.png';
            case 1: return "线路";
            default:
                return "";
        }
    },
    getTypeImg_3k: function (t) {
        switch (t) {
            case 4:
                return '/i/sgc/3k/river.png';
            case 2:
                return '/i/sgc/3k/road.png';
            case 3:
                return '/i/sgc/3k/rail.png';
            case 1:
                return '/i/sgc/3k/line.png';
            default:
                return "";
        }
    },
    isInLineSeg: function (tower, tStart, tEnd) {
        return (tower[2] >= tStart[2]) && (tower[2] < tEnd[2]);
    },
    getLineSeg: function (arrLineSeg, towers, id, tower) {
        for (var i = 0; i < arrLineSeg.length; i++) {
            var ls = arrLineSeg[i];
            var start = ls[3];
            if (id == start)
                return ls;
            var tStart = towers[start];
            if (!tStart)
                continue;
            var tEnd = towers[ls[4]];
            if (!tEnd)
                continue;
            if (this.isInLineSeg(tower, tStart, tEnd))
                return ls;
        }
        return Ysh.Array.initN(8, "");
    },
    getAcross: function (arrAcross, id) {
        var ret = [];
        for (var i = 0; i < arrAcross.length; i++) {
            var a = arrAcross[i];
            var start = a[0];
            if (start == id)
                ret.push(a);
        }
        if (ret.length == 0)
            ret.push(Ysh.Array.initN(8, ""));
        return ret;
    },
    combineTower: function (arrTower, arrLineSeg, arrAcross) {
        //arrTower:id,name,no,lon,lat,tx,tc,region
        //arrLineSeg:ID,MODEL,LENGTH,BEGIN_TOWER_ID,END_TOWER_ID,MAINT_ORG_ID,ON_TIME
        //arrAcross:towerminid,towermaxid,across_type,across_id,across_name,lon,lat,id
        //id,name,xh  cq xj dj cd kt kn dq ty dw tc tx ln lt im
        var ret = [];
        var towers = ProjectSGC.toDictionary(arrTower, 0);
        var kid = 0;
        for (var i = 0; i < arrTower.length; i++) {
            var tower = arrTower[i];
            var id = tower[0];
            var lineSeg = this.getLineSeg(arrLineSeg, towers, id, tower);
            var arrTowerAcross = this.getAcross(arrAcross, id);
            for (var j = 0; j < arrTowerAcross.length; j++) {
                var across = arrTowerAcross[j];
                kid++;
                ret.push([id, tower[1], lineSeg[1], "", "", "", lineSeg[2]
                    , across[2], across[4], tower[7], lineSeg[6], lineSeg[5]
                    , tower[6], tower[5], tower[3], tower[4], "", across[5], across[6], across[7] || kid
                ]);
            }
        }
        return ret;
    },
    getBorderName: function (arr) {
        if (arr.length == 0)
            return "";
        if (arr.length == 1)
            return SGC3k.getTowerNum(arr[0]);
        return SGC3k.getTowerNum(arr[0]) + "-" + SGC3k.getTowerNum(arr[arr.length - 1]);
    },
    getTowerNum: function (str) {
        var index = str.indexOf("线");
        if (index >= 0)
            str = str.substr(index + 1);
        return str.replace("杆塔", "").replace("号", "").replace("#", "");
    },
    getDrawLine: function (ds) {
        var towerline = [];
        var prev = { id: "", group: "", obj: null };
        var names = [];
        for (var i = 0; i < ds.length; i++) {
            var row = ds[i];
            var id = row[0];
            var name = row[1];            
            var group = row[9];
            var k3 = row[7];
            var k3n = row[8];
            var kid = row[19];
            if (prev.obj == null) {//第一个，肯定新建一个
                names.push(name);
                var o = { weight: "1px", text: SGC3k.getTowerNum(name), group: group,links:[] };
                if (k3)
                    o.links = [{ data: row, img: SGC3k.getTypeImg_3k(k3), text: k3n, id: kid }];
                towerline.push(o);
                prev.obj = o;
                continue;
            } else {
                if (k3) {
                    if (id == prev.id) {//同一个杆塔，合并3跨点
                        prev.obj.links.push({ data: row, img: SGC3k.getTypeImg_3k(k3), text: k3n, id: kid });
                    } else {//不是同一个杆塔，如果前边没有3跨点，那么合并名字，如果前边有3跨点，重起一个对象
                        if (prev.obj.links.length > 0) {
                            var o = { weight: "1px", text: SGC3k.getTowerNum(name), group: group, links: [{ data: row, img: SGC3k.getTypeImg_3k(k3), text: k3n, id: kid }] };
                            towerline.push(o);
                            prev.obj = o;
                            names = [name];
                        } else {//没有3跨点，看是不是同组
                            if (group != prev.obj.group) {
                                var o = { weight: "1px", text: SGC3k.getTowerNum(name), group: group, links: [{ data: row, img: SGC3k.getTypeImg_3k(k3), text: k3n, id: kid }] };
                                towerline.push(o);
                                names = [name];
                                prev.obj = o;
                            } else {
                                names.push(name);
                                prev.obj.links = [{ data: row, img: SGC3k.getTypeImg_3k(k3), text: k3n, id: kid }];
                                prev.obj.text = this.getBorderName(names);
                            }
                        }
                    }
                } else {//如果前边有3跨点，重起一个对象，如果是同组，那么和前边合并，如果不同组，那么重起一个对象                    
                    if ((group != prev.obj.group) || (prev.obj.links.length > 0)) {
                        var o = { weight: "1px", text: SGC3k.getTowerNum(name), group: group,links:[] };
                        towerline.push(o);
                        names = [name];
                        prev.obj = o;
                    } else {
                        names.push(name);
                        prev.obj.text = this.getBorderName(names);
                    }
                }
            }
            prev.id = id;
            prev.group = group;
        }
        return towerline;
    },
    get3kCount: function (arr) {
        var n = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != "")
                n++;
        }
        return n > 0 ? n + "个跨点" : "";
    }
}