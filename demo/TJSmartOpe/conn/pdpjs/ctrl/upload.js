Vue.component("gudupload", {
    props: ["value"],
    template: "#gudupload_template",
    data: function () {
        return { }
    }, computed: {
        fileList: function () {
            if (!this.value)
                return [];
            var arr = this.value.split('|||');
            var ret = [];
            for (var i = 0; i + 1 < arr.length; i += 2) {
                ret.push({ url: arr[i + 1], name: arr[i] });
            }
            return ret;
        },
        canUpload: function () { return !this.$attrs["disabled"]; }
    }, methods: {
        handleSuccess: function (res, file) {
            file.url = res;
            var v = this.value;
            if (v) v += "|||";
            v += file.name + "|||" + res;
            this.$emit('input', v);
        },
        handlePreview: function (file) {

        },
        handleDelete: function (file) {
            var v = [];
            for (var i = 0; i < this.fileList.length; i++) {
                var f = this.fileList[i];
                if (f == file)
                    continue;
                v.push(f.name);
                v.push(f.url);
            }
            this.$emit('input', v.join("|||"));
        }
    }
});