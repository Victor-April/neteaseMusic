<template>
	<view class="musichead">
		<view class="music-head-icon" v-show="iconShow">
			<text class="iconfont iconzuojiantou-copy" @tap="handleToBack"></text>
			 | 
			<text class="iconfont iconshouye" @tap="handleToHome"></text>
		</view>
		<text :style="{ 'color' : fontcolor }"> {{title}} </text>
	</view>
</template>

<script>
	export default {
		name: "musichead",
		data() {
			return {

			};
		},
		props: ['title','iconShow','fontcolor'],
		methods:{
			handleToBack(){
				uni.navigateBack();
			},
			handleToHome(){
				uni.navigateTo({
					url:"/pages/index/index"
				})
			}
		}
	}
</script>

<style>
	.musichead {
		width: 100%;
		height: 75px;
		font-size: 16px;
		line-height: 80px;
		text-align: center;
		color: black;
		position: relative;
		font-weight: bolder;
	}

	.music-head-icon {
		position: absolute;
		left: 8px;
		top: 50%;
		transform: translateY(-50%);
		width: 90px;
		height: 31px;
		background: rgba(0, 0, 0, .2);
		color: white;
		line-height: 31px;
		border-radius: 15px;
		display: flex;
		justify-content: space-evenly;
	}
</style>
