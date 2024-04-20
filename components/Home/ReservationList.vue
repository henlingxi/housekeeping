<template>
	<view class="Info" v-if="!Info.isAsigned">
		<view class="mian-info flex">
			<view class="request">
				{{Info.request}}
			</view>
			<view class="salary">
				{{Info.salary}}元
			</view>
		</view>

		<view class="address">
			<img src="../../static/地址.png" alt="" class="address-img">{{Info.address}}
		</view>

		<view class="work—time">
			{{Info.workTime}}发布
		</view>
		<template v-if="!Info.isAsigned">
			<text class="sure" @click="agreeWork(Info.id)">
				接受
			</text>
			<br>
		</template>
		<!-- Info.isAsigned -->
		<!-- Info.id/createId -->
	</view>
</template>

<script setup>
	import {
		AgreeReservation,
		NewReservation,
		AddReservation
	} from '@/apis/reservationApis'
	const props = defineProps({
		Info: Object
	})
	const agreeWork = async (id) => {
		await AddReservation(id)
	}
</script>

<style lang='scss' scoped>
	.Info {
		margin: 15upx 10upx;
		padding: 5upx 10upx 0 10upx;
		border-radius: 10upx;
		box-shadow: 10px 10px 13px 1px #eff3fa;

		.mian-info {
			width: 100%;
			margin: 20rpx 0;
			justify-content: space-between;

			.request {
				margin: 10rpx 30rpx;
				font-weight: bolder;
			}

			.salary {
				padding-right: 20rpx;
				margin-top: 20rpx;
				color: #7fc6d7;
				font-size: 1.1rem
			}
		}
		
		.work—time,
		.address{
			margin: 0 20rpx;
		}
		.address{
			font-size: 0.8rem
		}
		
		
		.work—time {
			margin-top: 20rpx;
			padding: 0 25rpx;
			font-size: 0.8rem;
			color:#5d5d5d
		}

		.sure {
			height: 50rpx;
			line-height: 50rpx;
			/* text-align: center; */
			position: relative;
			top: -50rpx;
			left: 80%;
			padding: 10rpx 40rpx;
			margin-bottom: 20rpx;
			border-radius: 15px;
			color: #fff;
			background-color: var(--blue);
		}
	}
</style>