const express = require('express')
const bodyParser = require('body-parser')

const app = express()
let items = []

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.listen(process.env.PORT || 3000, function () {
    console.log('Connected!')
})

app.get('/', (req, res) => {
    let today = new Date()
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    }

    let day = today.toLocaleDateString('en-US', options)

    res.render('home', { kindOfDay: day, newListItem: items })
})

app.post('/', (req, res) => {
    let item = req.body.newItem
    items.push(item)
    res.redirect('/')
})
