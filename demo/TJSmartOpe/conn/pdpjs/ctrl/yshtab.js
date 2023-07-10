/*v=1.21.625.1*/
Vue.component('yshtab', {
    props: {
        "tabs": {
            type: Array,
            "default": function () { return []; }
        }, "type": {
            type: String,
            "default": "default" //default, button1, button2
        }, "value": {
            type: String,
            "default": ""
        }, "autoselect": {
            type: String,
            "default": ""
        }, "tabstyle": {
            type: String,
            "default": ""
        }, "allnotify": {
            type: String,
            "default": ""
        }, "scroll": {
            type: String,
            "default": ""
        }, "margin": {
            type: Number,
            "default": 4
        }, "closable": {
            type: Boolean,
            "default": false
        }
    },
    template: "#yshtab_template",
    data: function () {
        return {
            scrollable: false,
            totalWidth: 0,
            tabWidth: [],
            currentPageIndex: 0,
            currentTabs: [],
            pages: [],
            widthInited: false
        };
    },
    computed: {
        itemStyle: function () {
            if (this.type == "button1")
                return "item_s";
            if (this.type == "button2")
                return "item_b";
            return "item";
        },
        normalStyle: function () {
            if (this.type == "button1")
                return "normal_s";
            if (this.type == "button2")
                return "normal_b";
            return "normal";
        },
        activeStyle: function () {
            if (this.type == "button1")
                return "active_s";
            if (this.type == "button2")
                return "active_b";
            return "active";
        },
        tabStyle: function () {
            return this.tabstyle == "" ? "nTab" : this.tabstyle;
        },
        otherStyle: function () {
            if (this.scroll == "no")
                return { width: this.totalWidth > 20 ? this.totalWidth + 'px' : '' };
            return {};
        }
    },
    methods: {
        selectTab: function (v) {
            if (this.allnotify != "1") {
                if (this.value === v)
                    return;
            }
            this.$emit('input', v);
            this.$emit('click');
        },
        clickTabImg: function (v) {
            this.$emit("clickimg", v);
        },
        initWidth: function () {
            if (this.widthInited) return;
            var _this = this;
            var jqDivTab = $(this.$el).children(".TabTitle");
            if (jqDivTab.width() == 0)
                return;
            this.tabWidth = [];
            this.totalWidth = 0;
            jqDivTab.children().each(function () {
                var w = Math.ceil($(this).outerWidth() + _this.margin);
                _this.totalWidth += w;
                _this.tabWidth.push(w);
            });
            this.widthInited = true;
        },
        resize: function () {
            if ($(this.$el).width() == 0) return;
            this.initWidth();
            if (this.scroll == "no") {
                this.scrollable = false;
                this.currentTabs = this.tabs;
                return false;
            }
            this.pages = [];
            var currWidth = 0;
            var currTab = [];
            var pWidth = $(this.$el).parent().width();
            if (this.totalWidth <= pWidth) {
                this.scrollable = false;
                this.currentTabs = this.tabs;
                return false;
            }
            pWidth = pWidth - 32; //减去右边移动按钮宽度
            this.scrollable = true;
            for (var i = 0; i < this.tabWidth.length; i++) {
                if (currWidth + this.tabWidth[i] > pWidth) {
                    this.pages.push(currTab);
                    currWidth = 0;
                    currTab = [];
                }
                currWidth += this.tabWidth[i];
                currTab.push(this.tabs[i]);
            }
            if (currTab.length > 0)
                this.pages.push(currTab);
            this.currentPageIndex = this.getSelectPageIndex();
            if (this.currentPageIndex == -1)
                this.currentPageIndex = 0;
            this.currentTabs = this.pages[this.currentPageIndex];
        },
        pagePrev: function () {
            if (this.currentPageIndex <= 0)
                return false;
            this.currentPageIndex--;
            this.currentTabs = this.pages[this.currentPageIndex];
        },
        pageNext: function () {
            if (this.currentPageIndex >= this.pages.length - 1)
                return false;
            this.currentPageIndex++;
            this.currentTabs = this.pages[this.currentPageIndex];
        },
        getSelectPageIndex: function () {
            if (this.value === "" || this.value === undefined)
                return -1;
            for (var i = 0; i < this.pages.length; i++) {
                for (var j = 0; j < this.pages[i].length; j++) {
                    if (this.pages[i][j][0] == this.value)
                        return i;
                }
            }
            return -1;
        }
    },
    created: function () {
        this.currentTabs = this.tabs;
    },
    mounted: function () {
        //默认选中第一个
        if (this.autoselect && this.value === "") {
            var v = this.tabs.length > 0 ? this.tabs[0][0] : "";
            //this.$emit('input', v);
            this.selectTab(v);
        }
        //this.initWidth();
        this.resize();
        /*var _this = this;
        //监听resize事件
        $(window).resize(function () {
            _this.resize();
        });*/
    }, watch: {
        tabs: function () {
            this.currentTabs = this.tabs;
            this.widthInited = false;
            this.$nextTick(function () {
                this.resize();
            });
        }
    }
});