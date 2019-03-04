<template>
  <el-dialog
    :append-to-body="false"
    :visible.sync="dialog"
    :title="isadd?'编辑广告':'新增广告'"
    width="600px"
    :modal="false"
  >
    <el-form>
      <el-upload
        class="upload-demo"
        :action="imagesUploadApi"
        :on-success="imgurlsucess"
        :on-error="imgurlfail"
        :on-exceed="imgurlexceed"
        :headers="headers"
        :show-file-list="true"
        list-type="picture"
        :limit="1"
        :file-list="imgdata"
      >
        <el-button size="small" type="primary">{{isadd?"编辑图片":"点击上传"}}</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <el-form-item class="mt20 flex-box-center">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="truepost('edit')">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import { addbanner, editbanner } from "@/api/newslist";
export default {
  name: "Banner",
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
      loading: false,
      headers: {
        Authorization: ""
      },
      postdata: {},
      imgdata: [],
      id: ""
    };
  },
  created() {
    this.headers.Authorization = "Bearer " + getToken();
  },
  computed: {
    ...mapGetters(["imagesUploadApi"])
  },
  methods: {
    truepost(formName) {
      console.log("?", this.postdata);
      this.loading = true;
      if (this.isadd) {
        this.postdata["id"] = this.id;
        this.toedit();
      } else {
        this.toadd();
      }
      console.log("?", this.postdata);
    },
    toadd() {
      var that = this;
      addbanner(this.postdata)
        .then(res => {
          this.loading = false;
          this.$notify({
            title: "创建成功",
            type: "success",
            duration: 1500
          });
          this.dialog = false;
          this.su_this.init().then(res => {
            console.log("then", res, this.$parent);
            this.su_this.bannerdata = res;
          });
        })
        .catch(res => {
          console.log("err", res);
          this.loading = false;
        });
    },
    toedit() {
      var that = this;
      editbanner(this.postdata)
        .then(res => {
          this.loading = false;
          this.$notify({
            title: "编辑成功",
            type: "success",
            duration: 1500
          });
          this.dialog = false;
          console.log("then", this.su_this, this.$parent);
          this.su_this.init().then(res => {
            console.log("then", res);
            this.su_this.bannerdata = res;
          });
        })
        .catch(res => {
          console.log("err", res);
          this.loading = false;
        });
    },
    cancel() {
      this.dialog = false;
    },
    imgurlsucess(response, file, fileList) {
      console.log("img", response, file, fileList);
      let data = {
        name: response.data[0],
        url: response.data[0]
      };
      this.imgdata = [];
      this.imgdata.push(data);
      this.postdata["imgUrl"] = response.data[0];
    },
    imgurlfail(response, file, fileList) {
      console.log("imgfail", response, file, fileList);
    },
    imgurlremove(file, fileList) {
      console.log(file, fileList);
      this.postdata.imgUrl = "";
    },
    imgurlexceed(response, file, fileList) {
      console.log("exceed", response, file, fileList);
      this.$notify({
        title: "超过最大上传数量",
        type: "success",
        duration: 2000
      });
    }
  }
};
</script>
<style lang="scss">
.upload-demo ul {
  display: flex;
}
.upload-demo ul li {
  width: 200px;
  margin-right: 20px;
}
.upload-demo ul li a {
  display: block;
}
.mt20 {
  margin-top: 20px;
}
</style>