// OpenAIChatbot.js
import React, { useState, useEffect } from 'react';
// import OpenAI from 'openai';

const OpenAIChatbot = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);



  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null);
    setValue("");
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      // front end makes a request to our backend endpoint
      const response = await fetch(
        "http://localhost:5000/completions",
        options
      );
      const data = await response.json();
      console.log(data)
      setMessage(data.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((previousChats) => [
        ...previousChats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, currentTitle]);
  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles =Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
  return (
    <div className="chatbot-container">
      <section className="side-bar">  
        <button >+ New chat </button>
        <ul className="history">
        {uniqueTitles?.map((uniqueTitle, index) =>  <li key={index} onClick={() =>handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by austin</p>
        </nav>
      </section>

      <section className="main">
        {!currentTitle && <h1>AustinGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
          </div>
          <p className="info">
            ChatGPT Mar 14 Version. Free Research Preview. Our goal is to make
            AI systems more natural and safe to interact with. Your feedback
            will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
};

export default OpenAIChatbot;
