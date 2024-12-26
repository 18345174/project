const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { orderId } = event
  try {
    // 这里应该调用微信支付接口
    // 由于是测试项目，我们直接模拟支付成功
    await db.collection('orders')
      .doc(orderId)
      .update({
        data: {
          status: 2, // 2: 待发货
          payTime: db.serverDate()
        }
      })
    return {
      code: 0,
      data: {
        payment: {
          timeStamp: '',
          nonceStr: '',
          package: '',
          signType: 'MD5',
          paySign: ''
        }
      }
    }
  } catch (error) {
    return {
      code: -1,
      message: '支付失败'
    }
  }
} 