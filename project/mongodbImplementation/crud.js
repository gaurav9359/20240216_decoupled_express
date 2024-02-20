const mongoose = require('mongoose');
let Product= require('./Schema/productSchema')
let Order= require('./Schema/OrderSchema')


// Class to declare the database name and methods to perform crud operations
module.exports = class Crud{
    constructor(){
        console.log("connected to crud")
    }

    // Create the object
    createRecord(fileName, objectToInsert){
    let newProduct={}
     // Insert data
   if(fileName==="product"){
        newProduct = new Product(objectToInsert);
   }
   else if(fileName==="order"){
        newProduct = new Order(objectToInsert);
   }
   else{
    throw new Error("enter valid file name to insert")
   }

   try {
    newProduct.save();
    console.log("Object saved successfully");
} catch (error) {
    console.error("Error saving object:", error);
}
    }

    // read the object
    async readRecord(fileName, id) {
      let collection = null;
  
      if (fileName === "product") {
          collection = Product;
      } else if (fileName === "order") {
          collection = Order;
      } else {
          throw new Error("Enter a valid file name to read");
      }
  
      try {
          const object = await collection.findOne({ "id":id });
          if (object) {
              console.log("Object found:", object);
              return object; // Return the object directly
          } else {
              console.log("Object not found");
              return null;
          }
      } catch (error) {
          console.error("Error reading object:", error);
          throw error;
      }
  }
  
    // update the object
    // update the object
async updateRecord(fileName, id, updatedData) {
  let collection = null;

  if (fileName === "product") {
      collection = Product;
  } else if (fileName === "order") {
      collection = Order;
  } else {
      throw new Error("Enter a valid file name to update");
  }

  try {
      const updatedObject = await collection.findOneAndUpdate(
          { "id": id }, // filter criteria
          updatedData, // updated data
          { new: true } // return the updated document
      );
      console.log("Object updated successfully:", updatedObject);
      return updatedObject;
  } catch (error) {
      console.error("Error updating object:", error);
      throw error;
  }
}


    // delete the object
    // delete the object
async deleteRecord(fileName, id) {
  let collection = null;

  if (fileName === "product") {
      collection = Product;
  } else if (fileName === "order") {
      collection = Order;
  } else {
      throw new Error("Enter a valid file name to delete");
  }

  try {
      const deletedObject = await collection.findOneAndDelete({ "id": id });
      if (deletedObject) {
          console.log("Object deleted successfully:", deletedObject);
          return deletedObject;
      } else {
          console.log("Object not found for deletion");
          return null;
      }
  } catch (error) {
      console.error("Error deleting object:", error);
      throw error;
  }
}

}