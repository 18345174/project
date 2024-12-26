const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { goodsId } = event
  try {
    await db.collection('goods')
      .doc(goodsId)
      .remove()
    return {
      code: 0
    }
  } catch (error) {
    return {
      code: -1,
      message: '删除失败'
    }
  }
} 