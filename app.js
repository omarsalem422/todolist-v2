/////// template for starting any node project //////////////////////////////////////////////////////
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

let items = ["Buy Food", "Cook Food", "Eat Food"];
let daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let day, today, toDay, options;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

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

// // C  - as in C RUD
// mongoose.connection.collections.items.drop();

// Item.insertMany(defaultItems, (err) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log("Successfully saved all the items to DB.")
//     }
// });

function setDate() {
    today = new Date();
    toDay = `Today's date is ${daysOfTheWeek[today.getDay()]} `;
    options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    day = today.toLocaleDateString("en-US", options);

}
app.get("/", (req, res) => {

    setDate();

    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Successfully saved all the items to DB.")
                }
            });
            res.redirect("/");
        } else {
            res.render("list", { kindOfDay: day, newListItems: foundItems, toDay: toDay });
        }
    });

});

app.post("/", (req, res) => {
    let item = req.body.newItem;
    items.push(item);
    res.redirect("/");
});

app.listen(5000, () => {
    console.log("server started on port 3000 ...")
});