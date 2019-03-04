<template>
  <el-dialog
    :append-to-body="false"
    :visible.sync="dialog"
    :title="isadd?'编辑商品':'新增商品'"
    width="100%"
    style="padding-left:180px"
    :modal="false"
  >
    <el-form :model="postdata" :rules="rules" ref="edit" label-width="120px">
      <el-form-item label="商品名称" prop="title">
        <el-input v-model="postdata.title"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="pcid">
        <el-select v-model="postdata.pcid" placeholder="请选择">
          <el-option
            v-for="item in classdata"
            :key="item.id"
            :label="item.className"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="关联模式" prop="classNote">
        <el-input v-model="postdata.classNote"></el-input>
      </el-form-item>-->
      <el-form-item label="排序" prop="sort">
        <el-input v-model="postdata.sort"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="postdata.price"></el-input>
      </el-form-item>
      <el-form-item label="规格" prop="guige">
        <el-input v-model="postdata.guige"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="number">
        <el-input v-model="postdata.number"></el-input>
      </el-form-item>
      <el-form-item label="商品类型" prop="productModel">
        <el-radio-group v-model="postdata.productModel">
          <el-radio label="1">公排商品</el-radio>
          <el-radio label="0">普通商品</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="首页推荐" prop="isPage">
        <el-radio-group v-model="postdata.isPage">
          <el-radio label="0">开启</el-radio>
          <el-radio label="1">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品简介" prop="content">
        <el-input v-model="postdata.content"></el-input>
      </el-form-item>
      <el-form-item label="商品详情">
        <div ref="editor" style="text-align:left;margin: 5px;"></div>
      </el-form-item>
      <el-form-item label="商品图片(封面图)">
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
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="详情图片">
        <el-upload
          class="upload-demo"
          id="Imglist"
          :action="imagesUploadApi"
          :on-success="imglistsucess"
          :on-remove="imglistremove"
          :on-error="imglistfail"
          :on-exceed="imglistexceed"
          :headers="headers"
          :show-file-list="true"
          list-type="picture"
          multiple
          :limit="10"
          :file-list="imglist"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>
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
import { initData } from "@/api/data";
import { addShopOne, editShopOne } from "@/api/shop";
export default {
  name: "Edit",
  props: {
    isadd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入价格"));
      } else {
        if (!isNaN(Number(value)) && Number(value) > 0) {
          console.log(value, !isNaN(Number(value)));
          if (value.split(".")[1] && value.split(".")[1].length > 2) {
            callback(new Error("价格最多只能输入2位小数"));
          } else {
            callback();
          }
        } else {
          callback(new Error("请输入正确的价格"));
        }
      }
    };
    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入商品排序"));
      } else {
        console.log(value);
        if (
          !isNaN(Number(value)) &&
          Number(value) > 0 &&
          value.toString().indexOf(".") == -1
        ) {
          callback();
        } else {
          this.isprice = false;
          callback(new Error("请输入一个正整数"));
        }
      }
    };
    var validatePass4 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入商品库存"));
      } else {
        if (
          !isNaN(Number(value)) &&
          Number(value) > 0 &&
          value.toString().indexOf(".") == -1
        ) {
          callback();
        } else {
          this.isprice = false;
          callback(new Error("请输入一个正整数"));
        }
      }
    };
    return {
      dialog: false,
      postdata: {
        imglist: []
      },
      loading: false,
      classdata: [],
      rules: {
        title: [{ required: true, message: "请输入商品名称" }],
        pcid: [{ required: true, message: "请选择商品分类" }],
        sort: [{ validator: validatePass3, trigger: "blur" }],
        price: [{ validator: validatePass2, trigger: "blur" }],
        number: [{ validator: validatePass4, trigger: "blur" }],
        guige: [{ required: true, message: "请输入规格" }],
        content: [{ required: false, message: "请输入商品描述" }],
        productModel: [{ required: true, message: "商品类型为必选字段" }],
        isPage: [{ required: true, message: "首页推荐为必选字段" }]
      },
      headers: {
        Authorization: ""
      },
      showtime: true,
      imgdata: [],
      imglist: [],
      isprice: true
    };
  },
  created() {
    this.headers.Authorization = "Bearer " + getToken();
    this.init().then(res => {
      this.classdata = res.data;
      console.log("this.classdata", this.classdata);
    });
  },
  watch: {
    dialog: function(val, oldval) {
      console.log("isdd", this.isadd);
      if (val && !this.isadd) {
        setTimeout(() => {
          this.createwangeditor();
        }, 100);
      }
    },
    postdata: function(val, oldval) {
      this.createwangeditor();
    }
  },
  computed: {
    ...mapGetters(["imagesUploadApi"])
  },
  methods: {
    createwangeditor() {
      this.showtime = false;
      // console.log("?", this.$refs,this.postdata.proDetails);
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
        this.postdata.proDetails = html;
      };
      editor.create();
      editor.txt.html(this.postdata.proDetails || "");
    },
    init() {
      return new Promise((resolve, reject) => {
        initData("api/productclass/selectList", { page: 0, size: 10 })
          .then(res => {
            console.log("?data", res);
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    truepost(formName, id) {
      console.log("?", this.postdata);
      this.$refs[formName].validate(valid => {
        console.log("valid", valid);
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
      addShopOne(this.postdata)
        .then(res => {
          this.loading = false;
          this.$notify({
            title: "创建成功",
            type: "success",
            duration: 1500
          });
          this.dialog = false;
          this.postdata.proDetails = "";
          this.$parent.init().then(res => {
            console.log("then", res, this.$parent);
            this.$parent.listdata = res;
          });
        })
        .catch(res => {
          console.log("err", res);
          this.loading = false;
        });
    },
    toedit() {
      var that = this;
      editShopOne(this.postdata)
        .then(res => {
          this.loading = false;
          this.$notify({
            title: "编辑成功",
            type: "success",
            duration: 1500
          });
          this.postdata.proDetails = "";
          this.dialog = false;
          this.$parent.init().then(res => {
            console.log("then", res);
            this.$parent.listdata = res;
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
      this.imgdata = [];
      this.imglist = [];
      this.postdata.proDetails = "";
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
      if (this.isadd) {
        this.postdata.imgUrl = response.data[0];
      } else {
        this.postdata["imgUrl"] = response.data[0];
      }
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
    },
    imglistsucess(response, file, fileList) {
      console.log("imglist", response, file, fileList);
      let data = {
        name: response.data[0],
        url: response.data[0]
      };
      this.postdata.imglist.push({ imgUrl: response.data[0] });
      // this.imglist.push(data);
    },
    imglistfail(response, file, fileList) {
      console.log("imgfail", response, file, fileList);
    },
    imglistexceed(response, file, fileList) {
      console.log("exceed", response, file, fileList);
      this.$notify({
        title: "超过最大上传数量",
        type: "success",
        duration: 2000
      });
    },
    imglistremove(file, fileList) {
      console.log(file, fileList);
      this.postdata.imglist = [];
      this.imglist = [];
      fileList.map(item => {
        let imgdata = {
          name: item.url,
          url: item.url
        };
        let data = {
          imgUrl: item.url
        };
        this.postdata.imglist.push(data);
        this.imglist.push(imgdata);
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
</style>

<style lang="scss" scoped>
.pd20 {
  padding: 0 20px;
  font-size: 16px;
  color: #333;
}
.ml120 {
  margin-left: 120px;
}
.input {
  flex: 1;
  line-height: 30px;
}
.img-box {
  padding-right: 20px;
}
.img {
  width: 120px;
  height: 120px;
  display: block;
}
</style>


