<template>
  <div>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="180px"
      label-position="left">
      <el-form-item label="源数据库连接信息Id" prop="sourceId">
        <el-input v-model="formData.sourceId" placeholder="请输入源数据库连接信息Id" clearable :style="{width: '70%'}">
        </el-input>
      </el-form-item>
      <el-form-item label="源数据库表名" prop="sourceTable">
        <el-input v-model="formData.sourceTable" placeholder="请输入源数据库表名" clearable :style="{width: '70%'}">
        </el-input>
      </el-form-item>
      <el-form-item label="目标数据库连接信息Id" prop="targetId">
        <el-input v-model="formData.targetId" placeholder="请输入目标数据库连接信息Id" clearable :style="{width: '70%'}">
        </el-input>
      </el-form-item>
      <el-form-item label="目标数据库表名" prop="targetTable">
        <el-input v-model="formData.targetTable" placeholder="请输入目标数据库表名" clearable :style="{width: '70%'}">
        </el-input>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import api from '@/api/system/migrate'

export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        sourceId: undefined,
        sourceTable: undefined,
        targetId: undefined,
        targetTable: undefined,
      },
      rules: {
        sourceId: [{
          required: true,
          message: '请输入源数据库连接信息Id',
          trigger: 'blur'
        }],
        sourceTable: [{
          required: true,
          message: '请输入源数据库表名',
          trigger: 'blur'
        }],
        targetId: [{
          required: true,
          message: '请输入目标数据库连接信息Id',
          trigger: 'blur'
        }],
        targetTable: [{
          required: true,
          message: '请输入源数据库表名',
          trigger: 'blur'
        }],
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      api.migrate(this.formData).then(response => {
        this.$message.success('操作成功')
        this.dialogVisible = false
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
  }
}

</script>
<style>
</style>
