import { useState } from "react";
import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { User } from "@/App";
import { fetchNui } from "@/providers/nui/fetchNui";
import { useNuiEvent } from "@/providers/nui/useNui";
import { Config, useConfig } from "@/providers/config";

export type ChatMessage = {
    id: number;
    user: User;
    datetime: number;
    message: string;
}

function Embed({ width, height, src, frameBorder, allowFullScreen }: { width: number, height: number, src: string, frameBorder: string, allowFullScreen: any }) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    useEffect(() => {
        if (iframeRef.current) {
            iframeRef.current.src = src;
        }
    }, []);
    return (
        <div style={{ position: 'relative' }}>
            <iframe ref={iframeRef} width={width} height={height} frameBorder={frameBorder} allowFullScreen={allowFullScreen} style={{ position: "relative", zIndex: 1 }}></iframe>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'gray', fontSize: '1.5rem', zIndex: 0 }}>Loading...</div>
        </div>
    );
}

function GetContentType(content: string): "medal" | "youtube" | "twitch" | "text" {
    if (content.includes("medal.tv/")) {
        return "medal";
    }
    else if (content.includes("youtube.com/") || content.includes("youtu.be/")) {
        return "youtube";
    }
    else if (content.includes("twitch.tv/")) {
        return "twitch";
    }
    return "text";
}

function GetFormattedContent({ content, embedWidth = 400, embedHeight = 225, isUser = false }: { content: string, embedWidth?: number, embedHeight?: number, isUser?: boolean }) {
    if (content.includes("youtube.com/") || content.includes("youtu.be/")) {
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
            <Embed width={embedWidth} height={embedHeight} src={`https://www.youtube.com/embed/${id}`} frameBorder="0" allowFullScreen></Embed>
        );
    }
    // PENDING: FiveM embed fix for ancestor iframes.
    // else if (content.includes("medal.tv/")) {
    //     let path = content.split("/");
    //     let idA = "";
    //     let idB = "";
    //     let invite = "cr-vvvv";
    //     for (let i = 0; i < path.length; i++) {
    //         if (path[i] === "clips" || path[i] === "clip") {
    //             idA = path[i + 1];
    //             idB = path[i + 2];
    //             invite = path[i + 3];
    //             break;
    //         }
    //     }
    //     return (
    //         <Embed width={embedWidth} height={embedHeight} src={`https://medal.tv/clip/${idA}/${idB}?invite=${invite}`} frameBorder="0" allowFullScreen></Embed>
    //     );
    // }
    // else if (content.includes("twitch.tv/")) {
    //     let path = content.split("/");
    //     let channel = "";
    //     let clip = "";
    //     for (let i = 0; i < path.length; i++) {
    //         if (path[i].includes("twitch.tv")) {
    //             channel = path[i + 1];
    //             if (path[i + 3] && path[i + 2].includes("clip")) {
    //                 clip = path[i + 3];
    //             }
    //             break;
    //         }
    //     }
    //     if (clip) {
    //         return (
    //             <Embed width={embedWidth} height={embedHeight} src={`https://clips.twitch.tv/embed?clip=${clip}&parent=localhost`} frameBorder="0" allowFullScreen></Embed>
    //         );
    //     } else {
    //         return (
    //             <Embed width={embedWidth} height={embedHeight} src={`https://player.twitch.tv/?channel=${channel}&parent=localhost`} frameBorder="0" allowFullScreen></Embed>
    //         );
    //     }
    // }
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    return (
        <div className={"text-foreground" + (isUser ? " text-right" : "")}>
            {parts.map((part, index) =>
                urlRegex.test(part) ? (
                    <div onClick={() => {
                        (window as any).invokeNative('openUrl', part);
                    }} key={index} className="cursor-pointer text-blue-500 underline">
                        {part}
                    </div>
                ) : (
                    part
                )
            )}
        </div>
    );
}

