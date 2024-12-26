const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  
  try {
    const $ = db.command.aggregate
    const { list } = await db.collection('orders')
      .aggregate()
      .match({
        userId: OPENID
      })
      .group({
        _id: '$status',
        count: $.sum(1)
      })
      .end()

    const counts = {
      unpaid: 0,    // 待付款
      unshipped: 0, // 待发货
      unreceived: 0,// 待收货
      completed: 0  // 已完成
    }

    list.forEach(item => {
      switch(item._id) {
        case 1: counts.unpaid = item.count; break;
        case 2: counts.unshipped = item.count; break;
        case 3: counts.unreceived = item.count; break;
        case 4: counts.completed = item.count; break;
      }
    })

    return {
      code: 0,
      data: counts
    }
  } catch (error) {
    return {
      code: -1,
      message: '获取失败'
    }
  }
} 