Vue.component("button-group", {
    props: {
        datalist: {
            type: Array,
            "default":null
        },
        data2d: {
            type: Array,
            "default":null
        },
        value: {
            type: String,
            "default": ""
        },
        css: {
            type: String,
            "default": "button-group-default"
        }, keyindex: {
            type: Number,
            "default":0
        }, textindex: {
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
                    lst.push({ key: item[this.keyindex], text: item[this.textindex], data: item });
                }
            }
            return lst;
        }
    },
    methods: {
        click: function (index, item) {
            this.$emit("input", item.key);
            this.$emit("click", index, item);
        },
        buttonCss: function (index, item) {
            return (this.value == item.key) ? "light" : "";
        }
    },
    template: '<div :class="css"><template v-for="(item,index) in options"><input type="button" :class="buttonCss(index,item)" :value="item.text" @click="click(index,item)" ></template></div>'
});