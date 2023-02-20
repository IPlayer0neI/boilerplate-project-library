require('dotenv').config();
const mongoose    = require('mongoose');

function main(callback){ 
  try{

   mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

   const booksSchema = mongoose.Schema({
    title: {type: String, required: true},
    comments: {type: [String], default: []},
    commentcount: {type: Number, default: 0},
    __v: {type: Number, select: true}
  });

  const Books = mongoose.model("Books", booksSchema);

   callback(Books);

  } catch (e) {

    console.error(e);
    throw new Error('Unable to Connect to Database');
  };
};

module.exports = main