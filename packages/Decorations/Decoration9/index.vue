<template>
  <div
    style="width: 100%;height: 100%"
    class="bs-design-wrap"
  >
    <dv-decoration-9
      :key="updateKey"
      :color="color"
      :dur="config.customize.dur"
    >
      <!-- <span :style="
        'font-size:' +
          config.customize.fontSize +
          'px;color:' +
          config.customize.color +
          ';font-weight:' +
          config.customize.fontWeight
      ">{{config.customize.title}}</span> -->
    </dv-decoration-9>
  </div>
</template>
<script>
import DvDecoration9 from '@jiaminghi/data-view/lib/components/decoration9/src/main.vue'
import { refreshComponentMixin } from 'packages/js/mixins/refreshComponent'
export default {
  name: 'Decoration9',
  components: {
    DvDecoration9
  },
  mixins: [refreshComponentMixin],
  props: {
    // 卡片的属性
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {}
  },
  computed: {
    color () {
      return this.config.customize.decorationColor1 ||
        this.config.customize.decorationColor2
        ? [
            this.config.customize.decorationColor1,
            this.config.customize.decorationColor2
          ]
        : null
    }
  },
  watch: {},
  mounted () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.bs-design-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: transparent;
  border-radius: 4px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}
.title-box {
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
  .target-value {
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
.el-icon-warning {
  color: #ffd600;
}
.title-hover {
  &:hover {
    cursor: move;
  }
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
