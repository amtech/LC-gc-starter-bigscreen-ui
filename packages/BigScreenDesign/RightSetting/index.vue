<template>
  <div
    class="bs-setting-wrap bs-scrollbar"
    @click.stop
  >
    <el-tabs
      v-if="config.option.displayOption.dataAllocation.enable"
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="数据"
        name="data"
      >
        <DataSetting ref="dataSetting" />
      </el-tab-pane>
      <el-tab-pane
        label="自定义"
        name="second"
      >
        <component
          :is="resolveComponentType(config.type)"
          ref="customSetting"
          :config="config"
          @closeRightPanel="close"
        />
      </el-tab-pane>
    </el-tabs>
    <component
      :is="resolveComponentType(config.type)"
      v-else
      ref="customSetting"
      :config="config"
      @closeRightPanel="close"
    />
    <div class="toolbar">
      <el-button class="bs-el-button-default" @click="close">
        取消
      </el-button>
      <el-button
        type="primary"
        @click="update"
      >
        更新
      </el-button>
    </div>
  </div>
</template>
<script>
import { resolveComponentType } from 'packages/js/utils'
import DataSetting from './DataSetting.vue'
import rightSetting from 'packages/js/utils/rightSettingImport'
import CustomComponent from './G2CustomSetting.vue'
import Svgs from 'packages/Svgs/setting.vue'
import { mapState } from 'vuex'
// 整体动态导入右侧设置组件，不用手动注册
const components = {}
for (const key in rightSetting) {
  if (Object.hasOwnProperty.call(rightSetting, key)) {
    const component = rightSetting[key]
    components[key] = component
  }
}
export default {
  name: 'RightSetting',
  components: { ...components, DataSetting, CustomComponent, Svgs },
  data () {
    return {
      activeName: 'data'
    }
  },
  computed: {
    ...mapState({
      activeCode: state => state.bigScreen.activeCode,
      hoverCode: state => state.bigScreen.hoverCode,
      config: state => state.bigScreen.activeItemConfig
    }),
    pageCode () {
      return this.$route.query.code
    }
  },
  watch: {},
  mounted () {
  },
  methods: {
    close () {
      this.$emit('closeRightPanel')
    },
    handleClick (val) {
      this.$set(this, 'activeName', val.name)
    },
    resolveComponentType,
    // 多个表单校验
    getFormPromise (form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res)
        })
      })
    },
    // 更新
    update () {
      // 有数据配置也有自定义配置的组件
      if (this.config.option.displayOption.dataAllocation.enable) {
        // 获取子组件的表单元素
        const commonForm = this.$refs.dataSetting.$refs.form
        const customForm = this.$refs.customSetting.$refs.form
        Promise.all([commonForm, customForm].map(this.getFormPromise)).then(async res => {
          const vaildateResult = res.every(item => !!item)
          if (vaildateResult) {
            if (this.$refs.dataSetting.params) {
              const params = this.$refs.dataSetting.params
              const paramsMap = params.reduce((obj, param) => {
                obj[param.name] = param.value
                return obj
              }, {})
              this.config.dataSource.params = paramsMap
            }
            this.$emit('updateDataSetting', this.config)
          } else {
            this.$message.warning('请完成数据配置')
            return false
          }
        })
      } else {
        // 只有自定义配置的组件
        if (this.$refs.customSetting?.$refs?.form?.validate) {
          this.$refs.customSetting.$refs.form.validate((valid) => {
            if (valid) {
              this.$emit('updateSetting', this.config)
              this.$message.success('更新成功')
            } else {
              this.$message.warning('请完成配置')
              return false
            }
          })
        } else {
          // 边框装饰组件的右侧配置
          this.$refs.customSetting.$refs.form.$refs.form.validate((valid) => {
            if (valid) {
              this.$emit('updateSetting', this.config)
              this.$message.success('更新成功')
            } else {
              this.$message.warning('请完成配置')
              return false
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~packages/assets/style/settingWrap.scss";
  .add-filter-box {
    position: relative;
    .add-filter {
      margin-left: 100px;
    }
    .add-filter-btn {
      position: absolute;
      top: 0;
    }
  }
</style>
