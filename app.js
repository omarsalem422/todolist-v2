/////// template for starting any node project ////////////////
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

let items = ["Buy Food", "Cook Food", "Eat Food"];
let daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const Item = mongoose.model('item', { name: String });

const item1 = new Item({
    name: "Welcome to your todolist"
});
const item2 = new Item({
    name: "Hit the + button to add a new item"
});
const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

// C  - as in C RUD
mongoose.connection.collections.items.drop();

Item.insertMany(defaultItems, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Successfully saved all the items.")
    }
});

// // R - as in CRUD
// Item.find({},(err, items) => {
//     if (err) {
//         console.log(err);
//     } else {
//         mongoose.connection.close();
//         items.forEach( (item) => {
//         console.log(item.name);
//         });
//     }
// })

app.set('view engine', 'ejs');

app.get("/", (req, res) => {

    
    // R - as in CRUD
    Item.find({}, (err, _items) => {
        if (err) {
            console.log(err);
        } else {
            items = _items;
            mongoose.connection.close();
            items.forEach((item) => {
                console.log(item.name);
            });
        }
    });


    let today = new Date();

    let toDay = `Today's date is ${daysOfTheWeek[today.getDay()]} `;

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US", options);

    res.render("list", { kindOfDay: day, newListItems: items, toDay: toDay });

});

app.post("/", (req, res) => {
    let item = req.body.newItem;
    items.push(item);
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("server started on port 3000 ...")
});