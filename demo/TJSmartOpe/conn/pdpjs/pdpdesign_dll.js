var vmDll = new Vue({
    el: "#divDll",
    data: {
        isShow: false,
        dll: {},
        dataIndex: -1
    },
    computed: {
    },
    methods: {
        readInputs: function () {
            if (!confirm("读取参数会覆盖原来的输入参数，\r\n确定继续？"))
                return;
            var arr = PDP.dll("PDP2.0:PDP.GetDllMethodInputs", [this.dll.dllid]);
            if (!arr.check("获取参数", true))
                return;
            arr = arr.value[0];
            if (!this.dll.inputs)
                this.dll.inputs = [];
            if (this.dll.inputs.length > arr.length)
                this.dll.inputs.length = arr.length;
            for (var i = 0; i < this.dll.inputs.length; i++)
                this.dll.inputs[i].desc = arr[i];
            for (var i = this.dll.inputs.length; i < arr.length; i++) {
                this.dll.inputs.push({ desc: arr[i] });
            }
        },
        ok: function () {
            this.$Message.info('保存成功');
            PDPDesign.Assist.defineXml(this.dll, "dll");
            if (!this.dll.id) {
                this.dll.id = PDPDesign.page.newId("dll");
                this.dll.__id = this.dll.id;
            }
            if (this.dll.inputs)
                Ysh.Array.each(this.dll.inputs, function (input) {
                    if (!input.id) {                        
                        input.id = PDPDesign.page.newId("input");
                        input.__id = input.id;
                    }
                });
            if (this.dll.outputs)
                Ysh.Array.each(this.dll.outputs, function (output) {
                    if (!output.id) {
                        output.id = PDPDesign.page.newId("output");
                        output.__id = output.id;
                    }
                });
            if (this.dataIndex == -1)
                vmCtrl.dlls.push(this.dll);
            else
                vmCtrl.$set(vmCtrl.dlls, this.dataIndex, this.dll);
            PDPDesign.Assist.defineParent(vmCtrl.dlls, null);
        },
        cancel: function () {
            this.$Message.info('取消保存');
        },
        show: function () {
            this.isShow = true;
        },
        hide: function () {

        },
        delOutput: function (index) {
            this.dll.outputs.splice(index, 1);
        },
        addOutput: function () {
            if (!this.dll.outputs)
                this.dll.outputs = [];
            this.dll.outputs.push({ desc:"新返回值" });
        }
    }
});