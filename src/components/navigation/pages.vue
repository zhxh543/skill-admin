<template>
  <div id="pages" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="20">
        <el-input v-model.trim="keyWord" placeholder="请输入新闻标题"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" class="el_long" @click="getList(1)">搜索</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" v-loading="dataLoading" stripe style="width: 100%" :cell-class-name="setClass">
      <el-table-column fixed type="index" width="50"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="seq" label="排序" width="100">
        <template slot-scope="data">{{data.row.seq?data.row.seq:'--'}}</template>
      </el-table-column>
      <el-table-column prop="creatorName" label="创建人" width="150"></el-table-column>
      <el-table-column prop="createdTime" label="创建时间" width="200">
        <template slot-scope="data">{{(data.row.createdTime?data.row.createdTime:'--') | dateDay}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button :type="scope.row.relationId?'warning':'primary'" plain size="mini" @click="selNews(scope.row)">
            {{scope.row.relationId?'取消选择':'选择'}}
          </el-button>
          <el-button type="primary" plain size="mini" v-if="scope.row.relationId" @click="seqModal=true,row=scope.row">
            编辑排序
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
      title="编辑排序"
      :visible.sync="seqModal"
      :custom-class="'dialog_mini'"
      append-to-body
    >
      <el-row v-if="row">
        <el-col :span="4" class="el_name">排序</el-col>
        <el-col :span="20">
          <el-input v-model.trim="row.seq" placeholder="请输入排序，10位数以内的正整数" maxlength="10"></el-input>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button size="mini" @click="seqModal = false">取 消</el-button>
        <el-button type="primary" :loading="editLoading" size="mini" @click="editSeq">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {validateNum} from '@/util/validate'

  export default {
    name: "pages",
    props: ['id'],
    data() {
      return {
        seqModal: false,
        keyWord: '',
        loading: false,
        editLoading: false,
        page: {
          page: 1,
          rows: 10,
          total: 0
        },
        dataLoading: false,
        tableData: [],
        row: null
      }
    },
    watch: {
      seqModal(val) {
        if (!val) {
          this.row = null;
          this.getList(this.page.page);
        }
      }
    },
    methods: {
      editSeq() {
        if (this.row) {
          if (!this.row.seq || !validateNum(this.row.seq)) {
            this.$message.error('请正确填写排序，10位以内正整数，不能为空！');
            return false;
          }
          this.editLoading = true;
          this.$ajax.put('/navigation/setSeq', {
            id: this.row.relationId,
            seq: this.row.seq
          }).then(res => {
            this.editLoading = false;
            if (res.status === 200) {
              this.$message.success(res.data.msg);
              this.seqModal = false;
            } else
              this.$message.error(res.data.msg);
          });
        }
      },
      selNews(row) {
        if (row.relationId) {
          this.$confirm('此操作取消该条信息，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading = true;
            this.$ajax.delete(`/navigation/deleteRelation/${row.relationId}`).then(res => {
              this.loading = false;
              if (res.status === 200)
                this.$message.success(res.data.msg);
              else
                this.$message.error(res.data.msg);
              this.getList(this.page.page);
            });
          }).catch(() => {
            this.getList(this.page.page);
          });
        } else {
          this.loading = true;
          this.$ajax.put('/navigation/createRelation', {
            navigationId: this.id,
            customPageId: row.id
          }).then(res => {
            this.loading = false;
            if (res.status === 200) {
              this.$message.success(res.data.msg);
              this.getList(this.page.page);
            } else
              this.$message.error(res.data.msg);
          });
        }
      },
      getList(page) {
        this.page.page = page;
        this.dataLoading = true;
        this.$ajax.get(`/page/customs/${this.id}`, {
          page: page,
          rows: this.page.rows,
          search: this.keyWord
        }).then(res => {
          this.dataLoading = false;
          if (res.status === 200) {
            this.page.total = res.data.total;
            this.tableData = res.data.rows;
            // if (res.data.rows.length > 0) {
            //   let a = res.data.rows[res.data.rows.length - 1].seq + '';
            //   let b = a.substring(0, a.length - 1) + '0';
            //   this.maxSeq = parseInt(b) + 10;
            // }
          } else {
            this.page.total = 0;
            this.tableData = [];
          }
        });
      },
      setClass({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 5) {
          return 'td_set';
        }
      },
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
    mounted() {
      if (this.id)
        this.getList(1);
    }
  }
</script>

<style scoped>

</style>
