const express = require('express');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors')
const app = express();
const ChatModel = require('./models/chatSchema')
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI, { useNewUrlParser: true });

const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
connection.once('open', () => {
  console.log('Connected to MongoDB');
});




// Use body-parser middleware to parse JSON requests
app.use(express.json());

// Store user inputs and responses
const API_KEY = process.env.REACT_APP_KEY
console.log(API_KEY)
// API endpoint to handle user input and save the response
app.post("/completions", async (req, res) =>{
  const options = {
      method: "POST",
      headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: req.body.message}],
          max_tokens: 100
      })
  }
try {
  const response = await fetch("https://api.openai.com/v1/chat/completions", options)
  const data = await response.json()
  // res.send(data)
  const newChatModel = new ChatModel({
    userInput: req.body.message,
    assistantResponse: data.choices[0].message.content
  });

  newChatModel.save()
    .then(() => res.json(data))
    .catch(err => res.status(400).json('Error: ' + err));
} catch (error) {
  console.log(error);
  res.status(500).json({ error: 'Internal Server Error' });
}


// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216

})
// const chatRouter = require('./routes/chatRoute')
// app.use('/chats', chatRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
