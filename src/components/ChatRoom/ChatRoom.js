import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import InfoBar from "../InfoBar/InfoBar";
import MessageInput from "../MessageInput/MessageInput";
import Messages from "../Messages/Messages";
import "./ChatRoom.css";
import ActiveUser from "../ActiveUser/ActiveUser";

let socket;

export default function ChatRoom({ location }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  //specify single message
  const [message, setMessage] = useState("");
  //all messages
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState("");

  const ENDPOINT = "https://chat-away-server.herokuapp.com/";

  useEffect(() => {
    //get the data that user enterd when joined the chat
    //get a URL back with location.search but parse it to an object
    const { name, room } = queryString.parse(location.search);

    // console.log("location.search", location.search);
    // console.log("user data from URL", name, room);

    //when get the connection and get an endpoint to server
    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    // console.log("socket", socket);
    //emit event from client side and able to pass in some data
    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    //componentUnmount - for disconnection
    return () => {
      socket.emit("disconnect");
      //turn off the "join" emit event
      socket.off();
    };
  }, [ENDPOINT, location.search]);
  //UP: only when these two values change, then rerender useEffect

  //when user send message
  useEffect(() => {
    //listen for message from backend for user join room
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);
  //UP: only run this useEffect when the array of messages change

  //function sending messages from frontend to backend
  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  console.log("is there any messages?", message);
  console.log("second message", messages);
  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <MessageInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <ActiveUser users={users} />
    </div>
  );
}
