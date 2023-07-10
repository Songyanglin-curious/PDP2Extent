(function () {
    onmessage = function (event) {
        if (event.data == "grid")
            event.data = "sgc/main:GetPwrGrid";
        else if (event.data == "dcc")
            event.data = "sgc/main:GetDispatchOrg";
        if (event.data) {
            var xml = event.data.toString();
            if (xml.substr(0, 4) == "sgc/") {
                ajax({
                    url: "/conn/ashx/AskHandler.ashx?m=Read&conn=SGC&xml=" + xml,
                    dataType: "json",
                    type: "post",
                    data: {},
                    success: function (data) {
                        if (typeof data == "string") {
                            if (data.substr(0, 6) == "[false") {
                                postMessage({ type: "line", fail: true });
                                return;
                            }
                        }
                        postMessage({ type: xml, data: data });
                    },
                    error: function (data) {
                        console.log(data.responseText);
                        postMessage({ type: xml, fail: true });
                    },
                    async: true
                });
                return;
            }
            if (event.data.type == "sync") {
                ajax({
                    url: "/conn/ashx/AskHandler.ashx?m=sync&name=" + event.data.name + "&time=" + event.data.time,
                    dataType: "json",
                    type: "post",
                    data: {},
                    success: function (data) {
                        if (!data)
                            postMessage({ type: event.data.type, name: event.data.name, fail: true });
                        else
                        postMessage({ type: event.data.type, name: event.data.name, data: data });
                    },
                    error: function (data) {
                        console.log(data.responseText);
                        postMessage({ type: event.data.type, name: event.data.name, fail: true });
                    },
                    async: true
                });
                return;
            }
        }
        if (event.data == "line") {
            ajax({
                url: "/conn/ashx/AskHandler.ashx?m=Read&conn=SGC&xml=sgc/line:GetAllLineInfo",
                dataType: "json",
                type: "post",
                data: {},
                success: function (data) {
                    if (typeof data == "string") {
                        if (data.substr(0, 6) == "[false") {
                            postMessage({ type: "line", fail: true });
                            return;
                        }
                    }
                    postMessage({ type: "line", data: data });
                },
                error: function (data) {
                    console.log(data.responseText);
                    postMessage({ type: "line", fail: true });
                },
                async: true
            });
            return;
        }
        ajax({
            url: "/Search/GetLocationInfoByType?types=" + event.data + "&nCount=100000",
            dataType: "text",
            type: "post",
            data: { types: [event.data], nCount: 100000 },
            success: function (data) {
                data = data.split("\n");
                var items = [];
                for (var i = 0; i < data.length; i++) {
                    var itemSta = data[i];
                    itemSta = itemSta.split(",");
                    if (itemSta.length < 6)
                        continue;
                    var vol = itemSta[2];
                    var volname = "";
                    if (vol.substr(0, 1) == "±") {
                        vol = vol.substr(1);
                        //volname = "±";
                    }
                    vol = parseInt(vol, 10);
                    volname += vol;
                    var tp = itemSta[3];
                    var id = itemSta[4];
                    var nm = itemSta[5];
                    items.push({
                        PlantStationType: tp, LONGITUDE: itemSta[0], LATITUDE: itemSta[1], VOLTAGE_TYPE: vol, TOP_VOLTAGE_TYPE: vol, ID: id, NAME: nm, code: itemSta[7],
                        data: {
                            id: id, name: nm, plantstationtype: tp, voltage: volname, operatedate: itemSta[6], owner: [itemSta[8], itemSta[9], itemSta[11]], state: itemSta[10]
                        }
                    });
                }
                postMessage({ type: event.data, items: items });
            },
            error: function (data) {
                console.log(data.responseText);
                postMessage({ type: event.data, fail: true });
            },
            async: true
        });
    };

    function ajax(paramer) {
        // 打开连接  
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.open(paramer.type, paramer.url, paramer.async);

        if (paramer.type == "get") {
            // 建议这边就绑定  
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    console.log(this.responseText);
                }
            }
        } else {
            // 因为是post所以是 这个 一定要  
            xmlhttp.setRequestHeader('Content-Type', paramer.dataType);
            // 发送请求，这里开始和get不一样了,post需要发送表单填写的  
            xmlhttp.send(paramer.data);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    //console.log(xmlhttp.responseText);
                    paramer.success(xmlhttp.responseText);
                };
            }
        }
        // 有这个就不会action到那里去了  
        return xmlhttp;
    }
})();