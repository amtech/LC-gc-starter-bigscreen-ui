<!--
 * @description: 标题属性设置面板
 * @Date: 2022-08-17 16:53:28
 * @Author: shiyi
-->
<template>
  <div class="bs-setting-wrap">
    <el-form
      ref="form"
      label-width="100px"
      label-position="left"
      :model="config"
      :rules="rules"
    >
      <div class="lc-field-body">
        <div class="">
          <el-form-item
            label="标题"
            label-width="100px"
            prop="title"
          >
            <el-input
              v-model="config.title"
              placeholder="请输入标题"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="标题字体大小"
            label-width="100px"
          >
            <el-input
              v-model="config.customize.fontSize"
              placeholder="请输入标题字体大小"
              clearable
            >
              <template slot="append">
                px
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="标题字体权重"
            label-width="100px"
          >
            <el-input-number
              v-model="config.customize.fontWeight"
              class="bs-el-input-number"
              placeholder="请输入标题字体权重"
            />
          </el-form-item>
          <el-form-item
            label="标题字体颜色"
            label-width="100px"
          >
            <el-color-picker v-model="config.customize.color" />
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'TextSetting',
  components: {
  },
  data () {
    return {
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    config: {
      get () {
        return this.$store.state.bigScreen.activeItemConfig
      },
      set (val) {
        this.$store.state.bigScreen.activeItemConfig = val
      }
    }
  },
  watch: {
  },
  mounted () {},
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  @import "../~packages/assets/style/settingWrap.scss";
  .bs-setting-wrap{
    padding-top: 16px;
  }
</style>