function CreateDebugMessage(identifier?: string): ChatMessage {
    const fakeNames = ["John Doe", "Jane Doe", "John Smith", "Jane Smith", "John Johnson", "Jane Johnson"];
    const fakeMessages = [
        "Hello, how can I help you?",
        "I'm here to help you with any questions you have.",
        "I'm a bot, please ask me anything.",
    ];
    return {
        id: Math.floor(Math.random() * 100000),
        user: {
            identifier: identifier || Math.random().toString(36).substring(2, 15),
            name: identifier ? "Pickle Mods" : fakeNames[Math.floor(Math.random() * fakeNames.length)],
            role: "Staff",
            image: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 25)}.jpg`,
        },
        datetime: Date.now() / 1000,
        message: fakeMessages[Math.floor(Math.random() * fakeMessages.length)],
    }
}

async function FetchChannelMessages(channel: string) {
    if (process.env.NODE_ENV === 'development') {
        return new Promise<ChatMessage[]>((resolve) => {
            setTimeout(() => {
                let newMessages = [];
                for (let i = 0; i < 10; i++) {
                    newMessages.push(CreateDebugMessage());
                }
                resolve(newMessages);
            }, 10);
        });
    }
    else {
        return fetchNui("fetchChannelMessages", { channel: channel });
    }
}

export function ChatChannel({ channel, embedWidth = 400, embedHeight = 225 }: { channel: string, embedWidth?: number, embedHeight?: number }) {
    const { config } = useConfig();
    const [configState, setConfigState] = useState<Config>({ identifier: "ERR_NO_IDENTIFIER" });
    useEffect(() => { setConfigState(config); }, [config]);
    const user = {
        identifier: configState.identifier,
        name: "Pickle Mods",
        role: "Staff",
        image: `https://picklemods.com/logo_1.png`,
    }
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const virtuoso = useRef<VirtuosoHandle>(null);
    useEffect(() => {
        setTimeout(() => {
            if (virtuoso.current && messages.length > 0) {
                console.log("Scrolling to the end of the list");
                virtuoso.current.scrollToIndex({
                    index: messages.length - 1,
                    align: 'end', // Scroll to the end of the list to show the latest message
                    behavior: GetContentType(messages[messages.length - 1].message) == "text" ? 'smooth' : 'auto',
                })
            }
        }, 100);
    }, [messages]);
    useEffect(() => {
        console.log("Fetching messages for the first time");
        FetchChannelMessages(channel).then((newMessages) => {
            setMessages(newMessages as ChatMessage[]);
        });
    }, []);
    useNuiEvent("receiveChannelMessage", (data) => {
        const targetChannel = data.channel;
        const message = data.message;
        if (targetChannel !== channel) return;
        console.log("Received a message", channel, message);
        setMessages((prevMessages) => [...prevMessages, message]);
    });
    return (
        <div className="flex flex-col h-full">
            {messages.length < 1 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">No chat history yet.</div>
            ) : (
                <Virtuoso
                    ref={virtuoso}
                    initialTopMostItemIndex={messages.length - 1}
                    className="flex flex-col gap-2 p-2 border-l-1 border-t-1 border-r-1 h-full overflow-y-auto overflow-x-hidden"
                    totalCount={messages.length}
                    itemContent={(index) => {
                        const message = messages[index];
                        return message && (
                            <div key={index} className={`flex gap-2 p-2 rounded-md ${message.user.identifier === user.identifier ? 'justify-end pr-6' : ''}`}>
                                {message.user.identifier !== user.identifier && (<img src={message.user.image} alt={message.user.name} className="w-8 h-8 rounded-full" />)}
                                <div className={"flex flex-col" + (message.user.identifier === user.identifier ? ' items-end' : '')}>
                                    {message.user.identifier !== user.identifier && (<div className="font-bold text-primary">{message.user.name}</div>)}
                                    <div className="bg-secondary p-2 rounded-md">
                                        <GetFormattedContent isUser={message.user.identifier == user.identifier} embedWidth={embedWidth} embedHeight={embedHeight} content={message.message} />
                                    </div>
                                    <div className={"text-xs text-muted-foreground" + (GetContentType(message.message) != "text" ? " pt-2" : " pt-1" )}>{new Date(message.datetime * 1000).toLocaleString()}</div>
                                </div>
                            </div>
                        );
                    }}
                />
            )}
            <div ref={messagesEndRef} />
            <div className="flex items-center w-full h-16 p-2 border-1">
                <Input
                    type="text"
                    placeholder="Type a message..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            fetchNui("sendChannelMessage", { channel: channel, message: input.value });
                            input.value = '';
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default function Chat() {
    return (
        <>
            <div className="font-bold px-2 pb-2 text-2xl">Staff Chat</div>
            <ChatChannel channel={"staff"} />
        </>
    )
}