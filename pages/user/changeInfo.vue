<template>
	<view class="Box">
		<!-- 0 修改密码 1忘记密码 2 修改邮箱 -->
		
		<view class="change_password" v-show="flag !== 2">
			<view class="title">
				<view class="password-title" :class="{'password-title-active' : flag == 0}" @click="setFlag(0)">修改密码</view>
				<view class="password-title" :class="{'password-title-active' : flag == 1}" @click="setFlag(1)">忘记密码</view>
			</view>
			<view class="form" v-if="flag==1">
				<view class="form-title color">邮箱</view>
				<input class="form-input" v-model="userinfo.email" placeholder="请输入邮箱" />
			</view>
			<view class="form flex" v-if="flag==1">
				<view class="form-title color">验证码</view>
				<input class="form-input" placeholder="输入验证码" v-model="userinfo.captcha" />
				<button class="getEmail" :disabled='!userinfo.email' @click="sendEmail">获取验证码</button>
			</view>
			<view class="form" v-if="flag == 0">
				<view class="form-title color">旧密码</view>
				<input class="form-input" v-model="userinfo.oldPwd" placeholder="请输入旧密码" />
			</view>
			<view class="form">
				<view class="form-title color">新密码</view>
				<input class="form-input" v-model="userinfo.newPwd" placeholder="请输入新密码" />
			</view>
			<view class="form">
				<view class="form-title color">确认密码</view>
				<input class="form-input" v-model="userinfo.rePwd" placeholder="请再次输入新密码" />
			</view>
			<button class="button submit" :disabled='loading' @click="submit">{{loading?'loading...':'提交'}}</button>
		</view>
		<view class="change_email" v-show="flag == 2">
			<view class="title">
				修改邮箱
			</view>
			<view class="form">
				<view class="form-title color">新邮箱</view>
				<input class="form-input" v-model="userinfo.email" placeholder="请输入新邮箱号" />
			</view>
			<view class="form flex">
				<view class="form-title color">验证码</view>
				<input class="form-input" placeholder="输入验证码" v-model="userinfo.captcha" />
				<button class="getEmail" :disabled='!userinfo.email' @click="sendEmail">获取验证码</button>
			</view>
			<button class="button submit" :disabled='loading' @click="submit">{{loading?'loading...':'提交'}}</button>
		</view>
	</view>
</template>

<script lang='ts' setup>
	import {
		ref,
		computed,
		getCurrentInstance,
		reactive
	} from "vue"
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		ForgetPwd,
		UpdatePwd,
		UpdateEmail
	} from '../../apis/userAPis'
	import {
		SendCode
	} from '../../apis/emailApis'
	const curInstance = getCurrentInstance()
	const flag = ref(0)
	const loading = ref(false)
	const message = ref('')
	const userinfo = reactive({
		email: '',
		password: '',
		captcha: '',
		newPwd: '',
		oldPwd: '',
		rePwd: ''
	})
	const flagTitle = computed(() => {
		return flag.value ? (flag.value == 2 ? '更换绑定邮箱' : '忘记密码') : '修改密码'
	})
	const messageClear = computed(() => {
		if (message.value) {
			setTimeout(() => {
				message.value = ''
			}, 5000)
		}
	})

	function setFlag(value: number): void {
		flag.value = value
	}

	async function sendEmail() {
		if (flag.value == 1) message.value = await SendCode(userinfo.email, 3)
		if (flag.value == 2) message.value = await SendCode(userinfo.email, 4)
	}

	async function submit() {
		loading.value = true
		if (!flag.value) message.value = await UpdatePwd(userinfo)
		if (flag.value == 1) message.value = await ForgetPwd(userinfo)
		if (flag.value == 2) message.value = await UpdateEmail(userinfo)
		// 邮箱
		// if(flag.value==2) message.value = await ForgetPwd(userinfo)
		loading.value = false
	}
	onShow(() => {
		if (curInstance.attrs.type == 'pwd') flag.value = 0
		if (curInstance.attrs.type == 'email') flag.value = 2
	})
</script>

<style lang="scss" scoped>
	.Box {
		.change_email,
		.change_password{
			margin: 20rpx;
			padding-bottom: 80rpx;
			border-radius: 20px;
			box-shadow: 2px 2px 13px 3px rgba(0, 0, 0, 0.1);
			position: relative;
			top: 150rpx;
		}
		.change_password{
			.title {
				display: flex;
				background-attachment: fixed;
				background-color: var(--blue);
				margin-bottom: 50rpx;
				border-radius: 15px 15px 0 0;
			
				.password-title {
					flex: 1;
					position: relative;
					height: 100upx;
					line-height: 100upx;
					text-align: center;
					color: white;
					background: inherit;
					border-radius: 15px 15px 0 0;
				}
			
				.password-title-active {
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
		}
		.form {
			margin: 40upx 20upx;
			display: flex;
			position: relative;

			.form-title {
				flex: 1;
				padding-top: 23rpx;
				height: 40upx;
				font-size: 30upx;
				line-height: 40upx;
				margin: 10upx;
			}

			.form-input {
				flex: 4;
				padding-left: 20upx;
				margin: 10upx;
				height: 60upx;
				font-size: 30upx;
				border-bottom: 1px solid #bfbfbf;
				&:hover {
					border-bottom: 1px solid #656bbf;
				}
			}

			.getEmail {
				margin: 10upx;
				height: 65upx;
				line-height: 65upx;
				position: absolute;
				top: -10rpx;
				right: 10rpx;
				background-color: #8ed7ee;
				color: var(--backgroundColor);
			}
		}
		.change_email{
			.title{
				text-align: center;
				font-size: 1.2rem;
				padding-top: 50rpx;
				border-radius: 20px;
			}
		}
		.button {
			margin: 10%;
			width: 80%;
			height: 65upx;
			line-height: 65upx;
			background-color: var(--blue);
			color: var(--backgroundColor);
		}
	}
</style>