'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {

	const {
		user_id,
		name,
		page = 1,
		pageSize = 10
	} = event
	let matchObj = {}
	if (name !== '全部') {
		matchObj = {
			classify: name
		}
	}
	const userinfo = await db.collection('user').doc(user_id).get()
	const article_likes_ids=userinfo.data[0].article_likes_ids
	// 聚合：接收分类筛选数据，聚合操作，更精细化处理数据
	const list = await db.collection('article')
		.aggregate()
		//追加字段
		.addFields({
			is_like: $.in(['$_id', article_likes_ids])
		})
		.match(matchObj)
		.project({
			content: false
		})
		.skip(pageSize * (page - 1))
		.limit(pageSize)
		.end()
	// const list =await db.collection('article')
	// .field({
	//false不返回这个字段，true只返回这个字段
	// 	content:false
	// })
	// .get()
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: list.data
	}
};
