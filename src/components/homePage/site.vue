<template>
  <div id="site">
    <el-button type="primary" @click="modal = true">添加</el-button>

    <template v-if="dataList.length > 0" v-for="(item,index) in dataList">
      <div class="banner_line">
        <el-row>
          <el-col :span="4">
            <div class="banner_img">
              <img :src="item.photo" alt="">
            </div>
          </el-col>
          <el-col :span="19" :offset="1">
            <el-row class="el_line">
              <el-col :span="4" class="el_name">标题</el-col>
              <el-col :span="10">
                <el-input v-model.trim="item.title" disabled></el-input>
              </el-col>
              <el-col :span="8" :offset="1">
                <el-button type="primary" size="small" @click="editItem(item)">编辑</el-button>
                <el-button type="info" size="small" @click="deleteItem(item.id)">删除</el-button>
              </el-col>
            </el-row>
            <el-row class="el_line el_row">
              <el-col :span="4" class="el_name">序号</el-col>
              <el-col :span="10">
                <el-input v-model.trim="item.seq" disabled></el-input>
              </el-col>
            </el-row>
            <el-row class="el_line el_row">
              <el-col :span="4" class="el_name">链接地址</el-col>
              <el-col :span="10">
                <el-input v-model.trim="item.customUrl" disabled></el-input>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </template>

    <el-dialog
      title="编辑轮播图"
      :visible.sync="modal"
      :custom-class="'dialog_model'"
    >
      <el-row>
        <el-col :span="4">
          <el-upload
            class="avatar-uploader"
            :action="''"
            ref="upload"
            :show-file-list="false"
            :on-change="uploadChange"
            accept="image/jpeg,image/gif,image/png"
            :auto-upload="false">
            <div class="avatar">
              <img v-if="info.photo"
                   :src="info.photo" alt="">
              <i v-else class="el-icon-plus"></i>
            </div>
          </el-upload>
        </el-col>
        <el-col :span="19" :offset="1">
          <el-row class="el_line">
            <el-col :span="4" class="el_name">标题</el-col>
            <el-col :span="20">
              <el-input v-model.trim="info.title" placeholder="请输入标题,50字内" maxlength="50"></el-input>
            </el-col>
          </el-row>
          <el-row class="el_line el_row">
            <el-col :span="4" class="el_name">序号</el-col>
            <el-col :span="20">
              <el-input v-model="info.seq" placeholder="请输入序号" maxlength="10"></el-input>
            </el-col>
          </el-row>
          <el-row class="el_line el_row">
            <el-col :span="4" class="el_name">链接地址</el-col>
            <el-col :span="16">
              <el-input v-model="info.customUrl" placeholder="请选择链接地址" disabled></el-input>
            </el-col>
            <el-col :span="4" style="padding-left:10px;">
              <el-button type="primary" class="el_long" plain size="small" @click="showDialog">选择</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button size="mini" @click="modal = false">取 消</el-button>
        <el-button type="primary" :loading="loading" size="mini" @click="editImg">确 定</el-button>
      </div>
    </el-dialog>
    <!--图片裁切弹窗-组件-->
    <imgCropper :cropData="cropData" @submitUpload="submitUpload" ref="crop"/>

    <urlSelector ref="url" @hideDialog="hideDialog" @getUrl="getUrl"></urlSelector>
  </div>
</template>

