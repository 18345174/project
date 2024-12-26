const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { name, price, stock, description, image, categoryId } = event
  try {
    const result = await db.collection('goods').add({
      data: {
        name,
        price,
        stock,
        description,
        image,
        categoryId,
        createTime: db.serverDate()
      }
    })
    return {
      code: 0,
      data: result
    }
  } catch (error) {
    return {
      code: -1,
      message: '添加失败'
    }
  }
} 