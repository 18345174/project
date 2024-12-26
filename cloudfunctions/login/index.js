const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { phone, password } = event
  try {
    const { data } = await db.collection('users')
      .where({
        phone,
        password
      })
      .get()

    if (data.length > 0) {
      return {
        code: 0,
        data: data[0]
      }
    } else {
      return {
        code: 1,
        message: '手机号或密码错误'
      }
    }
  } catch (error) {
    return {
      code: -1,
      message: '登录失败'
    }
  }
} 