Page({
  data: {
    goodsList: [],
    searchValue: '',
    loading: true,
    categories: [],
    currentCategory: null
  },

  onLoad() {
    this.loadCategories()
    this.loadGoodsList()
  },

  async loadCategories() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getCategoryList'
      })
      const categories = [{ _id: null, name: '全部' }, ...res.result.data]
      this.setData({ 
        categories,
        currentCategory: categories[0]
      })
    } catch (error) {
      console.error('加载分类失败', error)
    }
  },

  async loadGoodsList() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getGoodsList',
        data: {
          categoryId: this.data.currentCategory?._id
        }
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

  switchCategory(e) {
    const { category } = e.currentTarget.dataset
    this.setData({
      currentCategory: category,
      loading: true
    })
    this.loadGoodsList()
  },

  onSearch(e) {
    const value = e.detail
    this.setData({ searchValue: value })
    // 调用搜索接口
    this.searchGoods(value)
  },

  async searchGoods(keyword) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'searchGoods',
        data: { keyword }
      })
      this.setData({
        goodsList: res.result.data
      })
    } catch (error) {
      wx.showToast({
        title: '搜索失败',
        icon: 'none'
      })
    }
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/goods/detail/index?id=${id}`
    })
  }
}) 