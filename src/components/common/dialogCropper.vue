<template>
  <div :id="'dialogCropper' + cropData.index">
    <el-dialog title="裁切图片" :visible.sync="pictureCutShow" width="600px" :before-close="closeUpload">
      <div>
        <div class="img-container">
          <img :id="'image' + cropData.index" :src="cropData.cutImgUrl" alt="Picture">
        </div>
        <div class="img-preview preview-lg"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitUpload">原图</el-button>
        <el-button type="primary" @click="cropImg">裁切</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import '@static/js/cropperjs/cropper.css'
  import '@static/js/cropperjs/cropper.js'

  export default {
    name: "dialog-cropper",
    props: ["cropData"], /* 说明- cropData: {
                                      scale: 4 / 5,//图片裁切比例
                                      cutImgUrl: "",//要裁切的图片url
                                      result: "",//裁切好的图片url
                                      uploading: false,//正在上传图片
                                    },*/
    data() {
      return {
        pictureCutShow: false,//裁切图片弹窗
        canvasHeight: 250//预设输出canvas的高度
      }
    },
    methods: {
      /*显示弹窗*/
      showModel() {
        this.pictureCutShow = true;
        this.$nextTick(function () {
          let $image = $('#image' + this.cropData.index);
          $image.cropper({
            aspectRatio: this.cropData.scale,
            viewMode: 1,
            preview: '.img-preview'
          });
          $image.cropper('setAspectRatio', this.cropData.scale);//更新图片裁剪比例
          $image.cropper('replace', this.cropData.cutImgUrl);//更新图片裁剪地址
        });
      },
      /*关闭，清空原始数据*/
      closeUpload() {
        this.cropData.cutImgUrl = "";
        this.pictureCutShow = false;
        this.cropData.uploading = false;
      },
      /*裁切图片--原图，执行触发上传的操作，此时上传的是未经裁切的原图*/
      submitUpload() {
        this.pictureCutShow = false;
        this.cropData.result = this.cropData.cutImgUrl;
        this.$emit("submitUpload");
      },
      /*裁切图片--确定*/
      cropImg() {
        this.pictureCutShow = false;
        let $image = $('#image' + this.cropData.index);
        let croppedCanvas,
          width = this.canvasHeight * this.cropData.scale,
          height = this.canvasHeight;
        croppedCanvas = $image.cropper('getCroppedCanvas', {
          width: width,
          height: height
        });
        this.cropData.result = croppedCanvas.toDataURL();
        this.cropData.cutImgUrl = "";
        this.pictureCutShow = false;
        this.$emit("submitUpload");
      },
    }
  }
</script>

<style lang="less">
  /*裁切图片样式*/
  .img-container {
    margin-bottom: 1rem;
    height: 300px;
    overflow: hidden;
  }

  .img-preview {
    border: 1px solid #ccc;
    margin: 20px auto;
    overflow: hidden;
  }

  .img-preview > img {
    max-width: 100%;
  }

  .preview-lg {
    height: 200px;
  }
</style>
