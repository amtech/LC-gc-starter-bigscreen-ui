<template>
  <div
    style="position: relative; user-select: none;"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
  >
    <!-- 这里是需要进行框选的内容 -->
    <div :class="{ 'notSelect': isSelecting }">
      <slot />
    </div>
    <!-- 在鼠标框选移动时生成虚线框 -->
    <div
      v-if="isSelecting"
      :style="getSelectionBoxStyle"
    />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
let time = 0
let newTime = 0
export default {
  props: {
    offsetX: {
      type: Number,
      default: 340 + 50
    },
    offsetY: {
      type: Number,
      default: 73 + 50
    }
  },
  data () {
    return {
      isSelecting: false, // 是否正在进行框选
      isSelectDown: false, // 是否按下鼠标左键
      startX: 0, // 框选起始点的横坐标
      startY: 0, // 框选起始点的纵坐标
      endX: 0, // 框选结束点的横坐标
      endY: 0 // 框选结束点的纵坐标
    }
  },
  computed: {
    ...mapState('bigScreen', {
      shiftKeyDown: state => state.shiftKeyDown
    }),
    getSelectionBoxStyle () {
      // 计算虚线框的样式
      const left = Math.min(this.startX, this.endX) + 'px'
      const top = Math.min(this.startY, this.endY) + 'px'
      const width = Math.abs(this.endX - this.startX) + 'px'
      const height = Math.abs(this.endY - this.startY) + 'px'
      if (!this.isSelecting) {
        return {
          display: 'none'
        }
      }
      return {
        position: 'absolute',
        left,
        top,
        width,
        height,
        border: '1px dashed #007aff'
      }
    }
  },
  methods: {
    ...mapMutations('bigScreen',
      [
        'changeActiveCodes',
        'changeActiveCode'
      ]
    ),
    handleMouseDown (event) {
      if (event.button === 0) {
        time = new Date()
        // 避免和shift + 点击多选组件冲突
        if (this.shiftKeyDown) {
          return
        }
        this.isSelectDown = true
        //  x 697 - 357 = 340
        //  y 177 - 104 = 73
        this.startX = event.x - this.offsetX
        this.startY = event.y - this.offsetY
        this.endX = event.x - this.offsetX
        this.endY = event.y - this.offsetY
      }
    },
    handleMouseMove (event) {
      if (!this.isSelectDown) {
        return
      }
      newTime = new Date()
      if (newTime - time > 300) {
        this.isSelecting = true
      }
      if (this.isSelecting) {
        this.endX = event.x - this.offsetX
        this.endY = event.y - this.offsetY
      }
    },
    handleMouseUp (event) {
      this.isSelectDown = false

      //  按下鼠标和抬起鼠标时间间隔小表示单击，否则表示框选结束
      // 避免和shift + 点击多选组件冲突
      // 避免和右键点击冲突
      if (
        newTime - time < 300 &&
        !this.shiftKeyDown &&
        event.button !== 2
      ) {
        // 按下鼠标和抬起鼠标时间间隔小表示单击，否则表示框选结束
        this.changeActiveCodes([])
        this.changeActiveCode('')
      }

      if (event.button === 0 && this.isSelecting) {
        this.isSelecting = false
        if (newTime - time < 300) {
          newTime = 0
          time = 0
          return
        }
        newTime = 0
        time = 0
        // 在这里可以根据起始点和结束点的坐标计算选中的区域，进行相应的操作
        this.$emit('selectArea', {
          startX: Math.min(this.startX, this.endX),
          startY: Math.min(this.startY, this.endY),
          endX: Math.max(this.startX, this.endX),
          endY: Math.max(this.startY, this.endY)
        })
        // 重置起始点和结束点的坐标
        this.startX = 0
        this.startY = 0
        this.endX = 0
        this.endY = 0
      }
    },
    handleMouseLeave () {
      this.isSelecting = false
      this.isSelectDown = false
      this.startX = 0
      this.startY = 0
      this.endX = 0
      this.endY = 0
    }
  }
}
</script>
<style scoped>
.notSelect {
  user-select: none;
  pointer-events: none;
}
</style>