<script>
  import imgCropper from '@/components/common/dialogCropper'
  import urlSelector from '@/components/common/urlSelector'
  import {validateNum} from "@/util/validate";

  export default {
    name: "site",
    data() {
      return {
        modal: false,
        dataList: [],
        loading: false,
        info: {
          id: '',
          photo: '',
          title: '',
          seq: 10,
          url: '',
          linkUrl: '',
          linkType: 0,
          customUrl:''
        },
        maxSeq: 10,
        cropData: {
          scale: 23/10,//图片裁切比例
          cutImgUrl: "",//要裁切的图片url
          result: "",//裁切好的图片url
          uploading: false,//正在上传图片
          index: '1'
        },
        urlData: {
          modal: false,
          linkData: {
            linkType: 0,
            linkUrl: '',
            linkOther: 0,
            linkCustom: '',
            customUrl:''
          }
        }
      }
    },
    watch: {
      modal(val) {
        if (val) {
          if (!this.info.id)
            this.info.seq = this.maxSeq;
        } else {
          this.info = {
            id: '',
            photo: '',
            title: '',
            seq: 10,
            url: '',
            linkUrl: '',
            linkType: 0,
            customUrl:''
          };
        }
      }
    },
    components: {
      imgCropper,
      urlSelector
    },
    methods: {
      editItem(item) {
        if (item) {
          this.modal = true;
          this.info = {
            id: item.id,
            photo: item.photo,
            title: item.title,
            seq: item.seq,
            url: item.url,
            linkUrl: item.linkUrl,
            linkType: item.linkType,
            customUrl:item.customUrl
          }
        }
      },
      showDialog() {
        if (this.info.linkType === null) {
          this.info.linkType = 0;
        }
        let data = {
          modal: true,
          linkData: {
            linkType: this.info.linkType,
            linkUrl: '',
            linkOther: 0,
            linkCustom: '',
            customUrl:''
          }
        };
        switch (this.info.linkType) {
          case 0:
            data.linkData.linkUrl = this.info.url;
            break;
          case 1:
            data.linkData.linkCustom = this.info.url;
            break;
          case 2:
            data.linkData.linkOther = this.info.url;
            break;
        }
        data.linkData.customUrl = this.info.customUrl;
        this.$refs.url.getParams(data);
      },
      hideDialog() {
        this.urlData.modal = false;
        this.$refs.url.closeDialog();
      },
      getUrl(linkData) {
        this.info.linkType = linkData.linkType;
        switch (parseInt(linkData.linkType)) {
          case 0:
            this.info.url = linkData.linkUrl;
            break;
          case 1:
            this.info.url = linkData.linkCustom;
            break;
          case 2:
            this.info.url = linkData.linkOther;
            break;
        }
        this.info.customUrl = linkData.customUrl;
        if (this.info.url) {
          this.hideDialog();
        } else
          this.$message.error('选择链接出错！');
      },
      editImg() {
        if (!this.info.photo) {
          this.$message.error('请上传图片');
          return false;
        }
        if (!this.info.title) {
          this.$message.error('请正确输入标题');
          return false;
        }
        if (!validateNum(this.info.seq)) {
          this.$message.error('请正确输入排序，10位内正整数');
          return false;
        }
        let url = '/advertisement/save';
        if (this.info.id)
          url = '/advertisement/update';
        this.loading = true;
        this.info.type = 2;
        this.$ajax.put(url, this.info).then(res => {
          this.loading = false;
          if (res.status === 200) {
            this.$message.success(res.data.msg);
            this.modal = false;
            this.getList();
          } else
            this.$message.error(res.data.msg);
        });
      },
      /*裁切成功后，触发该方法*/
      submitUpload() {
        this.info.photo = this.cropData.result;
        this.cropData.uploading = false;
      },
      /*图书上传队列改变时--要做的处理-打开裁切窗口*/
      uploadChange(file) {
        if (this.cropData.uploading) return;
        this.cropData.uploading = true;
        this.$refs.crop.showModel();
        this.cropData.cutImgUrl = URL.createObjectURL(file.raw);
      },
      getList() {
        this.$ajax.get('/advertisement/advertisements/2').then(res => {
          if (res.status === 200) {
            this.dataList = res.data;
            if (res.data.length > 0) {
              let a = res.data[res.data.length - 1].seq + '';
              let b = a.substring(0, a.length - 1) + '0';
              this.maxSeq = parseInt(b) + 10;
            }
          } else
            this.$message.error(res.data.msg);
        });
      },
      deleteItem(id) {
        if (id) {
          this.$confirm('此操作永久删除该条信息，是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$ajax.delete(`/advertisement/delete/${id}`).then(res => {
              if (res.status === 200)
                this.$message.success(res.data.msg);
              else
                this.$message.error(res.data.msg);
              this.getList();
            });
          }).catch(() => {
            this.getList();
          });
        }
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>

<style scoped type="text/less" lang="less">
  .banner_line {
    padding: 20px 0;
    border-bottom: 1px #dcdfe6 solid;
    .banner_img {
      width: 100%;
      height: auto;
      position: relative;
      div {
        width: 100%;
        height: 100px;
        background: #cccccc;
      }
    }
  }
</style>
