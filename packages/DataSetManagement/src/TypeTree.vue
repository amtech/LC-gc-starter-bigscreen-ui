<template>
  <div class="bs-theme-wrap">
    <div class="tree-box">
      <div class="ztree-filter-container filter-container">
        <el-input
          v-model="queryForm.searchKey"
          placeholder="请输入数据集分类"
          clearable
          class="ztree-input bs-el-input"
          @keyup.enter.native="reSearch()"
          @clear="reSearch()"
        />
        <el-button
          :loading="loading"
          type="primary"
          icon="el-icon-search"
          @click="reSearch()"
        >
          查询
        </el-button>
      </div>
      <br class="br">
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="分组"
          name="group"
        />
        <el-tab-pane
          label="类型"
          name="type"
        />
      </el-tabs>
      <div
        v-show="activeName == 'group'"
        class="left"
      >
        <div class="ztree ztree-box">
          <el-scrollbar class="scroll">
            <el-empty v-show="noData" />
            <div
              v-if="!categoryData.length"
              style="text-align: center;"
            >
              <el-button
                type="text"
                icon="el-icon-plus"
                @click="addRootNode"
              >
                <span style="color: #3478f6;">新增根节点</span>
              </el-button>
            </div>
            <ul
              v-show="!noData"
              id="orgTree"
              class="ztree"
            />
            <div
              v-loading="loading"
              class="loading"
              element-loading-text="正在加载数据"
              element-loading-spinner="el-icon-loading"
            />
          </el-scrollbar>
        </div>
        <div
          v-show="rightClickForm.visible"
          class="ztreeNodeMenu"
          @mouseleave="rightClickForm.visible = false"
          @mouseenter="rightClickForm.visible = true"
        >
          <div id="orgTreeNodeMenuBottom">
            <div class="triangle" />
            <ul>
              <li
                v-if="!isBoth"
                @click="menuClick(editTypeConstant.editOrg)"
              >
                <span slot="title">编辑</span>
              </li>
              <li
                v-if="!isBoth"
                @click="menuClick(editTypeConstant.deleteOrg)"
              >
                <span slot="title">删除</span>
              </li>
              <li @click="menuClick(editTypeConstant.addSiblingOrg)">
                <span slot="title">新增同级</span>
              </li>
              <li
                v-if="!isBoth"
                @click="menuClick(editTypeConstant.addChildOrg)"
              >
                <span slot="title">新增子级</span>
              </li>
            </ul>
          </div>
          <div id="orgTreeNodeMenuTop">
            <ul>
              <li
                v-if="!isBoth"
                @click="menuClick(editTypeConstant.addChildOrg)"
              >
                <span slot="title">新增子级</span>
              </li>
              <li @click="menuClick(editTypeConstant.addSiblingOrg)">
                <span slot="title">新增同级</span>
              </li>
              <li
                v-if="!isBoth"
                @click="menuClick(editTypeConstant.deleteOrg)"
              >
                <span slot="title">删除</span>
              </li>
              <li
                v-if="!isBoth"
                @click="menuClick(editTypeConstant.editOrg)"
              >
                <span slot="title">编辑</span>
              </li>
            </ul>
            <div class="triangle" />
          </div>
        </div>
      </div>
      <div
        v-show="activeName == 'type'"
        class="left"
      >
        <div class="left-tab-box">
          <ul>
            <li
              v-for="_type in typeData"
              :key="_type.name"
              :class="{ 'tab-style': true, 'tab-active': _type.datasetType == curType }"
              @click="getTypeData(_type.datasetType)"
            >
              <span>{{ _type.name }}</span>
            </li>
          </ul>
        </div>
      </div>
      <org-edit-form
        v-if="editFormVisible"
        ref="editForm"
        :app-code="appCode"
      />
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import $ from 'jquery'
import 'ztree/js/jquery.ztree.core'
import 'ztree/js/jquery.ztree.exedit'
import 'ztree/js/jquery.ztree.exhide'
import 'packages/assets/style/zTree/metroStyle.css'
import 'packages/assets/style/zTree/zTree.scss'
import 'packages/assets/style/zTree/zTreeSelect.scss'
import { getDatasetTypeList, categoryRemove } from 'packages/js/utils/datasetConfigService'
import OrgEditForm from './CategroyEditForm.vue'
export default {
  name: 'OrgTreeIndex',
  components: {
    OrgEditForm
  },
  props: {
    dsType: {
      type: Array,
      default: () => (['original', 'custom', 'storedProcedure', 'json', 'script'])
    },
    appCode: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      activeName: 'group',
      categoryData: [],
      typeDataList: [
        { name: '全部', datasetType: '' },
        { name: '原始数据集', datasetType: 'original' },
        { name: '自助数据集', datasetType: 'custom' },
        { name: '存储过程数据集', datasetType: 'storedProcedure' },
        { name: 'JSON数据集', datasetType: 'json' },
        { name: '脚本数据集', datasetType: 'script' }
      ],
      curType: '-1',
      noData: false,
      loading: false,
      rightTableIsTransition: '',
      flatData: [],
      queryForm: {
        searchKey: ''
      },
      ztreeObj: '',
      nodeData: '',
      rightClickForm: {
        visible: false,
        org: {}
      },
      editTypeConstant: {
        deleteOrg: 'deleteOrg',
        editOrg: 'editOrg',
        addChildOrg: 'addChildOrg',
        addSiblingOrg: 'addSiblingOrg'
      },
      editFormVisible: false,
      ztreeSetting: {
        view: {
          dblClickExpand: false,
          showTitle: false,
          addHoverDom: (treeId, treeNode) => {
            const nodeObj = $('#' + treeNode.tId + '_a')
            nodeObj.css({ 'background-color': '#f6f7fb', cursor: 'pointer' })
          },
          removeHoverDom: (treeId, treeNode) => {
            const nodeObj = $('#' + treeNode.tId + '_a')
            nodeObj.css({ 'background-color': 'rgba(0,0,0,0)' })
          },
          addDiyDom: this.addDiyDom
        },
        callback: {
          onClick: this.getNodeData,
          onExpand: this.expandNode
        }
      },
      isBoth: false // 是否为全部
    }
  },
  computed: {
    typeData () {
      const types = this.typeDataList.filter(type => {
        return type.datasetType === '' || this.dsType.includes(type.datasetType)
      })
      return types
    }
  },
  mounted () {
    this.initLazyOrgTree()
  },

  methods: {
    // 新增根节点
    addRootNode () {
      this.editFormVisible = true
      this.$nextTick(() => {
        this.$refs.editForm.tableName = 'r_dataset'
        this.$refs.editForm.dialogFormVisible = true
        this.$refs.editForm.init({ parentId: 0 }, true)
        this.$refs.editForm.radio = 0
        this.$refs.editForm.title = '节点新增'
      })
    },
    addDiyDom (treeId, treeNode) {
      if (this.activeName === 'type') return
      if (treeNode.parentNode && treeNode.parentNode.id !== 2) return
      const aObj = $('#' + treeNode.tId + '_a')
      const editStr = "<span  id='diyBtn_" + treeNode.id + "' class='treeAddNode'>⋮</span>"
      aObj.after(editStr)
      const btn = $('#diyBtn_' + treeNode.id)
      if (btn) {
        const _this = this
        btn.bind('mouseenter', function () {
          if (treeNode.name === '全部' && treeNode.id === '') {
            _this.isBoth = true
          } else {
            _this.isBoth = false
          }
          _this.nodeData = treeNode
          _this.rightClickForm.org = treeNode
          _this.rightClickForm.visible = true
          let hieght = 0
          const nodeElObj = document.getElementById(treeNode.tId + '_a').getBoundingClientRect()
          const clientHeight = document.documentElement.clientHeight
          const clientY = nodeElObj.top + 34
          if (clientHeight - clientY < 200) {
            hieght = clientY - 200
            document.querySelector('#orgTreeNodeMenuBottom').style.display = 'none'
            const menu = document.querySelector('#orgTreeNodeMenuTop')
            /* 菜单定位基于鼠标点击位置 */
            menu.style.display = ''
            menu.style.left = nodeElObj.right - 92 + 'px'
            menu.style.top = hieght + 10.5 + 25 + 'px'
            menu.style.position = 'fixed' // 为新创建的DIV指定绝对定位
            menu.style.width = 110 + 'px'
          } else {
            hieght = clientY
            document.querySelector('#orgTreeNodeMenuTop').style.display = 'none'
            const menu = document.querySelector('#orgTreeNodeMenuBottom')
            /* 菜单定位基于鼠标点击位置 */
            menu.style.display = ''
            menu.style.left = nodeElObj.right - 92 + 'px'
            menu.style.top = hieght - 8 + 'px'
            menu.style.position = 'fixed' // 为新创建的DIV指定绝对定位
            menu.style.width = 110 + 'px'
          }
        })
        btn.bind('mouseout', function () {
          _this.rightClickForm.visible = false
        })
      }
    },
    // 初始化树节点
    initLazyOrgTree () {
      this.loading = true
      getDatasetTypeList({ tableName: 'r_dataset', moduleCode: this.appCode }).then((res) => {
        this.categoryData = res.map((item) => {
          return { isParent: item.hasChildren, ...item }
        })
        this.categoryData.unshift({ name: '全部', id: '', parentId: '0' })
        this.ztreeObj = $.fn.zTree.init($('#orgTree'), this.ztreeSetting, this.categoryData)
        this.$emit('reCategory')
      }).then((e) => {
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    // 节点展开
    expandNode (event, tree, nodeData) {
      if (nodeData.children) {
        nodeData.children.forEach((item) => {
          this.ztreeObj.showNode(item)
        })
      } else {
        this.loading = true
      }
    },
    // 未知
    expandedNodes () {
      if (this.rightTableIsTransition === 1) {
        this.$emit('expandedNodes', 1)
      } else {
        this.$emit('expandedNodes', this.flatTreeData(this.ztreeObj.getNodes()).length)
      }
      this.flatData = []
    },
    // filter方法
    filterNode (node) {
      const selfMatch = node.name.includes(this.queryForm.searchKey)
      const childMatch = false
      // 过滤非匹配的值
      return !(this.recursion(node, childMatch) || selfMatch)
    },
    // 子节点匹配 - 递归
    recursion (node, childMatch) {
      if (node.isParent) {
        for (let i = 0; i < node.children.length; i++) {
          if (node.children[i].name.includes(this.queryForm.searchKey)) {
            childMatch = true
            return childMatch
          } else {
            childMatch = this.recursion(node.children[i], childMatch)
          }
        }
      }
      return childMatch
    },
    // 查询
    reSearch () {
      this.activeName = 'group'
      if (this.queryForm.searchKey) {
        const treeObj = $.fn.zTree.getZTreeObj('orgTree')
        const nodes = treeObj.getNodesByParam('isHidden', true)
        treeObj.showNodes(nodes)
        const hiddenNodes = treeObj.getNodesByFilter(this.filterNode)
        treeObj.hideNodes(hiddenNodes)
        treeObj.expandAll(true)
      } else {
        this.initLazyOrgTree()
      }
    },
    // 节点点击事件
    getNodeData (treeId, treeNode, nodeData, clickFlag) {
      this.curType = '-1'
      this.$emit('nodeClick', nodeData, this.activeName)
    },
    // 类型点击事件
    getTypeData (datasetType) {
      this.curType = datasetType
      this.ztreeObj.cancelSelectedNode()
      this.$emit('nodeClick', datasetType, this.activeName)
    },
    // 更多事件
    menuClick (editType) {
      // 删除节点
      if (editType === this.editTypeConstant.deleteOrg) {
        this.deleteOrg(this.rightClickForm.org)
        return
      }
      // 编辑节点
      this.editFormVisible = true
      if (editType === this.editTypeConstant.editOrg) {
        this.$nextTick(() => {
          this.$refs.editForm.tableName = 'r_dataset'
          this.$refs.editForm.dialogFormVisible = true
          this.$refs.editForm.init(this.rightClickForm.org, false)
          this.$refs.editForm.title = '节点编辑'
        })
        return
      }
      // 新增同级节点
      if (editType === this.editTypeConstant.addSiblingOrg) {
        this.$nextTick(() => {
          this.$refs.editForm.tableName = 'r_dataset'
          this.$refs.editForm.dialogFormVisible = true
          this.$refs.editForm.init(this.rightClickForm.org, true)
          this.$refs.editForm.radio = 0
          this.$refs.editForm.title = '节点新增'
        })
        return
      }
      // 新增子节点
      if (editType === this.editTypeConstant.addChildOrg) {
        this.$nextTick(() => {
          this.$refs.editForm.tableName = 'r_dataset'
          this.$refs.editForm.dialogFormVisible = true
          this.$refs.editForm.init(this.rightClickForm.org, true)
          this.$refs.editForm.radio = 1
          this.$refs.editForm.title = '节点新增'
        })
      }
    },
    flatTreeData (data) {
      data.forEach(item => {
        this.flatData.push(item)
        if (item.children) {
          this.flatTreeData(item.children)
        }
      })
      return this.flatData
    },
    // 删除分类
    deleteOrg (org) {
      this.$confirm(
        '删除数据集分类，确定进行删除操作?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'bs-el-message-box'
        }
      ).then(() => {
        if (!org.id) {
          return
        }
        categoryRemove(org.id).then((data) => {
          this.$message.success('操作成功')
          // this.ztreeObj.removeNode(org)
          this.initLazyOrgTree()
          // 刷新右侧表格
          this.$emit('refreshData', org)
        })
      })
    },
    // 刷新右侧表格
    refreshData (cbObj) {
      // 刷新右侧表格
      this.$emit('refreshData', cbObj)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~packages/assets/style/bsTheme.scss';

/deep/ .el-tabs {
  .el-tabs__header {
    margin: 0;

    .el-tabs__nav {
      width: 100%;

      .el-tabs__item {
        color: var(--bs-el-text);
        width: 50%;
        text-align: center;
      }

      .el-tabs__active-bar {
        display: none !important;
      }

      .el-tabs__item.is-active {
        color: var(--bs-el-hover) !important;
        border-bottom-color: var(--bs-el-border-color) !important;
      }
    }
  }
}
 ::v-deep .ztree {
    span {
      color: var(--bs-el-text);
    }

    li:hover {
      background: transparent !important;
      background-color: transparent !important;
    }

    .curSelectedNode {
      background: var(--bs-el-background-3) !important;
      background-color: var(--bs-el-background-3) !important;
    }

    a:hover {
      background: var(--bs-el-background-3) !important;
      background-color: var(--bs-el-background-3) !important;
    }
  }
/deep/ .el-tabs__nav-wrap::after {
  display: none !important;
}

.left-tab-box ul li {
  font-size: 12px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  height: 34px;
  line-height: 40px;
  cursor: pointer;
  padding-left: 20px;
  margin: 2px 0;

  &:hover,
  &.tab-active {
    background-color: #f2f7fe;
  }

  &.tab-active::before {
    content: "";
    height: 34px;
    line-height: 40px;
    position: absolute;
    left: 0;
    border-left: 4px solid var(--bs-el-hover);
  }
}

.ztree-input {
  margin-right: 10px !important;
}

.ztree-box {
  height: 100%;
  overflow: hidden;
}

.el-textarea__inner {
  color: var(--bs-el-text);
  background-color: var(--bs-el-background) !important;
}
</style>
