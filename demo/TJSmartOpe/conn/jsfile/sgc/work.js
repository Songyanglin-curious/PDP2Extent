(function () {
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    onmessage = function (event) {
        ajax({
            url: "/conn/ashx/PDP,PDP2.0.ashx?",
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
                        data: { id: id, name: nm, plantstationtype: tp, voltage: volname, operatedate: itemSta[6], owner: [itemSta[8],itemSta[9]] }
                    });
                }
                postMessage({ type: event.data, items: items });
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    };

    function ajax(paramer) {
        // 打开连接  
        xmlhttp.open(paramer.type, paramer.url, true);


        // 建议这边就绑定  
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                alert(this.responseText);
            }
        }
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
        // 有这个就不会action到那里去了  
        return false;
    }
})();