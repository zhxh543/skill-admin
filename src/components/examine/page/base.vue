<template>
  <div id="examineBase">
    <selector :search="search" @getList="getList"></selector>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column fixed type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="基地名称" width="200"></el-table-column>
      <el-table-column prop="num" label="基地编号" width="200"></el-table-column>
      <el-table-column prop="mechanismName" label="机构名称" width="200"></el-table-column>
      <el-table-column prop="city" label="所在省市" width="150">
        <template slot-scope="data">
          {{data.row.province + ' ' + data.row.city}}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="详细地址" width="200">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.address" placement="top">
            <span class="label" v-html="data.row.address"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="zipCode" label="邮编" width="100"></el-table-column>
      <el-table-column prop="linkMan" label="联系人" width="100"></el-table-column>
      <el-table-column prop="linkPhone" label="电话" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
      <el-table-column prop="nature" label="单位性质" width="200">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.nature" placement="top">
            <span class="label" v-html="data.row.nature"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="survey" label="单位概况" width="200">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.survey" placement="top">
            <span class="label" v-html="data.row.survey"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="area" label="基地面积(㎡)" width="100"></el-table-column>
      <el-table-column prop="equipmentType" label="设备种类" width="200">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.equipmentType" placement="top">
            <span class="label" v-html="data.row.equipmentType"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="hold" label="可容纳人数" width="100"></el-table-column>
      <el-table-column prop="examineStateValue" label="审核状态" width="100"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="!scope.row.id" plain size="mini" @click="detailReview(scope.row.id)">详情</el-button>
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
    name: "examineBase",
    data() {
      return {
        modal: false,
        search: {
          keyWord: '',
          placeholder: '请输入基地名称/编号',
          list: [{
            name: '审核状态',
            value: null,
            list: [{
              name: '全部',
              value: null
            }]
          }]
        },
        dataLoading: false,
        loading: false,
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
    watch: {
      modal(val) {
        if (!val) {
          this.row = {
            id: '',
            examineState: 0
          };
        }
      }
    },
    components: {
      selector
    },
    methods: {
      examineActivity() {
        if (this.row.id) {
          if (this.row.examineState !== 1 && this.row.examineState !== 2) {
            this.$message.error('请先选择是否通过审核！');
            return false;
          }
          this.$confirm('此操作永久更改该基地审核状态，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading = true;
            this.$ajax.put(`/examine/activity`, this.row).then(res => {
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
      detailReview(id) {
        this.$router.push({name: 'examineDetail', params: {type: 'base'}, query: {id: id}});
      },
      getDefaults() {
        this.$ajax.get('/examineStates').then(res => {
          if (res.status === 200) {
            this.search.list[0].list = [{
              name: '全部',
              value: null
            }];
            res.data.forEach((item, index) => {
              this.search.list[0].list.push({
                name: item.value,
                value: item.code
              });
            });
          }
        });
      },
      getList(page) {
        this.page.page = page;
        this.dataLoading = true;
        this.$ajax.get('/activity/bases', {
          page: page,
          rows: this.page.rows,
          examineState: this.search.list[0].value,
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
    },
    mounted() {
      this.getList(1);
      this.getDefaults();
    }
  }
</script>

<style scoped>

</style>
