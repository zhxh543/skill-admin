<template>
  <div id="examineNews">
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
      <el-table-column prop="seq" label="排序" width="80"></el-table-column>
      <el-table-column prop="isRelation" label="是否关联图片" width="120">
        <template slot-scope="data">{{data.row.isRelation?'是':'否'}}</template>
      </el-table-column>
      <el-table-column prop="creatorName" label="创建人" width="120"></el-table-column>
      <el-table-column prop="createdTime" label="创建时间" width="120">
        <template slot-scope="data">{{(data.row.createdTime?data.row.createdTime:'--') | dateDay}}</template>
      </el-table-column>
      <el-table-column prop="examineStateValue" label="审核状态" width="100"></el-table-column>
      <el-table-column prop="usedState" label="新闻状态" width="100">
        <template slot-scope="data">{{data.row.usedSign?'启用':'停用'}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="!scope.row.id" plain size="mini" @click="review(scope.row.id)">详情
          </el-button>
          <el-button type="info" plain size="mini"
                     @click="modal=true,row.id=scope.row.id,row.examineState=scope.row.examineState">审核
          </el-button>
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
      title="审核"
      :visible.sync="modal"
      :custom-class="'dialog_model'">
      <el-row class="el_line">
        <el-col :span="4" class="el_name">审核状态</el-col>
        <el-col :span="20">
          <el-radio-group v-model="row.examineState">
            <el-radio :label="1">审核通过</el-radio>
            <el-radio :label="2">审核拒绝</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button size="mini" @click="modal = false">取 消</el-button>
        <el-button type="primary" :loading="loading" size="mini" @click="examineActivity">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import selector from '@/components/common/selector'

  export default {
    name: "examineNews",
    data() {
      return {
        modal: false,
        search: {
          keyWord: '',
          placeholder: '请输入标题',
          list: [{
            name: '关联图片',
            value: null,
            list: [{
              name: '全部',
              value: null
            }, {
              name: '是',
              value: true
            }, {
              name: '否',
              value: false
            }]
          }, {
            name: '审核状态',
            value: null,
            list: [{
              name: '全部',
              value: null
            }, {
              name: '待审核',
              value: 0
            }, {
              name: '审核通过',
              value: 1
            }, {
              name: '审核拒绝',
              value: 2
            }]
          }, {
            name: '新闻状态',
            value: null,
            list: [{
              name: '全部',
              value: null
            }, {
              name: '停用',
              value: false
            }, {
              name: '启用',
              value: true
            }]
          },]
        },
        loading: false,
        dataLoading: false,
        page: {
          page: 1,
          rows: 10,
          total: 0
        },
        tableData: [],
        row: {
          id: '',
          examineState: 0
        }
      }
    },
    methods: {
      review(id) {
        if (id)
          window.open(`${this.webUrl}/#/detail/article/${id}`);
      },
      examineActivity() {
        if (this.row.id) {
          if (this.row.examineState !== 1 && this.row.examineState !== 2) {
            this.$message.error('请先选择是否通过审核！');
            return false;
          }
          this.$confirm('此操作永久更改该新闻审核状态，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading = true;
            this.$ajax.put(`/examine/evaluating`, this.row).then(res => {
              this.loading = false;
              if (res.status === 200) {
                this.$message.success(res.data.msg);
                this.modal = false;
                this.getList(this.page.page);
              }
              else
                this.$message.error(res.data.msg);
            });
          }).catch(() => {
            this.getList(this.page.page);
          });
        }
      },
      getList(page) {
        this.page.page = page;
        this.dataLoading = true;
        this.$ajax.get('/page/specialPages/0', {
          page: page,
          rows: this.page.rows,
          search: this.search.keyWord,
          isRelation: this.search.list[0].value,
          examineState: this.search.list[1].value,
          usedState: this.search.list[2].value
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
    },
    components: {
      selector
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
  }
</script>

<style scoped>

</style>
