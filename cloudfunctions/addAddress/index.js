const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { name, phone, province, city, district, detail, isDefault } = event

  try {
    // 如果设为默认地址，先将其他地址设为非默认
    if (isDefault) {
      await db.collection('addresses')
        .where({
          userId: OPENID,
          isDefault: true
        })
        .update({
          data: {
            isDefault: false
          }
        })
    }

    await db.collection('addresses').add({
      data: {
        userId: OPENID,
        name,
        phone,
        province,
        city,
        district,
        detail,
        isDefault,
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