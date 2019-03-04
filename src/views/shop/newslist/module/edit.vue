<template>
  <el-dialog
    :append-to-body="false"
    :visible.sync="dialog"
    :title="isadd?'编辑文章':'新增文章'"
    width="1000px"
    :modal="false"
  >
    <el-form :model="postdata" :rules="rules" ref="edit" label-width="120px">
      <el-form-item label="文章名称" prop="title">
        <el-input v-model="postdata.title"></el-input>
      </el-form-item>
      <el-form-item label="文章内容">
        <div>
          <div ref="editor" style="text-align:left;margin: 5px;"></div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="truepost('edit',postdata.id)">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import E from "wangeditor";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import { addnews, editnews } from "@/api/newslist";
export default {
  inject: ["reload"],
  name: "Edit",
  props: {
    isadd: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      required: false
    },
    su_this: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      postdata: {
        content: "",
        title: ""
      },
      loading: false,
      rules: {
        title: [{ required: true, message: "请输入文章标题" }]
      },
      headers: {
        Authorization: ""
      },
      editorContent: "",
      showtime: true
    };
  },
  created() {
    this.headers.Authorization = "Bearer " + getToken();
  },
  computed: {
    ...mapGetters(["imagesUploadApi"])
  },
  watch: {
    dialog: function(val, oldval) {
      if (val && this.showtime) {
        setTimeout(() => {
          this.createwangeditor();
        }, 500);
      }
    }
  },
  mounted() {
    console.log("data", this.postdata);
  },
  updated() {},
  methods: {
    createwangeditor() {
      this.showtime = false;
      console.log(this.su_this.$refs, "?", this.$refs);
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
        this.postdata.content = html;
      };
      editor.create();
      editor.txt.html(this.postdata.content);
    },
    truepost(formName, id) {
      this.$refs[formName].validate(valid => {
        console.log("valid", valid, this.postdata);
        if (valid) {
          this.loading = true;
          if (this.isadd) {
            this.postdata["id"] = id;
            this.toedit();
          } else {
            this.toadd();
          }
          console.log("?", this.postdata);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    toadd() {
      var that = this;
      addnews(this.postdata)
        .then(res => {
          this.loading = false;
          this.$notify({
            title: "新增成功",
            type: "success",
            duration: 1500
          });
          this.dialog = false;
          this.su_this.init().then(res => {
            console.log("then", res, this.$parent);
            this.su_this.listdata = res;
          });
        })
        .catch(res => {
          console.log("err", res);
          this.loading = false;
        });
    },
    toedit() {
      var that = this;
      editnews(this.postdata)
        .then(res => {
          this.loading = false;
          this.$notify({
            title: "编辑成功",
            type: "success",
            duration: 1500
          });
          this.dialog = false;
          console.log(this.su_this, this.$parent);
          this.su_this.init().then(res => {
            console.log("then", res);
            this.su_this.listdata = res;
          });
        })
        .catch(res => {
          console.log("err", res);
          this.loading = false;
        });
    },
    cancel() {
      this.$refs.edit.resetFields();
      this.showtime = true;
      this.postdata.content = "";
      this.dialog = false;
    },
    uploadsucess(response, file, fileList) {
      console.log("img", response, file, fileList);
      this.postdata.classImg = response.data[0];
    },
    uploadfail(response, file, fileList) {
      console.log("imgfail", response, file, fileList);
    }
  }
};
</script>
<style lang="scss" scoped>
.pd20 {
  padding: 0 20px;
  font-size: 16px;
  color: #333;
}
.input {
  flex: 1;
  line-height: 30px;
}
.img {
  width: 120px;
  height: 120px;
  display: block;
}
</style>


