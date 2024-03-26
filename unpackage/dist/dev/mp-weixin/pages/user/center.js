"use strict";
const common_vendor = require("../../common/vendor.js");
const hooks_RouteIntercept = require("../../hooks/RouteIntercept.js");
const stores_userinfo = require("../../stores/userinfo.js");
const apis_userApis = require("../../apis/userApis2.js");
const utils_imgs_baseImg = require("../../utils/imgs/baseImg.js");
require("../../utils/baseUrl.js");
require("../../utils/http.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "center",
  setup(__props) {
    const changeAvatar = common_vendor.ref(false);
    const update = common_vendor.reactive({
      id: "",
      username: "",
      nickname: "",
      email: "",
      userPic: "",
      age: "",
      createTime: "",
      gender: "",
      number: "",
      roleId: "",
      updateTime: ""
    });
    const updateInfo = async () => {
      const _update = {
        username: Info.username,
        roleId: Info.roleId,
        email: Info.email,
        createTime: Info.createTime
      };
      _update.id = update.id ? update.id : Info.id;
      _update.nickname = update.nickname ? update.nickname : Info.nickname;
      _update.age = update.age ? update.age : Info.age;
      _update.gender = update.gender ? update.gender : Info.gender;
      _update.number = update.number ? update.number : Info.number;
      const { status, message } = await apis_userApis.UpdateInfo(_update);
      if (status)
        setIsEdit();
      common_vendor.index.showToast({
        title: message,
        duration: 2e3
      });
    };
    const roleName = common_vendor.computed(() => {
      if (Info.roleId == 1)
        return "用户";
      if (Info.roleId == 2)
        return "工作者";
    });
    const chooseFile = async () => {
      try {
        const res = await common_vendor.index.chooseFile({
          count: 1,
          // 可以选择的文件数量
          success: (res2) => {
            apis_userApis.UpLoad(res2.tempFiles[0], Info.username);
          },
          fail: (err) => {
            console.error("Failed to choose file:", err);
          }
        });
      } catch (err) {
        console.error("Error choosing file:", err);
      }
    };
    const getPic = common_vendor.computed(() => {
      let path = utils_imgs_baseImg.baseImg;
      if (Info.userPic)
        path = Info.userPic;
      return path;
    });
    const Info = stores_userinfo.useUserInfoStore();
    function jump(url) {
      common_vendor.index.redirectTo({
        url
      });
    }
    const isEdit = common_vendor.ref(false);
    const setIsEdit = () => {
      if (!isEdit.value)
        getElementScoollTop();
      isEdit.value = !isEdit.value;
    };
    function getElementScoollTop() {
      common_vendor.index.createSelectorQuery().select(".Box").boundingClientRect((data) => {
        common_vendor.index.createSelectorQuery().select(".JumpView").boundingClientRect((res) => {
          common_vendor.index.pageScrollTo({
            duration: 0,
            //过渡时间必须为0，uniapp bug，否则运行到手机会报错
            scrollTop: res.top - data.top - 50
          });
        }).exec();
      }).exec();
    }
    common_vendor.onShow(() => {
      hooks_RouteIntercept.RouteIntercept();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(getPic),
        b: common_vendor.t(common_vendor.unref(Info).nickname),
        c: common_vendor.t(isEdit.value ? "取消编辑" : "编辑信息"),
        d: common_vendor.o(setIsEdit),
        e: common_vendor.unref(Info).username
      }, common_vendor.unref(Info).username ? {
        f: common_vendor.t(common_vendor.unref(Info).username)
      } : {}, {
        g: common_vendor.unref(Info).email
      }, common_vendor.unref(Info).email ? {
        h: common_vendor.t(common_vendor.unref(Info).email)
      } : {}, {
        i: common_vendor.unref(Info).username
      }, common_vendor.unref(Info).username ? {
        j: common_vendor.p({
          type: "paperplane",
          size: "16"
        })
      } : {}, {
        k: common_vendor.p({
          type: "heart",
          color: "gray",
          size: "16"
        }),
        l: common_vendor.p({
          type: "star",
          color: "gray",
          size: "16"
        }),
        m: common_vendor.p({
          type: "notification",
          color: "gray",
          size: "16"
        }),
        n: !changeAvatar.value
      }, !changeAvatar.value ? {
        o: common_vendor.o(($event) => changeAvatar.value = !changeAvatar.value)
      } : {}, {
        p: changeAvatar.value
      }, changeAvatar.value ? {
        q: common_vendor.o(chooseFile)
      } : {}, {
        r: common_vendor.t(isEdit.value ? "编辑资料" : "基本信息"),
        s: common_vendor.t(common_vendor.unref(Info).username),
        t: !isEdit.value,
        v: isEdit.value ? 1 : "",
        w: common_vendor.unref(Info).nickname,
        x: update.nickname,
        y: common_vendor.o(($event) => update.nickname = $event.detail.value),
        z: !isEdit.value ? 1 : "",
        A: !isEdit.value,
        B: isEdit.value ? 1 : "",
        C: common_vendor.unref(Info).age ? common_vendor.unref(Info).age : "暂无内容",
        D: update.age,
        E: common_vendor.o(($event) => update.age = $event.detail.value),
        F: !isEdit.value ? 1 : "",
        G: !isEdit.value,
        H: isEdit.value ? 1 : "",
        I: common_vendor.unref(Info).gender ? common_vendor.unref(Info).gender : "暂无内容",
        J: update.gender,
        K: common_vendor.o(($event) => update.gender = $event.detail.value),
        L: !isEdit.value ? 1 : "",
        M: !isEdit.value,
        N: isEdit.value ? 1 : "",
        O: common_vendor.unref(Info).number ? common_vendor.unref(Info).number : "暂无内容",
        P: update.number,
        Q: common_vendor.o(($event) => update.number = $event.detail.value),
        R: !isEdit.value ? 1 : "",
        S: common_vendor.t(common_vendor.unref(roleName)),
        T: common_vendor.t(common_vendor.unref(Info).email),
        U: common_vendor.t(common_vendor.unref(Info).createTime),
        V: isEdit.value
      }, isEdit.value ? {
        W: common_vendor.o(setIsEdit),
        X: common_vendor.o(updateInfo)
      } : {}, {
        Y: isEdit.value
      }, isEdit.value ? {
        Z: common_vendor.o(($event) => jump("/pages/public/setting"))
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ba03e1e9"], ["__file", "D:/HBuilderX/for_nest/pages/user/center.vue"]]);
wx.createPage(MiniProgramPage);
