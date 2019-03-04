<template>
  <el-dialog
    :append-to-body="false"
    :visible.sync="dialog"
    title="创建虚拟子账号"
    width="500px"
    :modal="false"
  >
    <el-form
      :model="postdata"
      :rules="rules"
      ref="ruleForm"
      label-width="180px"
      label-position="top"
    >
      <el-form-item label="请输入待创建的虚拟子账号数量：" prop="number">
        <el-input v-model.number="postdata.number"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="truepost('ruleForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { newworld } from "@/api/world";
export default {
  inject: ["reload"],
  name: "Editname",
  props: {},
  data() {
    return {
      dialog: false,
      postdata: {
        number: "",
        groupName: ""
      },
      loading: false,
      rules: {
        groupName: [
          { required: true, message: "请输入创建账号位置", trigger: "blur" }
        ],
        number: [
          { required: true, message: "请输入创建个数", trigger: "blur" },
          { type: "number", message: "创建个数必须为数字值" }
        ]
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
          this.postdata.groupName = this.$route.query.groupName;
          let reg = /^[A-H]/g;
          newworld(this.postdata)
            .then(res => {
              this.loading = false;
              this.$notify({
                title: "创建成功",
                type: "success",
                duration: 1500
              });
              this.dialog = false;
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            })
            .catch(res => {
              console.log("err", res);
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


