//单选按钮扩展脚本
// wanglei 20120606 add
$.fn.radio = function (options) {
    var self = this;
    this.group = $(this).attr('group');
    /*this.dbValue = options.dbValue;
    this.isMain = $(this).attr('isMain');
    //处理主数据源控件
    if (self.isMain == 1) { $(':hidden[t=ysh_radio][group=' + self.group + ']').val(self.dbValue); }
    if (typeof self.group != 'undefined' && $.trim(self.group) != '') {
        if ($(':radio[t=ysh_radio][group=' + self.group + '][isMain=1]').length > 1) {
            alert('发生加载错误：同一组名 ( ' + self.group + ' ) radio控件包含了多个数据源设置.');
            return false;
        }
        var radioGroup = $(':radio[t=ysh_radio][group=' + self.group + ']');
        $.each(radioGroup, function (i, n) {
            if ($(n).attr('checked')) { $(':hidden[t=ysh_radio][group=' + self.group + ']').val($(n).val()); }
            if ($(n).val() == self.dbValue) {
                radioGroup.attr('checked', false);
                $(n).attr('checked', true);
                $(':hidden[t=ysh_radio][group=' + self.group + ']').val($(n).val());
            }
            if (!$(n).attr('disabled')) { radioGroup.removeAttr('disabled') }
        });
    }*/
    return $(this).click(function () {
        if (typeof $(this).attr("group") != 'undefined' && $.trim($(this).attr("group")) != '') {
            $(':radio[t=ysh_radio][group=' + $(this).attr("group") + ']').attr('checked', false);
            $(':hidden[t=ysh_radio][group=' + $(this).attr("group") + ']').val($(this).val());
        }
        $(this).attr('checked', true);
    })
}

