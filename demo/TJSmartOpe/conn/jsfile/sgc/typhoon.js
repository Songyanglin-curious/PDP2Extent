/*v=1.21.726.1*/
Vue.component('typhoon-head', {
    props: {
        orgs: { type: Array, "default": [] },
        name: { type: String, "default": "" }
    },
    data: function () {
        return {
            org: "",
            state: 0
        }
    },
    computed: {
        playImg: function () { return this.state ? "/i/sgc/typhoon/tpause.png" : "/i/sgc/typhoon/tplay.png"; }
    },
    methods: {
        selectOrg: function (o) { this.$emit("orgchanged", o); },
        play: function () { this.state = 1 - this.state; this.$emit("statechanged", this.state); }
    },
    created: function () {
        if (this.orgs && this.orgs.length > 0) {
            for (var i = 0; i < this.orgs.length; i++) {
                var org = this.orgs[i];
                if (org[0] <= 0)
                    continue;
                this.org = org[0];
                return;
            }
        }
    },
    template: `<div style="position:relative">
            <img style="display:block" src="/i/sgc/typhoon/torg.png" />
            <img style="display:block" src="/i/sgc/typhoon/tname.png" />
            <i-select v-model="org" style="background-color: #2F6F41;position:absolute;top:10px;left:10px;width:90px" @on-select="selectOrg">
                <i-option v-for="item in orgs" :label="item[1]" :value="item[0]" :key="item[0]"></i-option>
            </i-select>
            <img style="position:absolute;top:118px;left:20px;cursor:pointer" :src="playImg" @click="play" />
            <div style="position:absolute;top:50px;height:45px;width:90px;left:0px;display:flex;justify-content:center;align-items:center">
                <span style="font-size:20px;font-weight:700;text-align:center;vertical-align:middle;">{{name}}</span>
            </div>
        </div>`
});

