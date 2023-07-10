{//init开始

    var rangeList = [
        "<-32",
        "-32",
        "-28",
        "-24",
        "-20",
        "-16",
        "-12",
        "-8",
        "-4",
        "0",
        "4",
        "8",
        "12",
        "16",
        "20",
        "24",
        "28",
        "32",
        ">32"
    ]
    var rangeColor = [
        "#80007C",
        "#002F86",
        "#1A5CA6",
        "#2075D2",
        "#3CA0F0",
        "#75CFFF",
        "#97E1F4",
        "#BDF9FF",
        "#F2FFFF",
        "#DFFFD9",
        "#C4FFB7",
        "#BAFE83",
        "#FCFE9C",
        "#FFF3C4",
        "#FFDCA8",
        "#FFAF75",
        "#FD8784",
        "#EC5B5F",
        '#E54032'
    ]
    var defRange = '0,18'
    function onchange(min, max) {

    }
    this.onChange = function () {
        console.log(this.selectvalue)
    }
    this.showFilter = function (rangeList, rangeColor, defRange, onchange) {

        // var colorBox = this.$refs.colorBox
        var sz = [], img = [];
        var w = 100.0 / rangeColor.length;
        for (var i = 0; i < rangeColor.length; i++) {
            var clr = rangeColor[i]
            sz.push(Ysh.Number.toFixed(w * (i + 1), 2) + "% 100%");
            img.push(clr ? ("linear-gradient(" + clr + "," + clr + ")") : "");
        }
        sz = sz.join();
        img = img.join();
        // colorBox.style.backgroundSize=sz
        // colorBox.style.backgroundImage=img
        this.labelValue = [];
        var width = 450;
        var height = 5;
        var subWidth = parseInt(width / rangeList.length)
        var span = Math.round((100 / (rangeList.length - 1)) * 10) / 10;
        rangeList.forEach((item, index) => {
            var labelItem = {}
            labelItem.value = item;
            labelItem.color = rangeColor[index];
            labelItem.width = subWidth + 'px';
            labelItem.height = height + 'px';
            labelItem.left = span * index + '%';
            this.labelValue.push(labelItem)
        })

    }
    // this.showFilter(rangeList, rangeColor, defRange, onchange)
    this.test = function (e) {

        debugger
    }
    this.test1 = function (e) {
        e.preventDefault();
        debugger
    }
    this.test3 = function (e) {
        e.preventDefault();
    }
    // var dnd = {
    //     // 初始化
    //     init: function () {
    //         var me = this;
    //         me.src = document.querySelector('#demo1-src');
    //         me.panelList = document.querySelector('.panel-list');

    //         // 为拖拽源监听dragstart,设置关联数据
    //         me.src.addEventListener('dragstart', me.onDragStart, false);

    //         // 拖拽鼠标移入元素,在拖放目标上设置视觉反馈
    //         //   me.panelList.addEventListener('dragenter', me.onDragEnter, false);

    //         // 取消元素dragover默认行为,使其可拖放
    //         me.panelList.addEventListener('dragover', me.onDragOver, false);

    //         //   // 拖拽移出元素,清除视觉反馈
    //         //   me.panelList.addEventListener('dragleave', me.onDragLeave, false);

    //         // 鼠标释放,在拖放目标上接收数据并处理
    //         me.panelList.addEventListener('drop', me.onDrop, false);
    //     },
        this.onDragStart =function (e) {
            e.dataTransfer.setData('text/plain', 'demo1-src');
        }
        this.onDragEnter = function (e) {
            if (e.target.classList.contains('panel-item')) {
                e.target.classList.add('over');
            }
        }
        this.onDragLeave= function (e) {
            if (e.target.classList.contains('panel-item')) {
                e.target.classList.remove('over');
            }
        }
        this.onDragOver= function (e) {
            e.preventDefault();
        }
        this.onDrop =  function (e) {
            e.preventDefault();
            var id = e.dataTransfer.getData('text/plain');
            // var src = document.getElementById(id);
            // var target = e.target;
            // if (target.classList.contains('panel-item')) {
            //     target.appendChild(src);
            //     target.classList.remove('over');
            // }
        }



}//init结束