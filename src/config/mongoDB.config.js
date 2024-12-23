import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        
        mongoose.connect("mongodb+srv://maxijankovics:jXyRvmbW9gOHeYxp@cluster70395.hbm96.mongodb.net/clase-15");
        console.log("MongoDB conectado");

    } catch (error) {

        console.log(error);
    
    }
}