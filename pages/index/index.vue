<template>
	<view class="index">
		<musichead title="网易云音乐" :icon="false"></musichead>
		<view class="container">
			<scroll-view scroll-y="true" class="index-scroll">

				<!-- 搜索 -->
				<view class="index-search">
					<text class="iconfont iconsearch"></text>
					<input type="text" placeholder="搜索歌曲" />
				</view>

				<!-- 榜单 -->
				<view class="index-list">
					<view class="index-list-item" v-for="item in topList" :key="item.id" @tap="handleToList(item.id)">
						<view class="index-list-img">
							<image :src="item.coverImgUrl"></image>
							<text>{{item.updateFrequency}}</text>
						</view>
						<view class="index-list-text">
							<view v-for="item,index in item.tracks" :key="index">{{index+1}}.{{item.first}} - {{item.second}}</view>
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
		topList
	} from "../../common/api.js"
	export default {
		data() {
			return {
				topList: []
			}
		},
		components: {
			musichead
		},
		methods: {
			handleToList(id){
				// console.log(id)
				uni.navigateTo({
					url: '/pages/list/list?id='+id
				});
			}
		},
		onLoad() {
			topList().then((res) => {
				if (res.length = 4) {
					this.topList = res
				}
			})
		}
	}
</script>

<style scoped>
	.index-scroll {
		width: initial;
		margin-right: 44rpx;
		margin-left: 44rpx;
	}

	/* 搜索框区 */
	.index-search {
		display: flex;
		align-items: center;
		height: 72rpx;
		margin-top: 70rpx;
		margin-bottom: 32rpx;
		background: #f7f7f7;
		border-radius: 40rpx;
	}

	.index-search text {
		margin-left: 30rpx;
		font-size: 28rpx;
		color: #bcbcbc;
	}

	.index-search input {
		margin-left: 24rpx;
		font-size: 28rpx;
		color: #9a9a9a;
	}


	/* 榜单区 */
	.index-list-item {
		display: flex;
		margin-bottom: 36rpx;
	}

	.index-list-img {
		position: relative;
	}

	.index-list-img image {
		width: 212rpx;
		height: 212rpx;
		border-radius: 14rpx
	}

	.index-list-img text {
		font-size: 22rpx;
		color: #fff;
		position: absolute;
		bottom: 16rpx;
		left: 14rpx;
	}

	.index-list-text {
		margin-left: 22rpx;
		padding-top: 4rpx;
		color: #585858;
		font-size: 22rpx;
		width: 400rpx;
	}

	.index-list-text>view {
		line-height: 68rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
