{//zcxx开始
    this.showMore = function(col){
      var vmain = ProjectSGC.Global.getMainObject("vMain");
        var f = {  };
            f.filter = { type: this.devtype };
            f.col = col;
            f.order = 'desc';
        vMain.gotoApp("zichansearch", f );
    }
    Ysh.Vue.addHandle(this, "resize", function () {
        var hAll = $(this.$el).height();
        var hIf = $(this.$refs.divbottom).height();
        this.hTbl = Math.max(hAll - hIf - 60 - 20, 200);
    },true);

}//zcxx结束