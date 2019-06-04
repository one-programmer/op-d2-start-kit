<template>
  <d2-container ref="container">
    <el-card class="m-b-20">
      <el-radio-group v-model="user_type">
        <el-radio-button label="认证用户"></el-radio-button>
        <el-radio-button label="白名单用户"></el-radio-button>
      </el-radio-group>
    </el-card>
    <div v-if="this.user_type === '白名单用户'">
      <el-card ref="searchBox" class="search-box flex-j-end">
        <el-row>
          <el-form :inline="true">
            <el-form-item>
              <el-input placeholder="姓名" v-model="search.real_name__icontains" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="getList(1)">搜索</el-button>
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
              label="ID">
            </el-table-column>
            <el-table-column
              prop="organization_name"
              label="机构名字">
            </el-table-column>
            <el-table-column
              prop="real_name"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="手机号">
            </el-table-column>
            <el-table-column
              prop="organization_location"
              label="机构地址">
            </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                v-if="!scope.row.has_ban"
                size="mini"
                type="danger"
                @click="handleEnable(1, scope.row.id)">禁用</el-button>
              <el-button
                v-else
                size="mini"
                type="warning"
                @click="handleEnable(2, scope.row.id)">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="m-t-20"
          background
          layout="prev, pager, next"
          :current-page.sync="page"
          :page-size="page_size"
          @current-change="handleCurrentChange"
          :total="total">
        </el-pagination>
      </el-card>
    </div>
    <!-- 认证用户 -->
    <div v-else>
      <el-card ref="searchBoxGal" class="search-box flex-j-end">
        <el-row>
          <el-form :inline="true">
            <el-form-item class="user_status">
              <el-select v-model="searchGal.verified_status" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="昵称" v-model="searchGal.nickname__icontains" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="getListGal(1)">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </el-card>
      <el-card>
        <el-table
          stripe
          :height="tableHeightGal"
          :data="dataListGal"
          @selection-change="handleSelectionChangeGal"
          style="width: 100%">
          <el-table-column
            v-if="batchOptionsGal.length > 0"
            type="selection"
            width="55">
          </el-table-column>
            <el-table-column
              prop="id"
              label="ID">
            </el-table-column>
            <el-table-column
              prop="nickname"
              label="昵称">
            </el-table-column>
            <el-table-column
              prop="real_name"
              label="真实姓名">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="手机号">
            </el-table-column>
            <el-table-column
              prop="wechat"
              label="社交账号">
            </el-table-column>
            <el-table-column label="审核" width="150px">
            <!-- verified_status: (1, "未提交认证申请"), (2, "认证中"), (3, "认证通过"), (4, "认证失败") -->
              <template slot-scope="slot">
                <template v-if="slot.row.verified_status === 2">
                  <el-button
                    size="mini"
                    @click="handleVerify(1, slot.row.id)">审核</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleVerify(2, slot.row.id)">拒绝</el-button>
                </template>
                <el-tag v-if="slot.row.verified_status === 3" type="success">已通过</el-tag>
                <el-tag v-if="slot.row.verified_status === 4" type="danger">已拒绝</el-tag>
              </template>
            </el-table-column>
          <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEditGal(scope.$index, scope.row)">编辑</el-button>
              <el-button
                v-if="!scope.row.has_ban"
                size="mini"
                type="danger"
                @click="handleEnable(1, scope.row.id)">禁用</el-button>
              <el-button
                v-else
                size="mini"
                type="warning"
                @click="handleEnable(2, scope.row.id)">启用</el-button>
              <el-button
                v-if="!scope.row.is_white_list"
                size="mini"
                type="warning"
                @click="handleAddWhite(scope.$index, scope.row)">加入白名单</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="m-t-20"
          background
          layout="prev, pager, next"
          :current-page.sync="pageGal"
          :page-size="page_sizeGal"
          @current-change="handleCurrentChangeGal"
          :total="totalGal">
        </el-pagination>
      </el-card>
    </div>
  </d2-container>
