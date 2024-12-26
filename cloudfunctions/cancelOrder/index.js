const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { orderId } = event
  try {
    await db.collection('orders')
      .doc(orderId)
      .update({
        data: {
          status: 0, // 0: 已取消
          cancelTime: db.serverDate()
        }
      })
    return {
      code: 0
    }
  } catch (error) {
    return {
      code: -1,
      message: '取消订单失败'
    }
  }
} 