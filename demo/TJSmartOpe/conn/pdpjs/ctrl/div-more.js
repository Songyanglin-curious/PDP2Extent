/*v=1.19.1101.1*/
Vue.component('div-more', {
    data: function () {
        return { bFold: true,needMore:true };
    },
    props: ["rows", "text","linkurl","linkarg"],
    computed: {
        styleObject: function () { return this.bFold ? { "-webkit-line-clamp": this.rows, display: "-webkit-box","-webkit-box-orient":"vertical","overflow": "hidden" } : {}; },
        expandString: function () { return this.bFold ? "更多" : "收起"; },
        expandImage: function () { return this.bFold ? "../i/xia.png" : "../i/shang.png"; },
        textList: function () { if (!this.text) return []; var v = this.pureValue(this.text); return v.split("\n"); }
    },
    methods: {
        changeState: function () { this.bFold = !this.bFold; },
        computeMore: function () {
            var div = this.$el.children[0];
            this.needMore = (div.scrollHeight != div.offsetHeight);
        },
        click: function () {
            if (this.linkurl)
                window.location.href = this.linkurl.format(this.linkarg);
            this.$emit("click");
        },
        resize: function () {
            this.computeMore();
        }
    },
    mounted: function () {
        this.computeMore();
    },
    watch: {
        text: function () {
            this.bFold = true;
            this.$nextTick(function () {
                this.computeMore();
            })
        }
    },
    template: '<div><div style="width:100%;" :style="styleObject" @click="click"><slot></slot><template v-for="(row,index) in textList"><br v-if="index>0" />{{row}}</template></div><div v-if="needMore" style="text-align:right;cursor:pointer;color:#65d1fa" @click.stop="changeState">{{ expandString }}<img style="height:0.5rem;width:0.5rem" :src="expandImage"></img></div></div>'
});