<template>
	<view>
		<template v-for="i in list.items" :key="id">
			<view class="worker backColor">
				<view class="nickname backColor">{{i.nickname}}</view>
				<view class="flex backColor">
					<view class="other backColor">年龄：{{i.age}}</view>
					<view class="other backColor">性别：{{i.gender}}</view>
				</view>
				<view class="phone backColor">联系方式:{{i.number || i.email}}</view>
				<text class="button " @click="sub(i.id)">
					雇佣
				</text>
			</view>
		</template>
	</view>
</template>

<script setup>
	import {
		onShow
	} from '@dcloudio/uni-app'
	import {
		reactive
	} from "vue"
	import {
		GetReservation,
		ChangeReservation
	} from "@/apis/reservationApis"


	const props = defineProps(["item"])

	const list = reactive({
		total: 0,
		items: []
	})
	const getInfo = async () => {
		const {
			total,
			items
		} = await GetReservation({
			reservationId: props.item.id,
			pageNum: 1,
			pageSize: 100
		})
		list.items = items
		list.total = total

	}
	onShow(() => {
		getInfo()
	})

	const sub = async (agree) => {
		await ChangeReservation(`?workerId=${agree}&reservationId=${props.item.id}`)
	}
</script>

<style scoped>
	.backColor {
		background-color: #eff3fa;
	}

	.worker {
		margin: 20rpx 0;
		padding: 20rpx;
		border-radius: 15px;
		position: relative;
		/* box-shadow: 1rpx 3rpx 1rpx 1rpx #d1d1d1; */
	}

	.nickname {
		font-size: 1.05rem;
		font-weight: bold;
		margin: 10rpx;
	}
	.other{
		font-size: 0.8rem;
		margin: 10rpx;
		padding: 0 50rpx 0 0;
	}
	/* .sex {
		margin: 10rpx;
		font-size: 0.8rem;
	} */
		
	.phone{
		padding: 10rpx;
	}
	.button {
		position: absolute;
		top: 10rpx;
		right: 30rpx;
		padding: 2rpx 30rpx;
		margin-top: 20rpx;
		width: 70rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		border-radius: 15px;
		background-color: var(--blue);
		color: #fff;
	}
</style>