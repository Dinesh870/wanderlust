const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    mongoose.connect(MONGO_URL);
}
main()
    .then((res)=>console.log("connected to db"))
    .catch((err)=>{console.error(err)});

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '66794dbef4c3c47a3621bb3b'}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();