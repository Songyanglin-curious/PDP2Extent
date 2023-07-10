Vue.component('listnav',{
	props:{
		navData:{
			type: Object,
			"default": null
		}
	},
	methods:{
		listnavclick: function(){
			this.$emit('navclick')
		}
	},
	template: "<li @click='listnavclick'>{{navData.text}}</li>"
})