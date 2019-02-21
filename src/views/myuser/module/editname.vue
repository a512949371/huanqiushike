<template>
  <el-dialog
    :append-to-body="false"
    :visible.sync="dialog"
    title="修改推荐人"
    width="400px"
    :modal="false"
  >
    <el-form :model="postdata" :rules="rules" ref="ruleForm" label-width="140px">
      <el-form-item label="请输入推荐人账号" prop="phone">
        <el-input v-model="postdata.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="truepost('ruleForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { editname } from "@/api/myuser";
export default {
  inject: ["reload"],
  name: "Editname",
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
        phone: "",
        id: ""
      },
      loading: false,
      rules: {
        phone: {
          required: true,
          message: "请输入推荐人账号",
          trigger: "blur"
        }
      }
    };
  },
  created() {},
  methods: {
    truepost(formName) {
      this.postdata.id = this.accid;
      this.$refs[formName].validate(valid => {
        console.log("valid", valid);
        if (valid) {
          this.loading = true;
          console.log("postdata", this.postdata);
          editname(this.postdata).then(res => {
            this.loading = false;
            this.$notify({
              title: "修改成功",
              type: "success",
              duration: 1500
            });
            this.dialog = false;
            this.reload();
          }).catch(()=>{
            this.loading = false;
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


