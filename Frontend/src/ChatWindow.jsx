import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import {ScaleLoader} from "react-spinners";
import { useClerk, UserProfile ,useUser} from '@clerk/clerk-react';

function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat, theme, toggleTheme} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showModels, setShowModels] = useState(false);
    const { signOut } = useClerk();
    const { user } = useUser();
const [showProfile, setShowProfile] = useState(false);

   const getReply = async () => {
    setLoading(true);
    setNewChat(false);

    const userMessage = prompt;

    try {
     const response = await fetch(`${API_URL}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userMessage,
                threadId: currThreadId
            })
        });

        const res = await response.json();

        setPrevChats(prev => [
            ...prev,
            { role: "user", content: userMessage },
            { role: "assistant", content: res?.reply || "No response" }
        ]);

        setReply(res.reply);
        setPrompt("");

    } catch (err) {
        console.log(err);
    }

    setLoading(false);
};
    //Append new chat to prevChats
    useEffect(() => {
    if (!prompt || !reply) return;

    setPrevChats(prev => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply }
    ]);

    setPrompt("");
}, [reply]);
    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    return (
    <div className="chatWindow">

        {/* Navbar */}
        <div className="navbar">

            <div
                className="modelSelector"
                onClick={() => setShowModels(!showModels)}
            >
                <span>NexusAI</span>
                
            </div>

            <div className="navRight">

                <button
                    className="themeBtn"
                    onClick={toggleTheme}
                >
                    {theme === "dark" ? (
                        <i className="fa-solid fa-sun"></i>
                    ) : (
                        <i className="fa-solid fa-moon"></i>
                    )}
                </button>

                <div
                    className="userIconDiv"
                    onClick={handleProfileClick}
                >
                    <span className="userIcon">
                        <i className="fa-solid fa-user"></i>
                    </span>
                </div>

            </div>

        </div>

        {/* Model Dropdown */}
        {showModels && (
            <div className="modelDropdown">

                <div className="modelItem active">
                    <i className="fa-solid fa-bolt"></i>

                    <div>
                        <strong>NexusAI</strong>
                        <p>Fast • Default</p>
                    </div>
                </div>

                <div className="modelItem">
                    <i className="fa-solid fa-brain"></i>

                    <div>
                        <strong>NexusAI Pro</strong>
                        <p>Coming Soon</p>
                    </div>
                </div>

            </div>
        )}

        {/* User Dropdown */}
        {isOpen && (
            <div className="dropDown">

                <div className="profileInfo">

                    <img
                        src={user?.imageUrl}
                        alt="profile"
                        className="profileAvatar"
                    />

                    <div className="profileText">
                        <h4>{user?.fullName}</h4>
                        <p>{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>

                </div>

                <hr />

                <div
                    className="dropDownItem"
                    onClick={() => {
                        setShowProfile(true);
                        setIsOpen(false);
                    }}
                >
                    <i className="fa-solid fa-gear"></i>
                    <span>Settings</span>
                </div>

                <div
                    className="dropDownItem"
                    onClick={toggleTheme}
                >
                    {theme === "dark" ? (
                        <>
                            <i className="fa-solid fa-sun"></i>
                            <span>Light Mode</span>
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-moon"></i>
                            <span>Dark Mode</span>
                        </>
                    )}
                </div>

                <div className="dropDownItem">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <span>Upgrade Plan</span>
                </div>

                <div
                    className="dropDownItem"
                    onClick={() => signOut()}
                >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <span>Log out</span>
                </div>

            </div>
        )}

        <Chat />
<div className="loaderWrapper">
    <ScaleLoader
        color={theme === "dark" ? "#ffffff" : "#000000"}
        loading={loading}
    />
</div>
        

        <div className="chatInput">

            <div className="inputBox">

                <input
                    placeholder="Ask anything"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === "Enter" ? getReply() : null
                    }
                />

                <div
                    id="submit"
                    onClick={getReply}
                >
                    <i className="fa-solid fa-paper-plane"></i>
                </div>

            </div>

            <p className="info">
                NexusAI can make mistakes. Check important information.
            </p>

        </div>

        {showProfile && (
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2000,
                }}
                onClick={() => setShowProfile(false)}
            >
                <div
                    style={{ position: "relative" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        onClick={() => setShowProfile(false)}
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "#333",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            zIndex: 2001,
                        }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </div>

                    <UserProfile />

                </div>
            </div>
        )}

    </div>
);
}
export default ChatWindow;