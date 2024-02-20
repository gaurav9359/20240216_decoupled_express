const { CANCELLED } = require("dns");
const FileCrud= require("./crud")
const fs = require("fs");
const path = require("path");
const prompt = require('prompt-sync')();

let fileCrud= new FileCrud('curd');

// Class to declare the database name and methods to perform crud operations
module.exports = class Mydatabase {

  /**Create record from req body
   * @param {Object} object to insert inside Product
   */
 createRecord(fileName,objectToInsert){
    fileCrud.createRecord(fileName,objectToInsert)
 }

 /**Read record from  id*/
 readRecord(fileName,id){
    return fileCrud.readRecord(fileName,id)
 }

 /**Update record from id and req body*/
 updateRecord(fileName,id,newObject){
  fileCrud.updateRecord(fileName,id,newObject)
 }

 /**Delete record from id */
 deleteRecord(fileName,id){
  fileCrud.deleteRecord(fileName,id)
 }

/**Checkout the product
 * @param {Number} productId id of product
 * @param {Number} quantity  quantity of the product
 * @throws {Error} if the quantity to purchase > stock available
 */
checkoutOrder(productId,order_details){
  //take all the products from product.json
  let allProducts=require(`./database/product.json`)
  let idArray=[]

  //populate the id in array
  for(let singleObject in allProducts){
    idArray.push(allProducts[singleObject].id)
  }

  //if the id of product not found then return error
  if(!idArray.includes(productId)){
      console.log("product not found")
      return
  }

  let indexOfProduct=-1
  //get the index of productId from product
  for(let key in allProducts){
    if(allProducts[key].id===productId){
      indexOfProduct=key
    }
  }

  //check if the stock is available or not
  if(order_details.quantity>allProducts[indexOfProduct].stock){
    console.log("insufficient stock available")
    return
  }

  //if the stock is available then reduce the quantity purchased
  allProducts[indexOfProduct].stock-=order_details.quantity

  //take all orders from order.json to append it
  order_details["order_pId"]=productId
  this.createRecord("order",order_details)


  //write the product.json file again
  fs.writeFile(
    `./json_implementation/database/product.json`,
    JSON.stringify(allProducts),
    err => {
      // Checking for errors 
      if (err) throw err;

    });
}

/**cancel the product
 * @param {Number} productId id of product
 */
cancelOrder(productId){
  //take all the products from product.json
  let allOrders=require(`./database/order.json`)
  let idArray=[]

  //populate the id in array
  for(let singleObject in allOrders){
    idArray.push(allOrders[singleObject].id)
  }

  console.log(idArray)
  //if the id of product not found then return error
  if(!idArray.includes(productId)){
      console.log("product not found")
      return
  }

  let indexOfProduct=-1
  //get the index of productId from order
  for(let key in allOrders){
    if(allOrders[key].id===productId){
      indexOfProduct=key
    }
  }
  //quantity to add in the product json
  let quantityToAdd=allOrders[indexOfProduct].quantity
  let objectDeleted= allOrders[indexOfProduct]

  //delete the indexOfProduct form order
  allOrders.splice(indexOfProduct,1)
  
  //search for index of product that to be deleted in productjson
  let allProducts=require(`./database/product.json`)

  for(let key in allProducts){
    if(allProducts[key].id===productId){
      indexOfProduct=key
    }
  }
  allProducts[indexOfProduct].stock+=quantityToAdd

  //write in order.json file again
  fs.writeFile(
    `./json_implementation/database/order.json`,
    JSON.stringify(allOrders),
    err => {
      // Checking for errors 
      if (err) throw err;

    });

  //write the product.json file again
  fs.writeFile(
    `./json_implementation/database/product.json`,
    JSON.stringify(allProducts),
    err => {
      // Checking for errors 
      if (err) throw err;

    });

    //send the order cancelled into the call_order.json
    let allCancelled= require(`./database/cancelled_order.json`)
    objectDeleted.order_status="Cancelled"
    allCancelled.push(objectDeleted)

    //write into the json again
    fs.writeFile(
      `./json_implementation/database/cancelled_order.json`,
      JSON.stringify(allCancelled),
      err => {
        // Checking for errors 
        if (err) throw err;
  
      });

}

/** To get the status of the product purchased
 * @param {Number} productId 
 * @returns {Object} having status
 */
getStatus(productId){
  // check if the product is CANCELLED
  let allCancelled= require(`./database/cancelled_order.json`)

  for(let key in allCancelled){
    if(allCancelled[key].id==productId){
      return allCancelled[key]
    }
  }

  //check if the product is placed
  let allPlaced= require(`./database/order.json`)

  for(let key in allPlaced){
    if(allPlaced[key].id==productId){
      return allPlaced[key]
    }
  }

  // if the order is not made or cancelled
  console.log("no such order have been made or cancelled")

}
}

// let gaurav= new Mydatabase('oreno');

// // gaurav.deleteRecord('product',1)
// gaurav.updateRecord("order",2,{
//   "id": 2,
//   "order_date": "2023-08-25T15:00:00Z",
//   "order_address": "25, gulmohar nagar , nagpur",
//   "order_pId": 3,
//   "order_status": "dispatched",
//   "total_cost": 578
// })