const express  = require('express')
const app = express();

const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');

const dbo = require('./db');
const ObjectId = dbo.ObjectId;

app.engine('hbs',exhbs.engine({layoutsDir:'views/',defaultLayout:'main',extname:'hbs'}))

app.set('view engine','hbs');
app.set('views','views');

app.use(bodyparser.urlencoded({extended:true}));

app.get('/',async(req,res)=>{

    let database = await dbo.getDatabase();
    const collection = database.collection('workers');
    const cursor = collection.find({});
    let employee = await cursor.toArray();

    let edit_id, edit_detail;
    //If get edit request. fetch the data process...
    if(req.query.edit_id){
        edit_id = req.query.edit_id;
        edit_detail = await collection.findOne({_id:new ObjectId(edit_id)})
    }
    // deletion
    if(req.query.delete_id){
        await collection.deleteOne({_id: new ObjectId(req.query.delete_id)})
        return res.redirect('/?status = 3')
    }

    let message = '';
    switch(req.query.status){
        case '1':
            message = "insert Success";
            break;
        case '2':
            message = "update Success";
            break;
        case '3':
            message = "deletion Success";
            break;
        default:
            break;
    }
    res.render('main',{message,employee,edit_id,edit_detail});
})

// Add data to DB (Read operation)
app.post('/store',async(req,res)=>{
    let database = await dbo.getDatabase();
    const collection = database.collection('workers');
    let emp = {name:req.body.name,pos:req.body.pos}
    await collection.insertOne(emp)
    return res.redirect('/?status=1');
})
// update data to DB
app.post('/update/:edit_id',async(req,res)=>{
    let database = await dbo.getDatabase();
    const collection = database.collection('workers');
    let emp = {name:req.body.name,pos:req.body.pos}
    let edit_id = req.params.edit_id;
    await collection.updateOne({_id:new ObjectId(edit_id)},{$set:emp})
    return res.redirect('/?status=2');

})

app.listen(8000,()=>{
    console.log("listing to port 8000");
})