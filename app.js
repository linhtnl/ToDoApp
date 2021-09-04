const express = require('express')
const bodyParser = require('body-parser')
const date = require(__dirname + '/date.js')

const app = express()
let items = []
let workItems = []
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.listen(process.env.PORT || 3000, function () {
    console.log('Connected!')
})

app.get('/', (req, res) => {
    res.render('home', { listTitle: date(), newListItems: items })
})

app.post('/', (req, res) => {
    let item = req.body.newItem
    if (req.body.list === 'Work List') {
        workItems.push(item)
        res.redirect('/work')
    } else {
        items.push(item)
        res.redirect('/')
    }

})

app.get('/work', (req, res) => {
    res.render('home', { listTitle: 'Work List', newListItems: workItems })
})
