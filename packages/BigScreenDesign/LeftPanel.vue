<!--
 * @description: 左侧组件列表
 * @Date: 2022-05-24 15:35:07
 * @Author: xingheng
-->
<template>
  <transition name="slide-fade">
    <div class="bs-left-panel">
      <div
        :class="fold ? 'page-left page-left-fold' : 'page-left'"
        :style="{ height }"
      >
        <el-tabs
          v-model="activeName"
          tab-position="left"
          style="height: 200px;"
          class="left-tabs-box"
          @tab-click="tabClick"
        >
          <el-tab-pane
            name="default"
            @click.native="changeActiveCode('')"
          >
            <span
              slot="label"
              class="menu-slot"
              name="default"
              @click="toggleSidebar"
            >
              <i
                class="iconfont-bigscreen menu-icon"
                :class="fold ? 'icon-zhankaicaidan' : 'icon-shouqicaidan'"
              />
              <span class="menu-title-span">{{ foldText }}</span>
            </span>
          </el-tab-pane>
          <el-tab-pane
            name="layer"
          >
            <div
              slot="label"
              class="menu-slot"
              name="layer"
              @dbclick.native="toggleSidebar"
            >
              <i
                :class="[
                  'iconfont-bigscreen',
                  'icon-layer'
                ]"
                class="menu-icon"
              />
              <span class="menu-title-span">图层</span>
            </div>
            <div class="page-left-content">
              <div class="page-left-content-title">
                <div class="page-left-content-title-text">
                  图层
                </div>
              </div>
              <div class="page-left-content-components">
                <el-scrollbar>
                  <LayerList @openRightPanel="openRightPanel" />
                </el-scrollbar>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            v-for="menu in menuList"
            :key="menu.id"
            :name="menu.name"
            @click.stop.native="
              fold = false;
              activeName = 'chart';
              changeActiveCode('')
            "
          >
            <div
              slot="label"
              class="menu-slot"
              @dbclick.native="toggleSidebar"
            >
              <i
                :class="[
                  'iconfont-bigscreen',
                  menu.icon
                ]"
                class="menu-icon"
              />
              <span class="menu-title-span">{{ menu.title }}</span>
            </div>
            <div class="page-left-content">
              <div class="page-left-content-title">
                <div class="page-left-content-title-text">
                  {{ menu.title }}
                </div>
              </div>
              <el-scrollbar>
                <div class="page-left-content-components">
                  <div class="draggable chat-list">
                    <div
                      v-for="element in menu.components"
                      :key="element.type + element.name"
                      :class="element.component ? 'item menu-component drag-node' : 'item drag-node'"
                      draggable="true"
                      :data-type="element.type"
                      :data-name="element.name"
                    >
                      <div class="component-name">
                        {{ element.title || element.name }}
                      </div>
                      <div
                        class="img_dispaly chooseDragNode"
                        @click.stop="addComponent(element)"
                      >
                        <icon-svg
                          v-if="element.icon"
                          :name="element.icon"
                          class="page-opt-list-icon"
                        />
                        <img
                          v-else-if="element.img"
                          :src="element.img"
                          class="page-opt-list-img"
                          alt=""
                        >
                        <component
                          :is="element.component"
                          :key="new Date().getTime() + 1"
                          class="page-opt-list-component"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>
