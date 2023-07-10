_app.jinrishengchan = {
    legend: "none",
    quexian: null,
    huanjing: null,
    jianxiu: null,
    guzhang: null,
    arrange: function () {
    },
    open: function () {
        this.state = 1;
        vLayout.setLogo("今日生产");
        this.quexian = this.float("sc_jrsc_quexian", {}, false, function (c) {
            c.styles = {
                width: "30%", height: "50%",
                position: "absolute", "z-index": 100,
                left: "10px", top: "100px",
                "background-color":"#01474E","opacity":0.9
                //"background-color": "#03191f"
            }
            //c.$on("load", function () { this.styles.height = "80%"; this.resize(); });
        });
        this.env = this.float("sc_jrsc_env", {}, false, function (c) {
            c.styles = {
                width: "30%", height: "calc(50% - 120px)",
                position: "absolute", "z-index": 100,
                left: "10px", bottom: "10px",
                "background-color": "#01474E", "opacity": 0.9
                //"background-color": "#03191f"
            }
        });
        this.jianxiu = this.float("sc_jrsc_jianxiu", {}, false, function (c) {
            c.styles = {
                width: "30%", height: "calc(50% - 60px)",
                position: "absolute", "z-index": 100,
                right: "200px", top: "100px",
                "background-color": "#01474E", "opacity": 0.9
                //"background-color": "#03191f"
            }
            //c.$on("load", function () { this.styles.height = "80%"; this.resize(); });
        });
        this.guzhang = this.float("sc_jrsc_guzhang", {}, false, function (c) {
            c.styles = {
                width: "30%", height: "calc(50% - 60px)",
                position: "absolute", "z-index": 100,
                right: "200px", bottom: "10px",
                "background-color": "#01474E", "opacity": 0.9
                //"background-color": "#03191f"
            }
            //c.$on("load", function () { this.styles.height = "80%"; this.resize(); });
        });
        //this.huanjing = this.float("sc_jr")
    },
    close: function () {
        vLayout.setLogo("");
    }
}