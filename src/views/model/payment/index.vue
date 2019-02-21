<template>
  <div class="app-container">
    <!--表格渲染-->
    <el-form ref="form" :model="form" :rules="rules" size="small" border style="width: 100%;">
      <el-form-item label="手续费类型：" prop="type">
        <el-radio v-model="form.type" label="0">固定金额</el-radio>
        <el-radio v-model="form.type" label="1">百分比</el-radio>
      </el-form-item>
      <el-form-item label="手续费数额：" prop="handlingFee">
        <el-input v-model="form.handlingFee" style="width: 370px;"/> <span v-show="form.type">{{form.type=='0'?'元':'%'}}</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button :loading="loading" type="primary" @click="doSubmit">保存设置</el-button>
    </div>
  </div>
</template>
<script>
import { withdrawInfo,withdrawSave } from "@/api/model";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Form",
  components: { Treeselect },
  props: {
    
  },
  data() {
    return {
      dialog: false,
      loading: false,
      form: { type: "", handlingFee: "" },
      rules: {
        handlingFee: [
          { required: true, message: "请输入手续费数额", trigger: "blur" }
        ],
        type: [{ required: true, message: "手续费类型不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      var that = this;
      withdrawInfo().then(res => {
        console.log('init',res)
        that.form = res;
      });
    },
    doSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          withdrawSave(this.form)
            .then(res => {
              console.log('withdrawSave',res);
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
      this.form = { type: "", handlingFee: "" };
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
