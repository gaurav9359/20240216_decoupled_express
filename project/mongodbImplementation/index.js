const mongoose = require('mongoose');
let Product= require('./Schema/productSchema')
let Crud= require('./crud')

let MyCrud= new Crud('My crud')

// Class to declare the database name and methods to perform crud operations
module.exports = class Mydatabase{
    // constructor takes name of database as input and initialise the class
    constructor(name = null) {
    if (name === null || !name === "string") {
      throw new Error("name is null");
    }

    this.name = name;
    // Connect to MongoDB Atlas
    mongoose.connect("mongodb+srv://root:root@cluster0.tbo395f.mongodb.net/ecommerce")
    .then(() => {
    console.log("Connected to MongoDB Atlas");
    })
    .catch(error => {
    console.error("Error connecting to MongoDB Atlas:", error);
    });
  }

  createRecord(fileName, objectToInsert){
   MyCrud.createRecord(fileName,objectToInsert)
  }

  readRecord(fileName, id){
  return MyCrud.readRecord(fileName,id) 
}
  
updateRecord(fileName, id, newObject){
  MyCrud.updateRecord(fileName,id,newObject) 
}

deleteRecord(fileName,id){
  MyCrud.deleteRecord(fileName,id)
}

 // Checkout the product and create an order
 async checkoutOrder(productId, order_details) {
  try {
      // Check if the product exists
      const product = await MyCrud.readRecord("product", productId);
      if (!product) {
          console.log("Product not found");
          return;
      }

      // Check if sufficient stock is available
      if (order_details.quantity > product.stock) {
          console.log("Insufficient stock available");
          return;
      }

      // Deduct the stock
      product.stock -= order_details.quantity;
      await product.save();

      // Create the order
      order_details.order_pId = productId;
      await MyCrud.createRecord("order", order_details);

      console.log("Order placed successfully");
  } catch (error) {
      console.error("Error checking out order:", error);
      throw error;
  }
}

// Cancel an order and restore stock
async cancelOrder(orderId) {
  try {
      // Find the order
      const order = await MyCrud.readRecord("order", orderId);
      if (!order) {
          console.log("Order not found");
          return;
      }

      // Restore the stock
      const product = await MyCrud.readRecord("product", order.order_pId);
      if (product) {
          product.stock += order.quantity;
          await product.save();
      }

      // Delete the order
      await MyCrud.deleteRecord("order", orderId);

      console.log("Order cancelled successfully");
  } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
  }
}

// Get the status of a product (placed or cancelled order)
async getStatus(productId) {
  try {
      // Check if the product has a cancelled order
      const cancelledOrder = await MyCrud.readRecord("cancelled_order", productId);
      if (cancelledOrder) {
          console.log("Order cancelled:", cancelledOrder);
          return cancelledOrder;
      }

      // Check if the product has a placed order
      const placedOrder = await MyCrud.readRecord("order", productId);
      if (placedOrder) {
          console.log("Order placed:", placedOrder);
          return placedOrder;
      }

      console.log("No order found for product");
      return null;
  } catch (error) {
      console.error("Error getting status:", error);
      throw error;
  }
}
}



