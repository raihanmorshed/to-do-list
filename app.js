const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

// let items = [];
// let workItems = [];


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser:true});

const itemsSchema = {
    name: String
};

//creating mongoose model
const Item = mongoose.model("Item",itemsSchema);

//creating mongoose documents
const item1 = new Item ({
    name: "Welcome to your to do list!"
});

const item2 = new Item({
    name: "Hit the + button tot add a new to do"
});

const item3 = new Item({
    name: "GO agead and add your first list"
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function(err){
    if(err) {
        console.log(err);
    } else {
        console.log("Successfully saved default items to DB.")
    }
});

app.get("/", function(req, res){

    // let day = date();
   
    Item.find({}, function(err, foundItems){
        res.render("list", {listTitle: "Today", newListItems: foundItems});
        // console.log(foundItems);
    });

    
  
});

app.post("/", (req,res) => {

    var item = req.body.newItem;
    //creating an item here, every time the user adds an item,
    //it gets pushed to the items array, and items array is displayed 
    //in res.render above(app.get)

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", (req,res) => {
    res.render("list", {listTitle:"Work List", newListItems: workItems});

});

app.post("/work", (req,res) => {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.get("/about", (req,res) => {
    res.render("about");
});


app.listen(3000, function(){
  console.log("Server started on port 3000.");
}); 