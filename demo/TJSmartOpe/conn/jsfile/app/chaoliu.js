_app.chaoliu = {
    compatible: function () {
        return true;
    },
    open: function (data) {
        SGCChaoliu.showDc = true;
        SGCChaoliu.showAc = [-1];
        SGCChaoliu.showDirection = true;
        SGCChaoliu.showValue = true;
        SGCChaoliu.start();
        this.state = 1;
    },
    close: function () {
        SGCChaoliu.showDc = false;
        SGCChaoliu.showAc = [];
        SGCChaoliu.showDirection = false;
        SGCChaoliu.showValue = false;
        SGCChaoliu.start();
        this.state = 0;
    }
}