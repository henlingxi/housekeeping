<template>
	<view class="Box box">
		<img src="../../static/logo1.jpg" alt="" class="logo-img">
		<view class="welcome">欢迎使用家政平台</view>
		<view class="login" v-show="type !== 1">
			<view class="title">
				<view class="login-title" :class="{'login-title-active' : type == 0}" @click="change(0)">用户名登录</view>
				<view class="login-title" :class="{'login-title-active' : type == 2}" @click="change(2)">验证码登录</view>
			</view>
			<view class="form" v-show="type == 0">
				<input class="form-input" v-model.trim="userInfo.username" placeholder="请输入用户名" />
			</view>
			<view class="form" v-show="type == 0">
				<input class="form-input" type="password" v-model.trim="userInfo.password" placeholder="请输入密码" v-show="isShow==0"/>
				<input class="form-input" v-model.trim="userInfo.password" placeholder="请输入密码" v-show="isShow==1"/>
				<img src="../../static/不显示密码.png" alt="" class="password-img" v-show="isShow==0"
					@click="changePasswordState()">
				<img src="../../static/显示密码.png" alt="" class="password-img" v-show="isShow==1" @click="changePasswordState()">
			</view>
			<view class="form" v-show="type == 2">
				<input class="form-input" v-model.trim="userInfo.email" placeholder="请输入邮箱" />
				<text class="getEmail" @click="sendEmail">获取验证码</text>
			</view>
			<view class="form" v-show="type == 2">
				<input class="form-input" v-model.trim="userInfo.captcha" placeholder="请输入验证码" />
			</view>
			<view class="form">
				<button @click="submit" class="form-button color">{{loading?'loading...':typeTitle}}</button>
			</view>
			<view class="buttons flex">
				<a @click="RouteIntercept" class="back"> 返回 </a>
				<a @click="clear" class="clear"> 清空 </a>
			</view>
			<view class="toregister" @click="change(1)">去注册</view>
		</view>
		<view class="register" v-show="type == 1">
			<view class="form">
				<view class="form-title">用户名</view>
				<input class="form-input" v-model.trim="userInfo.username" placeholder="请输入用户名" />
			</view>
			<view class="form">
				<view class="form-title">昵称</view>
				<input class="form-input" v-model.trim="userInfo.nickname" placeholder="请输入昵称" />
			</view>
			<view class="form">
				<view class="form-title">身份</view>
				<view class="auth-list flex">
					<view class="auth-item" :class="{activeroleId:userInfo.roleId==1}" @click="changeRole(1)">用户</view>
					<view class="auth-item" :class="{activeroleId:userInfo.roleId==2}" @click="changeRole(2)">工作者</view>
				</view>
			</view>
			<view class="form">
				<view class="form-title">密码</view>
				<input class="form-input" type="password" v-model.trim="userInfo.password" placeholder="请输入密码" v-show="isShow==0"/>
				<input class="form-input" v-model.trim="userInfo.password" placeholder="请输入密码" v-show="isShow==1"/>
				<img src="../../static/不显示密码.png" alt="" class="register-password-img" v-show="isShow==0"
					@click="changePasswordState()">
				<img src="../../static/显示密码.png" alt="" class="register-password-img" v-show="isShow==1" @click="changePasswordState()">
			</view>
			
			<view class="form" v-show="type==1 ">
				<view class="form-title">确认密码</view>
				<input class="form-input" type="password" v-model.trim="userInfo.rePassword" v-show="isShowPassword == 0" placeholder="请确认密码" />
				<input class="form-input" v-model.trim="userInfo.rePassword" v-show="isShowPassword == 1" placeholder="请确认密码" />
				<img src="../../static/不显示密码.png" alt="" class="register-password-img" v-show="isShowPassword == 0" @click="changePassword()">
				<img src="../../static/显示密码.png" alt="" class="register-password-img" v-show="isShowPassword == 1" @click="changePassword()">
			</view>
			
			<view class="form">
				<view class="form-title">邮箱</view>
				<input class="form-input" v-model.trim="userInfo.email" placeholder="请输入邮箱" />
				<text class="register-getEmail" @click="sendEmail">获取验证码</text>
			</view>
			<view class="form">
				<view class="form-title">验证码</view>
				<input class="form-input" v-model.trim="userInfo.captcha" placeholder="请输入验证码" />
			</view>
			<view class="form">
				<button @click="submit" class="form-button color">{{loading?'loading...':typeTitle}}</button>
			</view>
			<view class="buttons flex">
				<a @click="RouteIntercept" class="back"> 返回 </a>
				<a @click="clear" class="clear"> 清空 </a>
			</view>
			<view class="tologin" @click="change(0)">去登录</view>
		</view>
		<view class="message" :class="{message_active:message}">
			{{message}}
		</view>

	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		computed,
		watch,
		nextTick
	} from 'vue'
	import {
		Login,
		Register
	} from '@/apis/loginApis'
	import {
		SendCode
	} from '@/apis/emailApis'
	import {
		useUserInfoStore
	} from '@/stores/userinfo.ts'
	import RouteIntercept from '../../hooks/RouteIntercept';
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"

	let jumpAddress = ''

	// 0登录 1注册 2验证码登录
	let type = ref(0)
	//  0不显示密码 1 显示密码
	let isShow = ref(0)
	// 确认密码 0不显示密码 1 显示密码
	let isShowPassword = ref(0)


	const typeTitle = computed(() => {
		return type.value ? (type.value == 1 ? '注册' : '验证码登录') : '用户名登录'
	})
	// 加载
	let loading = ref(false)
	// 信息
	let message = ref('')
	watch(message, (newValue, oldValue) => {
		if (newValue != '') setTimeout(() => {
			message.value = ''
		}, 5000)
	}, {
		immediate: true
	})
	// userInfo
	const userInfo = reactive({
		username: '',
		nickname: '',
		password: '',
		email: '',
		captcha: '',
		roleId: 0
	})
	// clear
	function clear() {
		userInfo.username = ''
		userInfo.nickname = ''
		userInfo.password = ''
		userInfo.rePassword = ''
		userInfo.email = ''
		userInfo.captcha = ''
		userInfo.roleId = ''

	}
	// changeType
	function change(val) {
		type.value = val
		if(val == 1){
			uni.setNavigationBarTitle({
			    title: '注册'
			});
		}else{
			uni.setNavigationBarTitle({
			    title: '登录'
			});
		}
		clear();
	}
	// submit form
	async function submit() {
		if (type.value == 0) await login()
		if (type.value == 1) await register()
		if (type.value == 2) await login()
	}
	// login
	async function login() {
		loading.value = true;
		message.value = await Login(userInfo, jumpAddress)
		// uni.showModal({
		// 	title:'提示',
		// 	content:message.value,
		// 	showCancel:false,
		// 	success:(res)=>{
				
		// 	}
		// })
		loading.value = false;
	}
	// repaire password
	// async function changePassword() {
	//     loading.value = true;
	//         // const data = await FindPassword(userInfo);
	// 		loading.value = false;
	// }

	//
	const changeRole = (val) => {
		userInfo.roleId = val
	}

	const changePasswordState = () => {
		isShow.value = isShow.value ? 0 : 1;
	}
	const changePassword = () => {
		isShowPassword.value = isShowPassword.value ? 0 : 1;
	}
	// 注册
	async function register() {
		loading.value = true;
		message.value = await Register(userInfo);
		loading.value = false;
	}
	// 邮件
	async function sendEmail() {
		if (type.value == 1) message.value = await SendCode(userInfo.email, 1);
		if (type.value == 2) message.value = await SendCode(userInfo.email, 3);
	}

	function UserInfostore(userInfo) {
		const useUserInfo = useUserInfoStore()
		useUserInfo.changeInfo(userInfo)
	}
	onLoad(option => {
		jumpAddress = option.address
	})
