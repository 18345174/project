Page({
  data: {
    goodsList: [],
    loading: true
  },

  onLoad() {
    this.loadGoodsList()
  },

  async loadGoodsList() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getGoodsList',
        data: { isAdmin: true }
      })
      this.setData({
        goodsList: res.result.data,
        loading: false
      })
    } catch (error) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  addGoods() {
    wx.navigateTo({
      url: '/pages/admin/goods-edit/index'
    })
  },

  editGoods(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/admin/goods-edit/index?id=${id}`
    })
  },

  async deleteGoods(e) {
    const { id } = e.currentTarget.dataset
    try {
      await wx.showModal({
        title: '提示',
        content: '确定要删除该商品吗？'
      })
      
      await wx.cloud.callFunction({
        name: 'deleteGoods',
        data: { goodsId: id }
      })
      
      wx.showToast({ title: '删除成功' })
      this.loadGoodsList()
    } catch (error) {
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      })
    }
  },

  async handleOrderManage() {
    wx.navigateTo({
      url: '/pages/admin/order-manage/index'
    })
  },

  handleCategoryManage() {
    wx.navigateTo({
      url: '/pages/admin/category-manage/index'
    })
  },

  handleStock(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/admin/stock-manage/index?id=${id}`
    })
  }
}) 