<template>
  <d2-container ref="container">
    <el-card>
      <el-row>
        <el-button size="small" type="primary" @click="handleAdd">新增</el-button>
      </el-row>
    </el-card>
    <el-card>
      <el-table
        stripe
        :height="tableHeight"
        :data="dataList"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          v-if="batchOptions.length > 0"
          type="selection"
          width="55">
        </el-table-column>
          <el-table-column
            prop="id"
            label="赛事id">
          </el-table-column>
          <el-table-column
            prop="updated_at"
            label="配置时间">
            <template slot-scope="scope">{{scope.row.created_stamp | time_hms_filter}}</template>
          </el-table-column>
          <el-table-column
            prop="href"
            label="链接">
          </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button
              v-if="config.editFlag"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              v-else
              size="mini"
              type="danger"
              disabled
              @click="handleDelete(scope.$index, scope.row)">已禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="m-t-20"
        ref="pagination"
        background
        layout="prev, pager, next"
        :current-page.sync="page"
        :page-size="page_size"
        @current-change="handleCurrentChange"
        :total="total">
      </el-pagination>
    </el-card>
  </d2-container>
</template>
<script>
export default {
  data () {
    return {
      tableHeight: 0,
      config: { searchFlag: false, editFlag: true, deleteFlag: true },
      dataList: [],
      total: 0,
      page_size: 20,
      page: 1,
      apiPath: '/api/admin/banner/',
      batchOptions: [
        // 通过Banner
        // { label: '删除', value: 'delete' }
      ],
      batchOption: '',
      multipleSelection: [],
      search: {},
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight = this.$op.setTableHeight(this)
      window.onresize = () => {
        this.tableHeight = this.$op.setTableHeight(this)
      }
    })
  },
  created () {
    this.getList()
  },
  methods: {
    getList (page = 1) {
      this.page = page || this.page_size
      let search = this.$op.changeSearch(this.search)
      this.$axios({
        method: 'get',
        url: this.apiPath,
        params: {
          ...search,
          page: page || this.page,
          page_size: this.page_size
        }
      }).then(result => {
        console.log('get list result', result)
        this.dataList = result.results
        this.total = result.count
      })
    },
    doBatchOption () {
      console.log('批量执行', this.batchOption, this.multipleSelection)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleEdit (index, row) {
      console.log('当前路径', this.$route)
      const path = `${this.$route.path}/${row.id}/edit`
      console.log('edit path', path)
      this.$router.push({ path })
    },
    handleAdd () {
      this.$router.push('/banner-add')
    },
    async handleDelete (index, row) {
      console.log('删除行：', index, row)
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch (e) {
        this.$notify({
          title: '取消',
          message: '已取消删除',
          type: 'info'
        })
        return
      }

      await this.$axios({
        method: 'delete',
        url: `${this.apiPath}/${row.id}/`
      })
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success'
      })
      this.getList(this.page)
    },
    handleCurrentChange (page) {
      console.log('handleCurrentChange', page)
      this.getList(page)
    }
  }
}
</script>
