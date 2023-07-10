Vue.component('htimeline1', {
    data: function () {
        return { width: 100, selectedIndex: - 1 };
    },
    props: {
        "value": {
            "default": ""
        },
        "datalist": {
            type: Array,
            "default": function () { return []; }
        },
        "height": {
            type: String,
            "default":"60px"
        }, "stepwidth": {
            type: String,
            "default": "50px"
        }, "defHeight": {
            type: String,
            "default": "2px"
        }, "defLineClr": {
            type: String,
            "default": "rgb(30,155,203)"
        }
    },
    computed: {
        lineHeights: function () {
            var arr = Ysh.Array.col(this.datalist, "weight", this.defHeight);
            return arr;
        },
        lineColors: function () {
            var arr = Ysh.Array.col(this.datalist, "lineColor", this.defLineClr);
            return arr;
        },
        widthPixel: function () {
            var v = (this.width + ((this.selectedIndex < 0) ? 0 : 7)) + "px";
            return v;
        },
        groups: function () {
            var ret = [];
            var gLast = null;
            for (var i = 0; i < this.datalist.length; i++) {
                var o = this.datalist[i];
                if (o.group) {
                    if (gLast == null) {
                        gLast = { text: o.group, start: i, end: i };
                        ret.push(gLast);
                    } else {
                        if (gLast.text == o.group) {
                            gLast.end = i;
                        } else {
                            gLast = { text: o.group, start: i, end: i };
                            ret.push(gLast);
                        }
                    }
                } else {
                    gLast = null;
                }
            }
            return ret;
        }
    },
    methods: {
        getDotImage: function (item, index) {
            if (this.selectedIndex == index)
                return item.imgSelected || "/i/sgc/dot_sel.png";
            return item.img || "/i/sgc/dot.png";
        },
        getDotClass: function (item, index) {
            var sz = 13;
            if (this.selectedIndex == index)
                sz = 20;
            return { width:sz + "px",height: sz + "px" };
        },
        getLineClass: function (item, index) {
            var w = 50 * (item.links ? Math.max(item.links.length, 1) : 1);
            return { width :w + 'px', height: this.lineHeights[index], backgroundColor: this.lineColors[index] };
        },/*
        click: function (item, index) {
            alert(index);
            this.$emit('input', item.key);
            this.$emit('click');
        },*/
        clickLink: function (item, index, link, linkIndex) {
            this.$emit('clicklink', item, index, link, linkIndex);
        },
        getItemLeftValue: function (item, index) {
            var linksWidth = 0;
            for (var i = 0; i < index; i++) {
                var o = this.datalist[i];
                if (o.links.length > 1)
                    linksWidth += o.links.length - 1;
            }
            var l = index * 63 + 50 + linksWidth*50;
            if (index == this.selectedIndex)
                return (l + 10);
            if ((this.selectedIndex < 0) || (index < this.selectedIndex))
                return (l + 7);
            return (l + 14);

        },
        getItemLeft: function (item, index) {
            return this.getItemLeftValue(item, index) + "px";
        },
        getExtendLeft: function (item, index) {
            return this.getItemLeftValue(item, index) - 25 + "px";
        },
        getGroupClass: function (item, index) {
            var l = this.getItemLeftValue(null,item.start) - 30;
            var w = this.getItemLeftValue(null, item.end) - l + 30;
            return { width: w + "px", left: l + "px" };
        },
        showLink: function (item, index) {
            return (item.links && item.links.length > 0);
        },
        getLinkImage: function (item, index, link, indexLink) {
            return link.img;
        },
        getLinkClass: function (item, index, link, indexLink) {
            var l = this.getItemLeftValue(item, index) + (50 * indexLink) + 35;
            return { left: l + "px" };
        },
        click: function (item, index) {
            this.selectedIndex = index;
            this.$emit('input', item.key);
            this.$emit('click', item, index);
        }
    },
    created: function () {
    }, mounted: function () {
        var root = this.$el.children[1];
        var w = 0;
        for (var i = 0; i < root.children.length; i++) {
            var c = $(root.children[i]);
            if (!c.attr("bk"))
                w += c.width();
        }
        this.width = w;
    }, template: '#htimeline1_template'
});