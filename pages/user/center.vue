<template>
	<view class="Box flex">
		<view class="base-info">
			<view class="user">
				<view class="flex backColor user_info">
					<image class="user-pic" :src="getPic" mode="aspectFill" @click="chooseFile"></image>
					<view class="user_info">
						<view class="nickname backColor ">{{Info.nickname}}</view>
						<view class="username backColor">用户名：{{Info.username}}</view>
						<view class="email backColor">邮箱：{{Info.email}}</view>
						<button class="info_button color" @click="setIsEdit">{{isEdit?"取消编辑":"编辑信息"}}</button>
					</view>
				</view>
			</view>
			<view class="" style="clear:both"></view>
		</view>
		<!-- <view class="background">
			<image :src="getPic" mode="widthFix" alt="" class="user-img"/>
		</view>
		<view class="base-info" >
			<view class="info backgroundColor">
				<text class="info_username color">{{Info.nickname}}</text>
				<button class="info_button color" @click="setIsEdit">{{isEdit?"取消编辑":"编辑信息"}}</button>
				<text v-if="Info.username" class="color info-text">用户名： {{Info.username}}\n</text>
				<text v-if="Info.email" class="color info-text">邮箱号： {{Info.email}}\n</text>
			</view>
		</view> -->
		<view class="list changeInfo backgroundColor JumpView">
			<!-- <view class="changeAvatar" @click="chooseFile">
				点击更新头像
			</view> -->

			<view class="user-info">
				<view class="title">
					{{isEdit?"编辑资料":"基本信息"}}
				</view>
				<view class="form form-border">
					<view class="form-title color">用户名</view>
					<view class="form-view" v-text="Info.username" />
				</view>
				<view class="form" :class="{'form-border':!isEdit}">
					<view class="form-title color">昵称</view>
					<input class="form-input" v-model="update.nickname" :disabled='!isEdit'
						:class="{'form-input-line':isEdit}" :placeholder="Info.nickname" />
				</view>
				<view class="form" :class="{'form-border':!isEdit}">
					<view class="form-title color">年龄</view>
					<input class="form-input" v-model="update.age" :disabled='!isEdit'
						:class="{'form-input-line':isEdit}" :placeholder="Info.age?Info.age:'暂无内容'" />
				</view>
				<view class="form" :class="{'form-border':!isEdit}">
					<view class="form-title color">性别</view>
					<input class="form-input" v-model="update.gender" :disabled='!isEdit'
						:class="{'form-input-line':isEdit}" :placeholder="Info.gender?Info.gender:'暂无内容'" />
				</view>
				<view class="form" :class="{'form-border':!isEdit}">
					<view class="form-title color">手机号码</view>
					<input class="form-input" v-model="update.number" :disabled='!isEdit'
						:class="{'form-input-line':isEdit}" :placeholder="Info.number?Info.number:'暂无内容'" />
				</view>
				<view class="form form-border">
					<view class="form-title color">身份</view>
					<view class="form-view" v-text="roleName" />
				</view>
				<view class="form form-border">
					<view class="form-title color">邮箱</view>
					<view class="form-view" v-text="Info.email" />
				</view>
				<view class="form form-border">
					<view class="form-title color">注册时间</view>
					<view class="form-view" v-text="createTime" />
				</view>
				<view class="form flex" v-if="isEdit">
					<button @click="setIsEdit" class="button">撤销</button>
					<button class="button" @click="updateInfo">提交</button>
				</view>
				<view class="form flex color tochange" v-if="isEdit">
					邮箱及密码需要到设置中修改
					<text @click="jump('/pages/public/setting')" class="blue">点击前往</text>
				</view>
			</view>
		</view>

		<!-- <view style="height:500upx"></view> -->
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
	import RouteIntercept from '../../hooks/RouteIntercept';
	import {
		useUserInfoStore
	} from '@/stores/userinfo.ts'
	import {
		UpLoad,
		UpdateInfo
	} from '../../apis/userApis.ts'
	import {
		baseUrl
	} from '../../utils/baseUrl'
	import baseImg from '../../utils/imgs/baseImg'
	const changeAvatar = ref(false)

	const update = reactive({
		id: '',
		username: '',
		nickname: '',
		email: '',
		userPic: '',
		age: '',
		createTime: '',
		gender: '',
		number: '',
		roleId: '',
		updateTime: '',
	})
	const createTime = computed(() => {
		return `${Info.createTime[0]}-${Info.createTime[1]}-${Info.createTime[2]}`
	})
	const updateInfo = async () => {
		const _update = {
			username: Info.username,
			roleId: Info.roleId,
			email: Info.email,
			createTime: Info.createTime,
		}

		_update.id = update.id ? update.id : Info.id
		_update.nickname = update.nickname ? update.nickname : Info.nickname
		_update.age = update.age ? update.age : Info.age
		_update.gender = update.gender ? update.gender : Info.gender
		_update.number = update.number ? update.number : Info.number
		const {
			status,
			message
		} = await UpdateInfo(_update)
		if (status) setIsEdit()
		uni.showToast({
			title: message,
			duration: 2000
		})

	}
	const roleName = computed(() => {
		if (Info.roleId == 1) return '用户'
		if (Info.roleId == 2) return '工作者'
	})
	const chooseFile = async () => {
		try {
			const res = await uni.chooseFile({
				count: 1, // 可以选择的文件数量
				success: (res) => {
					UpLoad(res.tempFiles[0], Info.username)
				},
				fail: (err) => {
					console.error('Failed to choose file:', err);
				}
			});
		} catch (err) {
			console.error('Error choosing file:', err);
		}
	};

	const getPic = computed(() => {
		let path = '../../static/pic(11).png'
		if (Info.userPic) path = Info.userPic
		return path
	})

	const Info = useUserInfoStore()
	// 调用 actions
	// function change() {
	// 	Info.changeInfo({
	// 		username: '测试123'
	// 	})
	// }
	function jump(url) {
		uni.redirectTo({
			url
		})
	}

	const isEdit = ref(false)
	const setIsEdit = () => {
		if (!isEdit.value) getElementScoollTop()
		isEdit.value = !isEdit.value
	}

	function getElementScoollTop() {
		uni.createSelectorQuery().select(".Box").boundingClientRect(data => {
			uni.createSelectorQuery().select(".JumpView").boundingClientRect((res) => {
				uni.pageScrollTo({
					duration: 0, //过渡时间必须为0，uniapp bug，否则运行到手机会报错
					scrollTop: res.top - data.top - 50,
				})
			}).exec()
		}).exec();
	}
	onShow(() => {
		RouteIntercept()
	})
