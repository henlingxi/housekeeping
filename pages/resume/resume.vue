<template>
	<view class="box">
		<view class="base-info ">
			<view class="user ">
				<view class="flex info">
					<image class="user-pic" :src="getPic(reservation.id)" mode="aspectFill"></image>
					<view class="right">
						<view class="nickname ">{{reservation.nickname}}</view>
						<uni-rate :readonly="true" :value="reservation.score | 5" class="star" :is-fill="false" />
						<view class="email ">邮箱：{{reservation.email}}</view>
					</view>
				</view>
				<view class="type flex ">
					<view class="type-item" v-for='item in work_type' :key="item">{{item.workType}}</view>
				</view>
			</view>
		</view>

		<view class="user-base-info">
			<view class="work">
				<view class="my-type">基本信息</view>
				<view class="work-info">
					<view class="info">性别</view>
					<view class="text">{{reservation.gender ||= '暂无信息'}}</view>
				</view>
				<view class="work-info">
					<view class="info">年龄</view>
					<view class="text">{{reservation.age ||= "暂无信息"}}</view>
				</view>
				<view class="work-info">
					<view class="info">期望薪资</view>
					<view class="text">{{reservation.salary ||= "暂无信息"}}</view>
				</view>
			</view>
			<view class="work">
				<view class="my-type">工作经历</view>
				<view class="work-info">
					<view class="info">介绍</view>
					<view class="text">{{reservation.introduction ||= "暂无信息"}}</view>
				</view>
				<view class="work-info">
					<view class="info">经验</view>
					<view class="text">{{reservation.exprience ||= "暂无信息"}}</view>
				</view>
				<view class="work-info">
					<view class="info">详细介绍</view>
					<view class="text">{{reservation.detail || "暂无信息"}}</view>
				</view>
			</view>
		</view>

	</view>

</template>

<script lang="ts" setup>
	import { onShow, onLoad } from '@dcloudio/uni-app'
	import { reactive, ref } from 'vue'
	import { useWorkInfoStore } from '@/stores/workinfo.ts'
	import { baseUrl } from '@/utils/baseUrl'
	import baseImg from '@/utils/imgs/baseImg'
	import { ResumeDetails } from '@/apis/resumeApis'
	const WorkInfoStore = useWorkInfoStore()
	const reservation = ref({})
	const user_pic = ref()
	const work_type = ref()
	const getPic = ((id) => {
		let path = '../../static/pic(11).png'
		if (id == 4 || id == 5 || id == 6) {
			path = '../../static/pic(' + id + ').png'
		}
		if (reservation.user_pic) path = baseUrl + '/static/uploads' + Info.user_pic
		return path
	})
	const jump = (url) => {
		uni.navigateTo({
			url
		})
	}
	onLoad((option) => {
		reservation.value = JSON.parse(option.item)
		work_type.value = reservation.value.work_type.split(',').reduce((pre, item) => {
			return [...pre, WorkInfoStore.workTypeList[item - 0]]
		}, [])
		user_pic.value = `${baseUrl}/static/upload/${reservation.value.user_pic}` | baseImg
		console.log(user_pic.value)
	})
</script>

<style lang="scss" scoped>
	::v-deep .uni-rate {
		background-color: transparent;
		position: relative;
		z-index: 1;
		.uniui-star-filled::before {
			background-color: #4b98f5 !important;
			border: 3px solid #4b98f5;
		}

	}

	.box {
		.base-info {
			background: linear-gradient(to bottom, #458cff, #5ab6dd);
			height: 45%;
			position: relative;
			border-radius: 0 0 30px 30px;
		}

		.base-info::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: inherit;
			z-index: -1;
		}

		.info {
			background: inherit;
			background-attachment: fixed;
		}

		.right {
			background: inherit;
			background-attachment: fixed;
		}

		.user {
			background-color: transparent;
			position: relative;
			z-index: 1;
			background-attachment: fixed;
			width: 100%;
			position: absolute;
			top: 35%;
			transform: translateY(-55%);
			border-radius: 0 0 25rpx 25px;

			.user-pic {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				margin: 25rpx 0 0 60rpx;
			}

			.email,
			.nickname {
				background-color: transparent;
				position: relative;
				z-index: 1;
				color: #efefef;
				line-height: 75rpx;
				padding: 0 20rpx;
			}

			.nickname {
				color: #fff;
				font-weight: bold;
				font-size: 1.1rem;
				margin-top: 20rpx;
			}

			.star {
				margin-left: 13rpx;
				background: inherit;
			}
		}

		.type {
			background-color: transparent;
			position: relative;
			z-index: 1;
			display: flex;
			justify-content: center;

			.type-item {
				text-align: center;
				padding: 10rpx;
				width: 170rpx;
				border-radius: 15rpx;
				background-color: #8ed7ee;
				color: #fff;
				margin: 10rpx 20rpx;
			}
		}

		.user-base-info {
			position: absolute;
			right: 3%;
			top: 30%;
			width: 94%;
			border-radius: 15px;
			background-color: rgba(248, 248, 248, 0.3);
			box-shadow: 1px 1px 13px 2px rgba(0, 0, 0, 0.1);
		}

		.work {
			padding: 50rpx 10rpx;
			border-radius: 10px;

			.my-type {
				padding: 10rpx 30rpx;
				border-left: 5upx solid var(--blue);
			}

			.work-info {
				display: flex;
				justify-content: center;
				align-items: center;

				.info {
					flex: 1;
					text-align: center;
					text-align: justify;
					text-justify: distribute-all-lines;
					text-align-last: justify;
					margin: 20rpx 10rpx;
					position: relative;
					font-weight: bold;

					&::after {
						content: " ";
						position: absolute;
						bottom: -0.5upx;
						right: -5upx;
						opacity: 0.8;
						width: 30%;
						height: 15rpx;
						background-color: #8ed7ee;
						border-radius: 10px;
					}
				}

				.text {
					// background-color: rgba(248, 248, 248, 0.3);
					flex: 3;
					margin: 20rpx;
					padding: 0 30rpx;
				}
			}

		}
	}
</style>