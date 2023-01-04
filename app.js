
const express=require("express");
const bodyParser=require("body-parser");

const app=express();
const mongoose=require("mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));

mongoose.set('strictQuery',false);
// mongoose.connect("mongodb://127.0.0.1:27017/todolist-DB");
mongoose.connect("mongodb+srv://admin-uday:Test123@cluster0.pbyinhw.mongodb.net/todolistDB");

// --------------------------------------------- Schemas --------------------------------------------- //

const itemSchema=new mongoose.Schema({
    item:String
});

const listSchema= new mongoose.Schema({
    name:String,
    list:[itemSchema]
});

const ListModel=mongoose.model("list", listSchema);
const itemModel=mongoose.model("item",itemSchema);

const item1=new itemModel({item:"<---- Never Give Up !!! ---->"});
// item1.save();
const defaultList=[item1];







const port=3000;







// .............................................. Post requests ...................................................... //

app.post("/", function(req,res){
    console.log(req.body);
    const titleFromReqestRoute=req.body.title;
    const itemFromRequestRoute=req.body.item;
    if(itemFromRequestRoute.length===0){
        console.log("Length=0");
        res.redirect("/");
    }else {
        const newItem=new itemModel({item:itemFromRequestRoute});
        // newItem.save();

        ListModel.findOne({name:titleFromReqestRoute},function(err,foundItems){
            if(err){
                console.log(err);
            }else{
                foundItems.list.push(newItem);
                foundItems.save();
                if(titleFromReqestRoute==="To-Do-List"){
                    res.redirect("/");
                }else{
                    res.redirect("/"+titleFromReqestRoute);
                }
            }
        });
        
    }
});

app.post("/delete", function(req,res){
    console.log(req.body);
    const checkedItemId=req.body.item_id;
    const checkedListTitle=req.body.listName;
    
    ListModel.findOneAndUpdate({name:checkedListTitle},{$pull:{list:{_id:checkedItemId}}},function(err,foundList){
        if(err){
            console.log(err);
        }else{
            if(checkedListTitle==="To-Do-List"){
                res.redirect("/");
            }else{
                res.redirect("/"+checkedListTitle);
            }
        }
    })
});

// .............................................. Get requests ...................................................... //

app.get("/", function(req,res){

    ListModel.findOne({name:"To-Do-List"},function(err,foundItems){
        if(!err){
            if(!foundItems){
                console.log("No items found.");
                const newList=new ListModel({name:"To-Do-List", list:[]});
                newList.save();
                res.redirect("/");
            }else{
                console.log("Items found.")
                res.render("index",{
                    title:foundItems.name,
                    list:foundItems.list
                });
            }
        }
    })
    
});

app.get("/:customListName", function(req,res){
    console.log(req.params);
    const customListName=req.params.customListName;
    
    ListModel.findOne({name:customListName},function(err,foundItems){
        if(!err){
            if(!foundItems){
                const newList=new ListModel({name:customListName,list:[]});
                newList.save();
                res.redirect("/"+customListName);
            }else{
                res.render("index", {
                    title:customListName,
                    list:foundItems.list
                });
            }
        }
    });
    
});


// .............................................. Listen ...................................................... //

app.listen(port, function(){
    console.log("Server started on port "+port);
});



// -------------------------------------------- commented section ---------------------------------------------- //

// let today=new Date();
    // let options={ 
    //     weekday:"long", day:"numeric", month:"short", year:"numeric" 
    // }

    // today:today.toLocaleDateString("en-US",options),
