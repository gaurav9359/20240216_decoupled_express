const mongoose = require('mongoose');
const Product = require('./Schema/productSchema');
const MyCrud = require('./crud');

let Crud= new MyCrud()

// Class to declare the database name and methods to perform CRUD operations
module.exports = class MyDatabase {
    /**Constructor for MyDatabase class.
     * @param {String} name The name of the database.
     * @throws {Error} if name is null or not a string.
     */
    constructor(name) {
        if (name === null || typeof name !== "string") {
            throw new Error("Name must be a non-null string");
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

    /**Create a record in the database.
     * @param {String} fileName The name of the file/collection.
     * @param {Object} objectToInsert The object to insert into the collection.
     */
    createRecord(fileName, objectToInsert) {
        Crud.createRecord(fileName, objectToInsert);
    }

    /** Read a record from the database.
     * @param {String} fileName The name of the file/collection.
     * @param {String} id The ID of the document.
     * @returns {Object} The retrieved document.
     */
    readRecord(fileName, id) {
        return Crud.readRecord(fileName, id);
    }

    /**Update a record in the database.
     * @param {String} fileName The name of the file.
     * @param {String} id The id of the document.
     * @param {Object} newObject The new data to update the document with.
     */
    updateRecord(fileName, id, newObject) {
        Crud.updateRecord(fileName, id, newObject);
    }

    /**Delete a record from the database.
     * @param {String} fileName The name of the file/collection.
     * @param {String} id The ID of the document.
     */
    deleteRecord(fileName, id) {
        Crud.deleteRecord(fileName, id);
    }

    /**Checkout the product and create an order.
     * @param {String} productId The ID of the product.
     * @param {Object} order_details Details of the order.
     */
    async checkoutOrder(productId, order_details) {
        try {
            // Check if the product exists
            const product = await this.readRecord("product", productId);
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
            await this.createRecord("order", order_details);

            console.log("Order placed successfully");
        } catch (error) {
            console.error("Error checking out order:", error);
            throw error;
        }
    }

    /**Cancel an order and restore stock.
     * @param {String} orderId The ID of the order to cancel.
     */
    async cancelOrder(orderId) {
        try {
            // Find the order
            const order = await this.readRecord("order", orderId);
            if (!order) {
                console.log("Order not found");
                return;
            }

            // Restore the stock
            const product = await this.readRecord("product", order.order_pId);
            if (product) {
                product.stock += order.quantity;
                await product.save();
            }

            // Delete the order
            await this.deleteRecord("order", orderId);

            console.log("Order cancelled successfully");
        } catch (error) {
            console.error("Error cancelling order:", error);
            throw error;
        }
    }

    /**Get the status of a product (placed or cancelled order).
     * @param {String} productId The ID of the product.
     * @returns {Object} The status of the product.
     */
    async getStatus(productId) {
        try {
            // Check if the product has a cancelled order
            const cancelledOrder = await this.readRecord("cancelled_order", productId);
            if (cancelledOrder) {
                console.log("Order cancelled:", cancelledOrder);
                return cancelledOrder;
            }

            // Check if the product has a placed order
            const placedOrder = await this.readRecord("order", productId);
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
