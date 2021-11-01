<template>
	<view class="home">
		<!-- 自定义组件 -->
		<navbar></navbar>
		<tab :list="tabList" :tabIndex="tabIndex" @tab="tab"></tab>
		<view class="home-list">
			<list :tab="tabList" :activeIndex="activeIndex" @change="change"></list>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				tabList: [],
				tabIndex:0,
				activeIndex:0
			}
		},
		onLoad() {
			uni.$on('labelChange',()=>{
				this.tabList=[]
				this.tabIndex=0
				this.activeIndex=0
				this.getLabel()
			})
			this.getLabel()
		},
		methods: {
			//swiper变化时
			change(current){
				this.tabIndex=current
				this.activeIndex=current
				console.log('222',current);
			},
			// 获取选项卡数据
			getLabel() {
				// 调用云函数方法
				this.$api.get_label().then(res => {
					console.log('res',res); 
					this.tabList = res.data
					this.tabList.unshift({
						name:'全部'
					})
				})
			},
			//点击tab时
			tab({data,index}) {
				console.log(data, index);
				this.activeIndex=index
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}

	.home {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
		.home-list{
			flex: 1;
			box-sizing: border-box;
		}
	}
</style>
