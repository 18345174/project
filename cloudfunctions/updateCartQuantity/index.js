const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { id, quantity } = event
  try {
    await db.collection('cart')
      .doc(id)
      .update({
        data: {
          quantity
        }
      })
    return {
      code: 0
    }
  } catch (error) {
    return {
      code: -1,
      message: '更新失败'
    }
  }
} 