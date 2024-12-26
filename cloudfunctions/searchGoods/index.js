const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { keyword } = event
  try {
    const { data } = await db.collection('goods')
      .where({
        name: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      })
      .get()
    return {
      code: 0,
      data
    }
  } catch (error) {
    return {
      code: -1,
      message: '搜索失败'
    }
  }
} 