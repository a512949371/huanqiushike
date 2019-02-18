<template>
  <el-dialog
    :append-to-body="false"
    :visible.sync="dialog"
    :title="isadd?'编辑分类':'新增分类'"
    width="500px"
    :modal="false"
  >
    <el-form :model="postdata" :rules="rules" ref="edit" label-width="120px">
      <el-form-item label="分类名称" prop="className">
        <el-input v-model="postdata.className"></el-input>
      </el-form-item>
      <el-form-item label="分类排序" prop="classRank">
        <el-input v-model.number="postdata.classRank"></el-input>
      </el-form-item>
      <el-form-item label="分类说明" prop="classNote">
        <el-input v-model="postdata.classNote"></el-input>
      </el-form-item>
      <el-form-item label="app图标" prop="classImg">
        <el-upload
          class="upload-demo"
          :action="imagesUploadApi"
          :on-success="uploadsucess"
          :on-error="uploadfail"
          :headers="headers"
          :show-file-list="false"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <div class="pb10 flex-box-center">
        <img v-if="postdata.classImg!=''" class="img" :src="postdata.classImg">
      </div>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="truepost('edit',postdata.id)">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import { addClassification, editClassification } from "@/api/shop";
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
    }
  },
  data() {
    return {
      dialog: false,
      postdata: {
        className: "",
        classRank: "",
        classNote: "",
        classImg: ""
      },
      loading: false,
      rules: {
        className: [{ required: true, message: "请输入分类名称" }],
        classRank: [
          { required: true, message: "请输入分类排序" },
          { type: "number", message: "排序必须为数字值" }
        ],
        classNote: [{ required: false, message: "请输入分类说明" }]
      },
      headers: {
        Authorization: ""
      }
    };
  },
  created() {
    this.headers.Authorization = "Bearer " + getToken();
  },
  mounted() {
    this.$nextTick(function() {
      console.log("this0", this.isadd);
    });
  },
  computed: {
    ...mapGetters(["imagesUploadApi"])
  },
  methods: {
    truepost(formName, id) {
      console.log("?", id);
      this.$refs[formName].validate(valid => {
        console.log("valid", valid);
        if (valid) {
          this.loading = true;
          if (this.isadd) {
            this.postdata["id"] = id;
            this.postdata["isDelete"] = 0;
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
      addClassification(this.postdata).then(res => {
        this.loading = false;
        this.$notify({
          title: "创建成功",
          type: "success",
          duration: 1500
        });
        this.dialog = false;
        this.$parent.init().then(res => {
          console.log("then", res, this.$parent);
          this.$parent.listdata = res;
        });
      }).catch((res)=>{
        console.log('err',res)
        this.loading = false;
      });;
    },
    toedit() {
      var that = this;
      editClassification(this.postdata).then(res => {
        this.loading = false;
        this.$notify({
          title: "编辑成功",
          type: "success",
          duration: 1500
        });
        this.dialog = false;
        console.log(this.$parent)
        this.$parent.init().then(res => {
          console.log("then", res);
          this.$parent.listdata = res;
        });
      }).catch((res)=>{
        console.log('err',res)
        this.loading = false;
      });;
    },
    cancel() {
      this.$refs.edit.resetFields();
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


