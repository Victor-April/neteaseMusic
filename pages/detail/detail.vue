<template>
	<view class="detail">
		<!-- <view class="fixbg" :style="{'background-image': 'url('+songDetail.al.picUrl+')'}"></view> -->
		<view class="fixbg" :style="{'background-image': 'url('+songDetail.al.picUrl+')'}"></view>
		<musichead :title='songDetail.name' :iconShow="true" fontcolor="#fff"></musichead>
		<view class="container">
			<scroll-view scroll-y="true">

				<!-- 播放相关 -->
				<view class="detail-play" @tap="handlePlayOrPause">
					<image :src="songDetail.al.picUrl" mode="" :class="{'detail-play-run' : playRotate}"></image>
					<text class="iconfont" :class="icon"></text>
					<view class=""></view>
				</view>

				<!-- 歌词 -->
				<view class="lyric">
					<view class="lyric-wrap">
						<view class="lyric-item" :class="{active:lyricIndex==index}" v-for="(item,index) in songLyric" :key="index">{{item.lyric}}</view>
					</view>
				</view>

				<!-- 推荐 -->
				<view class="like">
					<view class="like-head">
						喜欢这首歌的人也听
					</view>

					<view class="like-item" v-for="(item,index) in songSimi" :key="index">
						<view class="like-item-img">
							<image :src="item.album.blurPicUrl" mode=""></image>
						</view>

						<view class="like-item-middle">
							<view class="like-item-middle-title">{{item.name}}</view>
							<view class="like-item-middle-detail">
								<image v-if="item.privilege.flag>60&&item.privilege.flag<70" src="../../static/dujia.png" mode=""></image>
								<image v-if="item.privilege.maxbr==999000" src="../../static/sq.png" mode=""></image>
								<text>{{item.artists[0].name}} - {{item.album.name}}</text>
							</view>
						</view>

						<view class="like-item-right">
							<text class="iconfont iconbofang"></text>
						</view>
					</view>
					
					
				</view>

				<!-- 评论 -->
				<view class="comment">
					<view class="comment-head">精彩评论</view>
					<view class="comment-item" v-for="(item,index) in songComment" :key="item.commentId">
						<view class="item-left">
							<image :src="item.user.avatarUrl"></image>
						</view>
						<view class="item-right">
							<view class="item-right-top">
								<view class="item-right-top-left">
									<view class="">{{item.user.nickname}}</view>
									<view class="">{{item.time | formatTime}}</view>
								</view>
								<view class="item-right-top-right">
									{{item.likedCount | formatCount}}
									<text class="iconfont iconlike"></text>
								</view>
							</view>
							<view class="item-right-words">
								<text>{{item.content}}</text>
							</view>
							<view class="line">
								
							</view>
						</view>
					</view>
				</view>

			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from "../../components/musichead/musichead.vue"
	import {
		songDetail,
		songComment,
		songLyric,
		songSimi,
		songUrl
	} from "../../common/api.js"
	export default {
		data() {
			return {
				songDetail: {
					al: {
						picUrl:''
					}
				},
				songSimi:[],
				songComment:[],
				songLyric:[], 
				lyricIndex:0, // 控制哪条歌词高亮
				icon:'', // 图标状态变量，展示播放和暂停图标
				playRotate:true // 唱片旋转状态
			};
		},
		components: {
			musichead
		},
		methods: {
			getMusic(songId) {
				Promise.all([songDetail(songId),songSimi(songId),songComment(songId),songLyric(songId),songUrl(songId)]).then((res) => {
					// console.log(res)	
					if (res[0][1].data.code == 200) {
						this.songDetail = res[0][1].data.songs[0]
					}
					if(res[1][1].data.code == 200){
						this.songSimi = res[1][1].data.songs
					}
					if(res[2][1].data.code == 200){
						this.songComment = res[2][1].data.hotComments
					}
					if(res[3][1].data.code == 200){
						let lyric = res[3][1].data.lrc.lyric
						let re  = /\[([^\]]+)\]([^\[]+)/g
						var result = []
						lyric.replace(re,($0,$1,$2)=>{
							result.push({"time" : this.formatTimeToSec($1) , "lyric" : $2})
						})
						// console.log(result)
						this.songLyric = result 
					}
					if(res[4][1].data.code == 200){
						// console.log(res[4][1].data.data[0].url)
						this.bgAudioManager = uni.getBackgroundAudioManager();
						// console.log(bgAudioManager)
						this.bgAudioManager.title = this.songDetail.name;
						this.bgAudioManager.src = res[4][1].data.data[0].url;
						this.bgAudioManager.onPlay(()=>{
							this.icon = 'iconpause'
							this.playRotate = true
						})
						this.bgAudioManager.onPause(()=>{
							this.icon = 'iconbofang1'
							this.playRotate = false
						})
					}
				})
			},
			
			// 格式化歌词的时间以秒为单位
			formatTimeToSec(value){
				let arr = value.split(":")
				// console.log(typeof parseFloat(arr[0]))
				return ((arr[0])*60 + Number(arr[1])).toFixed(1)
			},
			handlePlayOrPause(){
				if(this.bgAudioManager.paused){
					this.bgAudioManager.play()
				}else{
					this.bgAudioManager.pause()
				}
			}
			
		},
		onLoad(options) {
			// console.log(options.songId)
			this.getMusic(options.songId)
		}
	}
