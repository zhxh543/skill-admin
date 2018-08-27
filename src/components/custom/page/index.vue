<template>
  <div id="customIndex">
    <el-button type="primary" @click="addNews('')">新增</el-button>
    <selector :search="search" @getList="getList"></selector>
    <el-table :data="tableData" v-loading="dataLoading" stripe style="width: 100%">
      <el-table-column fixed type="index" width="50"></el-table-column>
      <el-table-column prop="title" label="标题">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.title" placement="top">
            <span class="label" v-html="data.row.title"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="创建人" width="200"></el-table-column>
      <el-table-column prop="createdTime" label="创建时间" width="200">
        <template slot-scope="data">{{(data.row.createdTime?data.row.createdTime:'--') | dateDay}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="addNews(scope.row.id)">编辑</el-button>
          <el-button type="info" plain size="mini" @click="deleteNews(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="el_row" v-if="page.total > 10">
      <el-col :span="24" class="text-center">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="page.total"
          :page-size="page.rows"
          :current-page="page.page"
          @current-change="getList"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import selector from '@/components/common/selector'

  export default {
    name: "customIndex",
    data() {
      return {
        search: {
          keyWord: '',
          placeholder: '请输入标题'
        },
        dataLoading: false,
        page: {
          page: 1,
          rows: 10,
          total: 0
        },
        tableData: [],
      }
    },
    filters: {
      dateDay(d) {
        if (d !== '--') {
          let date = new Date(d);
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
          return Y + M + D;
        } else
          return d;
      }
    },
    components: {
      selector
    },
    methods: {
      //获取批次列表
      getList(page) {
        this.page.page = page;
        this.dataLoading = true;
        this.$ajax.get('/page/specialPages/2', {
          page: page,
          rows: this.page.rows,
          search: this.search.keyWord
        }).then(res => {
          this.dataLoading = false;
          if (res.status === 200) {
            this.page.total = res.data.total;
            this.tableData = res.data.rows;
          } else {
            this.page.total = 0;
            this.tableData = [];
          }
        });
      },
      addNews(id) {
        this.$router.push({name: 'customEdit', query: {id: id}});
      },
      deleteNews(id) {
        if (id) {
          this.$confirm('此操作永久删除该条信息，是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$ajax.delete(`/page/delete/${id}`).then(res => {
              if (res.status === 200)
                this.$message.success(res.data.msg);
              else
                this.$message.error(res.data.msg);
              this.getList(this.page.page);
            });
          }).catch(() => {
            this.getList(this.page.page);
          });
        }
      }
    },
    mounted() {
      this.getList(1);
    }
  }
</script>

<style scoped>

</style>