</script>

<style lang="scss" scoped>
	.Box {
		flex-direction: column;
		width: 100%;
		height: 100%;
		background: linear-gradient(rgba(189, 234, 253, 0.1), rgba(189, 234, 253, 0.1)), url(../../static/微信图片_20240417203751.jpg) no-repeat 0% 20%/ cover;
		
		.base-info {
			margin-bottom: 130rpx;
			min-height: 300rpx;
			position: relative;
			background: linear-gradient(rgba(189, 234, 253, 0.1), rgba(189, 234, 253, 0.1)), url(../../static/微信图片_20240417203751.jpg) no-repeat 0% 20%/ cover;
			.user {
				background-color: rgba(248, 248, 248, 0.3);
				margin: 0 5%;
				padding: 50rpx 0;
				width: 90%;
				position: absolute;
				top: 80%;
				transform: translateY(-44%);
				border-radius: 25px 15px;
				box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.3);
				.user_info{
					background-color: rgba(248, 248, 248, 0.1);
				}
				.user-pic {
					width: 150rpx;
					height: 150rpx;
					border-radius: 50%;
					margin: 25rpx 0 0 20rpx;
				}

				.email,
				.username {
					background-color: rgba(247, 247, 247, 0.13);
					color: #a8a8a8;
					padding: 0 15rpx;
					margin: 7rpx 10rpx;
				}

				.nickname {
					background-color: rgba(248, 248, 248, 0.13);
					padding: 0 15rpx;
					margin: 13rpx 10rpx;
					font-weight: bold;
					font-size: 1.1rem;
					margin-top: 35rpx;
				}

				.username {}

				.info_button {
					background-color: rgba(248, 248, 248, 0.3);
					position: absolute;
					top: 50%;
					transform: translateY(-90%);
					right: 40upx;
					color: var(--backgroundColor);
					background-color: var(--blue);
					border-radius: 30upx;
					font-size: 0.87rem;
				}
			}
		}

		// 	.background {
		// 		.user-img {
		// 			width: 100%;
		// 		}
		// 	}

		// 	.base-info {
		// 		position: relative;
		// 		margin-bottom: 180rpx;
		// 	}

		// 	.info {
		// 		position: absolute;
		// 		width: 90%;
		// 		margin: 10% 5%;
		// 		top: 50%;
		// 		transform: translateY(-50%);
		// 		border-radius: 0 0 40upx 40upx;
		// 		padding: 40upx;
		// 		box-shadow: 0 0 10upx 1upx var(--gray);

		// 		.info_username {
		// 			position: absolute;
		// 			height: 100upx;
		// 			line-height: 120upx;
		// 			font-size: 50upx;
		// 			font-weight: 600;
		// 			padding-top: 10upx;
		// 			top: -100upx;
		// 		}

		// 		.info_button {
		// 			position: absolute;
		// 			top: -60upx;
		// 			right: 40upx;
		// 			color: var(--backgroundColor);
		// 			background-color: var(--blue);
		// 			border-radius: 30upx;
		// 		}

		// 		.info_label {
		// 			margin-top: 40upx;
		// 			flex-wrap: wrap;

		// 			.info_label_item {
		// 				height: 50upx;
		// 				line-height: 50upx;
		// 				border-radius: 30upx;
		// 				padding: 0 30upx;
		// 				margin: 10upx;
		// 				background-color: var(--borderColor);
		// 				color: var(--backgroundColor);
		// 			}
		// 		}
		// 	}

		// 	.info::before {
		// 		content: "";
		// 		position: absolute;
		// 		height: 100upx;
		// 		border-radius: 40upx 40upx 0 0;
		// 		background-color: var(--backgroundColor);
		// 		left: 0;
		// 		right: 0;
		// 		top: -100upx;
		// 		bottom: 0;
		// 	}

		// .user-info {
		// 	bor
		// }

		// 	.cards {
		// 		margin: 20upx;

		// 		.button {
		// 			flex: 1;
		// 			flex-direction: column;
		// 			align-items: center;
		// 			justify-content: center;
		// 			height: 160upx;
		// 			margin: 20upx;
		// 			border: 1upx solid var(--gray);
		// 			border-radius: 20upx;
		// 			color: var(--borderColor);
		// 			background-color: var(--blue);
		// 		}
		// 	}
	}

	.list {
		background-color: rgba(248, 248, 248, 0.3);
		background-attachment: fixed;
		margin: 40upx 20upx;
		border-radius: 40upx;
		box-shadow: 1upx 1upx 5upx 1upx var(--gray);

		img {
			object-fit: cover;
			width: 100%;
		}
		.user-info{
			padding: 40upx;
			border-radius: 40upx;
			box-shadow: 1upx 1upx 5upx 1upx var(--gray);
			background-color: rgba(248, 248, 248, 0.3);
		}
		// .changeAvatar {
		// 	height: 40px;
		// 	width: 100%;
		// 	text-align: center;
		// 	color: var(--borderColor);
		// 	font-weight: bold;

		// 	button {
		// 		color: var(--borderColor);
		// 	}
		// }

		.title {
			background-color: rgba(248, 248, 248, 0.3);
			padding: 10rpx 30rpx;
			border-left: 5upx solid var(--blue);
			// color: var(--borderColor);
			font-size: 40upx;
			// font-weight: 600;
		}

		// .form-border {
		// 	// border-left: 5upx solid var(--borderColor);
		// }

		.form {
			background-color: rgba(248, 248, 248, 0.3);
			display: flex;
			justify-content: center;
			align-items: center;

			.form-title {
				background-color: rgba(248, 248, 248, 0.3);
				flex: 1;
				text-align: center;
				text-align: justify;
				text-justify: distribute-all-lines;
				text-align-last: justify;
				margin: 20rpx 15rpx;
				padding: 20rpx 0;
				position: relative;
				font-weight: bold;

				&::after {
					content: " ";
					position: absolute;
					bottom: 20upx;
					right: -5upx;
					opacity: 0.8;
					width: 30%;
					height: 15rpx;
					background-color: #8ed7ee;
					border-radius: 10px;
				}
			}


			.form-view {
				background-color: rgba(248, 248, 248, 0.13);
				background: inherit;
				flex: 2.5;
				margin: 20rpx;
				padding: 0 30rpx;
			}

			.form-input {
				background-color: rgba(248, 248, 248, 0.13);
				flex: 3;
				padding-left: 20upx;
				margin: 5upx 20upx;
				height: 65upx;
				font-size: 30upx;
			}

			.form-input-line {
				// border-radius: 10upx;
				border-bottom: 1px solid #bfbfbf;

				&:hover {
					border-bottom: 1px solid #656bbf;
				}
			}

			.button {
				flex: 1;
				height: 70upx;
				line-height: 70upx;
				margin-top: 20upx;
				background-color: var(--blue);
				color: var(--backgroundColor);
			}

			.button:first-child {
				margin-right: 60upx;
			}
		}
	}

	.tochange {
		margin: 20upx;
	}
</style>