Vue.component('typhoon', {
    data: function () {
        return { wLeft: 120, wRight: 120, widthBox: 0, groupSelected: "", curTime: new Date(), isLeft: true, isRight: false };
    },
    props: {
        "datalist": {
            type: Array,
            "default": function () { return []; }
        },
        name: { type: String, "default": "" },
        itemwidth: { type: Number, "default": 120 },
        now: { type: Date, "default": function () { return new Date(); } }
    },
    computed: {
        width: function () {
            if (this.showCount < 2)
                return this.widthAll - this.wLeft;
            var w = (this.widthAll - this.wLeft - this.wRight) / (this.showCount - 1);
            if (w < this.itemwidth)
                return this.itemwidth;
            return w;
        },
        needScroll: function () {
            return this.widthBox < this.widthAll;
        },
        groups: function () {
            var ret = [];
            var gLast = null;
            var idx = 0;
            for (var i = 0; i < this.datalist.length; i++) {
                var o = this.datalist[i];
                if (o.group && o.group.text) {
                    if (gLast == null) {
                        gLast = { text: o.group.text, data: o.group, start: idx, end: idx };
                        ret.push(gLast);
                    } else {
                        if (gLast.text == o.group.text) {
                            gLast.end = idx;
                        } else {
                            gLast = { text: o.group.text, data: o.group, start: idx, end: idx };
                            ret.push(gLast);
                        }
                    }
                } else {
                    gLast = null;
                }
                var showItem = true;
                if (this.groupSelected) {
                    if (o.group.text != this.groupSelected)
                        showItem = false;
                }
                if (showItem)
                    idx++;
            }
            for (var i = 0; i < ret.length; i++) {
                var g = ret[i];
                this.extendGroup(g, i, ret[i - 1]);
                if (this.groupSelected) {
                    if (g.text == this.groupSelected)
                        return [g];
                }
            }
            return ret;
        },
        widthAll: function () {
            var w = (this.showCount - 1) * this.itemwidth + this.wLeft + this.wRight;
            if (w < this.widthBox)
                w = this.widthBox;
            return w;
        },
        boxStyle: function () {
            return { width: this.widthAll + 'px' };
        },
        showCount: function () {
            if (!this.groupSelected)
                return this.datalist.length;
            var ret = 0;
            for (var i = 0; i < this.datalist.length; i++) {
                var item = this.datalist[i];

                if (item.group.text != this.groupSelected)
                    continue;
                ret++;
            }
            return ret;
        },
        showList: function () {
            var ret = [];
            var prev = null;
            for (var i = 0; i < this.datalist.length; i++) {
                var item = this.datalist[i];
                if (this.groupSelected) {
                    if (item.group.text != this.groupSelected)
                        continue;
                }
                var o = Ysh.Object.clone(item);
                o.prev = prev;
                this.extendItem(o, ret[ret.length - 1], ret.length, i);
                ret.push(o);
                prev = o;
            }
            return ret;
        },
        leftImg: function () {
            return this.isLeft ? "/i/sgc/typhoon/left0613.png" : "/i/sgc/typhoon/left200613.png";
        },
        rightImg: function () {
            return this.isRight ? "/i/sgc/typhoon/right0613.png" : "/i/sgc/typhoon/right200613.png";
        }
    },
    methods: {
        locateNow: function () {
            this.$refs.jumpland.click();
            var pos = this.$refs.box.scrollLeft;
            this.$refs.jump.click();
            var pos1 = this.$refs.box.scrollLeft;
            var w = $(this.$refs.box).width() / 2;
            if (pos < pos1)
                this.$refs.box.scrollLeft += w;
            else if (pos1 > w)
                this.$refs.box.scrollLeft -= w;
            console.log([pos, w, pos1, this.$refs.box.scrollLeft]);
        },
        getItemLeft: function (index, sz) {
            var w = this.width * index + this.wLeft - sz;
            return w + 'px';
        },
        setItemLand: function (item, index, pos) {
            item.domid = "_land";
            item.img = "/i/sgc/typhoon/land.png";
            item.styles.left = this.getItemLeft(index, 20);
            item.styles.top = (pos - 35) + 'px';
        },
        setItemPrevCurrent: function (time, item, index, pos, bCurr) {
            if (item.timeLast >= time) {
                if (!bCurr)
                    item.domid = "now";
                item.img = bCurr ? "/i/sgc/typhoon/now.png" : "/i/sgc/typhoon/current.png";
                item.styles.left = this.getItemLeft(index, 48);
                item.styles.top = (pos - 60) + 'px';
                item.timestr = Ysh.Time.formatString(item.time, "1001100") + " " + item.info;
                item.stylesTime.top = "138px";//"10px";
                item.stylesTime["background-image"] = "url(/i/sgc/typhoon/current-text.png)";
                item.stylesTime.width = "363px"
                item.stylesTime.height = "27px"
                item.stylesTime.left = this.getItemLeft(index, 180);
            }
            if (!item.prev)
                return;
            this.setItemPrevCurrent(time, item.prev, index - 1, pos, bCurr);
        },
        setItemCurrent: function (item, index, pos, bCurr) {
            if (!bCurr)
                item.domid = "now";
            else {
                if ((item.time <= this.now) && (item.timeLast >= this.now))
                    item.domid = "now";
            }
            item.img = bCurr ? "/i/sgc/typhoon/now.png" : "/i/sgc/typhoon/current.png";
            item.styles.left = this.getItemLeft(index, 48);
            item.styles.top = (pos - 60) + 'px';
            item.timestr = Ysh.Time.formatString(item.time, "1001100") + " " + item.info;
            item.stylesTime.top = "138px";//"10px";
            item.stylesTime["background-image"] = "url(/i/sgc/typhoon/current-text.png)";
            item.stylesTime.width = "363px"
            item.stylesTime.height = "27px"
            item.stylesTime.left = this.getItemLeft(index, 180);
            if (!item.prev)
                return;
            var tm = bCurr ? this.curTime : this.now;
            if (tm > item.timeLast)
                tm = item.timeLast;
            this.setItemPrevCurrent(tm, item.prev, index - 1, pos, bCurr);
        },
        extendItem: function (item, prev, index, indexAll) {
            item.styles = {};
            var pos = 95;
            item.stylesText = { left: this.getItemLeft(index, 50), width: "100px", "text-align": "center", top: (pos + 20) + 'px' }
            this.extendTime(item, prev, index);
            if (!item.stylesTime.top)
                item.stylesTime.top = (pos - 45) + 'px'
            /*if (item.type == 0) {
                item.img = "/i/sgc/typhoon/born.png";
                item.styles.left = this.getItemLeft(index, 10);
                item.styles.top = (pos - 20) + 'px';
                return;
            }*/
            if (index == 0) {
                this.setItemLand(item, index, pos);
                return;
            }
            if (item.time <= this.curTime) {
                var itemNext = this.datalist[indexAll + 1];
                if (itemNext) {
                    if (itemNext.time > this.curTime) {
                        this.setItemCurrent(item, index, pos, true);
                        return;
                    }
                } else {
                    if (item.timeLast >= this.curTime) {
                        this.setItemCurrent(item, index, pos, true);
                        return;
                    }
                }
            }
            if (item.time > this.now) {
                item.img = "/i/sgc/typhoon/point.png";
                item.styles.left = this.getItemLeft(index, 16);
                item.styles.top = (pos - 10) + 'px';
                return;
            }
            var itemNext = this.datalist[indexAll + 1];
            if (itemNext) {
                if (itemNext.time > this.now) {
                    this.setItemCurrent(item, index, pos);
                    return;
                }
            } else {
                if (item.timeLast >= this.now) {
                    this.setItemCurrent(item, index, pos);
                    return;
                }
            }
            item.img = "/i/sgc/typhoon/point-over.png";
            item.styles.left = this.getItemLeft(index, 16);
            item.styles.top = (pos - 10) + 'px';
        },
        setTime0: function (item, index) {
            item.timestr = Ysh.Time.formatString(item.time, "110");
            item.stylesTime["background-image"] = "url(/i/sgc/typhoon/time0.png)";
            item.stylesTime["height"] = "33px";
            item.stylesTime["width"] = "87px";
            item.stylesTime.left = this.getItemLeft(index, 46);
            item.stylesTime.paddingTop = "2px";
        },
        setTime1: function (item, index) {
            item.timestr = Ysh.Time.formatString(item.time, "1011000") + Ysh.Time.formatString(item.time, "110");
            item.stylesTime["background-image"] = "url(/i/sgc/typhoon/time1.png)";
            item.stylesTime["height"] = "29px";
            item.stylesTime["width"] = "138px";
            item.stylesTime.left = this.getItemLeft(index, 70);
            item.stylesTime.paddingTop = "4px";
        },
        extendTime: function (item, prev, index) {
            item.stylesTime = { left: this.getItemLeft(index, 50), width: "100px", "text-align": "center" }
            /*if (index == 0) {
                //item.timestr = Ysh.Time.formatString(item.time, "011000");
                //item.stylesTime.
                item.timestr = "";
                item.address = Ysh.Time.formatString(item.time, "1011000") + "<br />" + this.name + "产生";
                return;
            }*/
            if (index == 0) {
                this.setTime1(item, index);
                item.stylesTime.top = "138px";
                return;
            }
            if (item.time.getDate() == prev.time.getDate()) {
                this.setTime0(item, index);
                return;
            }
            this.setTime1(item, index);
        },
        extendGroup: function (g, index, gPrev) {
            g.imgLeft = "/i/sgc/typhoon/group-left" + (index % 4) + ".png";
            g.imgMiddle = "/i/sgc/typhoon/group-middle" + (index % 4) + ".png";
            g.imgRight = "/i/sgc/typhoon/group-right" + (index % 4) + ".png";
            g.imgHead = "/i/sgc/typhoon/head" + (index % 4) + ".png";
            if (g.start == 0) {
                g.width = this.wLeft + (g.end - g.start + 1) * this.width;
                g.left = 0;
            } else {
                g.width = (g.end - g.start + 1) * this.width + 80;
                g.left = gPrev.left + gPrev.width - 80;
            }
            g.styles = { width: g.width + 'px', left: g.left + 'px' };
            if (this.groupSelected) {
                if ((this.groupSelected == g.text) && (g.width < this.widthBox))
                    g.styles.width = this.widthBox + 'px';
            }
            //g.styles = { width: (this.wLeft + (g.end - g.start + 1) * this.width) + 'px', left: this.getItemLeft(g.start, this.wLeft) };
            //else if (index == this.groups.length - 1)
            //    g.styles.width = this.
            g.stylesHead = { left: this.getItemLeft(g.start, 10), top: "5px" };
            g.stylesText = { left: this.getItemLeft(g.start, -10), top: "9px" };
        },
        clickLink: function (item, index, link, linkIndex) {
            this.$emit('clicklink', item, index, link, linkIndex);
        },
        click: function (item, bText) {
            //this.selectedIndex = index;
            //this.$emit('input', item.key);
            this.$emit('click', item, bText);
        },
        refreshArrowImg: function () {
            var left = this.$refs.box.scrollLeft;
            this.isLeft = left == 0;
            this.isRight = (left + $(this.$refs.box).width()) == this.$refs.box.scrollWidth;
            
        },
        scroll: function (toLeft) {
            if (toLeft) { if (this.isLeft) return; }
            else { if (this.isRight) return; }
            this.$refs.box.scrollLeft += (toLeft ? -this.widthBox / 2.0 : this.widthBox / 2.0);
            this.refreshArrowImg();
        },
        selectGroup: function (g) {
            if (this.groupSelected) this.groupSelected = "";
            else this.groupSelected = g.text;
            this.$emit("clickgroup", this.groupSelected ? g : null);
            this.$refs.box.scrollLeft = 0;
            this.isLeft = true;
            this.isRight = false;
        },
        showCurve: function (id) {
            ProjectSGC.Card.showCard("pwrgridmeascard", "0101" + id);
        },
        resize: function () {
            this.widthBox = $(this.$el).width();
        },
        onmousewheel: function (e) {
            this.scroll(e.wheelDelta > 0);
        }
    },
    created: function () {
        //this.curTime = new Date(Ysh.Time.parseDate("2019-08-12 00:00:00"));
    }, mounted: function () {
        this.widthBox = $(this.$el).width();
    }, template: `<div style="width:100%;height:100%" @mousewheel="onmousewheel($event)"><a ref="jump" style="display:none" href="#now"></a><a ref="jumpland" style="display:none" href="#_land"></a>
            <div ref="box" class="typhoon" :style="{ width:(false?'calc(100% - 55px)':'100%') }">
                <div class="typhoon-box" :style="boxStyle">
                    <img src="/i/sgc/typhoon/bk.png" class="typhoon-bk" />
                    <img src="/i/sgc/typhoon/line.png" class="typhoon-path" />
                    <template v-for="(item,index) in showList">
                        <img :id="item.domid" class="typhoon-item-img" :src="item.img" :style="item.styles"  style="cursor:pointer" @click.stop="click(item)" />
                        <span class="typhoon-item-text" :style="item.stylesText" style="cursor:pointer;vertical-align:middle;" @click.stop="click(item)">
                            {{item.address}}<img src="/i/sgc/operate/fuhe.png" style="margin-left:3px;vertical-align:middle;" @click.stop="click(item,true)" />
                        </span>
                        <div class="typhoon-item-time" :style="item.stylesTime">{{item.timestr}}</div>
                    </template>
                    <div v-for="(g,index) in groups" :style="g.styles" style="position:absolute;height:100%;font-size:0">
                        <div class="typhoon-group-img">
                            <img :src="g.imgLeft" />
                            <img :src="g.imgMiddle" style="width:calc(100% - 157px);height:100%;" />
                            <img :src="g.imgRight" />
                        </div>
                        <img :src="g.imgHead" class="typhoon-group-img-head" style="cursor:pointer" @click.stop="selectGroup(g)" />
                        <span class="typhoon-group-text-head" style="cursor:pointer" @click.stop="selectGroup(g)">
                            {{g.text}}<img src="/i/sgc/operate/fuhe.png" style="margin-left:3px;margin-bottom:3px;" @click.stop="showCurve(g.data.id)" />
                        </span>
                        <span style="position:absolute;left:237px;z-index:7;top:8px;cursor:pointer" v-if="groupSelected" @click.stop="selectGroup(g)">返回全路径</span>
                    </div>
                </div>
            </div>
            <div class="typhoon-scroll" v-if="needScroll">
                <img :src="leftImg" @click="scroll(true)" />
                <img :src="rightImg" @click="scroll()" style="margin-left:2px;" />
            </div>
        </div>`
});

