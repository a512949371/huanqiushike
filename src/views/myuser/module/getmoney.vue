<template>
  <el-dialog :append-to-body="false" :visible.sync="dialog" title="充值" width="400px" :modal="false">
    <el-form :model="postdata" :rules="rules" ref="ruleForm" label-width="140px">
      <el-form-item label="请输入充值金额" prop="rechargeAmount">
        <el-input v-model.number="postdata.rechargeAmount"></el-input>
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
        rechargeAmount: [
          { required: true, message: "请输入充值金额", trigger: "blur" },
          { type: "number", message: "金额必须为数字值" }
        ]
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
          getmoney(this.postdata).then(res => {
            this.loading = false;
            this.$notify({
              title: "充值成功",
              type: "success",
              duration: 1500
            });
            this.dialog = false;
            this.reload();
          });
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


