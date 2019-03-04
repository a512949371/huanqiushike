<template>
  <el-dialog
    :append-to-body="false"
    :visible.sync="dialog"
    title="新增订单"
    width="500px"
    style="padding-left:180px"
    :modal="false"
  >
    <el-form :model="postdata" :rules="rules" ref="add" label-width="120px">
      <el-form-item label="账号" prop="account">
        <el-input v-model="postdata.account"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="postdata.address"></el-input>
      </el-form-item>
      <el-form-item label="订单数量" prop="number">
        <el-input v-model.number="postdata.number"></el-input>
      </el-form-item>
      <el-form-item label="购买商品" prop="goodsId">
        <el-select v-model="postdata.goodsId" placeholder="请选择">
          <el-option v-for="item in classdata" :key="item.id" :label="item.title" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否扣除余额" prop="isDeduct">
        <el-radio-group v-model="postdata.isDeduct">
          <el-radio label="YES">是</el-radio>
          <el-radio label="NO">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="truepost('add')">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import { initData } from "@/api/data";
import { addorder } from "@/api/shop";
export default {
  name: "Add",
  data() {
    return {
      dialog: false,
      postdata: {
        account: "",
        address: "",
        number: "",
        goodsId: "",
        isDeduct: "YES"
      },
      loading: false,
      classdata: [],
      rules: {
        account: [{ required: true, message: "请输入会员账号" }],
        address: [{ required: false, message: "请选择收货地址" }],
        number: [
          { required: true, message: "请输入购买数量" },
          { type: "number", message: "购买数量必须为数字值" }
        ],
        goodsId: [{ required: true, message: "请选择购买商品" }],
        isDeduct: [{ required: true, message: "请选择是否扣款" }]
      },
      showtime: true
    };
  },
  created() {
    this.init().then(res => {
      this.classdata = res;
      console.log("this.classdata", this.classdata);
    });
  },
  methods: {
    init() {
      return new Promise((resolve, reject) => {
        initData("api/product/queryAll")
          .then(res => {
            console.log("?data", res);
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    truepost(formName) {
      console.log("?", this.postdata);
      this.$refs[formName].validate(valid => {
        console.log("valid", valid);
        if (valid) {
          this.loading = true;
          addorder(this.postdata)
            .then(res => {
              console.log("res", res);
              if (res.isOK) {
                this.loading = false;
                this.$refs.add.resetFields();
                this.$notify({
                  title: "创建成功",
                  type: "success",
                  duration: 1500
                });
                this.dialog = false;
              } else {
                this.loading = false;
                this.$notify({
                  title: res.msg,
                  type: "success",
                  duration: 1500
                });
              }
            })
            .catch(res => {
              console.log("err", res);
              this.loading = false;
            });
          console.log("?", this.postdata);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancel() {
      this.$refs.add.resetFields();
      this.dialog = false;
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


