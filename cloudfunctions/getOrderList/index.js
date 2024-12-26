const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { status, isAdmin } = event
  
  try {
    let query = {}
    
    if (!isAdmin) {
      query.userId = OPENID
    }
    
    if (status > 0) {
      query.status = status
    }

    const { data } = await db.collection('orders')
      .where(query)
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