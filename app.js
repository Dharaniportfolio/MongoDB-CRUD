const express  = require('express')
const app = express();

const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');

const dbo = require('./db');

app.engine('hbs',exhbs.engine({layoutsDir:'views/',defaultLayout:'main',extname:'hbs'}))

app.set('view engine','hbs');
app.set('views','views');

app.use(bodyparser.urlencoded({extended:true}));

app.get('/',async(req,res)=>{

    let database = await dbo.getDatabase();
    const collection = database.collection('workers');
    const cursor = collection.find({});
    let employee = await cursor.toArray();

    let message = '';
    switch(req.query.status){
        case '1':
            message = "insert Success";
            break;
        default:
            break;
    }
    res.render('main',{message,employee});
})

app.post('/details',async(req,res)=>{
    let database = await dbo.getDatabase();
    const collection = database.collection('workers');
    let emp = {name:req.body.name,pos:req.body.pos}
    await collection.insertOne(emp)
    return res.redirect('/?status=1');
})

app.listen(8000,()=>{
    console.log("listing to port 8000");
})