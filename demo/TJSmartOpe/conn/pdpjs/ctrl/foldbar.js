Vue.component('foldbar', {
    data: function () {
        return { img:"/i/sgc/up.png" };
    },
    props: ["rows", "text","linkurl","linkarg"],
    computed: {
    },
    methods: {
        click: function () {
            var root = this.$el;
            var l = root.children.length;
            var img = root.children[l - 1].children[0];
            var objNext = img.parentElement.parentElement.nextSibling;
            if (objNext.style.display == "") {
                objNext.style.display = "none";
                this.img = "/i/sgc/down.png";
                this.$emit("onfold", true);
            } else {
                objNext.style.display = "";
                this.img = "/i/sgc/up.png";
                this.$emit("onfold", false);
            }
        }
    },
    template: '<div style="position:relative" @click="click"><slot></slot><div style="position:absolute;width:100%;bottom:0;left:0;" class="sep"></div><div style="position:absolute;left:0;bottom:5px;width:100%;text-align:center"><img :src="img" /></div></div>'
});