<template>
  <div id="setting">
    <a class="btn btn-primary" :class="{'btn-disabled':ids.length <= 0 || currentRow.claimNumber === 0}"
       :href="ids.length > 0 && currentRow.claimNumber > 0? ('/api/certificate/export?ids='+ids) : 'javascript:void(0);'" target="_blank">导出证书</a>
    <selector :search="search" @getList="getList"></selector>
    <el-table :data="tableData" v-loading="dataLoading" stripe style="width: 100%" highlight-current-row
              @current-change="selectRow">
      <el-table-column fixed type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="名称">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.name" placement="top">
            <span class="label" v-html="data.row.name"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="批次号"></el-table-column>
      <el-table-column prop="testProjectValue" label="测试项目"></el-table-column>
      <el-table-column prop="levelValue" label="等级"></el-table-column>
      <el-table-column prop="limitTime" label="报名截止时间">
        <template slot-scope="data">{{(data.row.limitTime?data.row.limitTime:'--') | dateTime}}</template>
      </el-table-column>
      <el-table-column prop="testTime" label="考试时间">
        <template slot-scope="data">{{(data.row.testTime?data.row.testTime:'--') | dateTime}}</template>
      </el-table-column>
      <el-table-column prop="testAddress" label="考试地点" width="200">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.testAddress" placement="top">
            <span class="label" v-html="data.row.testAddress"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="enrolment" label="报名人数"></el-table-column>
      <el-table-column prop="claimNumber" label="申领人数"></el-table-column>
      <el-table-column prop="mechanismName" label="机构"></el-table-column>
      <el-table-column prop="payStateValue" label="缴费状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="review(scope.row)">申领查询</el-button>
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
    name: "setting",
    data() {
      return {
        modal: false,
        dataLoading: false,
        title: '查询名称1',
        search: {
          keyWord: '',
          placeholder: '请输入考试批次',
          list: [{
            name: '机构',
            value: null,
            list: [{
              value: null,
              name: '全部'
            }]
          }, {
            name: '缴费状态',
            value: null,
            list: [{
              value: null,
              name: '全部'
            }, {
              value: 0,
              name: '待缴费'
            }, {
              value: 1,
              name: '缴费完成'
            }]
          }]
        },
        page: {
          page: 1,
          rows: 10,
          total: 0
        },
        tableData: [],
        mechanismList: [],
        currentRow: null,
        ids: []
      }
    },
    filters: {
      dateTime(d) {
        if (d !== '--') {
          let date = new Date(d);
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
          let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
          let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
          return Y + M + D + '  ' + h + m;
        } else
          return d;
      }
    },
    components: {
      selector,
    },
    methods: {
      selectRow(row) {
        if (row) {
          this.currentRow = row;
          this.ids = [];
          this.ids.push(row.id);
        }
      },
      //获取机构列表
      getMechanism() {
        this.$ajax.get('/mechanism/getChooses').then(res => {
          if (res.status === 200) {
            this.mechanismList = res.data;
            if (res.data.length > 0) {
              this.search.list[0].list = [{
                value: null,
                name: '全部'
              }];
              if (res.data.length > 0) {
                res.data.forEach((item, index) => {
                  this.search.list[0].list.push({
                    value: item.id,
                    name: item.name
                  })
                });
              }
            }
          }
        });
      },
      review(data) {
        this.$router.push({name: 'cerSearch', params: {type: 'index'}, query: {id: data.id}});
      },
      getList(page) {
        this.page.page = page;
        this.dataLoading = true;
        this.$ajax.get('/exam/examinationBatchs', {
          page: page,
          rows: this.page.rows,
          mechanismId: this.search.list[0].value,
          payState: this.search.list[1].value,
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
      }
    },
    mounted() {
      this.getMechanism();
      this.getList(1);
    }
  }
</script>

<style scoped>

</style>
