import { initData } from '@/api/data'

export default {
  data() {
    return {
      loading: true,listdata:[], data:[], page: 0, size: 10, total: 0, url: '', params: {}, query: {}, time: 170
    }
  },
  methods: {
    async init() {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        console.log('postdata',this.params)
        initData(this.url, this.params).then(res => {
          this.data = res.content
          console.log('data', res)
          setTimeout(() => {
            this.loading = false
          }, this.time)
          resolve(res)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    beforeInit() {
      return true
    },
    pageChange(e) {
      var that =this;
      this.page = e - 1
      this.init().then((res)=>{
        console.log('then',res)
        that.listdata=res
      })
    },
    sizeChange(e) {
      var that =this;
      this.page = 0
      this.size = e
      this.init().then((res)=>{
        console.log('then',res)
        that.listdata=res
      })
    }
  }
}
