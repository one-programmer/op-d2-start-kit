<template>
  <d2-container ref="container">
    <el-card ref="searchBox" class="search-box">
      <el-row>
        <el-form :inline="true">
          <el-form-item>
            <el-cascader
              v-model="area"
              :options="areaData"
              :props="areaProps"
              change-on-select
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="赛事名称" v-model="search.name__icontains" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="search.end_time__gte" type="date" placeholder="选择赛事时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">搜索</el-button>
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
            prop="name"
            label="赛事名称">
          </el-table-column>
          <el-table-column
            label="赛事结果">
            <template slot-scope="scope">{{scope.row.status | game_status_filter}}</template>
          </el-table-column>
          <el-table-column
            label="赛事时间">
            <template slot-scope="scope">{{scope.row.created_stamp | time_hms_filter}}</template>
          </el-table-column>
        <el-table-column label="操作" width="350px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleSeeDetail(scope.$index, scope.row)">查看详情</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleEdit(scope.$index, scope.row)">配置直播</el-button>
            <template v-if="scope.row.game_settings">
              <el-button
                v-if="!scope.row.game_settings.is_show"
                size="mini"
                type="danger"
                @click="handleEnable(scope.$index, scope.row)">禁用</el-button>
              <el-button
                v-else
                size="mini"
                type="warning"
                @click="handleEnable(scope.$index, scope.row)">启用</el-button>
            </template>
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
import dayjs from 'dayjs'
import areaData from '../../assets/json/area.js'
export default {
  data () {
    return {
      areaProps: {
        value: 'label'
      },
      area: [],
      tableHeight: 0,
      config: { searchFlag: false, editFlag: true, deleteFlag: true },
      dataList: [],
      total: 0,
      page_size: 20,
      page: 1,
      apiPath: '/api/admin/basketball/',
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
  async created () {
    this.areaData = areaData
    this.getList()
  },
  methods: {
    getList (page = 1) {
      this.search.end_time__lte = this.search.end_time__gte && dayjs(this.search.end_time__gte).add(1, 'day').toDate()
      this.search.province = this.area[0] || ''
      this.search.city = this.area[1] || ''
      this.search.district = this.area[2] || ''

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
      let path = `${this.$route.path}/${row.id}/edit`
      let query = {type: 'create'}
      // 更新配置
      if (row.game_settings) {
        path = `${this.$route.path}/${row.game_settings.id}/edit`
        query = {type: 'edit'}
      }
      console.log('edit path', path)
      this.$router.push({ path, query })
    },
    handleSeeDetail (index, row) {
      const path = `${this.$route.path}/${row.id}/details`
      this.$router.push({ path })
    },

    async handleEnable (index, row) {
      const path = `/api/admin/game_settings/`
      if (row.game_settings.is_show) {
        await this.$axios({
          method: 'post',
          url: `${path}${row.game_settings.id}/hide/`,
        })
      } else {
        await this.$axios({
          method: 'post',
          url: `${path}${row.game_settings.id}/show/`,
        })
      }
      this.getList()
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
    },
  }
}
</script>
