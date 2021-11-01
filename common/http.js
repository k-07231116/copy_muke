	import store from '../store/index.js'
export default function $http(options){
	const {
		url,
		data
	}=options
	const dataObj={
		// user_id:"5f3a80098142e4000189477e",
		user_id:store.state.userinfo._id,
		type:"all",
		...data
	}
	return new Promise((resolve,reject)=>{
		uniCloud.callFunction({
			name:url,
			data:dataObj
		}).then((res)=>{
			if(res.result.code===200){
				resolve(res.result)
			}else{
				reject(res.result)
			}
		}).catch(err=>{
			reject(err)
		})
	})
}