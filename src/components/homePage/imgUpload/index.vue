<template>
  <div :id="'imgUpload' + cropData.index" style="height: 100%;">
    <el-upload
      class="avatar-uploader"
      :action="''"
      ref="upload"
      :data="imgBase64"
      :show-file-list="false"
      :on-change="uploadChange"
      :before-upload="beforeUpload"
      accept="image/jpeg,image/gif,image/png"
      :auto-upload="false">
      <div class="avatar">
        <img v-if="imgBase64.data"
             :src="imgBase64.data" alt="">
        <template v-else>
          <template v-if="cropData.index === 'banner'">
            <div class="banner_upload">
              <i class="el-icon-picture-outline"></i>
              <p>上传封面</p>
              <p><span>建议尺寸：200×200</span></p>
            </div>
          </template>
          <template v-if="cropData.index !== 'banner'">
            <div class="other_upload">
              <div>
                <i class="el-icon-plus"></i>
                <p>点击上传头图</p>
              </div>
            </div>
          </template>
        </template>
      </div>
    </el-upload>

    <!--图片裁切弹窗-组件-->
    <imgCropper :cropData="cropData" @submitUpload="submitUpload" ref="crop"/>
  </div>
</template>

<script>
  import imgCropper from '@/components/common/dialogCropper'

  export default {
    name: "imgUpload",
    data() {
      return {
        imgBase64: {
          data: ""
        },
        cropData: {
          scale: 4 / 3,//图片裁切比例
          cutImgUrl: "",//要裁切的图片url
          result: "",//裁切好的图片url
          uploading: false,//正在上传图片
          index: ''
        },
      }
    },
    components: {
      imgCropper
    },
    methods: {
      getParams(index, scale) {
        this.cropData.index = index;
        this.cropData.scale = scale;
      },
      setImg(url) {
        this.imgBase64.data = url;
      },
      /*裁切成功后，触发该方法*/
      submitUpload() {
        this.imgBase64.data = this.cropData.result;
        if (this.cropData.index === 'banner') {
          this.$emit('bannerImg', this.cropData.result);
        }
        if (this.cropData.index !== 'banner') {
          this.$emit('headImg', this.cropData.result);
        }
        this.cropData.uploading = false;
      },
      /*图书上传队列改变时--要做的处理-打开裁切窗口*/
      uploadChange(file) {
        if (this.cropData.uploading) return;
        this.cropData.uploading = true;
        this.$refs.crop.showModel();
        this.cropData.cutImgUrl = URL.createObjectURL(file.raw);
      },
      /*图书上传封面--之前要做的处理*/
      beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
          this.cropData.uploading = false;
        }
        return isLt2M;
      },
    }
  }
</script>

<style scoped type="text/less" lang="less">
  .banner_upload {
    width: 100%;
    height: 100%;
    padding-top: 35px;
    i {
      font-size: 60px;
      color: #999999;
    }
    p {
      font-size: 14px;
      margin-top: 10px;
      color: #333333;
      span {
        font-size: 12px;
        color: #999999;
      }
    }
  }

  .other_upload {
    width: 100%;
    min-height: 100px;
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
</style>
