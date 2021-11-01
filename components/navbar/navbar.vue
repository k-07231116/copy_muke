<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<!-- 状态栏 -->
			<view :style="{height: statusBarHeight+'px'}"></view>
			<!-- 导航栏内容 -->
			<view class="navbar-content" :class="{search:isSearch}" :style="{height:navBarHeight+'px',width:windowWidth+'px'}" @click.stop="open">
				<view class="navbar-content_search-icons" v-if="isSearch" @click="back">
					<uni-icons type="back" size="22" color="#fff"></uni-icons>
				</view>
				<view v-if="!isSearch" class="navbar-search" >
					<!-- 非搜索页显示 -->
					<view class="navbar-search_icon" >
						<uni-icons type="search" color="black"></uni-icons>
					</view>
					<view class="navbar-search_text"></view>
				</view>
				<view class="navbar-search" v-else>
					<!-- 搜索页显示 -->
					<input class="navbar-search_text" type="text" v-model="val" placeholder="请输入要搜索的内容" @input="inputChange" />
				</view>
			</view>
		</view>
		<view :style="{height:statusBarHeight+navBarHeight+'px'}"></view>
	</view>
</template>

<script>
	export default {
		props:{
			isSearch:{
				type:Boolean,
				default:false
			},
			value:{
				type:[String,Number],
				default:''
			}
		},
		watch:{
			value(newVal){
				this.val=newVal
			}
		},
		data() {
			return {
				statusBarHeight: 20,
				navBarHeight: 40,
				windowWidth: 0,
				val:''
			};
		},
		created() {
			//获取状态栏高度
			const info = uni.getSystemInfoSync()
			this.statusBarHeight = info.statusBarHeight
			this.windowWidth = info.windowHeight
			// #ifdef MP-WEIXIN 
			// 获取胶囊信息
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			//（胶囊底部高度-状态栏高度）+（胶囊顶部高度-状态栏内高度）=导航栏高度
			this.navBarHeight = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info.statusBarHeight)
			this.windowWidth = menuButtonInfo.left
			// #endif
		},
		methods: {
			//返回
			back(){
				console.log('111');
				uni.switchTab({
					url:"/pages/tabbar/index/index"
				})
			},
			inputChange(e){
				const {value} = e.detail
				this.$emit('input',value)
			},
			// 打开搜索页
			open() {
				if(this.isSearch) return 
				uni.navigateTo({
					url:"/pages/home-search/home-search"
				})
			}
		}
	}
</script>

<style lang="scss">
	.navbar {
		.navbar-fixed {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			background-color: $mk-base-color;

			.navbar-content {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 45px;
				width: 100%;
				padding: 0 15px;
				box-sizing: border-box;

				.navbar-search {
					width: 100%;
					display: flex;
					align-items: center;
					padding: 0 10px;
					width: 100%;
					height: 30px;
					border-radius: 30px;
					background: #fff;

					.navbar-search_icon {
						width: 10px;
						height: 10px;
						margin-right: 10px;
						display: flex;
						justify-content: center;
						align-items: center;
					}

					.navbar-search_text {
						width: 100%;
						font-size: 14px;
						color: #999;
					}
				}
			}
			&.search{
				background-color: blue;
				padding-left:0px;
				.navbar-content_search-icons{
					margin-left: 10px ;
					margin-right: 10px;
				}
				.navbar-search{
					border-radius: 5px;
				}
			}

		}

	}
</style>
