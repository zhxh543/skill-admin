<template>
  <div id="user">
    <el-button type="primary" @click="modal = true">新建系统用户</el-button>
    <selector :search="search" @getList="getList"></selector>
    <el-table v-loading="dataLoading" :data="tableData" stripe style="width: 100%">
      <el-table-column fixed type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="登录名"></el-table-column>
      <el-table-column prop="realName" label="真实姓名"></el-table-column>
      <el-table-column prop="roleTypeValue" label="角色"></el-table-column>
      <el-table-column prop="usedSignValue" label="状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="230">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="modal = true,form = scope.row">编辑</el-button>
          <el-button type="info" plain size="mini" @click="resetPassword(scope.row.id)">密码重置</el-button>
          <el-switch v-model="scope.row.usedSign" style="margin-left: 10px;"
                     @change="changeSign(scope.row.id)"></el-switch>
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
      title="编辑系统用户"
      :visible.sync="modal"
      :custom-class="'dialog_model'"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="登录名" prop="username">
          <el-input v-model.trim="form.username" placeholder="请输入登录名，不超过50字" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model.trim="form.realName" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-radio-group v-model="form.roleType">
            <el-radio :label="1">系统领导</el-radio>
            <el-radio :label="2">系统管理员</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="modal = false">取 消</el-button>
        <el-button type="primary" size="mini" :loading="loading" @click="edit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import selector from '@/components/common/selector'

  export default {
    name: "user",
    data() {
      return {
        modal: false,
        loading: false,
        dataLoading: false,
        search: {
          keyWord: '',
          placeholder: '请输入登录名/真实姓名',
          list: [{
            name: '状态',
            value: null,
            list: [{
              value: null,
              name: '全部'
            }, {
              value: true,
              name: '启用'
            }, {
              value: false,
              name: '停用'
            }]
          }]
        },
        page: {
          page: 1,
          rows: 10,
          total: 0
        },
        tableData: [],
        form: {
          id: '',
          username: '',
          password: null,
          realName: '',
          roleType: 1
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          realName: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'}
          ]
        }
      }
    },
    watch: {
      modal(val) {
        if (!val) {
          this.reset();
          this.getList(this.page.page);
        }
      }
    },
    components: {
      selector
    },
    methods: {
      //获取用户列表
      getList(page) {
        if (page)
          this.page.page = page;
        this.dataLoading = true;
        this.$ajax.get('/admin/list', {
          page: page,
          rows: this.page.rows,
          usedSign: this.search.list[0].value,
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
      //编辑用户信息
      edit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = '/admin/save';
            if (this.form.id)
              url = '/admin/update';
            this.loading = true;
            this.$ajax.put(url, this.form).then(res => {
              this.loading = false;
              if (res.status === 200) {
                this.modal = false;
                this.$message.success(res.data.msg);
              } else
                this.$message.error(res.data.msg);
            });
          } else {
            return false;
          }
        });
      },
      //更改用户状态
      changeSign(id) {
        this.$confirm('此操作将会更改该用户状态，是否更改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax.post(`/admin/changeUsedSign/${id}`).then(res => {
            if (res.status === 200)
              this.$message.success(res.data.msg);
            else
              this.$message.error(res.data.msg);
            this.getList(this.page.page);
          });
        }).catch(() => {
          this.getList(this.page.page);
        });
      },
      //重置用户信息
      reset() {
        this.$refs['form'].resetFields();
        this.form = {
          id: '',
          username: '',
          password: null,
          realName: '',
          roleType: 1
        };
        this.$refs['form'].clearValidate();
      },
      //重置密码
      resetPassword(id) {
        this.$confirm('重置后的密码为123456，是否确定重置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax.post(`/admin/initPassword/${id}`).then(res => {
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
    },
    mounted() {
      this.getList(1);
    }
  }
</script>

<style scoped>

</style>
