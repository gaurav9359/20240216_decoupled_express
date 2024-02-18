  /**
 * Requirement- To create a basic database using Files and folders
 * Each folder can container any number of files and each files can
 * container n number of lines.
 * We need to perform crud operations on all these folder, files and
 * lines
 */
  const fs = require("fs");
  const path = require("path");
  const prompt = require('prompt-sync')();
  
  // Class to declare the database name and methods to perform crud operations
  module.exports = class Mydatabase {
    // constructor takes name of database as input and initialise the class
    constructor(name = null) {
      if (name === null || !name === "string") {
        throw new Error("name is null");
      }
  
      this.name = name;
    }
  
    /** Submethod to validate the object
    * @param {string} file name
    * @param {object} object to validate
    * @returns {boolean} True if the object follows the schema, false otherwise
    */
   validateSchema(fileName,objectToValidate) {
    //get all the file schema objects
    let productSchema=require(`./database/${fileName}_schema.json`)
    let allProducts=require(`./database/${fileName}.json`)
    let idArray=[]
  
    //populate the id in array
    for(let singleObject in allProducts){
      idArray.push(allProducts[singleObject].id)
    }
  
     // Check if all required properties are present
     for (const prop of productSchema.required) {
       if (!(prop in objectToValidate)) {
         console.log(`Property '${prop}' is missing.`);
         return false;
       }
     }
  
     //check if id is unique or not
     if(idArray.includes(objectToValidate.id)){
      console.log("given Id already exists")
      return false;
     }
  
     // Check if the types of properties match the schema
     for (const [key, value] of Object.entries(objectToValidate)) {
       if (!(key in productSchema.properties)) {
         console.log(`Property '${key}' is not allowed.`);
         return false;
       }
       if (typeof value !== productSchema.properties[key].type) {
         console.log(`Property '${key}' has incorrect type.`);
         return false;
       }
      
     }
  
     return true;
   }
  
    /**Submethod to check if the string start with char and shouldn't have space
     * @param {string} stringToCheck if it is valid or not
     * @returns {boolean} true if the string is valid else false
     */
    validString(stringToCheck) {
      // Regular expression to match strings with at least one letter and containing only letters and numbers
      const regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;
      // Check if the string matches the regular expression and does not start with a number
      let ansToReturn =
        regex.test(stringToCheck) && isNaN(parseInt(stringToCheck[0]));
  
      //check if the string have any "/" forward slash
      for (
        let indexOfString = 0;
        indexOfString < stringToCheck.length;
        indexOfString++
      ) {
        if (
          stringToCheck[indexOfString] === `/` ||
          stringToCheck[indexOfString] === `\\`
        ) {
          console.log("string contains "/" remove it")
          return false;
        }
      }
      return ansToReturn;
    }
  
    /** Write record inside the file
     * @param {string} fileName name of file in which data to be inserted
     * @param {object} objectToInsert objec to be inserted n
     * @throws {Error} if the file or folder is not present
    */
    createRecord(fileName,objectToInsert){
  
      // take all the json data from file
      let allRecords = require(`./database/${fileName}.json`);
  
      // check wheater the object is valid or not
      if(!this.validateSchema(fileName,objectToInsert)){
          console.log("Please enter all the information required")
          return;
      }
  
      // Adding new data to allRecords object
        allRecords.push(objectToInsert);
  
      // Writing to a file 
        fs.writeFile(
        `./dbManagement/database/${fileName}.json`,
        JSON.stringify(allRecords),
        err => {
          // Checking for errors 
          if (err) throw err;
   
          // Success 
          console.log("Done writing");
        });
  
    }
  
    /**read the record  from files
     * @param {string} fileName name of file in which data to be inserted
     * @throws {Error} if the file or folder is not present
    */
    readRecord(fileName,id){
  
      //take all the json data from file
      let allData = require(`./database/${fileName}.json`);
  
      //lets take data to return 
      let dataToReturn=[]
  
      // Loop through each object in the JSON data
      allData.forEach((object, index) => {
      
      // Check if the key exists in the current object
      if (object.id===id) {
      // If the value exists, print it
      dataToReturn.push(object)
    }
  });
  return dataToReturn
  }
  
  /**update record inside the file
  * @param {string} fileName name of file in which data to be inserted
  * @throws {Error} if the file or folder is not present
  */
  updateRecord(fileName,id,newObject){
  
    // take all the json data from file
    let allData = require(`./database/${fileName}.json`);
  
    //flag that if the id not found return that type valid id
    let flag=false
  
    // Loop through each object in the JSON data
    allData.forEach((object, index) => {
  
    // Check if the key exists in the current object
    if (object.id===id) {
  
    //delete that index object
    allData.splice(index, 1);
    
    //set the flag that id found
    flag=true
  
    // check if the newObject is valid or not
    if(!this.validateSchema(fileName,newObject)){
      console.log("Please enter all the information required")
      return;
  }
    //if valid push new object
    allData.push(newObject)
    }
  });
  
  //if flag = false return that enter valid id to change
  if(flag===false) {
    console.log("enter valid id to change") 
    return
  }
    //write the entire json again in the file
    fs.writeFile(
      `./dbManagement/database/${fileName}.json`,
      JSON.stringify(allData),
      err => {
        // Checking for errors 
        if (err) throw err;
  
        // Success 
        console.log("Updation Successfull");
      });
  
  }
  
  /**Delete the record inside file
  * @param {string} fileName name of file in which data to be inserted
  * @throws {Error} if the file or folder is not present
  */
  deleteRecord(fileName,id2){
  
    // take all the json data from file
    let allData = require(`./database/${fileName}.json`);
  
       // Loop through each object in the JSON data
    allData.forEach((object, index) => {
      if (object.hasOwnProperty('id') && object['id']===id2) {
          //store the object without deleting
          let objectToDelete= allData[index]
  
          // Remove the record from the array
          allData.splice(index, 1); 
  
          return objectToDelete
      }
    });
    
     //write the entire json again in the file
     fs.writeFile(
      `./dbManagement/database/${fileName}.json`,
      JSON.stringify(allData),
      err => {
        // Checking for errors 
        if (err) throw err;
  
        // Success 
        console.log("Deletion Successfull");
      });
  
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