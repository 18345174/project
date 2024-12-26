Page({
  data: {
    categories: [],
    loading: true
  },

  onShow() {
    this.loadCategories()
  },

  async loadCategories() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getCategoryList'
      })
      this.setData({
        categories: res.result.data,
        loading: false
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
      url: '/pages/admin/category-edit/index'
    })
  },

  handleEdit(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/admin/category-edit/index?id=${id}`
    })
  },

  async handleDelete(e) {
    const { id } = e.currentTarget.dataset
    try {
      await wx.showModal({
        title: '提示',
        content: '确定要删除该分类吗？'
      })

      await wx.cloud.callFunction({
        name: 'deleteCategory',
        data: { id }
      })

      wx.showToast({ title: '删除成功' })
      this.loadCategories()
    } catch (error) {
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      })
    }
  }
}) 