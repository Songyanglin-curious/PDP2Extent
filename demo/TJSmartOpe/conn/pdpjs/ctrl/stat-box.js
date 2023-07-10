Vue.component('stat-box', {
    data: function () {
        return {};
    },
    props: {
        "source": {
            type: Array,
            "default": function () { return []; }
        }, "css": {
            type: String, "default": ""
        }
    },
    methods: {
        onClick: function () {
            this.$emit("click");
        }
    },
    template: `<div style="display:flex;justify-content:space-around;align-items:center;" :class="css">
          <div v-for="item in source" style="font-size:0">
            <img :style="item.imgStyle" :src="item.img">
            </img>
            <div style="font-size:14px;display:flex;align-items:center">
                {{item.text}}
                <span :style="{ 'background-image': 'linear-gradient(180deg, #ffffff, '+item.color+')' }" style="margin-left:10px;font-size: 24px;-webkit-background-clip: text;-webkit-text-fill-color: #0000;">{{item.count}}</span>
            </div>
          </div>
        </div>`
});

Vue.component('stat-box2', {
    data: function () {
        return {};
    },
    props: {
        "source": {
            type: Array,
            "default": function () { return []; }
        }, "css": {
            type: String, "default": ""
        }
    },
    methods: {
        onClick: function () {
            this.$emit("click");
        }
    },
    template: `<div style="display:flex;justify-content:space-around;align-items:center;" :class="css">
            <div v-for="item in source" style="font-size:0;display: flex;align-items: center;">
                <div>
                    <img :style="item.imgStyle" :src="item.img">
                    </img>
                    <div style="font-size:14px;display:flex;align-items:center">
                        {{item.text}}
                    </div>
                </div>
                <div>
                    <div v-for="row in item.details" style="display: flex;align-items: center;width: 100%;justify-content: space-between;">
                        <span style="font-size:14px;display:flex;align-items:center">
                        {{row.text}}
                        </span>
                        <span :style="{ 'background-image': 'linear-gradient(180deg, #ffffff, '+item.color+')' }" style="margin-left:10px;font-size: 24px;-webkit-background-clip: text;-webkit-text-fill-color: #0000;">
                        {{row.count}}
                        </span>
                    </div>
                </div>
            </div>
        </div>`
});