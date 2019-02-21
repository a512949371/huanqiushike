<template>
  <div class="pd40">
    <div class="desc">详细内容</div>
    <div ref="editor" style="text-align:left;margin: 5px;"></div>
    <div class="flex-box-center pt20">
      <el-button type="primary" :loading="loading" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import E from "wangeditor";
import { getToken } from "@/utils/auth";
import { selectone, edit, add } from "@/api/userhelp";
export default {
  data() {
    return {
      headers: {
        Authorization: "Bearer " + getToken()
      },
      editorContent: "",
      id: "",
      loading: false
    };
  },
  created() {
    selectone().then(res => {
      console.log(res);
      if (res != "" && res != null) {
        this.id = res.id;
        this.editorContent = res.helpContext;
      }
      this.createwangeditor();
    });
  },
  computed: {
    ...mapGetters(["imagesUploadApi"])
  },
  mounted() {},
  methods: {
    createwangeditor() {
      this.showtime = false;
      console.log("?", this.$refs);
      var editor = new E(this.$refs.editor);
      editor.customConfig.uploadImgShowBase64 = true; // 使用 base64 保存图片
      // 不可修改
      editor.customConfig.uploadImgHeaders = this.headers;
      // 自定义文件名，不可修改，修改后会上传失败
      editor.customConfig.uploadFileName = "file";
      editor.customConfig.uploadImgServer = this.imagesUploadApi; // 上传图片到服务器
      editor.customConfig.uploadImgHeaders = {
        Authorization: "Bearer " + getToken()
      };
      editor.customConfig.uploadImgHooks = {
        before: function(xhr, editor, files) {
          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //     prevent: true,
          //     msg: '放弃上传'
          // }
        },
        success: function(xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        fail: function(xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function(xhr, editor) {
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function(xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        customInsert: function(insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
          console.log(result, "result");
          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          insertImg(result.data[0]);

          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      };
      editor.customConfig.onchange = html => {
        this.editorContent = html;
      };
      editor.create();
      editor.txt.html(this.editorContent || "2");
    },
    save() {
      if (this.id != "") {
        let data = {
          id: this.id,
          helpContext: this.editorContent
        };
        this.toedit(data);
      } else {
        let data = {
          helpContext: this.editorContent
        };
        this.toadd(data);
      }
    },
    toadd(data) {
      add(data)
        .then(() => {
          this.loading = false;
          this.$notify({
            title: "新增成功",
            type: "success",
            duration: 1500
          });
          this.dialog = false;
          setTimeout(() => {
            selectone().then(res => {
              console.log(res);
              if (res != "" && res != null) {
                this.id = res.id;
                this.editorContent = res.helpContext;
              }
              this.createwangeditor();
            });
          }, 500);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    toedit(data) {
      edit(data)
        .then(() => {
          this.loading = false;
          this.$notify({
            title: "编辑成功",
            type: "success",
            duration: 1500
          });
          this.dialog = false;
          setTimeout(() => {
            selectone().then(res => {
              console.log(res);
              if (res != "" && res != null) {
                this.id = res.id;
                this.editorContent = res.helpContext;
              }
              this.createwangeditor();
            });
          }, 500);
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
.pd40 {
  padding: 40px;
}
.editor-content {
  padding-left: 5px;
}
.desc {
  font-size: 16px;
  color: #545454;
  padding-bottom: 20px;
}
</style>
