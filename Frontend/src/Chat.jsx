import "./Chat.css";
import React, { useContext, useState, useEffect,useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply, setPrompt } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);
  const chatEndRef = useRef(null);
    useEffect(() => {
        if(reply === null) {
            setLatestReply(null); //prevchat load
            return;
        }
  

        if(!prevChats?.length) return;

        const content = reply.split(" "); //individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));

            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply]);
      useEffect(() => {
    chatEndRef.current?.scrollIntoView({
        behavior: "smooth"
    });

}, [prevChats, latestReply]);

    return (
        <>
        {newChat && (
    <div className="welcomeContainer">

        <div className="welcomeLogo">N</div>

        <h1 className="welcomeTitle">
            Welcome to <span>NexusAI</span>
        </h1>

        <p className="welcomeSubTitle">
            Your intelligent AI assistant
        </p>

        <div className="suggestionGrid">

            <div
                className="suggestionCard"
                onClick={() => setPrompt("Help me write a professional email")}
            >
                <span>✍️</span>
                <h3>Write</h3>
                <p>Create emails, blogs and documents</p>
            </div>

            <div
                className="suggestionCard"
                onClick={() => setPrompt("Give me creative ideas for my project")}
            >
                <span>💡</span>
                <h3>Brainstorm</h3>
                <p>Generate creative ideas and plans</p>
            </div>

            <div
                className="suggestionCard"
                onClick={() => setPrompt("Summarize the following text")}
            >
                <span>📄</span>
                <h3>Summarize</h3>
                <p>Condense long text into key points</p>
            </div>

            <div
                className="suggestionCard"
                onClick={() => setPrompt("Translate this text into English")}
            >
                <span>🌐</span>
                <h3>Translate</h3>
                <p>Translate between multiple languages</p>
            </div>

        </div>

    </div>
)}
                  <div className="chats">
                {
                    prevChats?.slice(0, -1).map((chat, idx) => 
                        <div className={chat.role === "user"? "userDiv" : "gptDiv"} key={idx}>
                            {
                                chat.role === "user"? 
                                <p className="userMessage">{chat.content}</p> : 
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                }

                {
                    prevChats.length > 0  && (
                        <>
                            {
                                latestReply === null ? (
                                    <div className="gptDiv" key={"non-typing"} >
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                                </div>
                                ) : (
                                    <div className="gptDiv" key={"typing"} >
                                     <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                </div>
                                )

                            }
                        </>
                    )
                }
<div ref={chatEndRef}></div>
            </div>
        </>
    )
}

export default Chat;