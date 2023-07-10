Vue.component('selectall', {
    data: function () {
        return {};
    },
    props: {
        "value": {
            type: Array,
            "default": function () { return []; }
        }, "source": {
            type: Array,
            "default": function () { return []; }
        }, "text": {
            type: String, "default": "全部"
        }
    },
    computed: {
        isAll: {
            get: function() {                
                for (var i = 0; i < this.source.length; i++) {
                    var id = this.source[i][0];
                    if (this.value.indexOf(id)<0)
                        return false;
                }
                return true;
            },
            set: function (b) {
                if (b)
                    this.$emit("input", Ysh.Array.to1d(this.source, 0));
                else
                    this.$emit("input", []);
            }
        },
        needShow: function () {
            return this.source.length > 1;
        }
    },
    methods: {
        onChange: function () {
            this.$emit("on-change", this.isAll);
        }
    },
    template: '<Checkbox v-if="needShow" v-model="isAll" @on-change="onChange">{{text}}</Checkbox>'
});