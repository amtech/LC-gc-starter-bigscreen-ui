<template>
  <el-dialog
    width="500px"
    :title="title"
    class="bs-dialog-wrap dialogClass bs-el-dialog"
    :visible.sync="dialogFormVisible"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <div style="margin: 20px;">
      <el-form
        ref="ruleForm"
        :model="dataForm"
        :rules="rules"
        label-position="left"
        label-width="90px"
      >
        <el-form-item
          label="节点名称"
          prop="name"
        >
          <el-input
            v-model="dataForm.name"
            class="bs-el-input"
            clearable
          />
        </el-form-item>
      </el-form>
    </div>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="bs-el-button-default"
        @click="cancel"
      >取消</el-button>
      <el-button
        type="primary"
        @click="submitForm('ruleForm')"
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addOrUpdateTree } from 'packages/js/utils/datasetConfigService'
export default {
  name: 'OriginalTableCategory',
  props: {
    appCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tableName: '',
      dataForm: {
        id: '',
        name: '',
        parentId: ''
      },
      title: '',
      dialogFormVisible: false,
      radio: 0,
      nodeFlag: false,
      rules: {
        name: [
          { required: true, message: '节点名称不能为空', trigger: 'blur' }
        ]
      },
      nodeData: {}
    }
  },
  watch: {
    dialogFormVisible (val) {
      if (!val) {
        this.dataForm = {
          id: '',
          name: '',
          parentId: ''
        }
      }
    }
  },
  methods: {
    init (row, flag) {
      this.nodeFlag = flag
      this.nodeData = row
      if (!flag) {
        this.dataForm.name = row.name
        this.dataForm.id = row.id
      }
    },
    cancel () {
      this.dialogFormVisible = false
      this.$nextTick(() => {
        this.$parent.addOrUpdateTreeVisible = false
      })
    },
    handleClose () {
      this.dialogFormVisible = false
      this.$parent.addOrUpdateTreeVisible = false
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let id = ''
          let parentId = ''

          if (this.nodeFlag) {
            // 新增节点
            if (this.radio === 0) {
              // 新增同级
              parentId = this.nodeData.parentId
            } else {
              // 新增子级
              parentId = this.nodeData.id
            }
          } else {
            // 修改节点
            id = this.dataForm.id
            parentId = this.nodeData.parentId
          }

          const params = {
            id: id,
            name: this.dataForm.name,
            parentId: parentId,
            tableName: this.tableName,
            moduleCode: this.appCode
          }
          addOrUpdateTree(params).then((r) => {
            this.$message.success('保存成功')
            this.cancel()
            try {
              this.$parent.init()
            } catch (error) {
              this.$parent.initLazyOrgTree()
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
