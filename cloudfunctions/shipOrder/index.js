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
          status: 3, // 3: 待收货
          shipTime: db.serverDate()
        }
      })
    return {
      code: 0
    }
  } catch (error) {
    return {
      code: -1,
      message: '发货失败'
    }
  }
} 