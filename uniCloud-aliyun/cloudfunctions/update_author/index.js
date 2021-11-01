'use strict';
const db = uniCloud.database();
const dbCmd  = db.command
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		user_id,
		author_id
	}  =event
	//返回数据给客户端
	const user = await db.collection('user').doc(user_id).get()
	const author_likes_ids = user.data[0].author_likes_ids
	
	let author_ids = null
	if(author_likes_ids.includes(author_id)){
		author_ids = dbCmd.pull(author_id)
	}else{
		author_ids = dbCmd.addToSet(author_id)
	}
	console.log('author_ids',author_ids);
	await db.collection('user').doc(user_id).update({
		author_likes_ids:author_ids
	})
	return {
		code:200,
		msg:"更新成功"
	}
};
