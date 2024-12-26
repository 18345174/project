Page({
  data: {
    addressList: [],
    isChooseMode: false
  },

  onLoad(options) {
    this.setData({
      isChooseMode: options.choose === 'true'
    })
  },

  onShow() {
    this.loadAddressList()
  },

  async loadAddressList() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getAddressList'
      })
      this.setData({
        addressList: res.result.data
      })
    } catch (error) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  handleAdd() {
    wx.navigateTo({
      url: '/pages/user/address/edit/index'
    })
  },

  handleEdit(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/user/address/edit/index?id=${id}`
    })
  },

  async handleDelete(e) {
    const { id } = e.currentTarget.dataset
    try {
      await wx.showModal({
        title: '提示',
        content: '确定要删除该地址吗？'
      })

      await wx.cloud.callFunction({
        name: 'deleteAddress',
        data: { id }
      })

      wx.showToast({ title: '删除成功' })
      this.loadAddressList()
    } catch (error) {
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      })
    }
  },

  handleChoose(e) {
    if (!this.data.isChooseMode) return
    
    const { address } = e.currentTarget.dataset
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('chooseAddress', { address })
    wx.navigateBack()
  }
}) 