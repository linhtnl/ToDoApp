const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const date = require(__dirname + '/date.js')
const _ = require('lodash')

const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

//Mongo-url
const uri = "mongodb+srv://linhtnl:Cuxin123@cluster0.1ui53.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

//Mongo connection
mongoose.connect(uri)
//Schemas
const itemSchema = {
    name: String
}
const listSchema = {
    name: String,
    items: [itemSchema]
}
const Item = mongoose.model('Item', itemSchema)
const List = mongoose.model('List', listSchema)

//Open port on local and Heroku
app.listen(process.env.PORT || 3000, function () {
    console.log('Connected!')
})

app.get('/', (req, res) => {
    Item.find({}, (err, foundItems) => {
        res.render('home', { listTitle: 'Today', newListItems: foundItems })
    })

})

app.post('/', (req, res) => {
    let item = new Item({
        name: req.body.newItem
    })
    const listName = req.body.list
    if (listName === 'Today') {
        item.save()
        res.redirect('/')
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            foundList.items.push(item)
            foundList.save()
            res.redirect('/' + listName)
        })
    }
})

app.post('/delete', (req, res) => {
    let id = req.body.checkbox
    let listName = req.body.listName
    if (listName === 'Today') {
        Item.findByIdAndRemove(id, (err) => {
            if (!err) {
                console.log("Delete success")
                res.redirect('/')
            }
        })
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: id } } }, (err, foundList) => {
            if (!err) {
                res.redirect('/' + listName)
            }
        })
    }
})
//Create new list by custom list name
app.get('/:customListName', (req, res) => {
    const listName = _.capitalize(req.params.customListName)
    let items = []
    List.findOne({ name: listName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: listName,
                    items: items
                })
                list.save()
                res.redirect('/' + listName)
            }else {
                res.render('home', { listTitle: foundList.name, newListItems: foundList.items })
            }
        } 
    })

})

