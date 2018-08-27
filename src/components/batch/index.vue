<template>
  <div id="batch">
    <el-button type="primary" @click="modal = true">新建批次</el-button>
    <selector :search="search" @getList="getList"></selector>
    <el-table :data="tableData" v-loading="dataLoading" stripe style="width: 100%">
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
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="modal=true,form=scope.row">编辑</el-button>
          <el-button type="info" plain size="mini" @click="payModal = true,rowData=scope.row">缴费设置</el-button>
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
      title="编辑批次"
      :visible.sync="modal"
      :custom-class="'dialog_model'">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入批次名称，不超过100字" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="批次号">
          <p v-html="form.num"></p>
        </el-form-item>
        <el-form-item label="测试项目" prop="testProject">
          <el-radio-group v-model="form.testProject">
            <template v-if="testProject.length > 0" v-for="(item,index) in testProject">
              <el-radio :label="item.code">{{item.value}}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-radio-group v-model="form.level">
            <template v-if="levels.length > 0" v-for="(item,index) in levels">
              <el-radio :label="item.code">{{item.value}}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="报名截止日期" prop="limitTime">
          <el-date-picker
            v-model="form.limitTime"
            type="datetime"
            placeholder="选择日期时间"
            class="el_long">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考试时间" prop="testTime">
          <el-date-picker
            v-model="form.testTime"
            type="datetime"
            placeholder="选择日期时间"
            class="el_long">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="机构" prop="mechanismId">
          <el-select v-model="form.mechanismId" placeholder="请选择考试机构" class="el_long">
            <template v-if="mechanismList.length > 0" v-for="(item,index) in mechanismList">
              <el-option :label="item.name" :value="item.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="考点" prop="testAddress">
          <el-input type="textarea" v-model.trim="form.testAddress" placeholder="请输入考点，不超过200字"
                    maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="modal = false">取 消</el-button>
        <el-button type="primary" size="mini" :loading="loading" @click="edit('form')">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog
      title="缴费设置"
      :visible.sync="payModal"
      :custom-class="'dialog_model'">
      <el-row class="el_line">
        <el-col :span="4" class="el_name">缴费状态</el-col>
        <el-col :span="20" v-if="rowData">
          <el-radio-group v-model="rowData.payState">
            <el-radio :label="0">待缴费</el-radio>
            <el-radio :label="1">已缴费</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button size="mini" @click="payModal = false">取 消</el-button>
        <el-button type="primary" size="mini" :loading="loading" @click="payStatus">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import selector from '@/components/common/selector'
  import {valDate} from '@/util/validate'

  export default {
    name: "batch",
    data() {
      let dateVal = (rule, value, callback) => {
        if (valDate(this.form.limitTime, this.form.testTime)) {
          callback(new Error('报名截止日期不能在考试日期之后'));
        } else
          callback();
      };
      return {
        modal: false,
        payModal: false,
        dataLoading: false,
        loading: false,
        rowData: '',
        search: {
          keyWord: '',
          placeholder: '请输入名称/批次号',
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
        form: {
          id: '',
          name: '',
          num: '',
          testProject: '',
          level: '',
          limitTime: '',
          testTime: '',
          testAddress: '',
          mechanismId: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入批次名称', trigger: 'blur'}
          ],
          testProject: [
            {required: true, message: '请选择测试项目', trigger: 'change'}
          ],
          level: [
            {required: true, message: '请选择考试等级', trigger: 'change'}
          ],
          limitTime: [
            {required: true, message: '请选择报名截止时间', trigger: 'blur'},
            {validator: dateVal, trigger: 'blur'}
          ],
          testTime: [
            {required: true, message: '请选择考试时间', trigger: 'blur'},
            {validator: dateVal, trigger: 'blur'}
          ],
          mechanismId: [
            {required: true, message: '选择机构', trigger: 'change'}
          ],
          testAddress: [
            {required: true, message: '请输入考试地点', trigger: 'blur'}
          ]
        },
        testProject: [],
        levels: [],
        mechanismList: []
      }
    },
    components: {
      selector
    },
    watch: {
      modal(val) {
        if (val) {
          if (!this.form.id) {
            this.$ajax.get('/exam/getNum').then(res => {
              if (res.status === 200)
                this.form.num = res.data;
            });
            this.setDefault();
          }
        } else {
          this.reset();
          this.getList(this.page.page);
        }
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
          let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
          let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
          return Y + M + D + '  ' + h + m + s;
        } else
          return d;
      }
    },
    methods: {
      //缴费状态
      payStatus() {
        if (this.rowData) {
          this.loading = true;
          this.$ajax.post(`/exam/changePayState/${this.rowData.id}`, {
            payState: this.rowData.payState
          }).then(res => {
            this.loading = false;
            if (res.status === 200) {
              this.$message.success(res.data.msg);
              this.payModal = false;
              this.rowData = '';
              this.getList(this.page.page);
            } else
              this.$message.error(res.data.msg);
          });
        }
      },
      //form重置
      reset() {
        this.$refs['form'].resetFields();
        this.form = {
          id: '',
          name: '',
          num: '',
          testProject: '',
          level: '',
          limitTime: '',
          testTime: '',
          testAddress: '',
          mechanismId: ''
        };
        this.$refs['form'].clearValidate();
        this.setDefault();
      },
      //设置默认
      setDefault() {
        if (this.mechanismList.length > 0)
          this.form.mechanismId = this.mechanismList[0].id;
        if (this.testProject.length > 0)
          this.form.testProject = this.testProject[0].code;
        if (this.levels.length > 0)
          this.form.level = this.levels[0].code;
      },
      //获取测试项目、等级、机构
      getSomething() {
        //获取机构列表
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
        //获取测试项目
        this.$ajax.get('/testProjects').then(res => {
          if (res.status === 200) {
            this.testProject = res.data;
          }
        });
        //获取等级
        this.$ajax.get('/levels').then(res => {
          if (res.status === 200) {
            this.levels = res.data;
          }
        });
      },
      //获取批次列表
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
      },
      //编辑用户信息
      edit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = '/exam/save';
            if (this.form.id)
              url = '/exam/update';
            this.loading = true;
            this.form.limitTime = new Date(this.form.limitTime).getTime();
            this.form.testTime = new Date(this.form.testTime).getTime();
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
    },
    mounted() {
      this.getSomething();
      this.getList(1);
    }
  }
</script>

<style scoped>

</style>
