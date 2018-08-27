<template>
  <div id="tutor">
    <el-upload
      action="/api/tutor/importMsg"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :multiple="false"
      :show-file-list="false"
      class="fl"
    >
      <el-button type="primary">导入信息</el-button>
    </el-upload>
    <a class="btn btn-primary" :class="{'btn-disabled':ids.length <= 0}" style="margin-left: 15px;"
       :href="ids.length > 0 ? ('/api/tutor/export?ids='+ids) : 'javascript:void(0);'" target="_blank">导出证书</a>
    <a :href="'/api/download/tutor'" class="btn_download">下载导入模板</a>
    <selector :search="search" @getList="getList"></selector>
    <el-table ref="table" :data="tableData" v-loading="dataLoading" stripe style="width: 100%"
              @selection-change="tableSelect">
      <el-table-column fixed type="selection" width="45"></el-table-column>
      <el-table-column fixed prop="tutorNo" label="导师编号" width="150"></el-table-column>
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column prop="sexValue" label="性别" width="60"></el-table-column>
      <el-table-column prop="birthday" label="出生日期" width="100">
        <template slot-scope="data">{{(data.row.birthday?data.row.birthday:'--') | dateDay}}</template>
      </el-table-column>
      <el-table-column prop="card" label="身份证号" width="200"></el-table-column>
      <el-table-column prop="phone" label="电话" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="postalAddress" label="通信地址" width="200">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.postalAddress" placement="top">
            <span class="label" v-html="data.row.postalAddress"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="mechanismCode" label="机构代码" width="200"></el-table-column>
      <el-table-column prop="mechanismName" label="机构名称" width="200"></el-table-column>
      <el-table-column prop="certificateNo" label="证书编号" width="200"></el-table-column>
      <el-table-column prop="dateOfPresentation" label="颁证日期" width="100">
        <template slot-scope="data">{{(data.row.dateOfPresentation?data.row.dateOfPresentation:'--') | dateDay}}
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
    name: "tutor",
    data() {
      return {
        modal: false,
        dataLoading: false,
        search: {
          keyWord: '',
          placeholder: '请输入导师姓名/身份证号'
        },
        page: {
          page: 1,
          rows: 10,
          total: 0
        },
        tableData: [],
        ids: []
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
      },
    },
    components: {
      selector
    },
    methods: {
      uploadSuccess(res, file, fileList) {
        if (res.code === 200) {
          if (res.data.fails && res.data.fails.length > 0) {
            let names = '';
            if (res.data.fails[0]['姓名']) {
              res.data.fails.forEach((item, index) => {
                if (index !== res.data.fails.length - 1)
                  names += item['姓名'] + ',';
                else
                  names += item['姓名'];
              });
              this.$message.warning('以下人员信息存在异常:' + names);
            } else
              this.$message.warning('表格信息与模板要求不符！')
          } else {
            this.$message.success(res.msg);
          }
          this.getList(1);
        } else
          this.$message.error(res.msg);
      },
      uploadError(err, file, fileList) {
        this.$message.error('导入文件与要求不符，需上传xls格式文件！');
      },
      tableSelect(params) {
        if (params.length > 0) {
          this.ids = [];
          params.forEach((item, index) => {
            this.ids.push(item.id);
          });
        } else
          this.ids = [];
      },
      getList(page) {
        this.page.page = page;
        this.dataLoading = true;
        this.$ajax.get('/tutor/tutors', {
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
      }
    },
    mounted() {
      this.getList(1);
    }
  }
</script>

<style scoped>
</style>
