<template>
    <div class="goods">
        <goods-list-item v-for="item in goods" :key="item.index" :goods-item="item"/>
        
    </div>
</template>

<script>
 import GoodsListItem from './GoodsListItem'
    export default {
        name: 'GoodList',
        components:{
            GoodsListItem
        },
        props:{
          goods:{
            type:Array,
            dafault() {
                return []
            }
         }
       }
        
}
</script>
<style scoped>
    .goods{
        display:flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

</style>