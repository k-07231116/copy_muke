<template>
	<view class="home">
		<navbar :isSearch="true" @input="change" v-model="value"></navbar>
		<view class="home-list">
			<view v-if="is_history" class="label-box">
				<view class="label-header">
					<text class="label-title">搜索历史</text>
					<text class="label-clear" @click="clearHistory">清空</text>
				</view>
				<view class="label-content" v-if="historyLists.length>0">
					<view class="label-content-item" v-for="item in historyLists" @click="openHistory(item)">{{item.name}}</view>
				</view>
				<view class="no-data" v-else>
					没有搜索历史
				</view>
			</view>
			<list-scroll v-else class="list-scroll">
				<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
				<view v-if="searchList.length>0">
					<list-card @click="setHistory" mode="base" :item="item" v-for="(item,index) in searchList" :key="index"></list-card>
				</view>
				<view class="no-data" v-if="searchList.length==0&&!loading">
					没有数据
				</view>
			</list-scroll>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				value: '',
				is_history: true,
				historyList: [],
				searchList: [],
				loading:false
			}
		},
		computed: {
			...mapState(['historyLists'])
		},
		onLoad() {

		},
		methods: {
			// 清空历史
			clearHistory(){
				this.$store.dispatch('clearHistory');
				uni.showToast({
					title:'清空完成'
				})
			},
			//打开历史
			openHistory(item) {
				this.value = item.name;
				this.getSearch(this.value);
			},
			//子组件传的
			setHistory() {
				this.$store.dispatch('set_history', {
					name: this.value
				})
			},
			// 输入框变化
			change(value) {
				if (!value) {
					clearTimeout(this.timer);
					this.mark = false;
					this.getSearch(value);
					return
				}
				if (!this.mark) {
					this.mark = true;
					this.timer = setTimeout(() => {
						this.mark = false;
						this.getSearch(value);
					}, 1000)
				}
				//
			},
			// 数据查询
			getSearch(value) {
				if (!value) {
					this.searchList = []
					this.is_history = true
					this.loading=true;
					return
				}
				this.$api.get_search({
					value,
				}).then(res => {
					const {
						data
					} = res;
					this.is_history = false;
					this.loading=false;
					console.log(res);
					this.searchList = data;
				}).catch(()=>{
					this.loading=false;
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		display: flex;
		background-color: #f5f5f5;
	}

	.home {
		display: flex;
		flex-direction: column;
		flex: 1;

		.label-box {
			background-color: #FFFFFF;
			margin-bottom: 10px;

			.label-header {
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				color: #666;
				padding: 10px 15px;
				border-bottom: 1px #f5f5f5 solid;

				.label-title {
					color: $mk-base-color;
				}

				.label-clear {
					color: #30b33a;
					font-weight: bold;
				}
			}

			.label-content {
				display: flex;
				flex-wrap: wrap;
				padding: 15px;
				padding-top: 0;

				.label-content-item {
					padding: 2px 10px;
					margin-top: 12px;
					margin-right: 10px;
					border-radius: 5px;
					border: 1px solid #666;
					font-size: 14px;
					color: #666;
				}
			}
		}
	}

	.no-data {
		height: 200px;
		line-height: 200px;
		width: 100%;
		text-align: center;
		font-size: 14px;
		color: #666;
	}
</style>
