<template>
  <div
    v-loading="saveloading"
    class="inner-container"
    :element-loading-text="saveText"
  >
    <div class="header">
      <el-page-header
        class="bs-el-page-header"
        :content="!isEdit ? '脚本数据集详情' : dataForm.id ? '脚本数据集编辑' : '脚本数据集新增'"
      />
      <el-button
        v-if="isEdit"
        id="search"
        type="primary"
        class="search"
      >
        帮助
      </el-button>
      <el-button
        v-if="isEdit"
        type="primary"
        class="save"
        @click="save('form')"
      >
        保存
      </el-button>
      <el-button
        class="back bs-el-button-default"
        @click="goBack"
      >
        返回
      </el-button>
    </div>
    <el-row style="margin: 16px 16px 0;">
      <el-col :span="isEdit ? 16 : 24">
        <el-form
          ref="form"
          :model="dataForm"
          :rules="rules"
          label-width="120px"
          style="padding: 16px 16px 0;"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="名称"
                prop="name"
              >
                <el-input
                  v-model="dataForm.name"
                  class="bs-el-input"
                  clearable
                  :disabled="!isEdit"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="分组"
                prop="typeId"
              >
                <el-select
                  ref="selectParentName"
                  v-model="dataForm.typeId"
                  class="bs-el-select"
                  popper-class="bs-el-select"
                  clearable
                  :disabled="!isEdit"
                  @clear="clearType"
                  @visible-change="setCurrentNode"
                >
                  <el-option
                    style="height: auto;padding: 0;"
                    :label="typeName"
                    :value="dataForm.typeId"
                  >
                    <div class="tree-box">
                      <el-tree
                        ref="categorySelectTree"
                        :data="categoryData"
                        node-key="id"
                        :indent="0"
                        :props="{ label: 'name', children: 'children' }"
                        :default-expand-all="true"
                        :highlight-current="true"
                        :expand-on-click-node="false"
                        class="bs-theme-wrap bs-el-tree"
                        @node-click="selectParentCategory"
                      >
                        <span
                          slot-scope="{ data }"
                          class="custom-tree-node"
                        >
                          <span>
                            <i :class="data.children && data.children.length ? 'el-icon el-icon-folder': 'el-icon el-icon-document'" />
                            {{ data.name }}
                          </span>
                        </span>
                      </el-tree>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="描述"
                prop="remark"
              >
                <el-input
                  v-model="dataForm.remark"
                  class="bs-el-input"
                  :disabled="!isEdit"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div
          v-if="isEdit"
          class="sql-config"
        >
          <div>
            <codemirror
              ref="targetInSql"
              v-model="dataForm.script"
              :options="cOptions"
              style="margin-top: 2px"
            />
          </div>
          <div style="text-align: center; padding: 16px 0;">
            <el-button
              type="primary"
              @click="toExecute"
            >
              执行
            </el-button>
          </div>
        </div>
      </el-col>
      <el-col
        v-if="isEdit"
        :span="8"
      >
        <div class="right-setting">
          <div class="paramConfig">
            <div class="title-style bs-title-style">
              脚本参数
              <el-button
                type="text"
                style="float: right;border: none;margin-top: -4px;"
                @click="openParamsConfig"
              >
                配置
              </el-button>
            </div>
            <div class="field-wrap bs-field-wrap bs-scrollbar bs-scrollbar-bg-1">
              <div
                v-for="param in dataForm.paramsList"
                :key="param.name"
                class="field-item"
                @click="openParamsConfig"
              >
                <span>{{ param.name }}</span>&nbsp;<span
                  v-show="param.remark"
                  style="color: #909399;"
                >({{ param.remark }})</span>
                <el-button
                  class="edit_field"
                  type="text"
                  style="float: right;border: none;margin-top: 2px;"
                  @click="openParamsConfig"
                >
                  配置
                </el-button>
              </div>
            </div>
          </div>
          <div class="structure">
            <div class="title-style bs-title-style">
              输出字段
              <el-button
                type="text"
                style="float: right;border: none;margin-top: -4px;"
                @click="fieldsetVisible = true"
              >
                配置
              </el-button>
            </div>
            <div class="field-wrap bs-field-wrap bs-scrollbar bs-scrollbar-bg-1">
              <div
                v-for="field in structurePreviewList"
                :key="field.columnName"
                class="field-item"
                @click="fieldsetVisible = true"
              >
                <span>{{ field.columnName }}</span>&nbsp;<span
                  v-show="field.fieldDesc"
                  style="color: #909399;"
                >({{ field.fieldDesc }})</span>
                <el-button
                  class="edit_field"
                  type="text"
                  style="float: right;border: none;margin-top: 2px;"
                  @click="fieldsetVisible = true"
                >
                  配置
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div
      v-if="isEdit"
      class="dataPreView"
      style="margin-top: 12px;"
    >
      <div class="result-view">
        数据预览
      </div>
      <div
        v-loading="tableLoading"
        class="bs-table-box is-Edit bs-scrollbar"
      >
        <el-table
          align="center"
          :data="dataPreviewList"
          max-height="400"
          :border="true"
          class="bs-el-table bs-scrollbar"
        >
          <el-table-column
            v-for="(value, key) in dataPreviewList[0]"
            :key="key"
            :label="key"
            align="center"
            show-overflow-tooltip
            :render-header="renderHeader"
          >
            <template slot-scope="scope">
              <span>{{ scope.row[key] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div
      v-if="!isEdit"
      class="dataPreView"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-loading="tableLoading"
          label="数据预览"
          name="data"
        >
          <div class="bs-table-box">
            <el-table
              align="center"
              :data="dataPreviewList"
              max-height="400"
              :border="true"
              class="bs-el-table"
            >
              <el-table-column
                v-for="(value, key) in dataPreviewList[0]"
                :key="key"
                :label="key"
                align="center"
                show-overflow-tooltip
                :render-header="renderHeader"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row[key] }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-loading="tableLoading"
          label="数据集结构"
          name="structure"
        >
          <div class="bs-table-box">
            <el-table
              max-height="400"
              :data="structurePreviewList"
              :border="true"
              align="center"
            >
              <el-table-column
                align="center"
                show-overflow-tooltip
                prop="columnName"
                label="字段值"
              />
              <el-table-column
                align="center"
                prop="fieldDesc"
                label="字段描述"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="isEdit"
                    v-model="scope.row.fieldDesc"
                    size="small"
                    class="labeldsc bs-el-input"
                  />
                  <span v-else>{{ scope.row.fieldDesc }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 字段填充方式 -->
    <el-dialog
      title="提示"
      :visible.sync="fieldDescVisible"
      width="420px"
      append-to-body
      :close-on-click-modal="false"
      custom-class="fieldDescCheck"
      class="bs-dialog-wrap"
    >
      <p style="line-height: 24px;padding-left: 10px;display: flex;">
        <i
          class="el-icon-warning"
          style="color: #E6A23C;font-size: 24px;margin-right: 5px;"
        />存在字段描述信息为空，请确认
      </p>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="fieldDescFill">使用字段名填充</el-button>
        <el-button @click="fieldDescEdit">进入编辑</el-button>
        <el-button
          type="primary"
          @click="toSave"
        >继续保存</el-button>
      </span>
    </el-dialog>
    <!-- 字段填充 -->
    <el-dialog
      title="输出字段配置"
      :visible.sync="fieldsetVisible"
      width="1000px"
      append-to-body
      :close-on-click-modal="false"
      :before-close="cancelField"
      class="bs-dialog-wrap bs-el-dialog"
    >
      <div class="bs-table-box">
        <el-table
          max-height="350"
          :data="structurePreviewListCopy"
          :border="true"
          align="center"
          class="bs-el-table"
        >
          <el-empty slot="empty" />
          <el-table-column
            align="left"
            show-overflow-tooltip
            prop="columnName"
            label="字段值"
          />
          <el-table-column
            align="center"
            prop="fieldDesc"
            label="字段描述"
          >
            <template slot-scope="scope">
              <el-input
                v-if="isEdit"
                v-model="scope.row.fieldDesc"
                size="small"
                class="labeldsc bs-el-input"
              />
              <span v-else>{{ scope.row.fieldDesc }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="bs-el-button-default"
          @click="cancelField"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="setField"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
    <!-- 参数配置 -->
    <el-dialog
      title="脚本参数配置"
      :visible.sync="paramsVisible"
      width="1000px"
      append-to-body
      :close-on-click-modal="false"
      :before-close="cancelParam"
      class="bs-dialog-wrap"
    >
      <div class="bs-table-box">
        <el-table
          ref="singleTable"
          :data="paramsListCopy"
          :border="true"
          align="center"
          class="bs-el-table"
        >
          <el-empty slot="empty" />
          <el-table-column
            prop="name"
            label="参数名称"
            align="center"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.name"
                class="bs-el-input"
                :disabled="!isSet"
                placeholder="请输入名称"
                clearable
                @change="checkParamsName(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="参数类型"
            align="center"
            width="200"
            filterable
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.type"
                popper-class="bs-el-select"
                class="bs-el-select"
                placeholder="请选择"
                :disabled="!isSet"
              >
                <el-option
                  v-for="item in typeSelect"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="require"
            label="是否必填"
            align="center"
            width="200"
            filterable
          >
            <template slot-scope="scope">
              <el-radio-group
                v-model="scope.row.require"
                :disabled="!isSet"
              >
                <el-radio :label="1">
                  是
                </el-radio>
                <el-radio :label="0">
                  否
                </el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column
            prop="value"
            label="参数值"
            align="center"
          >
            <template slot-scope="scope">
              <el-date-picker
                v-if="scope.row.type==='Date'"
                v-model="scope.row.value"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              />
              <el-input
                v-else
                v-model="scope.row.value"
                class="bs-el-input"
                clearable
                placeholder="请输入值"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            align="center"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.remark"
                :disabled="!isSet"
                clearable
                class="bs-el-input"
                placeholder="请输入备注"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-if="isSet"
            label="操作"
            width="105"
            align="center"
          >
            <template slot="header">
              <el-button
                icon="el-icon-plus"
                type="text"
                class="no-border"
                @click="addParam"
              >
                添加
              </el-button>
            </template>
            <template slot-scope="scope">
              <el-button
                type="text"
                style="color: #e47470;"
                class="no-border"
                @click="delRow(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="bs-el-button-default"
          @click="cancelParam"
        >取消</el-button>
        <el-button
          type="primary"
          @click="setParam"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { nameCheckRepeat, getDatasetTypeList, datasetAddorUpdate, getDataset, datasetExecute } from 'packages/js/utils/datasetConfigService'
import { codemirror } from 'vue-codemirror'
// import 'codemirror/mode/sql/sql.js'
import 'codemirror/mode/groovy/groovy'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/nord.css'
import _ from 'lodash'
export default {
  components: {
    codemirror
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    datasetId: {
      type: String,
      default: null
    },
    datasetName: {
      type: String,
      default: ''
    },
    typeId: {
      type: String,
      default: ''
    },
    appCode: {
      type: String,
      default: ''
    }
  },
  data () {
    const validateName = (rule, value, callback) => {
      nameCheckRepeat({
        id: this.datasetId,
        name: value,
        moduleCode: this.appCode
      }).then((r) => {
        if (r) {
          callback(new Error('数据集名称已存在'))
        } else {
          callback()
        }
      })
    }
    return {
      dataForm: {
        id: '',
        name: '',
        typeId: '',
        remark: '',
        script: '',
        paramsList: []
      },
      rules: {
        name: [
          { required: true, message: '请输入数据集名称', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ]
        // typeId: [
        //   {required: true, message: '请选择分组', trigger: 'blur'}
        // ]
      },
      cOptions: {
        mode: 'text/x-groovy',
        lineNumbers: true,
        lineWrapping: true,
        theme: 'nord',
        extraKey: { Ctrl: 'autocomplete' },
        hintOptions: {
          completeSingle: true
        }
      },
      activeName: 'data',
      dataPreviewList: [],
      structurePreviewList: [],
      structurePreviewListCopy: [],
      typeSelect: [{
        value: 'String'
      }, {
        value: 'Integer'
      }, {
        value: 'Double'
      }, {
        value: 'Long'
      }, {
        value: 'Date'
      }],
      typeName: '',
      categoryData: [],
      fieldDescVisible: false,
      fieldsetVisible: false,
      paramsVisible: false,
      tableLoading: false,
      saveloading: false,
      saveText: '',
      paramsListCopy: [],
      isSet: false, // 参数是否配置状态
      passTest: false,
      fieldDesc: null // 字段描述
    }
  },
  watch: {
    'dataForm.script' () {
      this.passTest = false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 保存数据集
    save (formName, nochecktosave = false) {
      if (this.passTest === false) {
        this.$message.error('请确保脚本不为空且执行通过')
        return
      }
      if (!this.structurePreviewList.length) {
        this.$message.warning('该执行脚本未生成输出字段，请重新检查')
        return
      }
      if (!nochecktosave) {
        const temp = this.structurePreviewList.some(item => {
          return item.fieldDesc === '' || !item.hasOwnProperty('fieldDesc')
        }) // true-存在为空
        if (temp) {
          this.fieldDescVisible = true
          return
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dataForm.paramsList.length > 0) {
            const names = this.dataForm.paramsList.map(value => value.name)
            const namesSet = new Set(names)
            if (namesSet.size !== names.length) {
              this.$message.error('参数名称不能重复，请重新输入')
              return
            }
          }
          this.saveloading = true
          this.saveText = '正在保存...'
          const data = {
            script: this.dataForm.script,
            fieldDesc: this.fieldDesc,
            paramsList: this.dataForm.paramsList
          }
          datasetAddorUpdate({
            id: this.datasetId,
            name: this.dataForm.name,
            typeId: this.dataForm.typeId,
            remark: this.dataForm.remark,
            datasetType: 'script',
            moduleCode: this.appCode,
            editable: this.appCode ? 1 : 0,
            data: JSON.stringify(data)
          }).then(() => {
            this.$message.success('保存成功')
            this.$parent.init(false)
            this.$parent.setType = null
            this.saveloading = false
            this.saveText = ''
          }).catch(() => {
            this.saveloading = false
            this.saveText = ''
          })
        } else {
          return false
        }
      })
    },
    // 取消操作
    cancelField () {
      this.structurePreviewListCopy = _.cloneDeep(this.structurePreviewList)
      this.fieldsetVisible = false
    },
    // 设置输出字段
    setField () {
      this.structurePreviewList = _.cloneDeep(this.structurePreviewListCopy)
      if (this.structurePreviewList.length) {
        this.fieldDesc = {}
        this.structurePreviewList.forEach(key => {
          this.fieldDesc[key.columnName] = key.fieldDesc
        })
      } else {
        this.fieldDesc = null
      }
      this.fieldsetVisible = false
    },
    // 字段值填充
    fieldDescFill () {
      this.fieldDesc = {}
      this.structurePreviewList.forEach(field => {
        if (field.fieldDesc === '' || !field.hasOwnProperty('fieldDesc')) {
          field.fieldDesc = field.columnName
          this.fieldDesc[field.columnName] = field.columnName
        } else {
          this.fieldDesc[field.columnName] = field.fieldDesc
        }
      })
      this.save('form')
      this.fieldDescVisible = false
    },
    // 进入编辑
    fieldDescEdit () {
      this.fieldDescVisible = false
      this.fieldsetVisible = true
    },
    // 继续保存
    toSave () {
      this.fieldDesc = {}
      this.structurePreviewList.forEach(field => {
        this.fieldDesc[field.columnName] = field.fieldDesc
      })
      this.save('form', true)
      this.fieldDescVisible = false
    },
    // 字段描述构建及同步
    buildFieldDesc () {
      const fieldDesc = {}
      this.structurePreviewList.forEach(field => {
        if (this.fieldDesc.hasOwnProperty(field.columnName)) {
          field.fieldDesc = this.fieldDesc[field.columnName]
        }
        fieldDesc[field.columnName] = field.fieldDesc
      })
      this.fieldDesc = fieldDesc
    },
    // 脚本执行
    scriptExecute (isInit = false) {
      const data = {
        script: this.dataForm.script,
        fieldDesc: this.fieldDesc,
        paramsList: this.paramsListCopy
      }
      this.saveloading = true
      datasetExecute({
        params: this.paramsListCopy,
        dataSetType: 'script',
        data: JSON.stringify(data)
      }).then(res => {
        if (!isInit) {
          this.$message.success('脚本执行通过')
        }
        this.dataPreviewList = res.length ? res : []
        this.structurePreviewList = []
        if (res.length) {
          this.structurePreviewList = Object.keys(res[0]).map(item => {
            return {
              columnName: item,
              fieldDesc: ''
            }
          })
        }
        if (this.structurePreviewList.length && this.fieldDesc) {
          this.buildFieldDesc()
        }
        this.structurePreviewListCopy = _.cloneDeep(this.structurePreviewList)
        this.saveloading = false
        this.passTest = true
      }).catch(() => {
        this.passTest = false
        this.saveloading = false
      })
    },
    // 执行事件
    toExecute () {
      if (this.dataForm.paramsList.length) {
        this.isSet = false
        this.paramsVisible = true
      } else {
        // 无参数，直接执行脚本
        this.scriptExecute()
      }
    },
    // 脚本参数配置
    openParamsConfig () {
      this.isSet = true
      this.paramsVisible = true
    },
    // 取消操作
    cancelParam () {
      this.paramsListCopy = _.cloneDeep(this.dataForm.paramsList)
      this.paramsVisible = false
    },
    // 设置脚本参数
    setParam () {
      if (!this.isSet) {
        this.scriptExecute()
        this.paramsListCopy = _.cloneDeep(this.dataForm.paramsList)
      } else {
        this.dataForm.paramsList = _.cloneDeep(this.paramsListCopy)
      }
      this.paramsVisible = false
    },
    // 清空分类
    clearType () {
      this.typeName = ''
      this.dataForm.typeId = ''
    },
    // 分类展开高亮
    setCurrentNode ($event) {
      if ($event) {
        const key = this.dataForm.typeId || null
        this.$refs.categorySelectTree.setCurrentKey(key)
      }
    },
    // 分类选择
    selectParentCategory (value) {
      this.dataForm.typeId = value.id
      this.typeName = value.name
      this.$refs.selectParentName.blur()
    },
    // 获取树节点
    // getTreeList() {
    //   getOriginalTableList().then(res => {
    //     this.categoryData = res
    //   })
    // },
    // 校验名称【参数名称不能与字段名重复】
    checkParamsName (value) {
      const checkList = this.structurePreviewList.filter(item => item.columnName === value.name)
      if (checkList.length) {
        this.$message.warning('参数名称不可以与字段名相同！')
        value.name = ''
      }
    },
    // 删除参数配置
    delRow (index) {
      this.paramsListCopy.splice(index, 1)
    },
    // 新增参数配置
    addParam () {
      this.paramsListCopy.push({
        name: '',
        type: '',
        value: '',
        status: 1,
        require: 0,
        remark: ''
      })
    },
    goBack () {
      this.$emit('back')
    },
    async init () {
      this.categoryData = await getDatasetTypeList({ tableName: 'r_dataset', moduleCode: this.appCode })
      if (this.typeId) {
        this.dataForm.typeId = this.typeId
        this.$nextTick(() => {
          try {
            this.typeName = this.$refs.categorySelectTree.getNode(this.dataForm.typeId).data.name
          } catch (error) {
            console.error(error)
          }
        })
      }
      if (this.datasetId) {
        getDataset(this.datasetId).then(res => {
          this.dataForm.id = res.id
          const data = JSON.parse(res.data)
          this.dataForm.name = res.name
          this.dataForm.typeId = res.typeId
          this.dataForm.remark = res.remark
          this.dataForm.script = data.script
          this.dataForm.paramsList = data.paramsList
          this.paramsListCopy = _.cloneDeep(this.dataForm.paramsList)
          this.fieldDesc = data.fieldDesc
          this.scriptExecute(true)
        })
      }
    },
    renderHeader (h, { column, index }) {
      const labelLong = column.label.length // 表头label长度
      const size = 14 // 根据需要定义标尺，直接使用字体大小确定就行，也可以根据需要定义
      column.minWidth = labelLong * size < 120 ? 120 : labelLong * size // 根据label长度计算该表头最终宽度
      return h('span', { class: 'cell-content', style: { width: '100%' } }, [column.label])
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~packages/assets/style/bsTheme.scss';
.tree-box {
  padding: 0;
  max-height: 270px;
}
/deep/ .el-input__inner {
  width: 100% !important;
}
.header {
  position: relative;
  .search {
    position: absolute;
    right: 124px;
    top: 16px;
    display: none;
  }
  .save {
    position: absolute;
    right: 86px;
    top: 16px;
  }
  .back {
    position: absolute;
    right: 16px;
    top: 16px;
  }
}
.sql-config {
  padding: 0 16px;
}
.operation {
  /deep/ .el-select {
    width: 200px !important;
    margin-right: 16px;
  }
  display: flex;
}
// .codeStyle {
//   border: 1px solid #EBEEF5;
// }
/deep/ .CodeMirror {
  height: 180px !important;
  font-family: Helvetica, Tahoma;
  // .CodeMirror-scroll {
  //   background: #fff;
  //   .CodeMirror-gutters {
  //     background: #f6f7fb;
  //   }
  // }
}
.no-border {
  border: 0;
}
/deep/ .fieldDescCheck {
  .el-dialog__body {
    height: fit-content !important;
    min-height: unset !important;
  }
}
.title-style {
  padding: 8px 12px;
  background-color: #f6f7fb;
  border-left: 5px solid var(--bs-el-hover);
  margin: 16px 16px 0 0;
}
.field-wrap {
  // max-height: 110px;
  overflow: auto;
  margin-right: 16px;
  cursor: pointer;
  .field-item {
    line-height: 32px;
    padding: 0 12px 0 16px;
    .edit_field {
      display: none;
    }
    &:hover {
      background-color: #f2f7fe;
      .edit_field {
        display: block;
      }
    }
  }
}
.right-setting {
  height: 358px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .paramConfig {
    max-height: 179px;
    .field-wrap {
      max-height: 127px;
    }
  }
  .structure {
    flex: 1;
    overflow: hidden;
    .field-wrap {
      height: calc(100% - 40px);
    }
  }
}

.result-view {
  font-size: 14px;
  font-weight: 600;
  color: var(--bs-el-text);
  position: relative;
  padding: 16px 0;
  padding-left: 12px;
  border-bottom: 1px solid var(--bs-background-1);
  &::before {
    content: "";
    height: 14px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    border-left: 4px solid var(--bs-el-hover);
  }
}
/deep/ .bs-table-box.is-Edit .el-table {
  max-height: unset !important;
  .el-table__body-wrapper {
    max-height: unset !important;
  }
}
.bs-table-box{
  height: 100% !important;
}
</style>
