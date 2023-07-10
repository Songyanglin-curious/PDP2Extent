/** 设备资产相关组件  */

Vue.component('title-div',{
	props:{
		title:{
			type: String,
			require: true,
		},
		title1:{
			type: String,
			require: true,
			default:'单位：个',
		},
		contentClass: {
			type: String,
			"default": '',
		},
		contentStyle: {
		    type: Object,
		    default: {}
		},
		isShowIcon:{
			type:Boolean,
			default:true,
		}
	},
	data(){
		return {
			divContentHeight: 0,
			isBigPage:false,
		}
	},
	methods:{
		clickIcon: function(){
			this.isBigPage = !this.isBigPage;
			this.$emit('click');
		}
	},
	mounted(){
		this.divContentHeight = this.$refs['divContent'].clientHeight;
	},
	template:`
	<div class='f dc title-div'>
		<div class='wrapper-title'>
			<i @click="clickIcon" :class="[isBigPage ? 'ivu-icon-md-contract' : 'ivu-icon-md-expand']" class="ivu-icon" :style="{'visibility' : isShowIcon ? 'visible' : 'hidden'}" style="cursor:pointer;font-size:24px" ></i>
			<span >{{title}}</span>
			<span >{{title1}}</span>
		</div>
		<div ref='divContent'  class="wrapper-content" :class="contentClass"  :style="contentStyle">
			<slot v-bind:divContentHeight='divContentHeight'></slot>		
		</div>
	</div>
	`
})

