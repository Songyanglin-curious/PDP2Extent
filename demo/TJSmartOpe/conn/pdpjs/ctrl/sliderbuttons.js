Vue.component("slider-buttons", {
    props: {
        datalist: {
            type: Array,
            "default": null
        },
        data2d: {
            type: Array,
            "default": null
        },
        value: {
            type: Number,
            "default": 0
        }, textindex: {
            type: Number,
            "default": 0
        }, assistindex: {
            type: Number,
            "default": 1
        }
    },
    computed: {
        options: function () {
            if (this.datalist)
                return this.datalist;
            var lst = [];
            if (this.data2d) {
                for (var i = 0; i < this.data2d.length; i++) {
                    var item = this.data2d[i];
                    lst.push({ assist: item[this.assistindex], text: item[this.textindex], data: item });
                }
            }
            return lst;
        }
    },
    mounted: function () {
        var obj = $(this.$el)
        var sWidth = 0;
        obj.children("span").children("span").each(function () {
            sWidth += this.offsetWidth;
        })
        var wWidth = (obj.children("span").children("span").length - 1) * 26 + sWidth;
        obj.width(wWidth + 1);
        obj.children(".slider_text").width(obj.children("span").children("span").eq(0).width() + 30)
        var spanLeft = obj.children("span").children("span").eq(this.value).position().left - 15
        var tWidth = obj.children("span").children("span").eq(this.value).width() + 30;
        $(this.$el).children(".slider_text").width(tWidth).css("left", spanLeft);
    },
    methods: {
        clickThis: function (event, item, bP) {
            var obj = $(event.target);
            if (bP)
                obj = obj.parent();
            var tWidth = obj[0].offsetWidth + 30;
            var spanLeft = obj.position().left - 15;
            $(this.$el).children(".slider_text").width(tWidth).css("left", spanLeft);
            this.$emit('click', item);
        }
    },
    template: '<div class="slider_button"><div class="slider_text"></div><span><span v-for="child in options" v-if = "child.text" @click.self = "clickThis($event,child)" :style="child.style" ><span  @click.self = "clickThis($event,child,true)">{{child.text}}</span><span v-if="child.assist"  @click.self = "clickThis($event,child,true)" class="slider_unit">{{child.assist}}</span></span></span></div>'
});