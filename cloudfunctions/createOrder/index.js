const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { items, address, deliveryType, remark, totalPrice } = event
  
  try {
    // 生成订单号
    const orderNo = `ORDER${Date.now()}${Math.random().toString(36).substr(2, 6)}`
    
    const result = await db.collection('orders').add({
      data: {
        orderNo,
        userId: OPENID,
        goods: items,
        address,
        deliveryType,
        remark,
        totalPrice,
        status: 1, // 1: 待付款
        createTime: db.serverDate()
      }
    })

    return {
      code: 0,
      data: {
        orderId: result._id
      }
    }
  } catch (error) {
    return {
      code: -1,
      message: '创建订单失败'
    }
  }
} 