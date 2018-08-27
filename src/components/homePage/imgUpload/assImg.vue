<template>
  <div id="assImg">
    <div class="ass_title">
      <el-checkbox v-model="checked" @change="setData">关联图片展示</el-checkbox>
    </div>
    <div class="ass_box" v-if="checked">
      <el-radio-group v-model="radio" @change="setData">
        <el-radio :label="0">
          方形
          <span class="ass_item item_1"></span>
        </el-radio>
        <el-radio :label="1">
          横版1
          <span class="ass_item item_2"></span>
        </el-radio>
        <el-radio :label="2">
          横版2
          <span class="ass_item item_3"></span>
        </el-radio>
      </el-radio-group>
      <div class="ass_upload" :class="{'ass1':radio === 0,'ass2':radio === 1,'ass3':radio ===2}">
        <el-upload
          class="avatar-uploader"
          :action="''"
          ref="upload"
          :data="imgBase64"
          :show-file-list="false"
          :on-change="uploadChange"
          :auto-upload="false"
          accept="image/jpeg,image/gif,image/png">
          <div class="avatar">
            <img v-if="imgBase64.data"
                 :src="imgBase64.data" alt="">
            <template v-else>
              <div class="other_upload">
                <div>
                  <i class="el-icon-plus"></i>
                  <p>最多上传1张图</p>
                </div>
              </div>
            </template>
          </div>
        </el-upload>
      </div>
    </div>

    <!--图片裁切弹窗-组件-->
    <imgCropper :cropData="cropData" @submitUpload="submitUpload" ref="crop"/>
  </div>
</template>

<script>
  import imgCropper from '@/components/common/dialogCropper'

  export default {
    name: "assImg",
    data() {
      return {
        msg: 'assImg',
        checked: false,
        radio: 0,
        imgBase64: {
          data: ""
        },
        formData: {
          name: "",//书名
          isbn: "",//ISBN码
          publicationCode: "",//出版物号
          resume: "",//简介
          logoUrl: "",//封面图
          tagIds: []//List :标签id
        },
        cropData: {
          scale: 4 / 3,//图片裁切比例
          cutImgUrl: "",//要裁切的图片url
          result: "",//裁切好的图片url
          uploading: false,//正在上传图片
          index: '0'
        },
      }
    },
    components: {
      imgCropper
    },
    watch: {
      radio(val) {
        this.imgBase64.data = '';
        this.$emit('getRelationImg', '');
      }
    },
    methods: {
      setData() {
        this.$emit('setRelationData', {
          relationType: this.radio,
          isRelation: this.checked
        });
      },
      setImg(data) {
        this.checked = data.flag;
        this.radio = parseInt(data.type + '');
        this.imgBase64.data = data.url;
      },
      /*裁切成功后，触发该方法*/
      submitUpload() {
        this.imgBase64.data = this.cropData.result;
        this.$emit('getRelationImg', this.cropData.result);
        this.cropData.uploading = false;
      },
      /*图书上传队列改变时--要做的处理-打开裁切窗口*/
      uploadChange(file) {
        if (this.cropData.uploading) return;
        this.cropData.uploading = true;
        switch (this.radio) {
          case 0:
            this.cropData.scale = 1;
            break;
          case 1:
            this.cropData.scale = 2;
            break;
          case 2:
            this.cropData.scale = 1.4;
            break;
        }
        this.$refs.crop.showModel();
        this.cropData.cutImgUrl = URL.createObjectURL(file.raw);
      },
    }
  }
</script>

<style scoped type="text/less" lang="less">
  .ass_title {
    padding: 20px;
  }

  .ass_box {
    border-top: 1px #dcdfe6 solid;
    padding: 20px 40px;
    .ass_item {
      vertical-align: top;
      display: block;
      height: 80px;
      margin: 5px 0 0 25px;
      background: #dcdfe6;
      &.item_1 {
        width: 80px;
      }
      &.item_2 {
        width: 160px;
      }
      &.item_3 {
        width: 120px;
      }
    }
    .ass_upload {
      margin-top: 10px;
      &.ass1 {
        width: 150px;
      }
      &.ass2 {
        width: 300px;
      }
      &.ass3 {
        width: 225px;
      }
    }
    .other_upload {
      width: 100%;
      min-height: 150px;
      position: relative;
      div {
        width: 100%;
        height: auto;
        overflow: hidden;
        position: absolute;
        left: 0;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%);
        transform: translateY(-50%);
        i {
          font-size: 30px;
          color: #999999;
        }
        p {
          color: #666666;
          font-size: 14px;
          margin-top: 10px;
        }
      }
    }
  }
</style>
