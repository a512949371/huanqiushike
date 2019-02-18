<template>
  <el-dialog
    :append-to-body="false"
    :visible.sync="dialog"
    title="关联子账号"
    width="400px"
    :modal="false"
  >
    <el-form :model="postdata" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="请输入子账号" prop="accountNo">
        <el-input v-model="postdata.accountNo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="truepost('ruleForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { fchangt } from "@/api/world";
export default {
  inject: ["reload"],
  name: "Reducemoney",
  props: {
    accid: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      postdata: {
        accountNo: "",
        id: ""
      },
      loading: false,
      rules: {
        accountNo: [
          { required: true, message: "请输入子账号", trigger: "blur" }
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
          this.postdata.id = this.accid;
          fchangt(this.postdata).then(res => {
            this.loading = false;
            this.$notify({
              title: "关联成功",
              type: "success",
              duration: 1500
            });
            this.dialog = false;
            setTimeout(() => {
              window.location.reload();
            }, 1000);
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


