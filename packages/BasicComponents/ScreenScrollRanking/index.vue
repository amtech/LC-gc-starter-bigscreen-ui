<template>
  <div
    style="width: 100%;height: 100%"
    class="bs-design-wrap"
  >
    <dv-scroll-ranking-board
      :key="updateKey"
      class="ranking-box"
      :class="{'light-theme':customTheme === 'light','auto-theme':customTheme =='auto','dark-theme':customTheme =='dark'}"
      :config="option"
    />
  </div>
</template>
<script>
import DvScrollRankingBoard from '@jiaminghi/data-view/lib/components/scrollRankingBoard/src/main.vue'
import '@jiaminghi/data-view/lib/components/scrollRankingBoard/src/main.css'
import { refreshComponentMixin } from 'packages/js/mixins/refreshComponent'
import commonMixins from 'packages/js/mixins/commonMixins'
import paramsMixins from 'packages/js/mixins/paramsMixins'
import linkageMixins from 'packages/js/mixins/linkageMixins'
export default {
  name: 'ScrollRankingBoard',
  components: {
    DvScrollRankingBoard
  },
  mixins: [refreshComponentMixin, paramsMixins, commonMixins, linkageMixins],
  props: {
    // 卡片的属性
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
    }
  },
  computed: {
    option () {
      return { ...this.config.customize, data: this.config.option.data }
    }
  },
  watch: {
  },
  mounted () {},
  methods: {
    buildOption (config, data) {
      const dataSourseList = []
      data.data.forEach(item => {
        dataSourseList.push({ name: item[config.dataSource.dimensionField || 'name'], value: item[config.dataSource.metricField || 'sum(num)'] })
      })
      config.option = {
        ...config.option,
        data: dataSourseList
      }
      return config
    }

  }
}
</script>

<style lang="scss" scoped>
.light-theme{
  background-color: #FFFFFF;
  color: #000000;
}
.auto-theme{
  background-color: rgba(0,0,0,0);
}
.dark-theme{
  background-color:rgb(31, 31, 31) ;
}
  .bs-design-wrap{
    position: relative;
    width: 100%;
    height: 100%;
    background-color: transparent;
    border-radius: 4px;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }
  .title-box{
    height: 40px;
    padding: 10px 10px 0 0;
    box-sizing: border-box;
    .title {
      font-size: 14px;
      color: #333;
      font-weight: bold;
      border-left: 3px solid var(--bs-el-hover);
      padding-left: 16px;
    }
    .target-value{
      overflow-y: auto;
      height: 60px;
      font-weight: bold;
      width: 100%;
      font-size: 20px;
      color: #333;
      padding: 16px 0 0 22px;
      box-sizing: border-box;
    }
  }
  .el-icon-warning{
    color: #FFD600;
  }
  .title-hover{
    &:hover{
      cursor: move;
    }
  }
  .ranking-box{
    padding: 10px;
  }
  /*滚动条样式*/
  /deep/::-webkit-scrollbar {
    width: 4px;
    border-radius: 4px;
    height: 4px;
  }
  /deep/::-webkit-scrollbar-thumb {
    background: #dddddd !important;
    border-radius: 10px;
  }

</style>
