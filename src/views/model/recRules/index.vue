<template>
  <div class="app-container">
    <!--表格渲染-->
    <el-form ref="form" :model="form" :rules="rules" size="small" border style="width: 100%;">
      <el-form-item label="烧伤制度" prop="isEnable">
        <el-radio v-model="form.isEnable" label='1'>开</el-radio>
        <el-radio v-model="form.isEnable" label='0'>关</el-radio>
      </el-form-item>
      <el-form-item label="推荐奖励百分比：" prop="percent" >
        <el-input v-model="form.percent" style="width: 370px;"/> %
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button :loading="loading" type="primary" @click="doSubmit">保存设置</el-button>
    </div>
  </div>
</template>
<script>
import { rulesInfo, rulesSave } from "@/api/model";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Form",
  components: { Treeselect },
  props: {},
  data() {
    let checkPercent = (rule, value, callback)=> {
      if (value > 0) {
        callback();
      } else {
        callback( new Error("推荐奖励百分比不能小于0"));
      }
    };
    return {
      dialog: false,
      loading: false,
      form: { isEnable: 0, percent: "" },
      rules: {
        percent: [
          { required: true, message: "请输入推荐奖励百分比", trigger: "blur" },
          { validator: checkPercent, trigger: "blur" }
        ],
        isEnable: [{ required: true, message: "状态不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      var that = this;
      rulesInfo().then(res => {
        that.form = res.data;
      });
    },
    doSubmit() {
      console.log('doSubmit');
      this.$refs["form"].validate(valid => {
        console.log('valid',valid);
        if (valid) {
          this.loading = true;
          rulesSave(this.form)
            .then(res => {
              this.resetForm();
              this.$notify({
                title: "修改成功",
                type: "success",
                duration: 2500
              });
              this.loading = false;
              this.init();
            })
            .catch(err => {
              this.loading = false;
              console.log(err.response.data.message);
            });
        } else {
          return false;
        }
      });
    },

    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.roleIds = [];
      this.form = { username: "", email: "" };
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
