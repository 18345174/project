const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { name, icon, sort = 0 } = event
  try {
    await db.collection('categories').add({
      data: {
        name,
        icon,
        sort,
        createTime: db.serverDate()
      }
    })
    return { code: 0 }
  } catch (error) {
    return {
      code: -1,
      message: '添加失败'
    }
  }
} 