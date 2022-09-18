import {
	baseUrl
} from "./config.js"

// 获取首页榜单数据
export function topList() {
	// let listIds = ['19723756','3779629','2884035','3778678']
	
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseUrl}/toplist/detail`,
			method: 'GET',
			data: {},
			success: res => {
				// playlist/detail?id=
				let result = res.data.list
				result.length = 4
				// for (var i = 0; i < listIds.length; i++) {
				// 	result[i].listId = listIds[i]
				// }
				// console.log(result)
				resolve(result)
			},
			fail: () => {},
			complete: () => {}
		});
	})


}

// 获取歌单详情页
export const list = (id)=>{
	return uni.request({
		url: `${baseUrl}/playlist/detail?id=${id}`,
		method: 'GET',
	});
}


// detail页请求
// 歌曲详情
export const songDetail = (songId)=>{
	return uni.request({
		url: `${baseUrl}/song/detail?ids=${songId}`,
		method: 'GET',
	});
}
// 相似歌曲
export const songSimi = (songId)=>{
	return uni.request({
		url: `${baseUrl}/simi/song?id=${songId}`,
		method: 'GET',
	});
}
// 歌曲评论
export const songComment = (songId)=>{
	return uni.request({
		url: `${baseUrl}/comment/music?id=${songId}`,
		method: 'GET',
	});
}
// 歌词
export const songLyric = (songId)=>{
	return uni.request({
		url: `${baseUrl}/lyric?id=${songId}`,
		method: 'GET',
	});
}
// 歌曲播放资源
export const songUrl = (songId)=>{
	return uni.request({
		url: `${baseUrl}/song/url?id=${songId}`,
		method: 'GET',
	});
}