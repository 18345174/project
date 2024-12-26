Page({
  data: {
    id: '',
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false,
    region: ['请选择省市区'],
    isEdit: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ 
        id: options.id,
        isEdit: true
      })
      this.loadAddressDetail()
    }
  },

  async loadAddressDetail() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getAddressDetail',
        data: { id: this.data.id }
      })
      const { name, phone, province, city, district, detail, isDefault } = res.result.data
      this.setData({
        name,
        phone,
        province,
        city,
        district,
        detail,
        isDefault,
        region: [province, city, district]
      })
    } catch (error) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [field]: e.detail.value
    })
  },

  bindRegionChange(e) {
    const [province, city, district] = e.detail.value
    this.setData({
      region: e.detail.value,
      province,
      city,
      district
    })
  },

  switchChange(e) {
    this.setData({
      isDefault: e.detail.value
    })
  },

  async submitForm() {
    const { id, name, phone, province, city, district, detail, isDefault, isEdit } = this.data
    
    if (!name || !phone || !province || !detail) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    try {
      const functionName = isEdit ? 'updateAddress' : 'addAddress'
      const data = {
        name,
        phone,
        province,
        city,
        district,
        detail,
        isDefault
      }
      
      if (isEdit) {
        data.id = id
      }

      await wx.cloud.callFunction({
        name: functionName,
        data
      })

      wx.showToast({
        title: isEdit ? '更新成功' : '添加成功'
      })

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (error) {
      wx.showToast({
        title: isEdit ? '更新失败' : '添加失败',
        icon: 'none'
      })
    }
  }
}) 