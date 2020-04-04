import {
  debounce
} from 'common/utils'

import {
  POP,
  NEW,
  SELL
} from "./const";
export const itemListenerMixin = {
    mounted() {
              const newRefresh = debounce(this.$refs.scroll.refresh, 100)

              this.itemImgListener = () => {
                newRefresh()
              }

              this.$bus.$on('itemImgLoad', this.itemImgListener)
    }
}

export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = pop
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
    }
  }
}