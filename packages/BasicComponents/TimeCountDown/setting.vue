<!--
 * @description: 指标组件案例设计面板
 * @Date: 2022-08-17 16:53:28
 * @Author: xingheng
-->
<template>
  <div class="setting-wrap">
    <el-form
      ref="form"
      label-width="100px"
      label-position="left"
      :model="config"
    >
      <el-form-item
        label="标题"
        label-width="100px"
      >
        <el-input
          v-model="config.title"
          placeholder="请输入标题"
        />
      </el-form-item>
      <el-form-item
        label="时间字体大小"
        label-width="100px"
      >
        <el-input
          v-model="config.customize.fontSize"
          placeholder="请输入时间字体大小"
        >
          <template slot="append">
            px
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="时间字体权重"
        label-width="100px"
      >
        <el-input-number
          v-model="config.customize.fontWeight"
          class="bs-el-input-number"
          placeholder="请输入时间字体权重"
        />
      </el-form-item>
      <el-form-item
        label="结束日期"
        label-width="100px"
      >
        <el-date-picker
          v-model="config.endTime"
          type="datetime"
          placeholder="请选择结束日期"
          :picker-options="pickerOptions"
          value-format="timestamp"
        />
      </el-form-item>
      <el-form-item
        label="字体颜色"
        label-width="100px"
      >
        <el-color-picker v-model="config.customize.color" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'TimeCountDownSetting',
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      HeaderFontSizeList: [
        { label: '正常', value: 16 },
        { label: '较小', value: 14 },
        { label: '较大', value: 30 }
      ],
      numberFormatList: [
        { label: '原始数据', value: 'value' },
        { label: '千位分隔', value: 'kilobit' }
      ]
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
  watch: {},
  mounted () {
    this.initEndTime()
  },
  methods: {
    initEndTime () {
      if (this.config.endTime) {
        this.config.endTime = new Date(this.config.endTime).getTime()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../~packages/assets/style/settingWrap.scss";
.setting-wrap {
  padding: 16px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
