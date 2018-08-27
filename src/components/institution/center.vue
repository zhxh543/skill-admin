<template>
  <div id="institutionCenter">
    <el-button type="primary" @click="modal = true">新增活动中心</el-button>
    <selector :search="search" @getList="getList"></selector>
    <el-table :data="tableData" v-loading="dataLoading" stripe style="width: 100%">
      <el-table-column fixed type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="中心名称" width="200"></el-table-column>
      <el-table-column prop="num" label="中心编号" width="200"></el-table-column>
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
      <el-table-column prop="area" label="中心面积(㎡)" width="100"></el-table-column>
      <el-table-column prop="equipmentType" label="设备种类" width="200">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.equipmentType" placement="top">
            <span class="label" v-html="data.row.equipmentType"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="hold" label="可容纳人数" width="100"></el-table-column>
      <el-table-column prop="oldActivity" label="往期活动" width="200">
        <template slot-scope="data">
          <el-tooltip effect="dark" :content="data.row.oldActivity" placement="top">
            <span class="label" v-html="data.row.oldActivity"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="examineStateValue" label="审核状态" width="100"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="editRow(scope.row)">编辑</el-button>
          <el-button type="info" plain size="mini" @click="deleteRow(scope.row.id)">删除</el-button>
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
      title="活动中心编辑"
      :visible.sync="modal"
      :custom-class="'dialog_modal'">
      <center-edit :info="info" @closed="closed"></center-edit>
    </el-dialog>
  </div>
</template>

<script>
  import selector from '@/components/common/selector'
  import centerEdit from '@/components/institution/centerEdit'

  export default {
    name: "institutionCenter",
    data() {
      return {
        modal: false,
        search: {
          keyWord: '',
          placeholder: '请输入中心名称/编号',
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
        info: {
          id: '',
          name: '',
          num: '',
          mechanismId: '',
          province: '',
          city: '',
          address: '',
          zipCode: '',
          linkMan: '',
          linkPhone: '',
          email: '',
          nature: '',
          survey: '',
          area: '',
          equipmentType: '',
          hold: '',
          oldActivity: ''
        }
      }
    },
    watch: {
      modal(val) {
        if (!val) {
          this.info = {
            id: '',
            name: '',
            num: '',
            mechanismId: '',
            province: '',
            city: '',
            address: '',
            zipCode: '',
            linkMan: '',
            linkPhone: '',
            email: '',
            nature: '',
            survey: '',
            area: '',
            equipmentType: '',
            hold: '',
            oldActivity: ''
          };
          this.getList(this.page.page);
        }
      }
    },
    components: {
      selector,
      centerEdit
    },
    methods: {
      closed() {
        this.modal = false;
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
        this.$ajax.get('/activity/centers', {
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
      deleteRow(id) {
        if (id) {
          this.$confirm('此操作永久删除该中心信息，是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$ajax.delete(`/activity/delete/${id}`).then(res => {
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
      editRow(row) {
        if (row)
          this.$confirm('此中心信息已通过审核，继续操作将重置审核状态，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.modal = true;
            this.info = row;
          }).catch(() => {
            this.getList(this.page.page);
          });
      }
    },
    mounted() {
      this.getList(1);
      this.getDefaults();
    }
  }
</script>

<style scoped>

</style>
