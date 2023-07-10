Vue.component('serialcode', {
    data: function () {
        return {};
    },
    props: {
        value: String,
        disable: { type: Boolean, "default": false }
    },
    computed: {
    },
    methods: {
        doInput: function (e) {
            this.$emit('input', e.target ? e.target.value : e);
        }
    },
    created: function () {
    },
    mounted: function () { //页面显示的时候如果还没值，那么生成编号

    }
    , template: '<input type="text" :value="value" @input="doInput($event)" />'
});