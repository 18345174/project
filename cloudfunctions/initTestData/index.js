const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    // 添加测试管理员
    await db.collection('admins').add({
      data: {
        username: 'admin',
        password: '123456',
        createTime: db.serverDate()
      }
    })

    // 添加测试用户
    await db.collection('users').add({
      data: {
        phone: '13800138000',
        password: '123456',
        nickName: '测试用户',
        createTime: db.serverDate()
      }
    })

    // 添加测试分类
    const categoryResult = await db.collection('categories').add({
      data: {
        name: '测试分类',
        icon: '',
        sort: 0,
        createTime: db.serverDate()
      }
    })

    // 添加测试商品
    await db.collection('goods').add({
      data: {
        name: '测试商品',
        price: 99.9,
        stock: 100,
        description: '这是一个测试商品',
        image: '',
        categoryId: categoryResult._id,
        createTime: db.serverDate()
      }
    })

    return {
      code: 0,
      message: '初始化成功'
    }
  } catch (error) {
    return {
      code: -1,
      message: '初始化失败',
      error
    }
  }
} 