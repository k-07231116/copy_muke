<template>
	<swiper class="home-swiper" :current="activeIndex" @change="change">
		<swiper-item class="swiper-item" v-for="(item,index) in tab" :key="index">
			<list-item :list="listCatchData[index]" :load="load[index]" @loadmore="loadmore"></list-item>
		</swiper-item>

	</swiper>
</template>

<script>
	import listItem from "./list-item.vue"
	export default {
		props: {
			tab: {
				type: Array,
				default () {
					return []
				}
			},
			activeIndex: {
				type: Number,
				default: 0
			}
		},
		components: {
			listItem
		},
		data() {
			return {
				list: [],
				listCatchData: {},
				load:{},
				pageSize: 10
			};
		},
		watch: {
			tab(newVal) {
				if (newVal.length === 0) return
				this.listCatchData={}
				this.load={}
				this.getList(this.activeIndex)
			}
		},
		created() {
			//tab还没有赋值
			uni.$on('update_article',(e)=>{
				if(e==='follow'){
					this.listCatchData={}
					this.load={}
					this.getList(this.activeIndex)
				}
			})
		},
		methods: {
			loadmore() {
				if(this.load[this.activeIndex].loading==='noMore'){
					return
				}
				this.load[this.activeIndex].page++
				console.log(222);
				this.getList(this.activeIndex)
			},
			//切换swiper
			change(e) {
				const {
					current
				} = e.detail

				console.log(this.tab[current].name);
				this.$emit('change', current)
				//当数据不存在才请求数据
				if (!this.listCatchData[current] || this.listCatchData[current].length === 0) {
					this.getList(current)
				}
			},
			getList(current) {
				if(!this.load[current]){
					this.load[current]={
						page:1,
						loading:'loading'
					}
				}
				this.$api.get_list({
					name: this.tab[current].name,
					page: this.load[current].page,
					pageSize: this.pageSize
				}).then(res => {
					if(res.data.length===0){
						let oldLoad={}
						oldLoad.loading='noMore'
						oldLoad.page=this.load[current].page
						this.$set(this.load,current,oldLoad)
						console.log('this.load',this.load);
						this.$forceUpdate()
						return
					}
					let oldList=this.listCatchData[current]||[]
					oldList.push(...res.data)
					//懒加载
					this.$set(this.listCatchData, current, oldList)
				})
			}
		}
	}
</script>

<style lang="scss">
	.home-swiper {
		height: 100%;

		.swiper-item {
			height: 100%;
			overflow: hidden;

			.list-scroll {
				height: 100%;
			}
		}
	}
</style>
