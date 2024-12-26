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
          status: 4, // 4: 已完成
          completeTime: db.serverDate()
        }
      })
    return {
      code: 0
    }
  } catch (error) {
    return {
      code: -1,
      message: '确认收货失败'
    }
  }
} 