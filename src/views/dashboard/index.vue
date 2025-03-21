<template>
  <div class="app-container">

    <!-- 原有代码完全保留 -->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        
      </el-form>
    </div>

    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;">

      <!-- 原有表格列完全保留 -->
      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="courseName" label="课程名称" />
      <el-table-column prop="coverUrl" label="课程封面" />
      <el-table-column prop="description" label="课程描述" />
      <el-table-column prop="viewCount" label="浏览量" />

      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.courseId)" title="修改"/>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.courseId)" title="删除" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 原有分页组件完全保留 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />

    <!-- 新增添加课程弹窗 -->
    <el-dialog 
      title="添加课程" 
      :visible.sync="addDialogVisible" 
      width="30%"
      @closed="handleAddClose">
      <el-form ref="addForm" :model="addForm" label-width="100px" size="small">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="addForm.courseName"/>
        </el-form-item>
        <el-form-item label="课程描述" prop="description">
          <el-input type="textarea" rows="2" v-model="addForm.description"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleAddSubmit" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改原有弹窗为编辑弹窗 -->
    <el-dialog 
      title="修改课程" 
      :visible.sync="editDialogVisible" 
      width="40%"
      @closed="handleEditClose">
      <el-form ref="editForm" :model="editForm" label-width="100px" size="small" style="padding-right: 40px;">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="editForm.courseName"/>
        </el-form-item>
        <el-form-item label="课程封面" prop="coverUrl">
          <el-input v-model="editForm.coverUrl"/>
        </el-form-item>
        <el-form-item label="课程描述" prop="description">
          <el-input type="textarea" rows="2" v-model="editForm.description"/>
        </el-form-item>
        <el-form-item label="浏览量" prop="viewCount">
          <el-input v-model="editForm.viewCount" disabled/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleEditSubmit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/system/courseManage'

// 完全保留原有默认表单结构
const defaultForm = {
  courseId: '',
  courseName: '',
  coverUrl: '',
  description: '',
  viewCount: ''
}

export default {
  data() {
    return {
      // 完全保留原有数据属性
      listLoading: true,
      list: null,
      total: 0,
      page: 1,
      limit: 5,
      searchObj: {},
      createTimes: [],
      saveBtnDisabled: false,

      // 新增弹窗控制属性
      addDialogVisible: false,
      editDialogVisible: false,

      // 新增表单数据
      addForm: {
        courseName: '',
        description: ''
      },
      editForm: { ...defaultForm }
    }
  },

  // 完全保留原有生命周期钩子
  created() {
    console.log('list created......')
    this.fetchData()
  },

  mounted() {
    console.log('list mounted......')
  },

  methods: {
    // 完全保留原有方法
    fetchData(page = 1) {
      debugger
      this.page = page
      if(this.createTimes && this.createTimes.length ==2) {
        this.searchObj.createTimeBegin = this.createTimes[0]
        this.searchObj.createTimeEnd = this.createTimes[1]
      }

      api.getPageList(this.page, this.limit, this.searchObj).then(
        response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }
      )
    },

    resetData() {
      console.log('重置查询表单')
      this.searchObj = {}
      this.createTimes = []
      this.fetchData()
    },

    removeDataById(courseId) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return api.removeById(courseId)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message || '删除成功')
      }).catch(() => {
         this.$message.info('取消删除')
      })
    },

    // 修改原有方法
    add() {
      this.addDialogVisible = true
    },

    edit(courseId) {
      this.editDialogVisible = true
      api.getById(courseId).then(response => {
        this.editForm = response.data
      })
    },

    // 新增表单处理方法
    handleAddSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          api.save(this.addForm).then(() => {
            this.$message.success('添加成功')
            this.addDialogVisible = false
            this.fetchData()
          })
        }
      })
    },

    handleEditSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          api.updateById(this.editForm).then(() => {
            this.$message.success('修改成功')
            this.editDialogVisible = false
            this.fetchData(this.page)
          })
        }
      })
    },

    // 保留原有保存方法（根据需求可选）
    save() {
      api.save(this.course).then(response => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },

    // 新增弹窗关闭处理
    handleAddClose() {
      this.$refs.addForm.resetFields()
      this.addForm = { courseName: '', description: '' }
    },

    handleEditClose() {
      this.$refs.editForm.resetFields()
      this.editForm = { ...defaultForm }
    }
  }
}
</script>

<!-- 完全保留原有样式 -->
<style lang="scss">
.app-container {
  .search-div {
    margin-bottom: 20px;
  }
  .tools-div {
    margin-bottom: 10px;
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>