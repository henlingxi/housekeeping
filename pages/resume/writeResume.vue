<template>
	<view class="Reservation">
		<view class="reservation-view">
			<view class="text">简介</view>
			<uni-easyinput trim="all" v-model="resume.introduction" class="introduction" placeholder="介绍一下自己,找到心仪的工作"
				:inputBorder="false"></uni-easyinput>
		</view>
		<view class="reservation-view">
			<view class="text">工作经验</view>
			<uni-easyinput type="textarea" trim="all" v-model="resume.exprience" placeholder="写出你异于常人的经验"
				:inputBorder="false" class="introduction"></uni-easyinput>
		</view>
		<view class="reservation-view">
			<view class="text">详细介绍</view>
			<uni-easyinput type="textarea" trim="all" v-model="resume.detail" placeholder="写出你异于常人的经验"
				:inputBorder="false" class="introduction"></uni-easyinput>
		</view>
		<view class="reservation-view">
			
			<view class="text"><img src="../../static/星号.png" alt="" class="mast_img">薪水</view>
			<uni-easyinput type="number" trim="all" v-model="resume.salary" placeholder="请输入期望薪水" :inputBorder="false"
				class="introduction"></uni-easyinput>
		</view>
		<view class="reservation-view">
			<view class="text"><img src="../../static/星号.png" alt="" class="mast_img">工作类型</view>
			<picker @change="pick" mode='selector' :value="pickIndex" :range="WorkInfoStore.workTypeList"
				range-key="workType" class='listPicker introduction'>
				{{pickIndex == -1 ? "请选择工作类型" : WorkInfoStore.workTypeList[pickIndex].workType}}
			</picker>
		</view>

		<view class="btns flex">
			<button class="button clear" @click="clear">清空</button>
			<button class="button submit" @click="submit">发布</button>
		</view>
	</view>
</template>

<script setup>
	import RouteIntercept from '../../hooks/RouteIntercept';
	import {
		onShow
	} from '@dcloudio/uni-app'
	import {
		NewResume
	} from "@/apis/resumeApis"
	import {
		ref,
		reactive,
		computed
	} from "vue"
	import {
		useWorkInfoStore
	} from '@/stores/workinfo.ts'
	const WorkInfoStore = useWorkInfoStore()

	const resume = reactive({
		exprience: "",
		introduction: "",
		detail: "",
		salary: 0,
		workType: 0
	})
	const submit = async () => {
		if (resume.workType === 0) resume.workType = WorkInfoStore.workTypeList[pickIndex.value].id
		const {
			status
		} = await NewResume({
			exprience: resume.exprience,
			introduction: resume.introduction,
			detail: resume.detail,
			salary: resume.salary - 0,
			workType: `${resume.workType}`
		})
		if (status) clear()
	}
	const clear = () => {
		resume.exprience = "",
			resume.introduction = "",
			resume.salary = 0,
			resume.workType = 0,
			resume.detail = "",
			pickIndex.value = -1

	}

	let pickIndex = ref(-1)

	const pick = (e) => {
		pickIndex.value = e.detail.value
		resume.workType = WorkInfoStore.workTypeList[e.detail.value].id
		// filterOptions.index = e.detail.value;
		// filterOptions.active = filterOptions.array[e.detail.value].name
	}

	onShow(() => {
		RouteIntercept()
	})
</script>

<style lang="scss" scoped>
	::v-deep.uni-easyinput__content-input {
		margin-left: -18rpx;
	}

	.Reservation {
		.reservation-view {
			display: flex;
			margin: 20rpx;
			padding: 20rpx;
			border-bottom: 1rpx solid #eeeeee;
			.mast_img{
				width: 20rpx;
				height: 20rpx;
				vertical-align: top;
			}
			.text {
				flex: 1;
				text-align: center;
				// text-align: justify;
				// text-justify: distribute-all-lines;
				// text-align-last: justify;
				margin-right: 60rpx;
				padding-top: 10rpx;
			}

			.introduction {
				flex: 3;
			}

			.listPicker {
				// text-align: center;
				font-size: 0.9rem;
			}

		}

		.btns {
			width: 100%;

			.submit {
				flex: 3;
			}

			.clear {
				flex: 1;
			}
		}

		.button {
			margin: 30upx 10upx;
			background-color: var(--blue);
			color: #fff;
		}
	}
</style>