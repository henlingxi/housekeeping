 <template>
 	<view class="home">
 		<view class="home-picture">
 			<!-- <image :src="baseImg" mode="widthFix" class="image"></image> -->
 		</view>
 		<view class="work-type-list">
 			<view class="work-type-item" :class="{'work-type-item-active':chooseLabel==0 | !chooseLabel}"
 				@click="superGet(0)">全部</view>
 			<view v-if="reservationList.total" class="work-type-item"
 				:class="{'work-type-item-active':chooseLabel==-1 }" @click="superGet(-1)">
 				我的附近
 				<input type="number" v-model="dist" @blur="superGet(-1)">
 			</view>
 			<template v-if="UserInfoStore.roleId !=2">
				
 				<view v-for="item in WorkInfoStore.workTypeList" :key="item.id" class="work-type-item"
 					:class="{'work-type-item-active':chooseLabel==item.id}" @click="superGet(item.id)">
 					{{item.workType}}
 				</view>
 			</template>
 		</view>
 		<view class="zero"></view>
 		<view class="home-list">
			<view class="zero" v-if="!resumeList.total && !reservationList.total">
				<img src="../../static/暂无内容.png" alt="" class="zero_img">
				<view class="zero-text">暂无内容</view>
			</view>
 			<template v-for="item in resumeList.items">
 				<ResumeList :Info="item"></ResumeList>
 			</template>
 			<template v-for="item in reservationList.items">
 				<ReservationList :Info="item"></ReservationList>
 			</template>
 		</view>
 		<!-- {{lng +'++'+lat}}
		<view class="bmap"> -->
 		<!-- 在这里添加地图上的其他元素，如标记、信息窗口等 -->

 		<!-- 	   <baidu-map  class="bm-view" @ready="handler" :center="{lng: 117.193, lat: 39.159}" :zoom="zoom">
				    <bm-control :offset="{width: '10px', height: '10px'}">
				          <bm-auto-complete  v-model="keyword" :sugStyle="{zIndex: 1}" @confirm="autoConfirm">
				            <input placeholder="请输入地名关键字"  />
				          </bm-auto-complete>
							</bm-control>
				        <bm-local-search :keyword="keyword" :auto-viewport="true"></bm-local-search>
				   </baidu-map>
				   
		</view> -->
 	</view>
 </template>

 <script setup>
 	// import { useGeocoder, usePoint } from 'vue-baidu-map-3x';

 	// const center = ref({lng: 117.193, lat: 39.159});
 	// const zoom = ref(13);
 	// const keyword = ref('');
 	// let lat = ref(0)
 	// let lng = ref(0)

 	// const autoConfirm = (res)=>{
 	//  console.log(keyword.value)
 	//  if(keyword.value){
 	// 	 useGeocoder().then((geocoder) => {
 	// 	   geocoder.getPoint(keyword.value, (res) => {
 	// 		   console.log(1)
 	// 	     console.log(res.lat);
 	// 		 lat.value = res.lat
 	// 		 lng.value = res.lng
 	// 		 getPlace()
 	// 	   });

 	// 	 });
 	//  }
 	// }

 	// const getPlace = ()=>{
 	// useGeocoder().then((geocoder) => {
 	//   usePoint( lng.value, lat.value).then(point => {
 	//     geocoder.getLocation(point, (result) => {
 	//       console.log(result.address);
 	//     });
 	//   });
 	// });

 	// }

 	// const handler = ({BMap, map}) => {
 	//   console.log(BMap, map);
 	//   center.value.lng = 116.404;
 	//   center.value.lat = 39.915;
 	//   zoom.value = 13;
 	// }

 	import {
 		ref,
 		reactive
 	} from "vue"
 	import ResumeList from "@/components/Home/ResumeList.vue"
 	import ReservationList from "@/components/Home/ReservationList.vue"
 	import baseImg from '@/utils/imgs/baseImg'
 	import {
 		GetResumeList
 	} from '@/apis/resumeApis'
 	import {
 		GetWorkType
 	} from '@/apis/workTypeApis'
 	import {
 		GetReservation,
 		GetNearReservation
 	} from '@/apis/reservationApis'
 	import {
 		onLoad,
 		onShow
 	} from "@dcloudio/uni-app"

 	import {
 		useUserInfoStore
 	} from '@/stores/userinfo.ts'
 	const UserInfoStore = useUserInfoStore()
 	import {
 		useWorkInfoStore
 	} from '@/stores/workinfo.ts'
 	const WorkInfoStore = useWorkInfoStore()
 	let chooseLabel = ref(0)

 	const reservationList = reactive({})
 	const resumeList = reactive({})
 	let dist = ref(5)


 	const superGet = async (label) => {

 		chooseLabel.value = label
 		if (UserInfoStore && UserInfoStore.roleId === 2) {
 			if (label === -1) {
 				const {
 					data
 				} = await GetNearReservation({
 					lng: 117.140051,
 					lat: 39.061951,
 					dist: dist.value
 				})
 				reservationList.total = data.length
 				reservationList.items = data
 			} else {
 				const {
 					total,
 					items
 				} = await GetReservation({
 					pageNum: 1,
 					pageSize: 100,
 					state: "已发布",
 					label: chooseLabel.value
 				})
 				reservationList.total = total
 				reservationList.items = items.reverse()
 			}
 		} else {
 			const {
 				total,
 				items
 			} = await GetResumeList({
 				pageNum: 1,
 				pageSize: 100,
 				label: chooseLabel.value
 			})
 			resumeList.total = total
 			resumeList.items = items
 		}
 	}


 	const getWorkType = async () => {
 		const list = await GetWorkType()
 		WorkInfoStore.changeWorkTypeList(list)
 	}
 	onLoad(async () => {
 		getWorkType()
 		superGet()
 	})
 </script>

 <style lang="scss" scoped>
 	.bm-view {
 		width: 100%;
 		height: 300px;
 	}

 	.work-type-item-active {
		position: relative;
 		font-size: 1.1rem;
		font-weight: bolder;
 		// border-bottom: 1rpx solid red;
 	}

 	.work-type-item-active::after {
 		content: " ";
 		position: absolute;
 		left: 50%;
		bottom: 0;
 		transform: translateX(-50%);
		width: 30%;
		height: 10rpx;
		background-color: #8ed7ee;
		border-radius: 15px;
 	}

 	.home {
 		.work-type-list {
 			position: fixed;
 			width: 100%;
 			display: flex;
 			overflow: auto;

 			&::-webkit-scrollbar {
 				display: none;
 			}

 			.work-type-item {
 				height: 80rpx;
 				line-height: 80rpx;
 				text-align: center;
 				padding: 10rpx 0;
 				flex: 0 0 20%;
 			}
 		}

 		.zero {
 			height: 75rpx;
			// background-color: var(--gray);
 		}

 		.home-picture {
 			position: relative;

 			.image {
 				width: 100%;
 				height: 400rpx;
 			}
 		}

 		.home-list {
 			// background-color: var(--bace-background-color);
 			// padding: 10rpx 2rpx;
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
 		}
 	}
 </style>