var SGC_Typhoon = {
    columns: { TIME: 0, LONGITUDE: 2, LATITUDE: 1, CITY: 3, REGION: 4, ORG: 5 },
    regions: null,
    init: function (regions) {
        this.regions = regions;
    },
    getProvince: function (region) {
        if (!region)
            return null;
        while (true) {
            var r = Ysh.Array.findRowBinary(this.regions, 0, region);
            if (r < 0)
                return null;
            r = this.regions[r];
            if (r[3] == "province")
                return r;
            region = r[2];//parent
            if (!region)
                return null;
        }
    },
    getItemByRow: function (row) {
        var region = row[this.columns.REGION];
        var group = this.getProvince(region);
        if (group) { group = { id: group[0], text: group[1] }; } else { group = { id: "", text: "" }; }
        var time = new Date(Ysh.Time.parseDate(row[this.columns.TIME]));
        return {
            data: row,
            group: group,
            address: row[this.columns.CITY],
            time: time,
            timeLast: time,
            info: ""//"风速：30m/s,9级特强气旋"
        };
    },
    locate: function (item, bText) {
        if (!bText) {
            var MapOpeInst = ProjectSGC.Global.getMainObject("MapOpeInst");
            MapOpeInst.menu("LocationArea", true, { arrownerid: [item.data[this.columns.REGION]], Level: 1004, padding: [0, 0, 0, 0], isParentArea: false, isShowOld: true, isShowShape: false, isShowLine: false });
        } else {
            ProjectSGC.Card.showCard("pwrgridmeascard", "0101" + item.data[this.columns.REGION]);
        }
        //cardUrlInst.showMeasCard()//pwrgridmeascard
    },
    locateGroup: function (g) {
            var MapOpeInst = ProjectSGC.Global.getMainObject("MapOpeInst");
            MapOpeInst.menu("LocationArea", true, { arrownerid: [g.data.id + ''], Level: 1003, padding: [0, 0, 0, 0], isShowOld: true });
    },
    combinePath: function (lst, row) {
        for (var i = lst.length - 1; i >= 0; i--) {
            var city = lst[i];
            if (city.address == row[this.columns.CITY]) {
                var time = new Date(Ysh.Time.parseDate(row[this.columns.TIME]));
                if (i == lst.length - 1) {
                    city.timeLast = time;
                    return true;
                }
                if (Ysh.Time.add('h', 1, city.timeLast) - time == 0) {
                    city.timeLast = time;
                    return true;
                }
                return false;
            }
        }
        return false;
    },
    getDataList: function (org, dsPath, dsFore) {
        var ret = [];
        var cityLast = "";
        for (var i = 0; i < dsPath.length; i++) {
            var row = dsPath[i];
            if (this.combinePath(ret, row))
                continue;
            /*
            if (row[this.columns.CITY] == cityLast) { //只要第一个
                if (ret.length > 0)
                    ret[ret.length - 1].timeLast = new Date(Ysh.Time.parseDate(row[this.columns.TIME]));
                continue;
            }
            cityLast = row[this.columns.CITY];
            */
            ret.push(this.getItemByRow(row));
        }
        var lastTime = (dsPath.length > 0) ? dsPath[dsPath.length - 1][this.columns.TIME] : "";
        for (var i = 0; i < dsFore.length; i++) {
            var row = dsFore[i];
            if (row[this.columns.ORG] != org)
                continue;
            if (lastTime) {
                if (row[this.columns.TIME] <= lastTime)
                    continue;
            }
            if (this.combinePath(ret, row))
                continue;
            /*
            if (row[this.columns.CITY] == cityLast) //只要第一个
                continue;
            cityLast = row[this.columns.CITY];*/
            ret.push(this.getItemByRow(row));
        }
        return ret;
    }
}