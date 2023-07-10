Vue.component("itabs",{
    props:{
        dataSource:{
            type: Object
        },
        iconShow: {
            type: Boolean,
            default: false,
        },
    },
    data(){
        let {value, type="line", size="default", closable=false, animated=true, capturefocus=false, beforeremove, name, draggable=false, tablist=[]} = this.dataSource;
        return {
            value,
            type,
            size,
            closable,
            animated,
            capturefocus,
            beforeremove,
            name,
            draggable,
            tablist
        }
    },
    watch:{
        dataSource: {
            handler: function (val, oldVal) { 
                this.value = val.value; 
                this.type = val.type; 
                this.size = val.size; 
                this.closable = val.closable; 
                this.animated = val.animated; 
                this.beforeremove = val.beforeremove; 
                this.draggable = val.draggable; 
                this.tablist = val.tablist; 
            },
            deep: true
        },
        value:{
            handler: function (val, oldVal) { 
                this.dataSource.value = val; 
            },
        },
        tablist:{
            handler:function(){
                this.handleTabPaneClosable();
            }
        }
    },
    methods:{
        /**************工具函数 */
        setAllItemDisabled(really){
            let tablist = this.tablist;
            if(!really){
                for(let item of tablist){
                    this.$set(item,'disabled',false)
                }
                return;
            }
            for(let item of tablist){
                this.$set(item,'disabled',true)
            }
        },
        setItemEnable(itemName){
            let tablist = this.tablist;
            for(let item1 of itemName){
                for(let item of tablist){
                    if(item.name === item1){
                        this.$set(item,'disabled',false);
                        break;
                    }
                }
            }
            
        },
        /**************操作函数 */
        handleClick(name){
            this.$emit("on-click",name)
        },
        handleDragDrop(name, newName, a, b, names){
            this.$emit("on-drag-drop",name, newName, a, b, names)
        },
        handleTabRemove(name){
            this.$emit("on-tab-remove",name)
        },
        handleTabPaneClosable() {//重写closable相关
            let ctrlMe = this;
            let ds = this.dataSource,dstl = this.dataSource.tablist;
            let tabsTabItemDom,tabsTabItemCloseIconDom=ctrlMe.$el.querySelectorAll(".ivu-tabs-close");
            if(ds&&dstl&&ds.closable){
                for(let i=0,l = dstl.length;i<l;i++){
                    if(dstl[i]["closable"]==undefined){
                        dstl[i]["closable"] = ds.closable;
                    }
                }
            }
            let time = setInterval(() => {
                new Promise((res,rej)=>{
                    tabsTabItemDom = Array.from(ctrlMe.$el.querySelectorAll(".ivu-tabs-tab"));
                    if(tabsTabItemDom&&tabsTabItemDom.length){
                        res("有了")
                    }else{
                        rej("no")
                    }
                }
                ).then((val)=>{
                    clearInterval(time);
                    for(let i=0,l=tabsTabItemCloseIconDom.length;i<l;i++){
                        tabsTabItemCloseIconDom[i].remove();
                    }
                    if (dstl != undefined) {
                        for (let i = 0, l = dstl.length; i < l; i++) {
                            if (dstl[i]["closable"]) {
                                let closeEl = document.createElement("i");
                                if (this.iconShow) {
                                    closeEl.setAttribute("class", "ivu-icon ivu-icon-ios-close ivu-tabs-close");
                                    closeEl.style.width = '22px';
                                    closeEl.style.marginRight = '-6px';
                                } else {
                                    closeEl.setAttribute("class", "ivu-icon ivu-icon-ios-close ivu-tabs-close");
                                }
                                tabsTabItemDom[i].appendChild(closeEl);
                                closeEl.addEventListener("click", function () {
                                    if (ctrlMe.beforeremove) {
                                        ctrlMe.beforeremove().then((val) => {
                                            console.log(val)
                                            ctrlMe.handleTabRemove(ctrlMe.dataSource.tablist[i].name);
                                            ctrlMe.dataSource.tablist.splice(i, 1);
                                        }, (err) => {
                                            console.log(err)
                                        })
                                    } else {
                                        ctrlMe.dataSource.tablist.splice(i, 1);
                                    }
                                })
                            }
                        }
                    }
                }
                , (err)=>{// console.log(err)
                }
                )
            }
            , 500);
        }
    },
    mounted(){
        this.handleTabPaneClosable();
    },
    template:`
        <Tabs 
            v-model:value="value" 
            :type="type" 
            :size="size"  
            :animated="animated"
            :draggable="draggable"
            @on-click = "handleClick"
            @on-drag-drop="handleDragDrop"
        >
            <TabPane v-for="(tab, index) in tablist" :key="index" 
                :label="tab.label" 
                :name="tab.name"
                :icon="tab.icon"
                :disabled="tab.disabled"
            >
            </TabPane>
        </Tabs>
    `
})