const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { id, name, icon, sort } = event
  try {
    await db.collection('categories')
      .doc(id)
      .update({
        data: {
          name,
          icon,
          sort,
          updateTime: db.serverDate()
        }
      })
    return { code: 0 }
  } catch (error) {
    return {
      code: -1,
      message: '更新失败'
    }
  }
} 