</template>
<script>
export default {
  data () {
    return {
      options: [{
        value: '2',
        label: '待审核'
      }, {
        value: '3',
        label: '已通过'
      }, {
        value: '4',
        label: '已拒绝'
      }],
      user_type: '认证用户',
      tableHeight: 0,
      config: { searchFlag: false, editFlag: true, deleteFlag: true },
      dataList: [],
      total: 0,
      page_size: 20,
      page: 1,
      apiPath: '/api/admin/user/',
      batchOptions: [
        // 通过Banner
        // { label: '删除', value: 'delete' }
      ],
      batchOption: '',
      multipleSelection: [],
      search: {
        is_white_list: 1
      },
      // * 两个列表：认证用户的变量和方法都带Gal' 缩写于 'general'
      tableHeightGal: 0,
      configGal: { searchFlag: false, editFlag: true, deleteFlag: true },
      dataListGal: [],
      totalGal: 0,
      page_sizeGal: 20,
      pageGal: 1,
      apiPathGal: '/api/admin/user/',
      batchOptionsGal: [
        // 通过Banner
        // { label: '删除', value: 'delete' }
      ],
      batchOptionGal: '',
      multipleSelectionGal: [],
      searchGal: {},
      user_status: '全部'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight = this.$op.setTableHeight(this)
      this.tableHeightGal = this.tableHeight
      window.onresize = () => {
        this.tableHeight = this.$op.setTableHeight(this)
        this.tableHeightGal = this.tableHeight
      }
    })
  },
  created () {
    this.getList()
    this.getListGal()
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
        console.log('data', this.dataList)
      })
    },

    handleAddWhite (index, row) {
      const path = `certification-add/${row.id}/`
      this.$router.push(path)
    },

    async handleEnable (type, id) {
      if (type === 1) {
        await this.$axios({
          method: 'post',
          url: `${this.apiPath}${id}/ban/`,
        })
      }
      if (type === 2) {
        await this.$axios({
          method: 'post',
          url: `${this.apiPath}${id}/un_ban/`,
        })
      }
      this.getList()
      this.getListGal()
    },

    async handleVerify (type, id) {
      if (type === 1) {
        await this.$axios({
          method: 'post',
          url: `${this.apiPath}${id}/verify_pass/`,
        })
      }
      if (type === 2) {
        await this.$axios({
          method: 'post',
          url: `${this.apiPath}${id}/verify_refused/`,
        })
      }
      this.getListGal()
    },

    handleAdd () {
      this.$router.push('/certification-add')
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
    handleCurrentChange (page) {
      console.log('handleCurrentChange', page)
      this.getList(page)
    },
    // 认证用户
    getListGal (pageGal = 1) {
      this.pageGal = pageGal || this.page_sizeGal
      let searchGal = this.$op.changeSearch(this.searchGal)
      this.$axios({
        method: 'get',
        url: this.apiPathGal,
        params: {
          ...searchGal,
          page: pageGal || this.pageGal,
          page_size: this.page_sizeGal
        }
      }).then(result => {
        console.log('get list result gal', result)
        this.dataListGal = result.results
        this.totalGal = result.count
      })
    },
    handleProhibitGal (index, row) {
      this.$message({
        message: '已禁用',
        type: 'warning'
      })
    },
    handleEnableGal () {
      this.$message({
        message: '启用成功',
        type: 'success'
      })
    },
    doBatchOptionGal () {
      console.log('批量执行', this.batchOptionGal, this.multipleSelectionGal)
    },
    handleSelectionChangeGal (val) {
      this.multipleSelectionGal = val
    },
    handleEditGal (index, row) {
      const pathGal = `${this.$route.path}/${row.id}/edit-gal`
      console.log('edit path gal', pathGal)
      this.$router.push(pathGal)
    },
    handleCurrentChangeGal (pageGal) {
      console.log('handleCurrentChangeGal', pageGal)
      this.getListGal(pageGal)
    },
    handleCommand (command) {
      this.user_status = command.target.innerText
      // 根据选择的状态请求接口进行过滤
    }
  }
}
</script>
