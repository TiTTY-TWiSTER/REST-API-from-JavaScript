const express = require('express')
const path = require('path')
const {v4} = require('uuid')

const app = express()

let CONTACTS = [
    {id: v4(), name: 'Maksim', value: '+7-921-100-20-30', mark: false}
]

app.use(express.json())//ДЛЯ парсинга данных из клиентского запроса (req)

// GET данные с сервера
app.get('/api/contacts', (req,res)=>{
    //setTimeout(()=>{ //искуственная задержка (проверить лоадер)
    res.status(200).json(CONTACTS)
    //},2000)
})

// POST данные с сервера
app.post('/api/contacts', (req,res)=>{
    const contact = {...req.body, id: v4(), mark: false}
    CONTACTS.push(contact)

    res.status(201).json(contact)
})

// DELETE данные с сервера
app.delete('/api/contacts/:id', (req,res)=>{
    CONTACTS = CONTACTS.filter( c => c.id != req.params.id)
    res.status(200).json({message: 'Контакт был удален'})
})

// PUT данные с сервера
app.put('/api/contacts/:id', (req,res)=>{
    const idx = CONTACTS.findIndex(c => c.id == req.params.id)

    CONTACTS[idx] = req.body
    res.json(CONTACTS[idx])

})


app.use(express.static(path.resolve(__dirname,'client')))

const PORT = process.env.PORT || 3030
app.listen(PORT, ()=> console.log('server is runing from PORT', PORT) )

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
 

app.get('/', (req,res)=>{
    //console.log(req)
    res.sendFile(`./client/index.html`)
})