<template>
  <div class="pd40">
    <div class="tit">微信设置</div>
    <el-form ref="edit" label-width="180px" :rules="rules2" :model="fromdata" style="width:500px">
      <el-form-item label="微信小程序APPID：" prop="appid">
        <el-input v-model="fromdata.appid"></el-input>
      </el-form-item>
      <el-form-item label="微信小程序SECRET：" prop="secret">
        <el-input v-model="fromdata.secret"></el-input>
      </el-form-item>
      <el-form-item label="微信商户号：" prop="mchId">
        <el-input v-model="fromdata.mchId"></el-input>
      </el-form-item>
      <el-form-item label="微信商户KEY：" prop="mchKey">
        <el-input v-model="fromdata.mchKey"></el-input>
      </el-form-item>
      <el-form-item label="上传证书：" prop="classImg">
        <el-upload
          class="upload-demo"
          :action="uploadCerts"
          :on-success="uploadsucess"
          :on-error="uploadfail"
          :on-remove="imgurlremove"
          :on-exceed="imgurlexceed"
          :headers="headers"
          :limit="1"
          :show-file-list="true"
          :file-list="imgdata"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <a
            slot="tip"
            class="desc pl20"
            target="_blank"
            href="http://kf.qq.com/faq/161222NneAJf161222U7fARv.html"
          >什么是证书</a>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="save('edit')">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import { wxselect, wxadd, wxedit } from "@/api/wxconfig";
export default {
  name: "Editpwd",
  data() {
    return {
      fromdata: {
        appid: "",
        secret: "",
        mchId: "",
        mchKey: "",
        certPath: ""
      },
      id: "",
      loading: false,
      rules2: {
        appid: [{ required: true, message: "请输入AppId", trigger: "blur" }],
        secret: [
          { required: true, message: "请输入小程序秘钥", trigger: "blur" }
        ],
        mchId: [{ required: true, message: "请输入商户号", trigger: "blur" }],
        mchKey: [
          { required: true, message: "请输入商户号秘钥", trigger: "blur" }
        ]
      },
      headers: {
        Authorization: ""
      },
      imgdata: []
    };
  },
  created() {
    this.headers.Authorization = "Bearer " + getToken();
    wxselect().then(res => {
      console.log(res);
      this.fromdata.appid = res.appid;
      this.fromdata.secret = res.secret;
      this.fromdata.mchId = res.mchId;
      this.fromdata.mchKey = res.mchKey;
      if (res.certPath != null && res.certPath != "") {
        let data = {
          name: res.certPath,
          url: res.certPath
        };
        this.imgdata.push(data);
      }
      this.id = res.id;
    });
  },
  computed: {
    ...mapGetters(["uploadCerts"])
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.id != "") {
            this.fromdata["id"] = this.id;
            this.toedit(this.fromdata);
          } else {
            this.toadd(this.fromdata);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    toadd(data) {
      wxadd(data)
        .then(() => {
          this.loading = false;
          this.$notify({
            title: "新增成功",
            type: "success",
            duration: 1500
          });
          setTimeout(() => {
            wxselect().then(res => {
              console.log(res);
              if (res != "" && res != null) {
                this.fromdata.appid = res.appid;
                this.fromdata.secret = res.secret;
                this.fromdata.mchId = res.mchId;
                this.fromdata.mchKey = res.mchKey;
                if (res.certPath != null && res.certPath != "") {
                  let data = {
                    name: res.certPath,
                    url: res.certPath
                  };
                  this.imgdata.push(data);
                }
                this.id = res.id;
              }
            });
          }, 500);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    toedit(data) {
      wxedit(data)
        .then(() => {
          this.loading = false;
          this.$notify({
            title: "编辑成功",
            type: "success",
            duration: 1500
          });
          this.imgdata = [];
          setTimeout(() => {
            wxselect().then(res => {
              console.log(res);
              if (res != "" && res != null) {
                this.fromdata.appid = res.appid;
                this.fromdata.secret = res.secret;
                this.fromdata.mchId = res.mchId;
                this.fromdata.mchKey = res.mchKey;
                if (res.certPath != null && res.certPath != "") {
                  let data = {
                    name: res.certPath,
                    url: res.certPath
                  };
                  this.imgdata.push(data);
                }
                this.id = res.id;
              }
            });
          }, 500);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    uploadsucess(response, file, fileList) {
      console.log("img", response, file, fileList);
      let data = {
        name: response.url,
        url: response.url
      };
      this.imgdata = [];
      this.imgdata.push(data);
      this.fromdata.certPath = response.url;
    },
    uploadfail(response, file, fileList) {
      console.log("imgfail", response, file, fileList);
    },
    imgurlexceed(response, file, fileList) {
      console.log("exceed", response, file, fileList);
      this.$notify({
        title: "超过最大上传数量",
        type: "success",
        duration: 2000
      });
    },
    imgurlremove(file, fileList) {
      console.log(file, fileList);
      this.fromdata.filedata = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.pd40 {
  padding: 40px;
}
.tit {
  padding-bottom: 10px;
}
.desc {
  font-size: 14px;
  color: #09a9f7;
  text-decoration: underline;
}
</style>

