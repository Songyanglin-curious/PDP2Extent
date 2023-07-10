function LongConnection(id, user) {
    this.reconnectNo = -1;
    this.url = "/conn/ashx/LongConnectHandler.ashx";
    this.post = function (timeout, data, fs, fe) {
        $.ajax({
            async: true, url: this.url + "?a=" + new Date(), type: "POST", "data": data, "timeout": timeout, dataType: "json", success: fs, error: fe
        });
    }
    this.Send = function (type, content, users) {
        this.post(500, { "id": id, "type": type, "user": user, "users": users, operate: "send", "content": escape(content) });
    }
    this.Connect = function (fDoIt) {
        var g = this;
        this.post(300000, { "id": id, operate: "connect", "user": user }, function (data) {
            g.Connect(fDoIt);
            fDoIt(data);
        }, function () {
            window.setTimeout(function () { g.Connect(fDoIt); }, 1000);            
        });
    }
    this.Close = function () {
        try {
            this.post(500, { "id": id, operate: "disconnect" });
        } catch (E) {
        }
    }
}