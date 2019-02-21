<template>
  <div class="pd40">
    <div class="tit">修改登录密码</div>
    <el-form ref="edit"  label-width="140px" :rules="rules2" :model="fromdata" style="width:400px">
    <el-form-item label="原密码" prop="passWordO">
      <el-input type="password" v-model="fromdata.passWordO"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="passWordN"> 
      <el-input type="password" v-model="fromdata.passWordN"></el-input>
    </el-form-item>
    <el-form-item label="再次输入新密码" prop="passWordNT">
      <el-input type="password" v-model="fromdata.passWordNT"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="truepost('edit')">保存设置</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>
<script>
import { edit } from '@/api/editpwd';
export default {
  name:'Editpwd',
  data(){
    var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.fromdata.passWordN) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return{
      fromdata:{
        passWordO:'',
        passWordN:'',
        passWordNT:''
      },
      loading:false,
      rules2: {
          passWordO: [
            { required: true, message: '请输入原密码', trigger: 'blur' }
          ],
          passWordN: [
            { required: true, message: "请输入新密码" , trigger: 'blur' }
          ],
          passWordNT: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
    }
  },
  methods:{
    truepost(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let data={
              passWordO:this.fromdata.passWordO,
              passWordN:this.fromdata.passWordN,
            }
            edit(data).then((res) => {
              this.$notify({
              title: '密码重置成功',
              type: "success",
              duration: 1500
            });
            setTimeout(() => {
              this.$store.dispatch('LogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            }, 1500);
            }).catch((err) => {
              
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }
  }
}
</script>
<style lang="scss" scoped>
.pd40{
  padding: 40px;
}
.tit{
  padding-bottom: 10px;
}
.desc{
  width: 140px;
}
</style>

