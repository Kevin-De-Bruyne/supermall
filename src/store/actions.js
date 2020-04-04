export default {
      addCart(context, payload) {
        return new Promise((resolve, reject) => {
        //  1.查找之前数组是否有该商品
        let oldPruduct = context.state.cartList.find(item => item.iid === payload.iid)

        //   2.判断oldProduct
          if (oldPruduct) {
          // 旧的商品数量+1
          // oldPruduct.count += 1
            context.commit('addCounter', oldPruduct)
            resolve('当前的商品数量 + 1')
          } else {
            // 添加新的商品
          payload.count = 1
          // context.state.cartList.push(payload)
            context.commit('addCart', payload)
            resolve('添加了新的商品')
        }
      })
    }
}