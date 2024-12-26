Page({
  data: {
    cartList: [],
    totalPrice: 0,
    selectedIds: [],
    isSelectAll: false
  },

  onShow() {
    this.loadCartList()
  },

  async loadCartList() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getCartList'
      })
      const cartList = res.result.data
      this.setData({ 
        cartList,
        selectedIds: [],
        isSelectAll: false
      })
      this.calculateTotal()
    } catch (error) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  onSelectItem(e) {
    const { id } = e.currentTarget.dataset
    let { selectedIds, cartList } = this.data
    
    const index = selectedIds.indexOf(id)
    if (index > -1) {
      selectedIds.splice(index, 1)
    } else {
      selectedIds.push(id)
    }
    
    this.setData({
      selectedIds,
      isSelectAll: selectedIds.length === cartList.length
    })
    this.calculateTotal()
  },

  onSelectAll() {
    const { cartList, isSelectAll } = this.data
    const selectedIds = !isSelectAll ? cartList.map(item => item._id) : []
    
    this.setData({
      selectedIds,
      isSelectAll: !isSelectAll
    })
    this.calculateTotal()
  },

  async changeQuantity(e) {
    const { id, type } = e.currentTarget.dataset
    const { cartList } = this.data
    const item = cartList.find(item => item._id === id)
    
    if (type === 'minus' && item.quantity <= 1) return
    
    try {
      await wx.cloud.callFunction({
        name: 'updateCartQuantity',
        data: {
          id,
          quantity: type === 'minus' ? item.quantity - 1 : item.quantity + 1
        }
      })
      this.loadCartList()
    } catch (error) {
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      })
    }
  },

  calculateTotal() {
    const { cartList, selectedIds } = this.data
    const total = cartList.reduce((sum, item) => {
      if (selectedIds.includes(item._id)) {
        return sum + item.price * item.quantity
      }
      return sum
    }, 0)
    
    this.setData({ totalPrice: total.toFixed(2) })
  },

  async checkout() {
    const { selectedIds, cartList } = this.data
    if (selectedIds.length === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return
    }

    const selectedItems = cartList.filter(item => 
      selectedIds.includes(item._id)
    )

    wx.navigateTo({
      url: '/pages/user/order/checkout/index',
      success: (res) => {
        res.eventChannel.emit('checkoutData', { items: selectedItems })
      }
    })
  }
}) 