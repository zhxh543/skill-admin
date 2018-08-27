<template>
  <div id="institutionalUser">
    <el-button type="primary" @click="modal = true">新建机构用户</el-button>
    <selector :search="search" @getList="getList"></selector>
    <el-table :data="tableData" v-loading="dataLoading" stripe style="width: 100%">
      <el-table-column fixed type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="机构名称">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.name" placement="top">
            <span class="label" v-html="data.row.name"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名(机构代码)">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.username" placement="top">
            <span class="label" v-html="data.row.username"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="linkMan" label="联系人">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.linkMan" placement="top">
            <span class="label" v-html="data.row.linkMan"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="linkPhone" label="联系电话"></el-table-column>
      <el-table-column prop="postalAddress" label="通讯地址" width="200">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.postalAddress" placement="top">
            <span class="label" v-html="data.row.postalAddress"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="zipCode" label="邮编"></el-table-column>
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
      title="编辑机构用户"
      :visible.sync="modal"
      :custom-class="'dialog_model'">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="机构名称" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入机构名称，不超过100字" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="用户名(机构代码)" prop="username">
          <el-input v-model.trim="form.username" placeholder="请输入机构代码，不超过100字" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkMan">
          <el-input v-model.trim="form.linkMan" placeholder="请输入联系人，不超过50字" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="linkPhone">
          <el-input v-model.trim="form.linkPhone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="zipCode">
          <el-input v-model.trim="form.zipCode" placeholder="请输入邮编" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="通讯地址" prop="postalAddress">
          <el-input type="textarea" v-model.trim="form.postalAddress" placeholder="请输入通讯地址，不超过200字"
                    maxlength="200"></el-input>
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
  import {validateTelephone, validateTel, validateCode, valStr} from '@/util/validate'

  export default {
    name: "institutionalUser",
    data() {
      let phoneVal = (rule, value, callback) => {
        if (!validateTel(value) && !validateTelephone(value)) {
          callback(new Error('请输入合法的联系电话'));
        } else
          callback();
      };
      let codeVal = (rule, value, callback) => {
        if (!validateCode(value)) {
          callback(new Error('请输入合法的邮政编码'));
        } else
          callback();
      };
      let strVal = (rule, value, callback) => {
        if (!valStr(value)) {
          callback(new Error('机构代码只能为字母、数字组合'));
        } else
          callback();
      };
      return {
        modal: false,
        loading: false,
        search: {
          keyWord: '',
          placeholder: '请输入机构名称/用户名',
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
        dataLoading: false,
        tableData: [],
        form: {
          id: '',
          name: '',
          username: '',
          password: null,
          linkMan: '',
          linkPhone: '',
          zipCode: '',
          postalAddress: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入机构名称', trigger: 'blur'}
          ],
          username: [
            {required: true, message: '请输入用户名(机构代码)', trigger: 'blur'},
            {validator: strVal, trigger: 'blur'}
          ],
          linkMan: [
            {required: true, message: '请输入联系人', trigger: 'blur'}
          ],
          linkPhone: [
            {required: true, message: '请输入联系电话', trigger: 'blur'},
            {validator: phoneVal, trigger: 'blur'}
          ],
          zipCode: [
            {required: true, message: '请输入邮编', trigger: 'blur'},
            {validator: codeVal, trigger: 'blur'}
          ],
          postalAddress: [
            {required: true, message: '请输入通讯地址', trigger: 'blur'}
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
      //获取列表
      getList(page) {
        if (page)
          this.page.page = page;
        this.dataLoading = true;
        this.$ajax.get('/mechanism/list', {
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
            let url = '/mechanism/save';
            if (this.form.id)
              url = '/mechanism/update';
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
      //重置用户信息
      reset() {
        this.$refs['form'].resetFields();
        this.form = {
          id: '',
          name: '',
          username: '',
          password: null,
          linkMan: '',
          linkPhone: '',
          zipCode: '',
          postalAddress: ''
        };
        this.$refs['form'].clearValidate();
      },
      //更改用户状态
      changeSign(id) {
        this.$confirm('此操作将会更改该用户状态，是否更改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax.post(`/mechanism/changeUsedSign/${id}`).then(res => {
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
      //重置密码
      resetPassword(id) {
        this.$confirm('重置后的密码为123456，是否确定重置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax.post(`/mechanism/initPassword/${id}`).then(res => {
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
