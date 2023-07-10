$.extend({
    executeAjax: function (url, data, f, er) {
        $.ajax({
            url: url,
            data: data,
            type: "post",
            cache: false,
            success: function (result) {
                if (typeof f != 'undefined')
                    f(result);
            },
            error: function (data, status, e) {
                if (typeof er != 'undefined')
                    er(data, status, e);
                else {
                    alert(e);
                    alert(data.responseText);
                }
                return false;
            }
        });
    },
    GetClientHeight: function (doc) {
        if (doc.documentElement.clientHeight == 0) {
            return doc.body.clientHeight;
        } else {
            return doc.documentElement.clientHeight;
        }
    },
    GetClientWidth: function (doc) {
        if (doc.documentElement.clientWidth == 0) {
            return doc.body.clientWidth;
        } else {
            return doc.documentElement.clientWidth;
        }
    }
});