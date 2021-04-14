import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'

Vue.component('loader', {
    template:`<div class="spinner-border" role="status">
  </div>`
})

new Vue({
    el:'#app',
    data(){
        return{
            loading:false,
            form:{
                name:'',
                value:''
            },
            contacts:[]
        }
    },
    computed:{
        validCreate(){
            return this.form.value.trim() && this.form.name.trim()
        }
    },
    methods:{
        async createContact(){
            const {...contact} = this.form

            const newContact = await request('/api/contacts','POST',{...contact})

            this.contacts.push(newContact)

            this.form.name = this.form.value = ''

           
        },
        async markContact(id){
            const contact = this.contacts.find(c => c.id == id)   
            const updated = await request(`/api/contacts/${id}`,'PUT',{...contact, mark:true})
            
            contact.mark = updated.mark
            
        },
        delContact(id){

            request(`/api/contacts/${id}`, 'DELETE').then(res=>{
                if(res.message.length > 0){
                    this.contacts = this.contacts.filter(c => c.id != id)
                }
            })

        }
    },
    async mounted(){
        this.loading = true

        this.contacts = await request('/api/contacts')

        this.loading = false
        
    }
})

async function request(url, method = "GET", data = null){
    try{
        const headers = {}
        let body

        if(data){
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }

        const response = await fetch(`${url}`,{
            method: `${method}`,
            headers,
            body
        })
        return await response.json()
    }  catch(e){
        console.warn('Error', e.message)
    }  
}