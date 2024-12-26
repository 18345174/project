const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { id, name, phone, province, city, district, detail, isDefault } = event

  try {
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

    await db.collection('addresses')
      .doc(id)
      .update({
        data: {
          name,
          phone,
          province,
          city,
          district,
          detail,
          isDefault,
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