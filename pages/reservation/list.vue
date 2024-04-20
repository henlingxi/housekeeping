<template>
	<view class="List">
		<view class="title flex">
			<template v-for="item in title" :key="item.id">
				<text :class="{'title-item-active':nowState==item.state}" class="title-item" v-text="item.title"
					@click="getReservation(item.state)"></text>
			</template>
		</view>
		<view class="zero flex " v-if="!list.total">
			<img src="../../static/暂无内容.png" alt="" class="zero_img">
			<view class="zero-text">暂无内容</view>
		</view>
		<template v-for="item in list.items" :key="item.id">
			<view class="Item">
				<view class="request">
					{{item.request}}
				</view>
				<view class="address">
					<img src="../../static/地址.png" alt="" class="address-img">{{item.address}}
				</view>
				<view class="other flex">
					<view class="salary">
						薪水：{{item.salary}}
					</view>
					<view class="work-time">
						时间：{{item.workTime || item.work_time}}
					</view>
				</view>
				<ItemList :item="item"></ItemList>
				<view v-if="nowState == '进行中' ">
					<view class="choose" @click="finish(item.id)">已完成</view>
				</view>
				<view v-if="nowState == '已发布' && UserInfoStore.roleId===2" class="choose-view">
					<view class="choose" @click="choose(item.id,1)">接受</view>
					<view class="choose" @click="choose(item.id,0)">拒绝</view>
				</view>
			</view>

		</template>
	</view>
</template>

<script lang="ts" setup>
	import RouteIntercept from '../../hooks/RouteIntercept';
	import ItemList from '../../components/ListItem.vue';

	import { onShow } from '@dcloudio/uni-app'
	import { GetReservation, ReservationRemark, ChangeReservation } from "@/apis/reservationApis"
	import { ref, reactive } from "vue"
	import { useUserInfoStore } from '@/stores/userinfo.ts'
	const UserInfoStore = useUserInfoStore()
	let nowState = ref('已发布')

	const title = [{ id: 1, title: "已发布", state: "已发布" },
	{ id: 2, title: "进行中", state: "进行中" },
	{ id: 3, title: "已完成", state: "已完成" },]

	let list = reactive({
		total: 0,
		items: []
	})

	const enter = (item) => {
		uni.navigateTo({
			url: '/pages/reservation/reservationParticulars?item=' + JSON.stringify(item),
		})
	}


	const getReservation = async (state ?: string) => {
		nowState.value = state || "已发布"
		if (nowState.value == "已发布" && UserInfoStore.roleId === 2) {
			const { data: { data } } = await ReservationRemark({ pageNum: 1, pageSize: 100 })
			list.total = data.total
			list.items = data.items
		} else {
			const { total, items } = await GetReservation({ state: nowState.value, pageNum: 1, pageSize: 100 })
			list.total = total
			list.items = items
		}


	}

	const choose = async (id, agree) => {
		await ChangeReservation(`?reservationId=${id}&agree=${agree}`)
	}
	const finish = async (id) => {
		await ChangeReservation(`?reservationId=${id}`)
	}

	onShow(async () => {
		RouteIntercept()
		getReservation()
	})
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
	}

	.List {
		height: 100%;

		.title {
			height: 90upx;
			line-height: 90upx;
			width: 100%;
			margin-bottom: 10upx;
			.title-item {
				flex: 1;
				text-align: center;
			}

			.title-item-active {
				font-size: 1.1rem;
				position: relative;
				font-weight: bolder;
			}

			.title-item-active::after {
				content: " ";
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				width: 20%;
				height: 10rpx;
				background-color: #8ed7ee;
				border-radius: 15px;
			}
		}

		.zero {
			display: flex;
			flex-direction: column;
			.zero_img{
				width: 100%;
			}
			.zero-text{
				text-align: center;
				font-size: 1.2rem;
			}
		}

		.Item {
			padding: 10rpx 20rpx;
			margin: 20rpx;
			border-radius: 20rpx;
			box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.15);
			.request {
				margin: 20rpx;
				font-size: 1.1rem;
				font-weight: bolder;
			}

			.address {
				font-size: 0.9rem;
				margin: 30rpx 20rpx;
			}

			.other {
				justify-content: space-between;
				font-size: 0.9rem;
				margin: 20rpx 0 25rpx 30rpx;
			}
			.choose-view{
				display: flex;
			}
			.choose {
				display: inline-block;
				padding: 2rpx 30rpx;
				margin: 30rpx 100rpx 30rpx 30rpx;
				width: 200rpx;
				height: 60rpx;
				line-height: 55rpx;
				text-align: center;
				border-radius: 15px;
				background-color: #fff;
				border: 1rpx solid #72a6c6;
				color: var(--blue);
			}

			.choose:first-child {
				background-color: var(--blue);
				color: #fff;
			}
		}
	}
</style>