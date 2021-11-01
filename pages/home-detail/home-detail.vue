<template>
	<view class="detail">
		<view class="detail-title">
			{{formData.title}}
		</view>
		<!-- 顶部头像 -->
		<view class="detail-header">
			<view class="detail-header__logo">
				<image :src="formData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header__content">
				<view class="detail-header__content-title">
					{{formData.title}}
				</view>
				<view class="detail-header__content-info">
					<text>{{formData.create_time}}</text>
					<text>{{formData.browse_count}}浏览</text>
					<text>{{formData.thumbs_up_count}}赞</text>
				</view>
			</view>
			<button class="detail-header__button" type="default" >关注</button>
		</view>
		<!-- 内容区 -->
		<view class="detail-content">
			<!-- 富文本 -->
			<view class="detail-html">
				<u-parse :content="formData.content" :noData="noData"></u-parse>
			</view>
			<!-- 评论 -->
			<view class="detail-comment">
				<view class="comment-title">
					最新评论
				</view>
				<view class="comment-content" v-for="(item) in commentsList" :key="item.comment_id">
					<comments-box :comments="item" @reply='reply'></comments-box>
				</view>
			</view>
		</view>
		<view class="detail-bottom">
			<view class="detail-bottom__input" @click="openComment">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<!-- 三个按钮 -->
			<view class="detail-bottom__icons">
				<view class="detail-bottom__icons-box "@click="open">
					<uni-icons type="chat" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-bottom__icons-box" @click="likeTap(formData._id)">
					<uni-icons :type="formData.is_like?'heart-filled':'heart'" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-bottom__icons-box" @click="thumbsup(formData._id)">
					<uni-icons :type="formData.is_thumbs_up? 'hand-thumbsup-filled':'hand-thumbsup'" size="22" color="#f07373"></uni-icons>
				</view>
			</view>
		</view>
		<!-- 发布评论弹出框 -->
		<uni-popup ref="popup" type="bottom" :maskClick="false">
			<view class="popup-wrap">
				<view class="popup-header">
					<text class="popup-header__item" @click="closeComment">取消</text>
					<text class="popup-header__item" @click="submit">发布</text>
				</view>
				<view class="popup-content">
					<textarea v-model="commentValue" class="popup-textarea" maxlength="200" placeholder="请输入评论内容" fixed />
					<view class="popup-count">{{commentValue.length}}/200</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uParse from '@/components/u-parse/u-parse.vue'
	export default {
		data() {
			return {
				formData: {},
				noData:'数据加载中',
				commentValue:'',
				commentsList:[],
				replyFormdata:{}
			}
		},
		components:{
			uParse
		},
		onLoad(options) {
			this.formData = JSON.parse(options.params)
			this.getDetail();
			this.getComments()
		},
		methods: {
			//跳转评论页面
			open(){
				uni.navigateTo({
					url:"/pages/detail-content/detail-content?id="+ this.formData._id
				})
			},
			//点击点赞按钮
			thumbsup(article_id){
				this.sutUpdateThumbs(article_id)
			},
			//点击收藏按钮
			likeTap(article_id){
				this.setUpdateLike(article_id)
			},
			//回复
			reply(e){
				this.replyFormdata={
					"comment_id":e.comments.comment_id,
					"is_reply":e.is_reply
				}
				if(e.comments.reply_id){
					this.replyFormdata.reply_id=e.comments.reply_id
				}
				console.log('this.replyFormdata.',this.replyFormdata);
				this.openComment()
			},
			//打开评论发布窗口
			openComment(){
				this.$refs.popup.open();
			},
			// 关闭评论窗口
			closeComment(){
				this.$refs.popup.close();
			},
			//发布评论
			submit(){
				if(!this.commentValue){
					uni.showToast({
						title:"请输入评论内容",
						icon:"none"
					})
					return
				}
				this.setUpdateComment({content:this.commentValue,...this.replyFormdata});
			},
			setUpdateComment(content){
				const formdata={
					article_id:this.formData._id,
					...content
				}
				uni.showLoading()
				this.$api.update_comment(formdata).then(res=>{
					console.log(res);
					uni.hideLoading();
					uni.showToast({
						title:"评论发布成功"
					})
					this.getComments()
					this.closeComment();
					this.replyFormdata={}
					this.commentValue=''
				})
			},
			// 获取详情信息
			getDetail() {
				this.$api.get_detail({
					article_id: this.formData._id
				}).then((res) => {
					const {
						data
					} = res
					this.formData = data
				})
			},
			//请求评论内容
			getComments(){
				this.$api.get_comments({
					article_id: this.formData._id
				}).then(res=>{
					console.log(res);
					const {data} = res
					this.commentsList=data
					console.log('comment',this.commentsList);
				})
			},
			//收藏文章
			setUpdateLike(article_id){
				uni.showLoading()
				this.$api.update_like({
					article_id
				}).then(res=>{
					console.log('收藏成功',res);
					this.formData.is_like=!this.formData.is_like
					uni.$emit('update_article')
					uni.showToast({
						title:this.formData.is_like?'收藏成功':'取消收藏',
						icon:'none'
					})
					uni.hideLoading()
				})
			},
			//点赞
			sutUpdateThumbs(article_id){
				uni.showLoading()
				this.$api.update_thumbsup({
					article_id
					}).then(res=>{
					uni.hideLoading()
					this.formData.is_thumbs_up = true
					this.formData.thumbs_up_count++
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.detail {
		padding: 15px 0;
		padding-bottom: 54px;
	}

	.detail-title {
		padding: 0 15px;
		font-size: 18px;
		font-weight: bold;
		color: #333;
	}

	.detail-header {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		margin-top: 10px;
		padding: 0 15px;

		.detail-header__logo {
			overflow: hidden;
			border-radius: 50%;

			image {
				width: 40px;
				height: 40px;
			}
		}

		.detail-header__content {
			width: 100%;
			display: flex;
			padding-left: 10px;
			flex-direction: column;
			justify-content: space-between;
			font-size: 12px;

			.detail-header__content-title {
				font-size: 14px;
				color: #333;
			}

			.detail-header__content-info {
				color: #999;

				text {
					margin-right: 10px;
				}
			}
		}
		.detail-header__button{
			flex-shrink: 0;
			height: 30px;
			font-size: 12px;
			color: #fff;
			background-color: $mk-base-color;
		}
	}

	.detail-content {
		margin-top: 20px;
		min-height: 500px;
		.detail-html{
			padding: 0 15px;
		}
		.detail-comment{
			margin-top: 30px;
			.comment-title{
				padding: 0 15px;
				font-size: 14px;
				color: #666;
				border-bottom: 1px #f5f5f5 solid;
			}
			.comment-content{
				padding: 0 15px;
				border-top: 1px #eee solid;
			}
		}
	}

	.detail-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		width: 100%;
		height: 44px;
		border: 1px solid #f5f5f5;
		background-color: #fff;
		box-sizing: border-box;

		.detail-bottom__input {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-left: 10px;
			padding: 0 10px;
			width: 100%;
			height: 30px;
			border: 1px solid #ddd;
			border-radius: 5px;

			text {
				font-size: 14px;
				color: #999;
			}
		}

		.detail-bottom__icons {
			display: flex;
			flex-shrink: 0;
			padding: 0 10px;

			.detail-bottom__icons-box {
				position: relative;
				display: flex;
				align-items: center;
				width: 44px;
			}
		}
	}
	.popup-wrap{
		background-color: #fff;
		.popup-header{
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			color: #666;
			border-bottom: px solid #f5f5f5;
			.popup-header__item{
				height: 50px;
				line-height: 50px;
				padding: 0 15px;
			}
		}
		.popup-content{
			width: 100%;
			padding: 15px;
			box-sizing: border-box;
			.popup-textarea{
				width: 100%;
				height: 200px;
				
			}
			.popup-count{
				display: flex;
				justify-content: flex-end;
				font-size: 12px;
				color: #999;
			}
		}
	}
</style>
