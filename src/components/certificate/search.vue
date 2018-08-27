<template>
  <div id="search">
    <el-button type="primary" @click="modal = true">颁证日期</el-button>
    <selector :search="search" @getList="getList"></selector>
    <el-table :data="tableData" v-loading="dataLoading" stripe style="width: 100%">
      <el-table-column fixed type="index" width="50"></el-table-column>
      <el-table-column prop="admissionTicket" label="准考证号" width="200"></el-table-column>
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column prop="birthday" label="出生日期" width="100">
        <template slot-scope="data">{{(data.row.birthday?data.row.birthday:'--') | dateDay}}</template>
      </el-table-column>
      <el-table-column prop="card" label="身份证号"></el-table-column>
      <el-table-column prop="testProjectName" label="测试项目"></el-table-column>
      <el-table-column prop="levelName" label="等级" width="100"></el-table-column>
      <el-table-column prop="certificateNo" label="证书编号"></el-table-column>
      <el-table-column prop="date" label="颁证日期" width="100">
        <template slot-scope="data">{{(data.row.date?data.row.date:'--') | dateDay}}</template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="颁证日期设置"
      :visible.sync="modal"
      :custom-class="'dialog_modal'"
      append-to-body>
      <el-row class="el_line">
        <el-col :span="4" class="el_name">颁证日期</el-col>
        <el-col :span="10">
          <el-date-picker
            v-model.trim="date"
            type="date"
            class="el_long"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp"
            placeholder="选择日期">
          </el-date-picker>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button size="mini" @click="modal = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="setDate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import selector from '@/components/common/selector'

  export default {
    name: "search",
    props: ['type'],
    data() {
      return {
        modal: false,
        date: '',
        search: {
          keyWord: '',
          placeholder: '请输入考生姓名/身份证号'
        },
        id: this.$route.query.id,
        dataLoading: false,
        loading: false,
        page: {
          page: 1,
          rows: 10,
          total: 0
        },
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
      },
    },
    watch: {
      modal(val) {
        if (!val) {
          this.date = '';
        }
      }
    },
    components: {
      selector
    },
    methods: {
      setDate() {
        if (this.date) {
          this.loading = true;
          this.$ajax.get(`/certificate/setDate/${this.id}`, {
            date: new Date(this.date).getTime()
          }).then(res => {
            this.loading = false;
            if (res.status === 200) {
              this.$message.success(res.data.msg);
              this.modal = false;
            } else
              this.$message.error(res.data.msg);
            this.getList(1);
          });
        } else
          this.$message.error('请先选择颁证日期！');
      },
      getList(page) {
        if (this.id) {
          this.page.page = page;
          this.dataLoading = true;
          this.$ajax.get(`/certificate/certificates/${this.id}`, {
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
      }
    },
    mounted() {
      this.getList(1);
    }
  }
</script>

<style scoped>

</style>
