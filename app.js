App({
  globalData: {
    userInfo: null,
    isAdmin: false
  },
  onLaunch() {
    // 检查登录状态
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.globalData.userInfo = res.data
      }
    })
  }
}) 