<template>
  <div id="navFirst">
    <el-button type="primary" @click="modal = true">新建一级导航</el-button>
    <el-table :data="tableData" v-loading="dataLoading" stripe style="width: 100%">
      <el-table-column fixed type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="一级导航"></el-table-column>
      <el-table-column prop="seq" label="排序"></el-table-column>
      <el-table-column prop="creatorName" label="创建人"></el-table-column>
      <el-table-column prop="createdTime" label="创建时间">
        <template slot-scope="data">{{(data.row.createdTime?data.row.createdTime:'--') | dateDay}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="modal=true,info=scope.row">编辑</el-button>
          <el-button type="info" plain size="mini" @click="deleteNav(scope.row.id)">删除</el-button>
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

    <el-dialog
      title="编辑一级导航"
      :visible.sync="modal"
      :custom-class="'dialog_model'">
      <el-form ref="form" :model="info" :rules="rules" label-width="120px">
        <el-form-item label="一级导航" prop="name">
          <el-input v-model.trim="info.name" placeholder="请输入一级导航，不超过10个字" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input v-model.trim="info.seq" placeholder="请输入排序，不超过10位数" maxlength="10"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="modal = false">取 消</el-button>
        <el-button type="primary" :loading="loading" size="mini" @click="edit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {validateNum} from '@/util/validate'

  export default {
    name: "navFirst",
    data() {
      let seqVal = (rule, value, callback) => {
        if (!validateNum(value)) {
          callback(new Error('排序号只能为正整数！'));
        } else
          callback();
      };

      return {
        modal: false,
        loading: false,
        info: {
          id: '',
          name: '',
          seq: ''
        },
        maxSeq: 10,
        rules: {
          name: [
            {required: true, message: '请输入一级导航', trigger: 'blur'}
          ],
          seq: [
            {required: true, message: '请输入排序', trigger: 'blur'},
            {validator: seqVal, trigger: 'blur'}
          ]
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
    watch: {
      modal(val) {
        if (val) {
          if (!this.info.id)
            this.info.seq = this.maxSeq;
        } else
          this.reset();
      }
    },
    methods: {
      deleteNav(id) {
        if (id) {
          this.$ajax.get(`/navigation/checkChildren/${id}`).then(res => {
            if (res.status === 200) {
              let message = '此操作永久删除该导航信息，是否删除?';
              if (res.data) {
                message = '此导航存在二级导航，此操作将永久删除改导航信息及二级导航信息，是否删除?';
              }
              this.$confirm(message, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$ajax.delete(`/navigation/delete/${id}`).then(res => {
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
          });
        }
      },
      getList(page) {
        this.page.page = page;
        this.dataLoading = true;
        this.$ajax.get('/navigation/navigations', {
          page: page,
          rows: this.page.rows,
          type: 0
        }).then(res => {
          this.dataLoading = false;
          if (res.status === 200) {
            this.page.total = res.data.total;
            this.tableData = res.data.rows;
            if (res.data.rows.length > 0) {
              let a = res.data.rows[res.data.rows.length - 1].seq + '';
              let b = a.substring(0, a.length - 1) + '0';
              this.maxSeq = parseInt(b) + 10;
            }
          } else {
            this.page.total = 0;
            this.tableData = [];
          }
        });
      },
      edit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = '/navigation/save';
            if (this.info.id)
              url = '/navigation/update';
            this.loading = true;
            this.$ajax.put(url, this.info).then(res => {
              this.loading = false;
              if (res.status === 200) {
                this.reset(formName);
                this.modal = false;
                this.getList(this.page.page);
                this.$message.success(res.data.msg);
              } else
                this.$message.error(res.data.msg);
            });
          } else {
            return false;
          }
        });
      },
      reset(formName) {
        if (formName) {
          this.$refs[formName].clearValidate();
          this.$refs[formName].resetFields();
        }
        this.info = {
          id: '',
          name: '',
          seq: ''
        };
      }
    },
    mounted() {
      this.getList(1);
    }
  }
</script>

<style scoped>

</style>
