<template>
  <div id="enrollIndex">
    <el-upload
      :action="currentRow?'/api/student/importMsg':''"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :multiple="false"
      :show-file-list="false"
      :data="{'ids':ids}"
      class="fl"
      :disabled="!currentRow"
    >
      <el-button type="primary" :disabled="!currentRow">导入信息</el-button>
    </el-upload>
    <el-popover
      placement="top-start"
      width="300"
      trigger="hover"
      content="照片请以“tx+身份证号码”命名">
      <a href="javascript:void(0);" slot="reference" class="upload_files fl">
        <input v-if="currentRow && currentRow.enrolment > 0" id="upload" type="file" multiple @change="uploadFiles"
               accept="image/jpeg,image/gif,image/png">
        <el-button type="primary" :disabled="!currentRow || currentRow.enrolment <= 0">导入照片</el-button>
      </a>
    </el-popover>
    <el-button type="primary" :disabled="!currentRow" @click="timeSetting">时间设置</el-button>
    <a class="btn btn-primary" :class="{'btn-disabled':ids.length <= 0 || (currentRow && currentRow.enrolment <= 0)}"
       style="margin-left: 10px;"
       :href="ids.length > 0 && currentRow && currentRow.enrolment > 0 ? ('/api/student/export/zkz/'+ids) : 'javascript:void(0);'"
       target="_blank">导出准考证</a>
    <a class="btn btn-primary" :class="{'btn-disabled':ids.length <= 0 || (currentRow && currentRow.enrolment <= 0)}"
       style="margin-left: 10px;"
       :href="ids.length > 0 && currentRow && currentRow.enrolment > 0 ? ('/api/student/export/signUp/'+ids) : 'javascript:void(0);'"
       target="_blank">导出报名表</a>
    <a :href="'/api/download/student'" class="btn_download">下载导入模板</a>
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
      <el-table-column prop="mechanismName" label="机构"></el-table-column>
      <el-table-column prop="payStateValue" label="缴费状态"></el-table-column>
      <el-table-column prop="time" label="笔试时间">
        <template slot-scope="data">{{(data.row.time?data.row.time:'--') | dateTime}}</template>
      </el-table-column>
      <el-table-column prop="practiceTime" label="实操时间">
        <template slot-scope="data">{{(data.row.practiceTime?data.row.practiceTime:'--') | dateTime}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="searchStudent(scope.row.id)">考生查询</el-button>
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
      title="时间设置"
      :visible.sync="timeModal"
      :custom-class="'dialog_modal'">
      <el-row class="el_line el_row">
        <el-col :span="4" class="el_name">笔试时间</el-col>
        <el-col :span="10">
          <el-date-picker
            v-model.trim="time.time"
            type="datetime"
            class="el_long"
            placeholder="选择日期">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row class="el_line el_row">
        <el-col :span="4" class="el_name">实操时间</el-col>
        <el-col :span="10">
          <el-date-picker
            v-model.trim="time.practiceTime"
            type="datetime"
            class="el_long"
            placeholder="选择日期">
          </el-date-picker>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button size="mini" @click="timeModal = false">取 消</el-button>
        <el-button type="primary" size="mini" :loading="loading" @click="editTime">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import selector from '@/components/common/selector'

  export default {
    name: "enrollIndex",
    data() {
      return {
        modal: false,
        timeModal: false,
        loading: false,
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
        dataLoading: false,
        mechanismList: [],
        currentRow: null,
        time: {
          time: '',
          practiceTime: ''
        },
        ids: []
      }
    },
    watch: {
      timeModal(val) {
        if (!val) {
          this.reset();
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
    components: {
      selector
    },
    methods: {
      searchStudent(id) {
        if (id) {
          this.$router.push({name: 'enrollSearch', query: {id: id}});
        }
      },
      uploadFiles() {
        let $this = this;
        let obj = document.getElementById('upload').files;
        if (obj.length > 0) {
          let formData = new FormData();
          for (let i = 0; i < obj.length; i++) {
            formData.append('files', obj[i]);
          }
          formData.append('ids', this.ids);
          this.$ajax.file('/student/importHead', formData).then(res => {
            if (res.status === 200) {
              if (res.data.data.fails.length > 0) {
                let names = '';
                res.data.data.fails.forEach((item, index) => {
                  if (index !== res.data.data.fails.length - 1)
                    names += item + ',';
                  else
                    names += item;
                });
                this.$message.warning('以下图片存在异常:' + names);
              } else {
                this.$message.success(res.data.msg);
              }
              this.getList(1);
            } else
              this.$message.error(res.data.msg);
          });
        } else
          this.$message.error('请选择需要上传的照片!')
      },
      uploadSuccess(res, file, fileList) {
        if (res.code === 200) {
          if (res.data.fails && res.data.fails.length > 0) {
            let names = '';
            if (res.data.fails[0]['考生姓名']) {
              res.data.fails.forEach((item, index) => {
                if (index !== res.data.fails.length - 1)
                  names += item['考生姓名'] + ',';
                else
                  names += item['考生姓名'];
              });
              this.$message.warning('以下人员信息存在异常:' + names);
            } else
              this.$message.warning('表格信息与模板要求不符！')
          } else {
            this.$message.success(res.msg);
          }
          this.getList(1);
        } else
          this.$message.error(res.data.msg);
      },
      uploadError(err, file, fileList) {
        this.$message.error('导入文件与要求不符，需上传xls格式文件！');
      },
      selectRow(row) {
        if (row) {
          this.currentRow = row;
          this.ids = [];
          this.ids.push(row.id);
        } else {
          this.currentRow = null;
          this.ids = [];
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
      //时间设置
      timeSetting() {
        this.timeModal = true;
        if (!this.currentRow.time) {
          this.time.time = '';
        } else
          this.time.time = this.currentRow.time;
        if (!this.currentRow.practiceTime) {
          this.time.practiceTime = '';
        } else
          this.time.practiceTime = this.currentRow.practiceTime;
      },
      editTime() {
        console.log(this.time);
        if (this.time.time) {
          if (this.time.practiceTime) {
            this.loading = true;
            let time = {
              id: this.currentRow.id,
              time: new Date(this.time.time).getTime(),
              practiceTime: new Date(this.time.practiceTime).getTime()
            };
            this.$ajax.put(`/exam/setTime`, time).then(res => {
              this.loading = false;
              if (res.status === 200) {
                this.timeModal = false;
                this.$message.success(res.data.msg);
              } else
                this.$message.error(res.data.msg);
            });
          } else
            this.$message.warning('请先选择实操时间！');
        } else
          this.$message.warning('请先选择笔试时间！');
      },
      reset() {
        this.ids = [];
        this.time = {time: '', practiceTime: ''};
        this.currentRow = null;
        this.getList(this.page.page);
      },
      setSearch() {
        this.$ajax.get('/getRoleType').then(res => {
          if (res.status === 200) {
            if (res.data === 3) {
              this.search.list.forEach((item, index) => {
                if (item.name === '机构') {
                  this.search.list.splice(index, 1);
                }
              });
            } else
              this.getMechanism();
          }
        });
      }
    },
    mounted() {
      this.getList(1);
      this.setSearch();
    }
  }
</script>

<style scoped type="text/less" lang="less">
  .upload_files {
    display: inline-block;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    margin: 0 15px;
    input {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      cursor: pointer;
      font-size: 100px;
    }
  }
</style>
