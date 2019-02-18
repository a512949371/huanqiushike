<template>
  <el-dialog
    :append-to-body="false"
    :visible.sync="dialog"
    title="修改位置"
    width="400px"
    :modal="false"
  >
    <el-form :model="postdata" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="请输入新位置" prop="groupPosition">
        <el-input v-model="postdata.groupPosition"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="truepost('ruleForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { editchild } from "@/api/myuser";
export default {
  inject: ["reload"],
  name: "Child",
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
        groupPosition: "",
        accountId: "",
        accountNo: "",
        accountSubId: "",
        position: ""
      },
      loading: false,
      rules: {
        groupPosition: {
          required: true,
          message: "请输入新位置",
          trigger: "blur"
        }
      }
    };
  },
  created() {},
  methods: {
    truepost(formName) {
      this.$refs[formName].validate(valid => {
        console.log("valid", valid);
        if (valid) {
          this.loading = true;
          (this.postdata.accountId = this.accid),
            (this.postdata.accountNo = this.data.accountNo),
            (this.postdata.accountSubId = this.data.id),
            (this.postdata.position = this.data.groupName + this.data.position);
          console.log("postdata", this.postdata);
          editchild(this.postdata).then(res => {
            this.loading = false;
            this.$notify({
              title: "修改成功",
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


