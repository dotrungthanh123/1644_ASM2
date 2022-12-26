const express = require('express')
const app = express()
app.use(express.static('public'))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

const { addItem, getAllItems, deleteItem, editItem, getItem } = require('./databaseHandler');

const uri = 'mongodb+srv://dotrungthanh:dotrungthanh@cluster0.d0if6r0.mongodb.net/?retryWrites=true&w=majority'

app.get('/', async(req, res) => {
    let items = await getAllItems()
    res.render('home', { items: items })
})

app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/add', async(req, res) => {
    const item = req.body.item

    const price = req.body.price
    const description = req.body.description
    const img = req.body.img
    const newItem = {
        item: item,
        price: Number.parseFloat(price),
        img: img,
        description: description
    }
    await addItem(newItem)
    res.redirect('/')
})

app.get('/delete', async(req, res) => {
    await deleteItem(req.query.id)
    res.redirect('/')
})

app.get('/edit', async(req, res) => {
    item = await getItem(req.query.id)
    res.render('edit', { item: item })
})

app.post('/edit', async(req, res) => {
    const id = req.body.id
    const item = req.body.item
    const price = Number.parseFloat(req.body.price)
    const img = req.body.img
    const description = req.body.description
    await editItem(id, item, price, img, description)
    res.redirect('/')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, (req, res) => console.log(`Server's running on ${PORT}`))