<template>
    <div id="detail">
      <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
      <scroll class="content" 
              ref="scroll" 
              :probe-type="3" 
              @scroll="contentScroll">
        <detail-swiper :top-images="topImages"/>
        <detail-base-info :goods="goods" />
        <detail-shop-info :shop="shop"/>
        <detail-goods-info :detail-info="detailInfo" @imgLoad="imgLoad" ref="goodsInfo"/>
        <detail-param-info ref="params" :param-info="paramInfo"/>
        <detail-comment-info ref="comment" :comment-info="commentInfo"/>
        <goods-list ref="recommend" :goods="recommend"/>
        
      </scroll>
      <detail-bottom-bar @addCart="addCart"/>
      <back-top @click.native="backClick" v-show=" isShowBackTop"/>
      <toast :message="message" :show="show"/>
    </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailBottomBar from './childComps/DetailBottomBar'
import DetailCommentInfo from './childComps/DetailCommentInfo'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/content/backTop/BackTop'
import Toast from 'components/common/toast/Toast'

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail'
import {debounce} from 'common/utils'
import {itemListenerMixin} from 'common/mixin'

export default {
  name: 'Detail',
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailBottomBar,
    DetailCommentInfo,
    Scroll,
    GoodsList,
    BackTop,
    Toast
  },
  mixins:[itemListenerMixin],
  data () {
    return{
      iid:null,
      topImages:[],
      goods:{},
      shop:{},
      detailInfo:{},
      paramInfo:{},
      commentInfo:{},
      recommend:[],
      itemImgListener:null,
      themeTopYs:[],
      getThemeTopY:null,
      currentIndex:0,
      isShowBackTop:true,
      message: '',
      show:false
    }
  },
  created() {
    // 1.保存传入的iid
    this.iid= this.$route.params.iid
      
    // 2.根据iid请求详细数据
     getDetail(this.iid).then(res =>{
        // 1.获取顶部的图片轮播数据
       console.log(res);
       const data=res.result;
       this.topImages=res.result.itemInfo.topImages
       
      //  2.获取商品信息
       this.goods= new Goods(data.itemInfo,data.columns,data.shopInfo.services)

      //  3.创建店铺信息
       this.shop=new Shop(data.shopInfo)
         
       // 4.保存商品的详情数据
       this.detailInfo=data.detailInfo;

       // 5.获取商品参数信息
       this.paramInfo=new GoodsParam(data.itemParams.info,data.itemParams.rule)

       // 6.读出评论的信息
       if (data.rate.cRate !==0){
         this.commentInfo = data.rate.list[0]
       }
      // this.$nextTick(() =>{
        // 根据最新的数据，对应的DOM是已经被渲染出来
        // 但是图片依然是没有加载完(目前获取到offsetTop不包含其中的图片)
        // offsetTop值不对时，都是因为图片的问题
      //   this.themeTopYs=[]

      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

      // console.log(this.themeTopYs);
      // })
    
     })
      
      // 3.请求推荐数据
      getRecommend().then(res =>{
        this.recommend =res.data.list
      })

    },
    mounted() {
     
    },
    updated() {
      
    },
    methods: {
      // 判断图片加载完成，刷新可滚动区域
      imgLoad() {
        this.$refs.scroll.refresh()
        // this.newRefresh()
        // 给navbar中的item定位到对应的位置

         this.themeTopYs=[]

        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

        console.log(this.themeTopYs);
        
      },
       titleClick(index){
      //  console.log(index);
       this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
      },
      contentScroll(position) {
        // 1.获取y值
        const positionY = -position.Y

        // 2.positionY和主题中值进行对比
        //  [0, 7938, 9120 ,9452]
        // positionY 在 0 和 7938 之间，index=0
        // positionY 在 =7938 和 9120 之间，index=1
        // positionY 在 9120 和 9452 之间，index=2

        // positionY 超过或者等于9120，index=3

        let length = this.themeTopYs.length
        for(let i=0; i<length;i++){
          if (this.currentIndex !==i && ((i < length -1 && positionY >=this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) ||
          (i ===length -1 && positionY >= this.themeTopYs[i]))) {
            this.currentIndex=i;
            this.$refs.nav.currentIndex= this.currentIndex;

          //  3.是否显示回到顶部
          this.isShowBackTop = (-position.y) > 1500
        //  this.topIsShow = (- position.y) > this.$refs.goodsInfo.$el.offsetTop;
            
          }
          
        }
     },
      backClick() {
      this.$refs.scroll.scrollTo(0,0)
     },
      addCart() {
        // 1.获取购物车需要展示的信息
        const product = {}
        product.image =this.topImages[0];
        product.title= this.goods.titles;
        product.desc= this.goods.desc;
        product.price=this.goods.newPrice;
        product.iid=this.iid;

        // 2.将商品添加到购物车
        // this.$store.commit('addCart',product)
        this.$store.dispatch('addCart',product).then(res =>{
          this.show = true;
          this.message = res;

          setTimeout(()=>{
            this.show =false;
            this.message=''
          },1500)
          // this.$toast.show(res,2000)
        })
     },
      buyNow() {
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;
        // 放入到购物车中
        // if(product.iid){
        // this.$store.dispatch('buyNow',product).then(res => {
          // this.$toast.show(res, 1500)
          // this.$router.push('/cart')
        // })}else {
        //   this.$toast.show('添加失败请刷新重试', 1500)
        // }
      }
    
    },

    destroyed() {
       this.$bus.$off('itemImgLoad',this.itemImgListener)
    }
}
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
 
 .detail-nav{
   position: relative;
   z-index: 9;
   background-color: #fff;
 }
 .content{
   height:calc(100% - 44px);
 }
</style>
