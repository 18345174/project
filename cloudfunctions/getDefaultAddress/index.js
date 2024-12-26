const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  try {
    const { data } = await db.collection('addresses')
      .where({
        userId: OPENID,
        isDefault: true
      })
      .get()
    return {
      code: 0,
      data: data[0] || null
    }
  } catch (error) {
    return {
      code: -1,
      message: '获取失败'
    }
  }
} 