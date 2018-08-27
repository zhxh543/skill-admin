<template>
  <div id="editor_con">
    <div ref="editor" style="text-align:left;"></div>
    <!-- <button v-on:click="getContent">查看内容</button> -->
  </div>
</template>

<script>
  import E from 'wangeditor'

  export default {
    name: 'editor',
    props: ["content", "isEdit"],//isEdit-是否编辑，"true"-编辑状态，需要将content.html写入编辑器
    /*content:{
        html:"",
        text:""
     },*/
    data() {
      return {
        editorContent: '',
        editor: null,
        isWrited: true
      }
    },
    methods: {
      getContent: function () {
        alert(this.editorContent)
      },
      returnContent() {
        return this.editorContent;
      },
      writeContent() {
        this.editor.txt.html(this.content.html);
        this.isWrited = false;
      }
    },
    mounted() {
      var _self = this;
      var editor = new E(this.$refs.editor);
      this.editor = editor;
      // 自定义菜单配置
      editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'image',  // 插入图片
        'table',  // 表格
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ];
      // editor.customConfig.uploadImgServer = '/upload';
      editor.customConfig.onchange = (html) => {
        this.editorContent = html;
        this.content.html = html;//富文本
        this.content.text = editor.txt.text();//纯文本
      };
      // 配置服务器端地址
      editor.customConfig.uploadImgServer = '/api/upload';
      // 将图片大小限制为 3M
      editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
      editor.customConfig.uploadImgMaxLength = 1;
      editor.customConfig.uploadFileName = 'file';
      // editor.customConfig.uploadImgHeaders = {
      //     'Content-Type':'multipart/form-data'
      // }
      editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {
          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //     prevent: true,
          //     msg: '放弃上传'
          // }
        },
        success: function (xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        fail: function (xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function (xhr, editor) {
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function (xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },

        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function (insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          if (result.url) {
            insertImg(_self.serverUrl + result.url);
          } else {
            alert(result.msg);
          }
          // if (result.success) {
          //   for (let item of result.data) {
          //     insertImg(item.url);
          //   }
          // } else {
          //   alert(result.msg);
          // }

          // insertImg(url);

          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      }


      // editor.customConfig.customUploadImg = function (files, insert) {
      //    //添加请求头
      //   let config = {
      //     headers:{'Content-Type':'multipart/form-data'}
      //   };
      //   let param = new FormData(); //创建form对象
      //   let file = files[0];
      //   param.append('file',file,file.name);//通过append向form对象添加数据
      //   param.append('chunk','0');//添加form表单中其他数据
      //   _self.$http.post('/api',param,config)
      //    .then(function (response) {
      //     console.log(response);
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
      //     // files 是 input 中选中的文件列表
      //     // insert 是获取图片 url 后，插入到编辑器的方法

      //     // 上传代码返回结果之后，将图片插入到编辑器中
      //     // insert('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521043310481&di=320c4eaaaa62380a152f961118558029&imgtype=0&src=http%3A%2F%2Fa.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F0dd7912397dda144a5db01a2beb7d0a20df486cb.jpg');
      // };
      editor.create();
      editor.txt.html(this.content.html);
    },
    watch: {
      'content.html': {
        handler(newVal, oldVal) {
          /*编辑状态--将content.html写入编辑器*/
          if (this.isEdit == "true" && newVal != "" && this.isWrited) { //“编辑状态”and “内容不为空” and  “未曾写入”
            this.writeContent();
          }
        },
        deep: true
      }
    }
  }
</script>

<style scoped>
</style>
