const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

// let items = [];
// let workItems = [];


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-raihan:Admin1234@cluster0.88b2v.mongodb.net/todolistDB", {useNewUrlParser:true});

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

//
const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res){

    // let day = date();

   Item.find({}, function(err, foundItems){
        // console.log(foundItems);
   if (foundItems.length === 0) {
    Item.insertMany(defaultItems, function(err){
        if(err) {
            console.log(err);
        } else {
            console.log("Successfully saved default items to DB.")
        }
    });
    res.redirect("/");
   } else {
    res.render("list", {listTitle: "Today", newListItems: foundItems});
   }
        
    });

    
  
});

//
app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName); //applying lodash for capitalizing urls

    List.findOne({name:customListName}, function(err,foundList){
        if(!err){
            if(!foundList){
                //create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();
                res.redirect("/" + customListName);
            } else {
                //show an existing list
                res.render("list",  {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    });

});

app.post("/", (req,res) => {

    const itemName = req.body.newItem;
    //creating an item here, every time the user adds an item,
    //it gets pushed to the items array, and items array is displayed 
    //in res.render above(app.get)
    const listName = req.body.list;

    const item = new Item ({
        name: itemName
    });

    if (listName === "Today") {
        item.save(); //mongoose shortcut
        res.redirect("/");
    } else {
        List.findOne({name:listName}, function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }

    

    // if (req.body.list === "Work") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // } else {
    //     items.push(item);
    //     res.redirect("/");
    // }
});

app.post("/delete", (req,res) => {
    const checkedItemId = req.body.checkbox;

    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err){
            if(!err) {
                console.log("Successfully deleted checked item");
                res.redirect("/");
            } 
    
        });
    } else { //delete request comes from a custom list
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}}, function(err, foundList) {
            if(!err) {
                res.redirect("/" + listName);
            }
        });
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