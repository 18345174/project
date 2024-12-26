const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { goodsId, quantity, deliveryType } = event
  
  try {
    // 查询商品信息
    const { data: goodsInfo } = await db.collection('goods')
      .doc(goodsId)
      .get()

    // 添加到购物车
    await db.collection('cart').add({
      data: {
        userId: OPENID,
        goodsId,
        quantity,
        deliveryType,
        name: goodsInfo.name,
        price: goodsInfo.price,
        image: goodsInfo.image,
        createTime: db.serverDate()
      }
    })

    return {
      code: 0
    }
  } catch (error) {
    return {
      code: -1,
      message: '添加失败'
    }
  }
} 