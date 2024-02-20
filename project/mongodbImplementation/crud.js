const mongoose = require('mongoose');
let Product= require('./Schema/productSchema')
let Order= require('./Schema/OrderSchema')


// Class to declare the database name and methods to perform crud operations
module.exports = class Crud{
    constructor(){
        console.log("connected to crud")
    }

    /**Create Record in atlas
     * @param {String} fileName name of the file
     * @param {object} objectToInsert document to insert inside the collection
     * @throws {Error} if there is problem in saving the document
     */
    createRecord(fileName, objectToInsert){
    let newProduct={}
     
    //check if the file is order or product then make a model of that
   if(fileName==="product"){
        newProduct = new Product(objectToInsert);
   }
   else if(fileName==="order"){
        newProduct = new Order(objectToInsert);
   }
   else{
    throw new Error("enter valid file name to insert")
   }

  // insert inside the collection
   try {
    newProduct.save();
    console.log("Object saved successfully");
    } catch (error) {
    console.error("Error saving object:", error);
    }
    }

    /**Read the collection for the document
     * @param {fileName} fileName name of the collection to read
     * @param {id} id of the document
     * @throws {Error} if there is problem in reading the collection
     */
    async readRecord(fileName, id) {
      let collection = null;
  
      // save the collection name to refer later
      if (fileName === "product") {
          collection = Product;
      } else if (fileName === "order") {
          collection = Order;
      } else {
          throw new Error("Enter a valid file name to read");
      }
  
      // find the product or order through id and return 
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
          console.error("Error reading object:", error); //throw error 
          throw error;
      }
  }
  
   /**Read the collection for the document
     * @param {fileName} fileName name of the collection to read
     * @param {id} id of the document
     * @param {object} updatedData new data to be replaced
     * @throws {Error} if there is problem in updating the data
     */
    async updateRecord(fileName, id, updatedData) {
      let collection = null;

      //check if we need to update the product or order
      if (fileName === "product") {
          collection = Product;
      } else if (fileName === "order") {
          collection = Order;
      } else {
          throw new Error("Enter a valid file name to update");
      }

      // find and update the document
      try {
          const updatedObject = await collection.findOneAndUpdate(
              { "id": id }, // filter criteria
              updatedData, // updated data
              { new: true } // return the updated document
          );
          console.log("Object updated successfully:", updatedObject);
          return updatedObject;
      } catch (error) {
          console.error("Error updating object:", error); //throw error
          throw error;
      }
    }

    /**Read the collection for the document
     * @param {fileName} fileName name of the collection to read
     * @param {id} id of the document
     * @throws {Error} if there is problem in deleting data
     */
    async deleteRecord(fileName, id) {
      let collection = null;

      //check if the document to be deleted from product or order collection
      if (fileName === "product") {
          collection = Product;
      } else if (fileName === "order") {
          collection = Order;
      } else {
          throw new Error("Enter a valid file name to delete");
      }

      // find and delete document from collection
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
          console.error("Error deleting object:", error); //throw error
          throw error;
      }
    }

}