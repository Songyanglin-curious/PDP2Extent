Vue.component('rich-button', {
    props: {
        "linkurl": {
            type: String,
            "default": ""
        },
        "img":{
            type: String,
            "default": ""
        },
        "text": {
            type: String,
            "default": ""
        },
        "linkarg": {
            type: String,
            "default": ""
        }, css: {
            type: String,
            "default": "rich_button"
        }
    },
    computed: {
        url: function() {
            if (!this.linkurl)
                return "";
            return this.linkurl.format(this.linkarg);
        }
    },
    template: '<div :class="css"><a :href = "url"><img :src="img" /><p><slot></slot>{{ text }}</p></a></div>'
});