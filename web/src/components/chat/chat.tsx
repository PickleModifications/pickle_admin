import { useState } from "react";
import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

export type ChatMessage = {
    user: {
        identifier: string;
        name: string;
        role: string;
        image: string;
    },
    datetime: number;
    message: string;
}

function Embed({ width, height, src, frameBorder, allowFullScreen }: { width: number, height: number, src: string, frameBorder: string, allowFullScreen: any }) {
    return (
        <div style={{ position: 'relative' }}>
            <iframe width={width} height={height} src={src} frameBorder={frameBorder} allowFullScreen={allowFullScreen} style={{ position: "relative", zIndex: 1 }}></iframe>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'gray', fontSize: '1.5rem', zIndex: 0 }}>Loading...</div>
        </div>
    );
}

function GetFormattedContent({ content }: { content: string }) {
    if (content.includes("medal.tv/")) {
        let path = content.split("/");
        let idA = "";
        let idB = "";
        let invite = "cr-vvvv";
        for (let i = 0; i < path.length; i++) {
            if (path[i] === "clips" || path[i] === "clip") {
                idA = path[i + 1];
                idB = path[i + 2];
                invite = path[i + 3];
                break;
            }
        }
        return (
            <Embed width={1280 / 3} height={720 / 3} src={`https://medal.tv/clip/${idA}/${idB}?invite=${invite}`} frameBorder="0" allowFullScreen></Embed>
        );
    }
    else if (content.includes("youtube.com/") || content.includes("youtu.be/")) {
        let path = content.split("/");
        let id = "";
        for (let i = 0; i < path.length; i++) {
            console.log(path[i]);
            if (path[i].includes("watch?v=")) {
                id = path[i].split("watch?v=")[1];
                break;
            }
            else if (path[i].includes("youtu.be")) {
                id = path[i + 1];
                break;
            }
        }
        return (
            <Embed width={1280 / 3} height={720 / 3} src={`https://www.youtube.com/embed/${id}`} frameBorder="0" allowFullScreen></Embed>
        );
    }
    else if (content.includes("twitch.tv/")) {
        let path = content.split("/");
        let channel = "";
        let clip = "";
        for (let i = 0; i < path.length; i++) {
            if (path[i].includes("twitch.tv")) {
                channel = path[i + 1];
                if (path[i + 3] && path[i + 2].includes("clip")) {
                    clip = path[i + 3];
                }
                break;
            }
        }
        if (clip) {
            return (
                <Embed width={1280 / 3} height={720 / 3} src={`https://clips.twitch.tv/embed?clip=${clip}&parent=localhost`} frameBorder="0" allowFullScreen></Embed>
            );
        } else {
            return (
                <Embed width={1280 / 3} height={720 / 3} src={`https://player.twitch.tv/?channel=${channel}&parent=localhost`} frameBorder="0" allowFullScreen></Embed>
            );
        }
    }
    return content;
}

function CreateDebugMessage(identifier?: string): ChatMessage {
    const fakeNames = ["John Doe", "Jane Doe", "John Smith", "Jane Smith", "John Johnson", "Jane Johnson"];
    const fakeMessages = [
        "Hello, how can I help you?",
        "I'm here to help you with any questions you have.",
        "I'm a bot, please ask me anything.",
    ];
    return {
        user: {
            identifier: identifier || Math.random().toString(36).substring(2, 15),
            name: identifier ? "Pickle Mods" : fakeNames[Math.floor(Math.random() * fakeNames.length)],
            role: "Staff",
            image: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 25)}.jpg`,
        },
        datetime: Date.now(),
        message: fakeMessages[Math.floor(Math.random() * fakeMessages.length)],
    }
}

export default function Chat() {
    const user = {
        identifier: "char-debug",
        name: "Pickle Mods",
        role: "Staff",
        image: `https://picklemods.com/logo_1.png`,
    }
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const virtuoso = useRef<VirtuosoHandle>(null);
    useEffect(() => {
        setTimeout(() => {
            if (virtuoso.current) {
                console.log("Scrolling to the end of the list");
                virtuoso.current.scrollToIndex({
                    index: messages.length - 1,
                    align: 'end', // Scroll to the end of the list to show the latest message
                    behavior: typeof GetFormattedContent({content: messages[messages.length - 1].message}) == "string" ? 'smooth' : 'auto',
                })
            }
        }, 100);
    }, [messages]);

    if (messages.length === 0) {
        let debugMessages: ChatMessage[] = [];
        for (let i = 0; i < 1000; i++) {
            debugMessages.push(CreateDebugMessage());
        }
        setMessages(debugMessages);
    }

    return (
        <div className="flex flex-col w-full h-full rounded-md">
            <div className="flex items-center w-full h-16 p-2 border-1 rounded-tr-md rounded-tl-md">
                <div className="font-bold text-lg">Staff Chat</div>
            </div>
            <Virtuoso
                ref={virtuoso}
                initialTopMostItemIndex={messages.length - 1}
                className="flex flex-col gap-2 p-2 border-l-1 border-r-1 h-full overflow-y-auto overflow-x-hidden"
                totalCount={messages.length}
                itemContent={(index) => {
                    const message = messages[index];
                    return (
                        <div key={index} className={`flex gap-2 p-2 rounded-md ${message.user.identifier === user.identifier ? 'justify-end' : ''}`}>
                            {message.user.identifier !== user.identifier && (
                                <img className="w-8 h-8 rounded-full" src={message.user.image} alt="User Profile" />
                            )}
                            <div className="flex flex-col bg-secondary p-2 rounded-md">
                                {message.user.identifier !== user.identifier && (<div className="font-bold">{message.user.name}</div>)}
                                <GetFormattedContent content={message.message} />
                            </div>
                            {message.user.identifier === user.identifier && (
                                <img className="w-8 h-8 rounded-full" src={message.user.image} alt="User Profile" />
                            )}
                        </div>
                    );
                }}
            />
            <div ref={messagesEndRef} />
            <div className="flex items-center w-full h-16 p-2 border-1 rounded-br-md rounded-bl-md">
                <Input
                    type="text"
                    placeholder="Type a message..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            const newMessage: ChatMessage = {
                                user: user,
                                datetime: Date.now(),
                                message: input.value,
                            };
                            setMessages([...messages, newMessage]);
                            input.value = '';
                        }
                    }}
                />
            </div>
        </div>
    )
}