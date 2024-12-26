const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { goodsId, quantity, type, remark } = event
  
  try {
    const { data: goods } = await db.collection('goods')
      .doc(goodsId)
      .get()
    
    // 检查库存是否充足（出库时）
    if (type === -1 && goods.stock < quantity) {
      return {
        code: 1,
        message: '库存不足'
      }
    }

    // 更新商品库存
    await db.collection('goods')
      .doc(goodsId)
      .update({
        data: {
          stock: db.command.inc(type * quantity)
        }
      })

    // 记录库存日志
    await db.collection('stockLogs').add({
      data: {
        goodsId,
        type,
        quantity,
        remark,
        operator: OPENID,
        createTime: db.serverDate()
      }
    })

    return { code: 0 }
  } catch (error) {
    return {
      code: -1,
      message: '操作失败'
    }
  }
} 