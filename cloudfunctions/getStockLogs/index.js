const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { goodsId } = event
  
  try {
    const { data } = await db.collection('stockLogs')
      .where({
        goodsId
      })
      .orderBy('createTime', 'desc')
      .get()

    return {
      code: 0,
      data
    }
  } catch (error) {
    return {
      code: -1,
      message: '获取失败'
    }
  }
} 