</script>

<style scoped lang="less">
	// CD区
	.detail-play {
		width: 580rpx;
		height: 580rpx;
		background: url(~@/static/disc.png);
		background-size: cover;
		margin: 214rpx auto 0 auto;
		position: relative;
		
		.detail-play-run{
			animation-play-state: running;
		}
		image {
			width: 370rpx;
			height: 370rpx;
			border-radius: 50%;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;
			animation: 15s linear move infinite;
			animation-play-state: paused;
		}
		
		@keyframes move {
			from{transform: rotate(0deg);}
			to{transform: rotate(360deg);}
		}
		
		
		
		text {
			font-size: 100rpx;
			width: 100rpx;
			height: 100rpx;
			line-height: 100rpx;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;
			color: #FFFFFF;
		}

		view {
			width: 230rpx;
			height: 350rpx;
			position: absolute;
			background: url(../../static/needle.png);
			background-size: cover;
			position: absolute;
			top: -210rpx;
			left: 214rpx;
		}


	}

	// 歌词区
	.lyric {
		font-size: 32rpx;
		line-height: 82rpx;
		height: 246rpx;
		text-align: center;
		color: #909091;
		overflow: hidden;

		.lyric-wrap {}

		.lyric-wrap-item {
			height: 82rpx;
		}

		.active {
			color: #FFFFFF;
		}
	}

	// like区
	.like {
		width: 100vw;
		margin-left: 30rpx;
		margin-right: 30rpx;
		color: #FFFFFF;

		.like-head {
			height: 80rpx;
			line-height: 80rpx;
			font-size: 36rpx;
		}

		.like-item {
			height: 120rpx;
			display: flex;
			align-items: center;
		}

		.like-item-img {
			width: 82rpx;
			height: 82rpx;
			overflow: hidden;
		}

		.like-item-img image {
			width: 82rpx;
			height: 82rpx;
			border-radius: 10rpx;
		}

		.like-item-middle {
			margin-left: 20rpx;
			width: 532rpx;
		}

		.like-item-middle-title {
			height: 40rpx;
			font-size: 30rpx;
			line-height: 40rpx;
		}

		.like-item-middle-detail image {
			width: 30rpx;
			height: 20rpx;
			margin: 0 6rpx 0 0;
		}

		.like-item-middle-detail text {
			font-size: 22rpx;
			color: d0c9c6;
		}

		.like-item-right text {
			font-size: 50rpx;
		}
	}

	// 评论区
	.comment {
		width: 100vw;
		padding: 0 30rpx 0 30rpx;
		box-sizing: border-box;

		.comment-head {
			line-height: 90rpx;
			font-size: 34rpx;
			color: #FFFFFF;
		}

		.comment-item {
			display: flex;
		}

		.item-left {
			height: 84rpx;
			width: 62rpx;
			margin-right: 18rpx;
		}

		.item-left image {
			width: 62rpx;
			height: 62rpx;
			border-radius: 50%;
		}

		.item-right {
			flex: 1;
		}

		.item-right-top {
			display: flex;
			justify-content: space-between;
			height: 78rpx;
		}

		.item-right-top-left {
			height: 100%;
		}

		.item-right-top-left view:nth-child(1) {
			font-size: 24rpx;
			color: #f7f7f7;
		}

		.item-right-top-left view:nth-child(2) {
			font-size: 16rpx;
			color: #eceaea;
		}

		.item-right-top-right {
			color: #F7F7F7;
			font-size: 24rpx;
		}

		.item-right-top-right text {
			font-size: 30rpx;
			color: #f7f7f7;
			margin-left: 8rpx;
		}

		.item-right-words {}

		.item-right-words text {
			line-height: 38rpx;
			font-size: 28rpx;
			color: #FFFFFF;
		}

		.line {
			width: 100%;
			border-bottom: 1rpx solid #f7f7f7;
			margin-top: 36rpx;
			margin-bottom: 30rpx;
		}

	}
</style>
