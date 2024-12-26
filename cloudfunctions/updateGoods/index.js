const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { goodsId, name, price, stock, description, image } = event
  try {
    await db.collection('goods')
      .doc(goodsId)
      .update({
        data: {
          name,
          price,
          stock,
          description,
          image,
          updateTime: db.serverDate()
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