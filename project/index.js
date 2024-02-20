//import all the modules
// let Mydatabase= require('./json_implementation/dbManagement/index')
let Mydatabase= require('./MongodbImplementation/index')
const express = require('express')
const app = express()
const port = 3000

// initialize the database
let gaurav= new Mydatabase("oreno");
app.use(express.json())

// post the product into the database
app.post('/product',(req, res) => {
    try{
    gaurav.createRecord('product',req.body)
    res.send(gaurav.readRecord("product",req.body.id))
    }
    catch(e){
      res.send(e)
    }
})

// put the product into the database
app.put('/product',async (req, res) => {
    try{
    await gaurav.updateRecord('product',Number(req.query.id),req.body)
    res.send(await gaurav.readRecord("product",Number(req.query.id)))
    }
    catch(e){
      res.send(e)
    }
})

//get product from id
app.get('/product',async (req, res) => {
    try {
      
        let product = await gaurav.readRecord('product', Number(req.query.id));
        console.log(product)
        res.send(product);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

//Delete product from product json
app.delete('/product',async (req,res)=>{
  try{
    let deleted_element=await gaurav.readRecord("product",Number(req.query.id))
    await gaurav.deleteRecord('product',Number(req.query.id))
    res.send(deleted_element)
  }
  catch(e){
    res.send(e)
  }
})

//Cancel Purchase
app.delete('/cancel',(req,res)=>{
  try{
    let objectDeleted= gaurav.readRecord('order',Number(req.query.id));
    gaurav.cancelOrder(Number(req.query.id))
    res.send(objectDeleted)
  }
  catch(e){
    res.send(e)
    console.log(e)
  }
})

//post the checkout
app.post('/checkout',(req,res)=>{
  try{
    gaurav.checkoutOrder(Number(req.query.id),  req.body)
    res.send(gaurav.readRecord('order',Number(req.body.id)))
  }
  catch(e){
    res.send(e)
    console.log(e)
  }
})

//get Status of product
app.get('/status',(req,res)=>{
  try{
    res.send(gaurav.getStatus(Number(req.query.id)))

  }
  catch(e){
    res.send(e)
  }
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

