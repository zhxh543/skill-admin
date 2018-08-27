<template>
  <div id="navSecond">
    <el-button type="primary" @click="modal = true">新建二级导航</el-button>
    <el-table :data="tableData" v-loading="dataLoading" stripe style="width: 100%" :cell-class-name="setClass">
      <el-table-column fixed type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="一级导航"></el-table-column>
      <el-table-column prop="seq" label="排序"></el-table-column>
      <el-table-column prop="creatorName" label="创建人"></el-table-column>
      <el-table-column prop="createdTime" label="创建时间">
        <template slot-scope="data">{{(data.row.createdTime?data.row.createdTime:'--') | dateDay}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="setInfo(scope.row)">编辑</el-button>
          <el-button type="warning" v-if="scope.row.linkType === 1" plain size="mini"
                     @click="selCustom=true,id=scope.row.id">选择内容
          </el-button>
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
      title="页面选择"
      :visible.sync="selCustom"
      :custom-class="'dialog_modal'"
    >
      <pages v-if="selCustom && id" :id="id"></pages>
    </el-dialog>

    <el-dialog
      title="编辑二级导航"
      :visible.sync="modal"
      :custom-class="'dialog_model'">
      <el-form ref="form" :model="info" :rules="rules" label-width="120px">
        <el-form-item label="二级导航" prop="name">
          <el-input v-model.trim="info.name" placeholder="请输入二级导航，不超过10个字" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="一级导航" prop="parentId">
          <el-select v-model="info.parentId" placeholder="请选择一级导航" class="el_long">
            <template v-if="firstList.length > 0" v-for="(item,index) in firstList">
              <el-option :label="item.name" :value="item.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input v-model.trim="info.seq" placeholder="请输入排序，不超过10位数" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="链接类型" prop="linkType">
          <el-radio-group v-model="info.linkType" @change="urlValidate">
            <el-radio :label="0">外部地址</el-radio>
            <el-radio :label="1">自定义页面</el-radio>
            <el-radio :label="2">特殊页面</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="info.linkType === 0" label="链接地址">
          <el-input v-model.trim="info.linkUrl" placeholder="请输入链接地址，例：http://www.baidu.com"></el-input>
        </el-form-item>
        <el-form-item v-if="info.linkType === 1" label="列表样式选择" prop="listStyle">
          <el-radio-group class="list_img" v-model.trim="info.listStyle">
            <el-radio :label="0"><img src="./img/list-1.png" alt=""></el-radio>
            <el-radio :label="1"><img src="./img/list-2.png" alt=""></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="info.linkType === 2" label="特殊页面">
          <el-radio-group v-model="info.specialType">
            <template v-if="specialType.length > 0" v-for="(item,index) in specialType">
              <el-radio :label="item.code">{{item.value}}</el-radio>
            </template>
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
  import {validateNum} from '@/util/validate'
  import pages from '@/components/navigation/pages'

  export default {
    name: "navSecond",
    data() {
      let seqVal = (rule, value, callback) => {
        if (!validateNum(value)) {
          callback(new Error('排序号只能为正整数！'));
        } else
          callback();
      };

      return {
        modal: false,
        selCustom: false,
        seqModal: false,
        loading: false,
        specialType: [],
        id: '',
        info: {
          id: '',
          name: '',
          seq: '',
          parentId: '',
          linkType: 0,
          linkUrl: '',
          customUrl: '',
          listStyle: 0,
          specialType: 0
        },
        maxSeq: 10,
        rules: {
          name: [
            {required: true, message: '请输入二级导航', trigger: 'blur'}
          ],
          seq: [
            {required: true, message: '请输入排序', trigger: 'blur'},
            {validator: seqVal, trigger: 'blur'}
          ],
          parentId: [
            {required: true, message: '请选择一级导航', trigger: 'change'}
          ],
          listStyle: [
            {required: true, message: '请选择列表样式', trigger: 'change'}
          ],
          linkType: [
            {required: true, message: '请选择列表样式', trigger: 'change'}
          ]
        },
        page: {
          page: 1,
          rows: 10,
          total: 0
        },
        dataLoading: false,
        tableData: [],
        firstList: []
      }
    },
    components: {
      pages
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
      },
      selCustom(val) {
        if (!val)
          this.id = '';
      }
    },
    methods: {
      setInfo(data) {
        this.modal = true;
        this.info = {
          id: data.id,
          name: data.name,
          seq: data.seq,
          parentId: data.parentId,
          linkType: data.linkType,
          linkUrl: data.linkUrl,
          customUrl: data.customUrl,
          listStyle: data.listStyle,
          specialType: data.specialType
        };
      },
      getFirst() {
        this.$ajax.get('/navigation/getLevelOnes').then(res => {
          if (res.status === 200) {
            this.firstList = res.data;
          }
        })
      },
      deleteNav(id) {
        if (id) {
          this.$confirm('此操作永久删除该导航信息，是否删除?', '提示', {
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
      },
      getList(page) {
        this.page.page = page;
        this.dataLoading = true;
        this.$ajax.get('/navigation/navigations', {
          page: page,
          rows: this.page.rows,
          type: 1
        }).then(res => {
          this.dataLoading = false;
          if (res.status === 200) {
            this.page.total = res.data.total;
            this.tableData = res.data.rows;
            if (res.data.total > 0) {
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
            if (this.info.linkType === 0)
              this.info.customUrl = this.info.linkUrl;
            if (this.info.linkType === 1)
              this.info.customUrl = `/list/article/${this.info.listStyle}`;
            if (this.info.linkType === 2) {
              switch (parseInt(this.info.specialType)) {
                case 0:
                  this.info.customUrl = `/list/score`;
                  break;
                case 1:
                  this.info.customUrl = `/list/tutor`;
                  break;
                case 2:
                  this.info.customUrl = `/list/center`;
                  break;
                case 3:
                  this.info.customUrl = `/list/base`;
                  break;
              }
            }
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
        }
        this.info = {
          id: '',
          name: '',
          seq: '',
          parentId: '',
          linkType: 0,
          linkUrl: '',
          customUrl: '',
          listStyle: 0,
          specialType: 0
        };
      },
      setClass({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 5) {
          return 'td_set';
        }
      },
      urlValidate() {
        if (this.info.linkType !== 0) {
          this.$refs.form.clearValidate(['linkUrl']);
        }
      },
      getType() {
        this.$ajax.get('/specialPages').then(res => {
          if (res.status === 200) {
            this.specialType = res.data;
          }
        })
      }
    },
    mounted() {
      this.getList(1);
      this.getFirst();
      this.getType();
    }
  }
</script>

<style scoped type="text/less" lang="less">
  .list_img {
    line-height: 50px;
    img {
      vertical-align: top;
      width: 120px;
    }
  }
</style>
