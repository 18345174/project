Page({
  data: {
    username: '',
    password: ''
  },

  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    })
  },

  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },

  async handleLogin() {
    const { username, password } = this.data
    if (!username || !password) {
      wx.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      })
      return
    }

    try {
      const res = await wx.cloud.callFunction({
        name: 'adminLogin',
        data: {
          username,
          password
        }
      })

      if (res.result.code === 0) {
        wx.setStorageSync('adminInfo', res.result.data)
        getApp().globalData.isAdmin = true
        
        wx.redirectTo({
          url: '/pages/admin/goods-manage/index'
        })
      } else {
        wx.showToast({
          title: res.result.message,
          icon: 'none'
        })
      }
    } catch (error) {
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    }
  }
}) 