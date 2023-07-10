/*v=1.21.612.1*/
Vue.component("btngroup", {
    props: {
        datasource: {/**数据源,对象数组类型，每个对象里需配置“text”属性作为按钮显示的文字 */
            type: Array
        },
        /**classname里面配置column:true属性即可触发按钮组竖向布局,可以向该属性添加自定义css类名样式*/
        classname: {
            type: Object
        },
        defaultsel: {/**默认选中按钮索引值 */
            type: [String, Number],
            default: 0
        },
    },
    data: function () {
        return {
            check: []
        }
    },
    computed: {
    },
    methods: {
        /**
         * 该方法会触发父级绑定的click事件，并抛出一个item作为参数
         * @param {Object} item 
         * @param {Number} index item的索引值 
         */
        btnClick(item, index) {
            for (let i = 0; i < this.check.length; i++) {
                this.$set(this.check, i, "");
            }
            this.$set(this.check, index, "btn-select");
            this.$emit("click", item);
        },
        removeSelect: function () {
            this.check = [];
        }
    },
    created() {
        for (let i = 0; i < this.datasource.length; i++) {
            this.check.push("");
        }
        if (Number(this.defaultsel) > -1) {
            this.$set(this.check, this.defaultsel, "btn-select");
            //this.btnClick(this.datasource[this.defaultsel],this.defaultsel);
        }
    },
    template: `
        <div class="btn-group-wrapper" :class="classname">
            <button v-for="(item,index) in datasource" type="button" :class="check[index]" class="btn-default" @click="btnClick(item,index)">
                {{item.text}}
                <slot :name="index"></slot>
            </button>
        </div>
    `
})