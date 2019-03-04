import { userinfo,childlist } from '@/api/myuser'
const myuser={
  state:{
    infodata:'',
    childdata:''
  },
  mutations:{
    Infodata(state,data){
      state.infodata=data
    },
    Childdata(state,data){
      state.childdata=data
    }
  },
  actions:{
    Getuserinfo:function({commit},data){
     return userinfo(data).then((res)=>{
        console.log('info',res)
        commit('Infodata',res)
        return true
      })
    },
    Childlist:function({commit},data){
      return childlist(data).then((res)=>{
        console.log('Childdata',res)
        commit('Childdata',res)
        return true
      }).catch(()=>{
        
      })
    }
  }
}
export default myuser