<template>
	<view class="box">
		<view class="box-info">
			<view class="userInfo flex">
				<image :src="getPic" mode="aspectFill" alt="" class="userInfo_img" />
				<view class="userInfo_info ">
					<view class="info_nickname">{{Info.nickname?Info.nickname:'未登录'}}</view>
					<view class="info_username">用户名：{{Info.username}}</view>
					<view class="tocenter" @click="jump('/pages/user/center')">查看或编辑个人资料></view>
				</view>
				<!-- <view class="userInfo_type flex" @click="jump('/pages/user/center')">
					{{Info.username?'个人中心':'去登录'}}
					<uni-icons type="right" size="16" color='#959595' class="userInfo_type_icon flex"></uni-icons>
				</view> -->
			</view>
			
			<view class="work flex color">
				<template v-for="item in works" :key="item.id">
					<!-- {{item}} -->
					<view v-if="!item.role || Info.roleId==item.role" @click="jump(item.url)" class="work-item">
						<img src="../../static/订单.png" alt="" class="work-pic" v-if="item.id == 1">
						<img src="../../static/新建&发布订单.png" alt="" class="work-pic" v-if="item.id == 2">
						<img src="../../static/我的简历.png" alt="" class="work-pic" v-if="item.id == 3">
						{{item.title}}
						<view class="work_text_first" v-if="item.id == 1">查看所有订单</view>
						<view class="work_text" v-if="item.id == 2">编辑具体要求</view>
						<view class="work_text" v-if="item.id == 3">自此完善简历</view>
					</view>
				</template>
			</view>
			<view class="list">
				<uni-list-item thumb="../../static/消息.png" class="item" title="消息中心" clickable
					@click="jump('/pages/user/message')" />
				<uni-list-item thumb="../../static/问题.png" class="item" title="常见问题" :to="`/pages/public/assist`" />
				<uni-list-item thumb="../../static/设置.png" class="item" title="设置" :to="`/pages/public/setting`" />
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed
	} from 'vue'
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		useUserInfoStore
	} from '@/stores/userinfo.ts'
	import RouteIntercept from '../../hooks/RouteIntercept';
	import baseImg from '@/utils/imgs/baseImg'
	import {
		useWorkInfoStore
	} from '@/stores/workinfo.ts'
	const WorkInfoStore = useWorkInfoStore()
	const Info = useUserInfoStore()
	const getPic = computed(() => {
		let path = '../../static/pic(11).png'
		if (Info.userPic) path = Info.userPic
		return path
	})

	const works = ref([{
			id: 1,
			title: '我的订单',
			role: 0,
			url: '/pages/reservation/list'
		},
		{
			id: 2,
			title: '发布预约',
			role: 1,
			url: '/pages/reservation/reservation'
		},
		{
			id: 3,
			title: '个人简历',
			role: 2,
			url: '/pages/resume/writeResume'
		}
	])


	function jump(address) {
		RouteIntercept(address)
	}
	import {
		GetWorkType
	} from '@/apis/workTypeApis'
	const getWorkType = async () => {
		const list = await GetWorkType()
		WorkInfoStore.changeWorkTypeList(list)
	}
	onShow(() => {
		let token = uni.getStorageSync("access_token")
		if (!token) {
			uni.reLaunch({
				url: "/pages/login/login"
			})
		}
		getWorkType()
	})
</script>

<style lang="scss" scoped>
	.box {
		background-color: var(--bace-background-color);
		.box-info{
			background-color: #fff;
		}
		.userInfo {
			padding: 20upx 20upx 50upx 20upx;
			.userInfo_img {
				width: 200upx;
				height: 200upx;
				margin-right: 20upx;
				border-radius: 50%;
				background-size: contain;
				vertical-align: middle;
			}

			.userInfo_info {
				padding: 15rpx;
				.info_nickname{
					flex: 1;
					font-weight: bolder;
					font-size: 40rpx;
					align-items: center;
				}
				.info_username{
					margin: 20rpx 0;
					font-size: 0.9rem;
					color: #a8a8a8;
				}
					
				.tocenter{
					font-size: 0.9rem;
					// color: #a8a8a8;
					color:rgb(163, 187, 219)
				}
				
			}

			.userInfo_type {
				padding: 40upx;
				align-items: center;
			}

			.userInfo_type_icon {
				align-items: center;
				height: 100%;

			}
		}

		.work {
			height: 150upx;
			align-items: center;
			margin-bottom: 40upx;
			background-attachment: fixed;
			.work-item {
				flex: 1;
				height: 150upx;
				margin: 0 25upx 0 0;
				border-radius: 10px;
				background-color: rgba(237, 243, 255, 0.5); 
				position: relative;
				font-weight: bolder;
				padding: 30rpx;
				.work-pic{
					height: 66%;
					position: absolute;
					bottom: 3%;
					right: 0;
				}
				.work_text{
					background: inherit;
					font-size: 0.8rem;
					margin: 20rpx 0 0 0;
					color: #a3bded;
					background-color: rgba(237, 243, 255, 0.1);
				}
					
				.work_text_first{
					background: inherit;
					font-size: 0.8rem;
					margin: 20rpx 0 0 0;
					color: #7fc6d7;
				}
			}
				
			.work-item:first-child{
				margin: 0 25upx;
				background-color: #f3fdfe;
			}
		}

		.list {
			border-radius: 45upx;
			overflow: hidden;

			.item {
				height: 120upx;
			}
		}
	}
</style>