</script>

<style lang="scss" scoped>
	.activeroleId {
		background-color: var(--borderColor);
	}

	.Box {
		// padding: 200upx 20upx 50upx 20upx;
		padding: 50upx 20upx;
		max-width: 1200upx;
		margin: auto;

		.logo-img {
			width: 230upx;
			border-radius: 50%;
			position: relative;
			left: 50%;
			transform: translateX(-50%);
		}

		.welcome {
			text-align: center;
			padding: 20rpx;
			// color: var(--blue);
		}

		.login {
			margin: 36rpx;
			padding-bottom: 80rpx;
			position: relative;
			border-radius: 20px;
			box-shadow: 2px 2px 13px 3px rgba(0, 0, 0, 0.1);

			.title {
				display: flex;
				background-attachment: fixed;
				background-color: var(--blue);
				margin-bottom: 50rpx;
				border-radius: 15px 15px 0 0;

				.login-title {
					flex: 1;
					position: relative;
					height: 100upx;
					line-height: 100upx;
					text-align: center;
					color: white;
					background: inherit;
					border-radius: 15px 15px 0 0;
				}

				.login-title-active {
					color: black;
					background-color: #fff;
					border-radius: 15px 15px 0 0;

					&::after {
						content: " ";
						position: absolute;
						left: 50%;
						bottom: 0;
						transform: translateX(-50%);
						width: 20%;
						height: 10rpx;
						background-color: #8ed7ee;
						border-radius: 10px;
					}
				}
			}

			.toregister {
				position: absolute;
				bottom: 15px;
				right: 5px;
				margin: 20upx;
				padding: 5upx 10upx;
				font-size: 0.9rem;
				// font-weight: 100;
			}
		}

		.form {
			padding: 0 20upx;
			margin: 20upx 0;
			position: relative;

			.form-title {
				font-size: 30upx;
				height: 40upx;
				line-height: 40upx;
				border-left: 6upx solid #95e5fa;
				padding-left: 10upx;
				margin: 20upx 0;
			}

			.form-input {
				height: 80upx;
				padding: 20upx;
				padding-left: 50upx;
				margin: 30upx 10rpx;
				border-radius: 20px;
				background-color: #eff3fa;

				&:hover {
					border: 1px solid #8ed7ee;
				}
			}

			.form-button {
				color: var(--backgroundColor);
				height: 90upx;
				line-height: 90upx;
				background-color: var(--blue);
				font-size: 0.98rem;
				margin: 20upx;
			}

			.form-button:disabled {
				background-color: #7fb8dd;
			}

			.password-img {
				width: 50rpx;
				position: absolute;
				top: 40rpx;
				right: 50rpx;
			}

			.getEmail {
				color: #51a8c8;
				position: absolute;
				top: 50%;
				transform:translateY(-50%);
				right: 55rpx;
				font-size: 0.9rem;
			}

			.auth-list {
				.auth-item {
					flex: 1;
					text-align: center;
					height: 60rpx;
					line-height: 60rpx;
					margin: 0 20rpx;
					border: 1rpx solid var(--borderColor);
				}
			}
		}

		.register {
			padding: 50rpx 0 40rpx;
			position: relative;
			margin: 20rpx;
			border-radius: 20px;
			box-shadow: 2px 2px 13px 3px rgba(0, 0, 0, 0.1);
			.register-password-img,
			.register-getEmail{
				color: var(--blue);
				position: absolute;
				top: 110rpx;
				right: 60rpx;
			}
			.register-password-img{
				width: 50rpx;
			}
			.tologin {
				
				position: absolute;
				bottom: 0px;
				right: 0;
				margin: 20upx;
				padding: 5upx 10upx;
				font-weight:100;
				// font-size: 2upx
			}
		}

		.message {
			margin: 20upx;
			padding: 0 20upx;
			height: 60upx;
			line-height: 60upx;
			overflow: hidden;
			color: #bd3228;
			border: 1upx solid #bd3228;
			border-radius: 12upx;
			opacity: 0;
			transition: opacity 1s ease;
		}

		.message_active {
			opacity: 1;
		}

		.buttons {
			justify-content: space-between;
			border-radius: 15px;
			margin: 5upx;
			.back,
			.clear {
				text-align: center;
				border: 2upx solid var(--borderColor);
				border-radius: 10upx;
				height: 80upx;
				line-height: 80upx;
				margin: 0 35upx 50upx;
			}

			.back {
				flex: 3;
			}

			.clear {
				flex: 1;
			}
		}
	}
</style>