<script>
import _ from 'lodash'
import basicComponents from 'packages/js/config/basicComponentsConfig'
import g2PlotComponents, { getCustomPlots } from '../G2Plots/plotList'
import borderComponents from 'packages/js/config/borderComponentsConfig'
import decorationComponents from 'packages/js/config/decorationComponentsConfig'
import svgComponents from 'packages/Svgs/svgConfigList'
import LayerList from './LayerList/index.vue'
import { mapMutations } from 'vuex'
import IconSvg from 'packages/SvgIcon'
export default {
  name: 'PageLeftPanel',
  components: {
    LayerList,
    IconSvg
  },
  props: {
    headerShow: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: '100vh'
    }
  },
  data () {
    return {
      g2PlotComponents,
      activeName: 'g2PlotComponents', // 设置左侧tab栏的默认值
      fold: false, // 控制左侧菜单栏伸缩
      currentTab: 'basic',
      menuList: [
        { id: 1, name: 'chart', title: '基础', icon: 'icon-zujian', components: basicComponents },
        { id: 2, name: 'g2PlotComponents', title: '图表', icon: 'icon-jichushuju', components: this.g2PlotComponents },
        { id: 3, name: 'dataV', title: '边框', icon: 'icon-border-outer', components: borderComponents },
        { id: 4, name: 'decoration', title: '装饰', icon: 'icon-a-1', components: decorationComponents },
        { id: 5, name: 'svg', title: '图标', icon: 'icon-svg', components: svgComponents }
      ],
      currentActive: 'chart'
    }
  },
  computed: {
    // 获取当前类型的组件
    currentComponentList () {
      return this.componentList.filter(item => item.type === this.currentTab)
    },
    foldText () {
      return this.fold ? '展开' : '收起'
    }
  },
  watch: {
    fold (isExpand) {
      if (isExpand && this.activeName === 'default') {
        this.activeName = 'chart'
      }
    }
  },
  created () {
    this.initList()
    this.g2PlotComponents = [
      ...this.g2PlotComponents,
      ...getCustomPlots()
    ]
    this.menuList[1].components = this.g2PlotComponents
  },
  mounted () {
    this.nodeDrag()
  },
  methods: {
    ...mapMutations('bigScreen', ['changeActiveCode']),
    nodeDrag () {
      this.$nextTick(() => {
        const nodes = document.querySelectorAll('.drag-node')
        nodes.forEach(node => {
          node.addEventListener('dragstart', event => {
            const type = node.getAttribute('data-type')
            const name = node.getAttribute('data-name')
            // 从menuList中获取当前拖拽的组件
            const element = this.menuList.find(item => item.name === this.activeName)?.components.find(item => item.type === type && item.name === name)
            /* 设置拖拽传输数据 */
            event.dataTransfer.setData('dragComponent',
              JSON.stringify({
                ...element,
                offsetX: event.offsetX,
                offsetY: event.offsetY
              })
            )
          })
        })
        // 阻止默认动作
        document.addEventListener('drop', e => {
          e.preventDefault()
        }, false)
      })
    },
    onClone (e) {
      return _.cloneDeep(e)
    },
    onStart (e) {
      // this.$emit('onStart', e)
    },
    // 拖拽组件时触发
    onEnd (e) {
    },
    // 点击左侧组件时触发
    addComponent (element) {
      this.$store.commit('bigScreen/changeActiveItem', element)
      this.$emit('addComponent', element)
    },
    // 初始化
    initList () {
    },
    // 点击tab标签
    tabClick (tab) {
      this.nodeDrag()
      if (tab.index !== '0') {
        this.fold = false
        this.currentActive = this.activeName
      }
    },
    toggleSidebar () {
      this.fold = !this.fold
      setTimeout(() => {
        this.activeName = this.currentActive
      })
    },
    openRightPanel (config) {
      this.$emit('openRightPanel', config)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~packages/BigScreenDesign/fonts/iconfont.css';
.bs-left-panel {
  display: flex;
  background-color: var(--bs-background-1);

  .bs-folder-wrap {
    width: 20px;
    position: relative;

    i {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      font-size: 20px;
      color: #fff;
      cursor: pointer;
      z-index: 1;
    }

    &:hover {
      background: rgba(143, 225, 255, .1)
    }
  }

  .page-left {
    box-sizing: border-box;

    >* {
      color: #fff;
    }

    .iconfont-bigscreen {
      color: #fff;
    }

    .flexible {
      width: 45px;
      /* border-right: 1px solid #ccc; */
      text-align: center;
    }

    .el-tabs {
      width: 250;
      position: relative;
      height: 100% !important;
      overflow: visible;

      .is-active {
        .iconfont-bigscreen {
          color: var(--bs-el-hover);
        }
        .menu-title-span {
          color: var(--bs-el-hover);
        }
      }

      .el-tab-pane {
        height: 100%;
      }

      .page-left-content {
        height: 100%;
      }

      /deep/.el-tabs__content {
        height: 100%;
        width: 190px;

        .page-left-content-title {
          background-color: var(--bs-background-2);
          color: var(--bs-el-title);
          font-size: 14px;
          margin: 8px;
          padding: 8px 0;

          .page-left-content-title-text {
            /*border-left: 4px solid #007aff;*/
            position: relative;
            padding-left: 12px;
            &:after{
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              content: '';
              width: 4px;
              height: 14px;
              background-color: var(--bs-el-hover);
            }
          }
        }
        .el-scrollbar__view{
          height: calc(100vh - 55px);
        }
        .page-left-content-components {
          width: 100%;
          text-align: center;
          padding-bottom: 20px;
          margin-bottom: 20px;

          .draggable {
            display: flex;
            flex-wrap: wrap;
            cursor: pointer;
            box-sizing: border-box;
            justify-content: center;
            padding: 8px;
            cursor: move;

            .item {
              width: 100%;
              background: var(--bs-background-2);
              margin-bottom: 8px;

              .component-name {
                background: var(--bs-background-3);
                color: var(--bs-el-title);
                font-size: 12px;
                padding: 4px 16px;
                text-align: left;
              }
              .sampleImg {
                margin: 0 auto;
                width: 102px;
                height: 73px;
                display: block;
              }

              .img_dispaly {
                margin: 0 auto;
                text-align: center;
                width: 100px;
                height: 70px;
                line-height: 70px;

                .icon-svg {
                  width: 50px !important;
                  height: 50px !important;
                }
              }
            }

            .menu-component {
              margin: 7px;

              .page-opt-list-component {
                width: 102px;
                height: 75px;
              }
              .img_dispaly {
                height: 80px;
              }
            }
          }
        }
      }
    }

    /deep/.el-tabs__header {
      width: 45px;
      height: 100%;
      margin-right: 0 !important;
    }

    /deep/.el-tabs--left .el-tabs__nav-wrap.is-left::after {
      width: 0 !important;
    }

    .el-tabs__active-bar {
      transform: none !important;
      height: 0 !important;
    }

    .el-tabs__nav-wrap.is-left::after {
      left: 0;
    }

    .el-tabs__nav-wrap {
      height: 100%;
      /* border-right: 1px solid #ccc; */
    }

    /deep/ .el-tabs__nav-scroll {
      background-color: var(--bs-background-2);
    }
  }

  .page-left-fold {
    width: 45px;
    overflow: hidden;
    /* border-right: 1px solid #ccc; */

    .el-tabs__content {
      border: none;
    }
  }
  .left-tabs-box{
    /deep/.el-tabs__item{
      height: 70px!important;
      .menu-slot{
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        color: #bcc9d4;
        .menu-icon{
          height: 20px;
        }
        .menu-title-span{
          display: block;
          width: 100%;
          font-size: 12px;
        }
      }
    }
  }
}

.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to

/* .slide-fade-leave-active for below version 2.1.8 */
  {
  transform: translateX(10px);
  opacity: 0;
}

/deep/ .el-tabs__item.is-left {
  text-align: center;
  padding: 0;
}

.page-opt-list-img {
  width: 100%;
  height: 70px;
}
</style>
