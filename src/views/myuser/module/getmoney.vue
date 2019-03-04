<template>
  <el-dialog :append-to-body="false" :visible.sync="dialog" title="充值" width="400px" :modal="false">
    <el-form :model="postdata" :rules="rules" ref="ruleForm" label-width="140px">
      <el-form-item label="请输入充值金额" prop="rechargeAmount">
        <el-input v-model="postdata.rechargeAmount"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="truepost('ruleForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getmoney } from "@/api/myuser";
export default {
  inject: ["reload"],
  name: "Getmoney",
  props: {
    data: {
      type: Object
    },
    accid: {
      type: Number,
      required: true
    }
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入充值金额"));
      } else {
        if (!isNaN(Number(value)) && Number(value) > 0) {
          console.log(value, !isNaN(Number(value)));
          if (value.split(".")[1] && value.split(".")[1].length > 2) {
            callback(new Error("充值金额最多只能输入2位小数"));
          } else {
            callback();
          }
        } else {
          callback(new Error("请输入正确的充值金额"));
        }
      }
    };
    return {
      dialog: false,
      postdata: {
        rechargeAmount: "",
        account: {
          id: ""
        }
      },
      loading: false,
      rules: {
        rechargeAmount: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  created() {
    console.log("postdata", this.data);
  },
  methods: {
    truepost(formName) {
      this.$refs[formName].validate(valid => {
        console.log("valid", valid);
        if (valid) {
          this.loading = true;
          this.postdata.account.id = this.accid;
          console.log("postdata", this.postdata);
          if (Number(this.postdata.rechargeAmount) > 0) {
            getmoney(this.postdata)
              .then(res => {
                this.loading = false;
                this.$notify({
                  title: "充值成功",
                  type: "success",
                  duration: 1500
                });
                this.dialog = false;
                this.reload();
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            this.loading = false;
            this.$notify({
              title: "充值金额不能小于0",
              type: "success",
              duration: 1500
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancel() {
      this.dialog = false;
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
market_out.el-input__inner {
  height: 36px;
}
</style>


