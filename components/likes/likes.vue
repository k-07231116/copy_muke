<template>
	<view class="icons" @click.stop="likeTap">
		<uni-icons :type="like?'heart-filled':'heart'" size="20" color="#f07373"></uni-icons>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				like: false
			};
		},
		props: {
			item: {
				type: Object,
				default () {
					return {}
				}
			},
			types:{
				type:String,
				default:''
			}
		},
		watch: {
			item(newVal) {
				this.like = this.item.is_likes
			}
		},
		created() {
			this.like = this.item.is_like
		},
		methods: {
			likeTap() {
				this.like = !this.like
				this.setUpdateLikes()
			},
			setUpdateLikes() {
				uni.showLoading()
				uni.showToast({
					title:this.like?'收藏成功':'取消收藏',
					icon:"none"
				})
				uni.$emit('update_article',this.types)
				this.$api.update_like({
					user_id: '5f3a80098142e4000189477b',
					article_id: this.item._id
				}).then(res => {
					uni.hideLoading()
					console.log(res);
				}).catch(() => {
					uni.hideLoading()
				})
			}
		}

	}
</script>

<style>
	.icons {
		position: absolute;
		right: 0;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 20px;
		height: 20px;
	}
</style>
