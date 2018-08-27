<template>
  <div id="urlSelector">
    <el-dialog
      title="链接选择器"
      :visible.sync="urlData.modal"
      :custom-class="'dialog_model'"
      :before-close="closeDialog"
    >
      <el-tabs v-model="urlData.linkData.linkType" @tab-click="tabClick">
        <el-tab-pane label="外部地址" name="0">
          <el-row class="el_line">
            <el-col :span="4" class="el_name">链接地址</el-col>
            <el-col :span="20">
              <el-input v-model.trim="urlData.linkData.linkUrl"
                        placeholder="请输入链接地址(例：http://www.baidu.com)"></el-input>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="自定义页面" name="1">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-input v-model.trim="keyWord" placeholder="请输入标题"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" class="el_long" @click="getList(1)">搜索</el-button>
            </el-col>
          </el-row>
          <el-table :data="tableData" v-loading="dataLoading" stripe style="width: 100%">
            <el-table-column prop="title" label="标题">
              <template slot-scope="data">
                <el-tooltip effect="dark" :content="data.row.title" placement="top">
                  <span class="label" v-html="data.row.title"></span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="creatorName" label="创建人" width="100"></el-table-column>
            <el-table-column prop="createdTime" label="创建时间" width="120">
              <template slot-scope="data">{{(data.row.createdTime?data.row.createdTime:'--') | dateDay}}</template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
              <template slot-scope="scope">
                <el-button type="primary" :disabled="urlData.linkData.linkCustom === scope.row.id + ''" plain
                           size="mini"
                           @click="urlData.linkData.linkCustom=scope.row.id + ''">
                  {{urlData.linkData.linkCustom===scope.row.id + ''?'已选择':'选择'}}
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
        </el-tab-pane>
        <el-tab-pane label="特殊页面" name="2">
          <el-row class="el_line">
            <el-col :span="4" class="el_name">特殊页面</el-col>
            <el-col :span="20">
              <el-radio-group v-model="urlData.linkData.linkOther">
                <template v-if="typeList.length > 0" v-for="item in typeList">
                  <el-radio :label="item.code">{{item.value}}</el-radio>
                </template>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button type="primary" size="mini" @click="editUrl">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "urlSelector",
    data() {
      return {
        typeList: [],
        urlData: {
          modal: false,
          linkData: {
            linkType: '0',
            linkUrl: '',
            linkOther: 0,
            linkCustom: '',
            customUrl: ''
          }
        },
        keyWord: '',
        page: {
          page: 1,
          rows: 10,
          total: 0
        },
        dataLoading: false,
        tableData: []
      }
    },
    methods: {
      getType() {
        this.$ajax.get('/specialPages').then(res => {
          if (res.status === 200)
            this.typeList = res.data;
        })
      },
      getParams(data) {
        this.urlData = {
          modal: data.modal,
          linkData: {
            linkType: data.linkData.linkType + '',
            linkUrl: data.linkData.linkUrl,
            linkOther: parseInt(data.linkData.linkOther),
            linkCustom: data.linkData.linkCustom,
            customUrl: data.customUrl
          }
        };
      },
      editUrl() {
        let data = this.urlData.linkData;
        switch (parseInt(data.linkType)) {
          case 0:
            data.customUrl = data.linkUrl;
            break;
          case 1:
            data.customUrl = `/detail/article/${data.linkCustom}`;
            break;
          case 2:
            switch (parseInt(data.linkOther)) {
              case 0:
                data.customUrl = `/list/score`;
                break;
              case 1:
                data.customUrl = `/list/tutor`;
                break;
              case 2:
                data.customUrl = `/list/center`;
                break;
              case 3:
                data.customUrl = `/list/base`;
                break;
            }
            break;
        }
        this.$emit('getUrl', this.urlData.linkData);
      },
      closeDialog() {
        this.id = null;
        this.urlData = {
          modal: false,
          linkData: {
            linkType: '0',
            linkUrl: '',
            linkOther: 0,
            linkCustom: '',
            customUrl: ''
          }
        };
      },
      getList(page) {
        this.page.page = page;
        this.dataLoading = true;
        this.$ajax.get('/page/specialPages/2', {
          page: page,
          rows: this.page.rows,
          search: this.keyWord
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
      tabClick() {

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
    mounted() {
      this.getType();
      this.getList(1);
    }
  }
</script>

<style scoped>

</style>
