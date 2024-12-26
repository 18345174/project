Page({
  data: {
    phone: '',
    password: ''
  },

  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },

  async handleLogin() {
    const { phone, password } = this.data
    if (!phone || !password) {
      wx.showToast({
        title: '请输入手机号和密码',
        icon: 'none'
      })
      return
    }

    try {
      // 这里调用登录接口
      const res = await wx.cloud.callFunction({
        name: 'login',
        data: {
          phone,
          password
        }
      })

      if (res.result.code === 0) {
        wx.setStorageSync('userInfo', res.result.data)
        getApp().globalData.userInfo = res.result.data
        
        wx.switchTab({
          url: '/pages/user/home/index'
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