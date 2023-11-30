const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema for the chat
const chatSchema = new Schema({
  userInput: JSON,
  assistantResponse: JSON,
});

// Create a model based on the schema
const ChatModel = mongoose.model('Chat', chatSchema);

module.exports = ChatModel;