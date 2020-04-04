<template>
    <div id="home" class="wrapper">
      <!-- 首页的导航栏 -->
        <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
        <!-- 用来应付首页滑下去，tabControl继续吸顶的效果 -->
         <tab-control 
                     :titles="['流行','新款','精选']" 
                     @tabClick="tabClick" 
                     ref="tabControl1" 
                     class="tab-control"
                     v-show="isTabFixed"/>
            <!-- 首页滚动条 -->
        <scroll class="content" 
                ref="scroll" 
                :probe-type="3" 
                @scroll="contentScroll" 
                :pull-up-load="true"  @pullingUp="loadMore">
            <!-- 首页轮播图 -->
        <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
          <!-- 首页推荐栏 -->
        <recommend-view  :recommends="recommends"/>
           <!-- 首页喜爱栏 -->
        <feature-view/>
        <tab-control 
                     :titles="['流行','新款','精选']" 
                     @tabClick="tabClick" 
                     ref="tabControl2" />
            <!-- tabControl展示的货物 -->
        <good-list :goods="showGoods"/>
        </scroll>
          <!-- 一键向上返回 -->
        <back-top @click.native="backClick" v-show=" isShowBackTop"/>
    </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'


import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import {getHomeMultidata,getHomeGoods} from "network/home";
import {debounce} from 'common/utils'
import {itemListenerMixin} from 'common/mixin'


export default {
  name: 'Home',
  components:{
    NavBar,
    TabControl,
    HomeSwiper,
    RecommendView,
    FeatureView,
    GoodList,
    Scroll,
    BackTop
  },
  mixins:[itemListenerMixin],
  data(){
    return{ 
      banners:[],
      recommends:[],
      goods:{
        'pop':{page:0, list:[]},
        'new':{page:0, list:[]},
        'sell':{page:0, list:[]},
      },
      currentType: 'pop',
      isShowBackTop:false,
      tabOffsetTop:0,
      isTabFixed:false,
      itemImgListener:null,
      saveY: 0
    }
  },
   computed: {
    showGoods () {
      return this.goods[this.currentType].list
    }
  },
  
  created() {
    // 1.请求多个数据                                         
     this.getHomeMultidata()
    // 2.请求商品数据
     this.getHomeGoods('pop')
     this.getHomeGoods('new')
     this.getHomeGoods('sell')
  },
  activated() {
      // 返回页面时滚动到离开时记录的位置并刷新
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },

    deactivated(){
    // 离开页面时记录页面离开时的滚动位置
    this.saveY = this.$refs.scroll.getCurrentY()
    // 离开页面时取消全局事件的监听
    this.$bus.$off('itemImgLoad',this.itemImgListener)
    },
  mounted() {
     
  },
   methods: {
      /**
     * 事件监听相关方法
     */
   tabClick(index){
     switch (index){
        case 0:
          this.currentType ='pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType= 'sell'
          break
     }
      this.$refs.tabControl1.currentIndex=index;
      this.$refs.tabControl2.currentIndex=index;
      // 点击tabcontrol滚动到相应的位置
      this.$refs.scroll.scrollTo(0, (-this.tabOffsetTop))
   },
   backClick() {
      this.$refs.scroll.scrollTo(0,0)
   },
   contentScroll(position){
    //  1.判断BackTop是否显示
    this.isShowBackTop = (-position.y) > 1000

     // 2.决定tabControl是否吸顶(position: fixed)
     this.isTabFixed =(-position.y) >this.tabOffsetTop
   },
   loadMore() {
     this.getHomeGoods(this.currentType)
   },
  //  让tabControl2高度等于tabOffsetTop,盖住导航栏
   swiperImageLoad() {
     this.tabOffsetTop =this.$refs.tabControl2.$el.offsetTop;
   },
   /**
     * 网络请求相关方法
     */
     getHomeMultidata(){
       getHomeMultidata().then(res =>{
         // this.result=res;
         this.banners=res.data.banner.list;
         this.recommends=res.data.recommend.list;
       })
     },
     getHomeGoods(type){
         const page=this.goods[type].page+1
         getHomeGoods(type,page).then(res =>{

           this.goods[type].list.push(...res.data.list)
           this.goods[type].page +=1

            // 完成上拉加载更多
           this.$refs.scroll.finishPullUp()

         })
     }
   }
    
}
</script>
r
<style scoped>
 #home{
   /* viewport-height */
   height: 100vh;
   position: relative;
 }

 .home-nav{
   background-color:var(--color-tint);
   color:white;

    /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
   /* position: fixed;
   left:0;
   right: 0;
   top: 0;
   z-index:9; */

 }
  
  /* .content{
    height: calc (100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */
  .content{
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    position:absolute;
    left: 0;
    right: 0;
  }
  /* .fixed{
    position: fixed;
    left:0;
    right: 0;
    top: 44px;
  } */
  .tab-control{
    position: relative;
    z-index:9;
  }
</style>
