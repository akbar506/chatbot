"use client";

import {
    ChatInput,
    ChatInputSubmit,
    ChatInputTextArea,
} from "@/components/ui/chat-input";
import {
    ChatMessage,
    ChatMessageAvatar,
    ChatMessageContent,
} from "@/components/ui/chat-message";
import { ChatMessageArea } from "@/components/ui/chat-message-area";
import { SquarePen, User, AlertCircle, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Message {
    id: string;
    type: "user" | "assistant";
    content: string;
}

export default function Chats() {
    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isChat, setIsChat] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    const newChat = () => {
        window.location.reload();
    };

    const buildPrompt = (allMessages: Message[]): string => {
        let prompt =
            "Use the conversation history to answer the new question. If conversation history is not available then just give response to user query. \n\n";
        allMessages.forEach((msg) => {
            if (msg.type === "user") {
                prompt += `User: ${msg.content}\n`;
            } else {
                prompt += `Assistant: ${msg.content}\n`;
            }
        });
        prompt += "Assistant:"; // Now the AI should generate the next answer.
        return prompt;
    };

    const handleSubmit = () => {
        if (!value.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            type: "user",
            content: value,
        };

        // Create a new conversation history that includes the new user message.
        const conversationHistory = [...messages, newUserMsg];
        // Build a prompt that includes the conversation history.
        const prompt = buildPrompt(conversationHistory);

        setIsChat(true);
        setIsLoading(true);
        // Update the messages with the new user message immediately.
        setMessages(conversationHistory);
        setValue("");

        // Using promise chaining instead of async/await
        fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: prompt }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("API error");
                return response.json();
            })
            .then((data) => {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        type: "assistant",
                        content: data.reply ?? "No response",
                    },
                ]);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error sending message:", error);
                setError("Error occurred while processing your message.");
                setIsLoading(false);
            });
    };

    return (
        <div className="min-h-screen flex flex-col pb-6">
            <div className="flex p-5 justify-between">
                <SquarePen onClick={newChat} className="cursor-pointer" />
                <User />
            </div>
            <div className="w-[700px] mx-auto px-4 sm:px-6 lg:px-8">
                {error &&
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                }
            </div>
            {!isChat && (
                <div className="flex-grow py-24 lg:py-32 flex flex-col justify-center">
                    <div className="mt-0 max-w-4xl w-full text-center mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-primary sm:text-4xl">
                            What can I help with?
                        </h1>
                        <p className="mt-3 text-muted-foreground">
                            A Gemini powered AI for the web
                        </p>
                    </div>
                    <div className="mt-5 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 ">
                        <ChatInput
                            variant="default"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onSubmit={handleSubmit}
                            loading={isLoading}
                            onStop={() => setIsLoading(false)}
                            className="h-[100px]"
                        >
                            <ChatInputTextArea placeholder="Type a message..." />
                            <ChatInputSubmit className="mt-3" />
                        </ChatInput>
                    </div>
                </div>
            )}

            {isChat && (
                <>
                    <div className="w-full">
                        <ChatMessageArea className={`space-y-4 p-2 ${error ? "h-[calc(100vh-300px)]" : "h-[calc(100vh-230px)]"} max-w-[700px] mx-auto`}>
                            {messages.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    id={message.id}
                                    variant={message.type === "user" ? "bubble" : undefined}
                                    type={message.type === "user" ? "outgoing" : "incoming"}
                                >
                                    {message.type === "assistant" && <ChatMessageAvatar />}
                                    <ChatMessageContent content={message.content} />
                                </ChatMessage>
                            ))}
                            {isLoading && (
                                <div className={`flex gap-x-4 items-center`}>
                                    <div className="rounded-full border p-2 w-9 h-9 flex justify-center items-center">
                                        <div className="translate-y-px [&amp;_svg]:size-4 [&amp;_svg]:shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg></div>
                                    </div>
                                    <LoaderCircle className="animate-spin" color="#ffffff" />
                                </div>
                            )}
                        </ChatMessageArea>
                    </div>

                    <div className="mt-3 mb-3 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                        <ChatInput
                            variant="default"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onSubmit={handleSubmit}
                            loading={isLoading}
                            onStop={() => setIsLoading(false)}
                            className="h-[100px]"
                        >
                            <ChatInputTextArea placeholder="Type a message..." />
                            <ChatInputSubmit className="mt-3" />
                        </ChatInput>
                    </div>
                </>
            )}

            <footer className="mt-auto max-w-4xl text-center mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-xs text-muted-foreground">
                    This AI model can make mistakes, Please Check the important Info
                </p>
            </footer>
        </div>
    );
}
