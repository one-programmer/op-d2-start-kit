<template>
  <d2-container ref="container">
    <el-card ref="searchBox" class="search-box">
      <el-row>
        <el-form :inline="true">
          <el-form-item>
            <el-input placeholder="省" v-model="search.province__icontains" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="市" v-model="search.city__icontains" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="区" v-model="search.area__icontains" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="赛事名称" v-model="search.search_match_name__icontains" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="search.search_match_time__gte" type="date" placeholder="选择赛事时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleSearch()">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row v-if="batchOptions.length > 0">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="批量">
            <el-select v-model="batchOption" placeholder="请选择">
              <el-option
                v-for="item in batchOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="doBatchOption">执行</el-button>
          </el-form-item>
        </el-form>
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
            prop="match_name"
            label="赛事名称">
          </el-table-column>
          <el-table-column
            prop="staff_id"
            label="赛事结果">
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="赛事时间">
          </el-table-column>
        <el-table-column label="操作" width="350px">
          <template slot-scope="scope">
            <el-button
              v-if="config.editFlag"
              size="mini"
              @click="handleSeeDetail(scope.$index, scope.row)">查看详情</el-button>
            <el-button
              v-if="config.editFlag"
              size="mini"
              type="danger"
              @click="handleEdit(scope.$index, scope.row)">配置直播</el-button>
            <el-button
              v-if="config.editFlag"
              size="mini"
              @click="handleEnable(scope.$index, scope.row)">启用</el-button>
            <el-button
              v-else
              size="mini"
              type="danger"
              @click="handleProhibit(scope.$index, scope.row)">禁用</el-button>
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
      apiPath: '/api/match',
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
    handleSearch () {
      // 加搜索功能
    },
    doBatchOption () {
      console.log('批量执行', this.batchOption, this.multipleSelection)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleEdit (index, row) {
      const path = `${this.$route.path}/${row.id}/edit`
      console.log('edit path', path)
      this.$router.push({ path })
    },
    handleSeeDetail (index, row) {
      const path = `${this.$route.path}/${row.id}/edit?detail=detail`
      this.$router.push({ path })
    },
    handleEnable (index, row) {
      this.$message({
        message: '启用成功',
        type: 'success'
      })
    },
    handleProhibit (index, row) {
      this.$message({
        message: '已禁用',
        type: 'warning'
      })
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
