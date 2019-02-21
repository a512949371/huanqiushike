<template>
  <div class="pd40">
    <div class="tit">短信推送配置</div>
    <!-- <div class="flex pt10" v-for="item in listdata" :key="item.id">
      <div class="desc">{{item.msgName}}:</div>
      <div class="radio-box">
        <el-radio :model="item.msgKey" :label="item.status">开启</el-radio>
        <el-radio :model="item.msgKey" :label="!item.status">关闭</el-radio>
      </div>
    </div> -->
    <div class="flex pt10">
      <div class="desc">注册短信:</div>
      <div class="radio-box"  >
        <el-radio-group v-model="listdata.REGISTER_MSG" @change="changeradio('REGISTER_MSG',listdata.REGISTER_MSG)">
          <el-radio  label="true" >开启</el-radio>
          <el-radio  label="false">关闭</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="flex pt10">
      <div class="desc">转账短信:</div>
      <div class="radio-box">
        <el-radio-group v-model="listdata.TRANSFER_MSG" @change="changeradio('TRANSFER_MSG',listdata.TRANSFER_MSG)">
          <el-radio  label="true" >开启</el-radio>
          <el-radio  label="false">关闭</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="flex pt10">
      <div class="desc">提现短信:</div>
      <div class="radio-box">
        <el-radio-group v-model="listdata.TIXIAN_MSG" @change="changeradio('TIXIAN_MSG',listdata.TIXIAN_MSG)">
          <el-radio  label="true" >开启</el-radio>
          <el-radio  label="false">关闭</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="flex pt10">
      <div class="desc">登录短信:</div>
      <div class="radio-box">
        <el-radio-group v-model="listdata.LOGIN" @change="changeradio('LOGIN',listdata.LOGIN)">
          <el-radio  label="true" >开启</el-radio>
          <el-radio  label="false">关闭</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="flex pt10">
      <div class="desc">修改密码:</div>
      <div class="radio-box">
        <el-radio-group v-model="listdata.CHANGE_PSW_MSG" @change="changeradio('CHANGE_PSW_MSG',listdata.CHANGE_PSW_MSG)">
          <el-radio  label="true" >开启</el-radio>
          <el-radio  label="false">关闭</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="flex-box pt20"><el-button type="primary" :loading="loading" @click="save()">保存设置</el-button></div>
  </div>
</template>
<script>
import { smsdata,editsms } from '@/api/sms';
export default {
  name:'Sms',
  data(){
    return{
      listdata:{},
      postdata:{
        list:[]
      },
      loading:false
    }
  },
  created(){
    this.ajaxdata()
  },
  methods:{
    changeradio(value,state){
      if(this.postdata.list.length>0){
        this.postdata.list.map((item)=>{
          if(item.msgType==value){
            item.status=state
          }else{
            let data={
              msgType:value,
              status:state
            }
            this.postdata.list.push(data)
            console.log('?')
          }
          console.log('?!')
          return this.postdata.list
        })
      }else{
        let data={
          msgType:value,
          status:state
        }
        this.postdata.list.push(data)
      }
      
      console.log(this.postdata.list)
    },
    ajaxdata(){
      smsdata().then((res)=>{
        console.log(res)
        this.listdata=res
      })
    },
    save(){
      var that=this;
      if(this.postdata.list.length>0){
        this.loading=true
        console.log(this)
        editsms(this.postdata).then((res)=>{
          console.log(res)
          this.$notify({
            title: '修改成功',
            type: 'success',
            duration: 1500
          })
          this.loading=false
        }).catch(()=>{
          this.loading=false;
          that.ajaxdata()
        })
      }
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
