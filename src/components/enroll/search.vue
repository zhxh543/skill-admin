<template>
  <div id="enrollSearch">
    <selector :search="search" @getList="getList"></selector>
    <el-table :data="tableData" v-loading="dataLoading" stripe style="width: 100%">
      <el-table-column fixed type="index" width="50"></el-table-column>
      <el-table-column prop="admissionTicket" label="准考证号" width="200"></el-table-column>
      <el-table-column prop="name" label="考生姓名"></el-table-column>
      <el-table-column prop="birthday" label="出生日期" width="150">
        <template slot-scope="data">{{(data.row.birthday?data.row.birthday:'--') | dateDay}}</template>
      </el-table-column>
      <el-table-column prop="card" label="身份证号" width="200"></el-table-column>
      <el-table-column prop="sex" label="性别" width="100"></el-table-column>
      <el-table-column prop="linkMan" label="联系人姓名"></el-table-column>
      <el-table-column prop="linkPhone" label="联系人电话" width="150"></el-table-column>
      <el-table-column prop="email" label="邮箱">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.email" placement="top">
            <span class="label" v-html="data.row.email"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="postalAddress" label="通信地址" width="200">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.postalAddress" placement="top">
            <span class="label" v-html="data.row.postalAddress"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="guardian" label="监护人"></el-table-column>
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
    name: "enrollSearch",
    data() {
      return {
        id: this.$route.query.id,
        search: {
          keyWord: '',
          placeholder: '请输入考生姓名/身份证号'
        },
        page: {
          page: 1,
          rows: 10,
          total: 0
        },
        dataLoading: false,
        tableData: []
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
      getList(page) {
        this.page.page = page;
        this.dataLoading = true;
        this.$ajax.get('/student/students', {
          id: this.id,
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
    },
    mounted() {
      this.getList(1);
    }
  }
</script>

<style scoped>

</style>
