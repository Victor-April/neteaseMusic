<template>
	<view class="list">
		<view class="fixbg" :style="{'background-image': 'url('+playlist.coverImgUrl+')'}"></view>
		<musichead title="歌单" :icon="true" class="musichead" fontcolor="#fff"></musichead>
		<view class="container" v-show="show">
			<scroll-view scroll-y="true">
				
				<!-- 列表头部 -->
				<view class="list-head">
					<view class="list-head-img">
						<image :src="playlist.coverImgUrl"></image>
						<text class="iconfont iconyousanjiao">{{playlist.playCount | formatCount}}</text>
					</view>
					<view class="list-head-text">
						<view class="">{{playlist.name}}</view>
						<view class="">
							<image :src="playlist.creator.avatarUrl"></image><text>网易云音乐</text>
						</view>
						<view class="">{{playlist.description}}</view>
					</view>
				</view>
				
				<!-- 差异化编译：微信分享按钮 -->
				<!-- #ifdef MP-WEIXIN -->
				<button class="list-share" open-type="share">
					<text class="iconfont iconicon-"></text>分享给微信好友
				</button>
				<!-- #endif -->
				
				<!-- 音乐列表 -->
				<view class="list-music">
					<!-- 列表头部 -->
					<view class="list-music-head">
						<text class="iconfont iconbofang1"></text>
						<text>播放全部</text>
						<text>(共{{playlist.trackCount}}  首)</text>
					</view>
					<!-- <view class="list-music-item">
						<view class="list-music-top"><text>1</text></view>
						<view class="list-music-song">
							<view class="">与我无关</view>
							<view class="">
								<image src="../../static/sq.png" mode=""></image>
								<image src="../../static/dujia.png" mode=""></image>
								<text>啊冗 - 与我无关</text>
							</view>
						</view>
						<text class="iconfont iconbofang"></text>
					</view> -->
					
					<!-- 列表个体 -->
					<view class="list-music-item" v-for="(item,index) in playlist.tracks" :key="item.id" @tap="hundleToDetail(item.id)">
						<view class="list-music-top"><text>{{index+1}}</text></view>
						<view class="list-music-song">
							<view class="">{{item.name}}</view>
							<view class="">
								<image v-if="privileges[index].flag>=60&&privileges[index].flag<=70" src="../../static/dujia.png" mode=""></image>
								<image v-if="privileges[index].maxbr == 999000" src="../../static/sq.png" mode=""></image>
								<text>{{item.ar[0].name}} - {{item.al.name}}</text>
							</view>
						</view>
						<text class="iconfont iconbofang"></text>
					</view>
					
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	
	import musichead from "../../components/musichead/musichead.vue"
	import { list } from "../../common/api.js"
	
	export default {
		data() {
			return {
				playlist:{
					coverImgUrl:'',
					creator:{
						avatarUrl:''
					}
				},
				privileges:[],
				show:false
			}
		},
		components: {
			musichead
		},
		methods: {
			hundleToDetail(id){
				uni.navigateTo({
					url: '/pages/detail/detail?songId='+id
				});
			}
		},
		onLoad(options) {
			// 启动加载中效果
			uni.showLoading({
				title: '加载中...'
			});
			// 拿到url传过来的id参数以便于发请求
			list(options.id).then((res,rej)=>{
				if(res[1].data.code === 200){
					this.playlist = res[1].data.playlist
					this.privileges = res[1].data.privileges
					this.show = true
					// 取消加载中效果
					uni.hideLoading()
				}
			})	
		}
	}
</script>

<style scoped>

	/* head区域样式 */

	.list-head {
		display: flex;
		margin: 34rpx;
	}

	.list-head-img {
		position: relative;
	}

	.list-head-img image {
		width: 262rpx;
		height: 262rpx;
		border-radius: 30rpx;
	}

	.list-head-img text {
		position: absolute;
		right: 10rpx;
		top: 8rpx;
		color: white;
		font-size: 22rpx
	}

	.list-head-text {
		flex: 1;
		padding-left: 40rpx;
	}

	.list-head-text view:nth-child(1) {
		font-size: 30rpx;
		color: #fff;
	}

	.list-head-text view:nth-child(2) {
		display: flex;
		align-items: center;
		margin-top: 30rpx;
		margin-bottom: 26rpx;
	}

	.list-head-text view:nth-child(2) image {
		width: 56rpx;
		height: 56rpx;
		border-radius: 50%;
		margin-right: 14rpx;
	}

	.list-head-text view:nth-child(2) text {
		font-size: 22rpx;
		color: #fff;
	}

	.list-head-text view:nth-child(3) {
		font-size: 20rpx;
		color: #fff;
		line-height: 32rpx;
	}


	/* 分享按钮区域样式 */
	.list-share {
		width: 334rpx;
		height: 74rpx;
		color: #fff;
		line-height: 74rpx;
		border-radius: 40rpx;
		background-color: rgba(0,0,0,0.2);
		font-size: 28rpx;
	}
	.list-share text {
		margin-right: 16rpx;
	}
	
	
	/* 歌曲列表 */
	.list-music{margin-top:42rpx;background-color: #fff;border-radius: 50rpx;}
	.list-music-head{line-height: 112rpx;}
	.list-music-head text:nth-child(1){font-size: 52rpx;margin-right: 26rpx;margin-left: 26rpx;}
	.list-music-head text:nth-child(2){font-size: 30rpx;margin-right: 10rpx;}
	.list-music-head text:nth-child(3){font-size: 24rpx; color: #b1b1b1;}
	
	.list-music-item{height: 126rpx;width: 100%;display: flex;align-items: center;position: relative;}
	.list-music-top{width: 100rpx; color: #959559; text-align: center;}
	.list-music-song{display: flex;flex-direction: column;}
	.list-music-song view:nth-child(1){width: 500rpx; font-size: 28rpx;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;}
	.list-music-song view:nth-child(2){width: 500rpx;overflow: hidden; display: flex;align-items: center;margin-top: 10rpx;}
	.list-music-song view:nth-child(2) image{width: 30rpx;height: 20rpx;margin-right: 6rpx; }
	.list-music-song view:nth-child(2) text{ width: 430rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-left:2rpx; font-size: 24rpx; color: #808080;}
	.list-music-item .iconbofang {font-size: 58rpx;color: #d7d7d7; position: absolute;right: 32rpx;}
	
</style>
