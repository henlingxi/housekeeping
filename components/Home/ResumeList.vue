<template>
	<view class="ResumeList color" @click="jump('/pages/resume/resume?item='+JSON.stringify(Info))">
		<view class="user">
			<image :src="getPic(Info.id)" mode="aspectFill" alt="" class="user-img"
				@click.stop="jump('/pages/user/showUser?item='+JSON.stringify(Info))" />
			<view class="user-info">
				<view class="user-base-info">
					<view class="user-name">{{Info.nickname}}</view>
					<view class="user-eval"><img src="../../static/shoucang.png" alt="" class="star">{{Info.score| 5}}
					</view>
				</view>
				<view class="work">
					<view class="work-introduction" v-text="Info.introduction"></view>
					<view class="type flex backColor">
						<view class="type-item" v-for="item in Info.work_type.split(',')" :key="item" :style="color[item]">{{workType[item]}}</view>
					</view>
				</view>
				<view class="work-salary" v-text="Info.salary+' / 次 '"></view>
			</view>

			<view class="user-zero"></view>
			<view class="user-gis flex">
			</view>
		</view>
	</view>

</template>

<script lang="ts" setup>
	import { onShow, onLoad } from '@dcloudio/uni-app'
	import { computed, toRefs, defineProps, ref, reactive} from "vue"
	import baseImg from '@/utils/imgs/baseImg'
	import { baseUrl } from '@/utils/baseUrl.ts'
	const props = defineProps({
		Info: Object
	})
	const workType = ref(['小时工','保洁','月嫂','育婴师','护工','家庭保姆'])
	const color = reactive([{
		border: "2rpx solid #7ea8ea",
		color: "#7ea8ea"
	},{
		border: "2rpx solid #7ea8ea",
		color: "#7ea8ea"
	},{
		border: "2rpx solid #c4b4f5",
		color: "#c4b4f5"
		
	},{
		border: "2rpx solid #93af6e",
		color: "#93af6e"
	},{
		border: "2rpx solid #93af6e",
		color: "#93af6e"
	},{
		border: "2rpx solid #c4b4f5",
		color: "#c4b4f5"
	}]
	)
	const { Info } = toRefs(props)
	const getPic = ((id) => {
		let path = '../../static/pic(11).png'
		if(id == 4 || id == 5 || id == 6){
			path = '../../static/pic('+id+').png'
		}
		if (Info.user_pic) path = baseUrl + '/static/uploads' + Info.user_pic
		return path
	})
	interface ResumeInfo {
		createId : number
		introduction : string
		exprience : string
		salary : number
	}
	const jump = (url) => {
		uni.navigateTo({
			url
		})
	}
</script>

<style lang="scss" scoped>
	.ResumeList {
		margin: 15upx 10upx;
		padding: 5upx 10upx;
		border-radius: 10upx;
		box-shadow: 10px 10px 13px 1px #eff3fa;
		.work {
			margin-bottom: 10upx;
			.work-introduction {
				font-size: 0.9rem;
				width: 400rpx;
				flex: 1;
				word-break: break-all;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}

			.type {
				display: flex;
				margin: 10rpx 0;
				.type-item {
					font-size: 0.9rem;
					text-align: center;
					padding: 10rpx 5rpx;
					margin: 0 12rpx 0 0;
					width: 135rpx;
					border-radius: 15px;
					border: 2rpx solid #72a6c6;
					background-color: #fff ;
					// color: var(--blue);
				}
			}

			.work-exprience {
				font-size: 0.85em;
				width: 400rpx;
				word-break: break-all;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
				padding: 10upx 0;
			}
		}

		.user {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 20rpx 0;
			.user-img {
				height: 120upx;
				width: 120upx;
				border-radius: 10px;
				margin: 10upx 15upx 10upx 0;
			}

			.user-info {
				width: 80%;
				position: relative;
			}

			.user-base-info {
				display: flex;
			}

			.user-name,
			.user-eval {
				height: 40upx;
				line-height: 40upx;
				margin: 10rpx 10rpx 10rpx 0;
				font-size: 0.9rem;
			}

			.user-name {
				font-weight: bolder;
				font-size: 1.05rem;
			}

			.user-eval {
				// font-size: 0.8em
				padding: 0 10rpx;
			}

			.star {
				height: 30upx;
				width: 30upx;
				margin-right: 10rpx;
			}

			.work-salary {
				position: absolute;
				top: -10rpx;
				right: 0;
				font-size: 0.9em;
				font-weight: bold;
				margin: 10upx;
				color: #82b7a3;
			}

			.user-zero {
				flex: 1;
			}

			.user-gis {
				align-items: end;
			}
		}
	}
</style>