<template>
	<view>
		<view class="detail-content" v-for="item in commentsList" :key="item.comment_id">
			<comments-box :comments="item"></comments-box>
		</view>
		<uni-load-more v-if="commentsList.length===0 || commentsList.length>5" type="snow" :status="status"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				commentsList: [],
				article_id: '',
				pageSize: 5,
				page: 1,
				status: 'loading'
			}
		},
		onLoad(query) {
			this.article_id = query.id
			this.getComments()
		},
		onReachBottom() {
			if (this.status === 'noMore') return
			this.page++
			this.getComments()
		},
		methods: {
			//请求评论内容
			getComments() {
				this.$api.get_comments({
					article_id: this.article_id,
					page: this.page,
					pageSize: this.pageSize
				}).then(res => {
					const {
						data
					} = res
					if (data.length === 0) {
						this.status = 'noMore'
						return
					}
					let oldFormData = JSON.parse(JSON.stringify(this.commentsList))
					oldFormData.push(...data)
					this.commentsList = oldFormData
				})
			},
		}
	}
</script>

<style lang="scss">
	.detail-content {
		padding: 0 15px;
	}
</style>
