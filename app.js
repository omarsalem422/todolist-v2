/////// template for starting any node project ////////////////
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let items = [ "Buy Food", "Cook Food", "Eat Food"];
let daysOfTheWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    let today = new Date();

    let toDay = `Today's date is ${daysOfTheWeek[today.getDay()]} `;

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US", options);

    res.render("list", {kindOfDay: day, newListItems: items, toDay: toDay });
});

app.post("/", (req, res) => {
    let  item = req.body.newItem;
    items.push(item);
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("server started on port 3000 ...")
});