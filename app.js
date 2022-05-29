const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

let items = [];
let workItems = [];


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res){

    let day = date();
   
    res.render("list", {listTitle: day, newListItems: items
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