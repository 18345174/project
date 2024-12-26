const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { id } = event
  try {
    await db.collection('categories')
      .doc(id)
      .remove()
    return { code: 0 }
  } catch (error) {
    return {
      code: -1,
      message: '删除失败'
    }
  }
} 