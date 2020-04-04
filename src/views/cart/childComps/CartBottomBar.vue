<template>
    <div class="bottom-bar">
      <div class="check-content">
        <check-button 
         :is-checked="isSelectAll" 
         class="check-button"
         @click.native="checkClick"/>
        <span>全选 </span>
      </div>
        <div class="price">
            合计: ￥{{totalPrice}}
        </div>

        <div class="calculate" @click="calcClick">
            去计算({{checkLength}})
        </div>
    </div>
</template>

<script>
    import CheckButton from 'components/content/checkButton/CheckButton'
    export default {
        name: 'CartBottomBar',
        components:{
            CheckButton
        },
        computed: {
            totalPrice() {
              return this.$store.state.cartList.filter(product=> {
                 return product.checked
         }).reduce((preValue, product) =>{
             var price =product.price.slice(1);
             return preValue + parseInt(price) * product.count
          },0).toFixed(2)
         },
         checkLength() {
             return this.$store.state.cartList.filter(product => product.checked).length
         },
         isSelectAll() {
            //  1.使用filter
            //  return !(this.$store.state.cartList.filter(product => product.checked).length)
            if (this.$store.state.cartList.length === 0){
                return false
            }

            // 2.使用find
            return !this.$store.state.cartList.find(product => !product.checked)

            // 3.普通遍历
            // for(let product of this.$store.state.cartList){
            //     if(!product.checked){
            //         return false
            //     }
            //     return true
            // }


         }
     },
        methods: {
         checkClick() {
                //  全部选中
             if(this.isSelectAll){
                 this.$store.state.cartList.forEach(product => product.checked = false)
             }else{
                //  部分或全部不选中
                 this.$store.state.cartList.forEach(product => product.checked = true)
             }
         },
         calcClick() {
             if(!this.isSelectAll) {
                //  this.$toast.show('请选择购买的商品',2000)
             }
         }
     }  
        
}
</script>
<style scoped>
    .bottom-bar{
        height: 40px;
        background-color:#eee;
        position: relative;
        line-height: 40px;
        display: flex;
    }

     .check-button{
         width: 20px;
         height: 20px;
         line-height: 20px;
         margin-right: 5px;
     }
     .check-content{
         display: flex;
         align-items: center;
         margin-left: 10px;
         width: 60px;
     }
     
     .price{
         margin-left:20px;
         flex:1;
     }

     .calculate{
         width: 80px;
         background-color: red;
         color:white;
         text-align: center;
         font-size: 14px;
     }
</style>