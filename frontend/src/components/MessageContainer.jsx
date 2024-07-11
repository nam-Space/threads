import {
    Avatar,
    Divider,
    Flex,
    Image,
    Skeleton,
    SkeletonCircle,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
    conversationsAtom,
    selectedConversationAtom,
} from "../atoms/messagesAtom";
import { useEffect, useRef, useState } from "react";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import messageSound from "../assets/sounds/message.mp3";
import { useNavigate } from "react-router-dom";

const MessageContainer = () => {
    const navigate = useNavigate();
    const showToast = useShowToast();
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState([]);
    const currentUser = useRecoilValue(userAtom);
    const { socket } = useSocket();
    const setConversations = useSetRecoilState(conversationsAtom);
    const messageEndRef = useRef(null);
    const lastUserSeen = [...messages]
        ?.reverse()
        ?.find((m) => m.sender === currentUser._id && m.seen);

    useEffect(() => {
        socket.on("newMessage", (message) => {
            if (selectedConversation._id === message.conversationId) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }

            const sound = new Audio(messageSound);
            sound.play();

            setConversations((prev) => {
                const updatedConversations = prev.map((conversation) => {
                    if (conversation._id === message.conversationId) {
                        return {
                            ...conversation,
                            lastMessage: {
                                text: message.text,
                                sender: message.sender,
                            },
                        };
                    }
                    return conversation;
                });
                return updatedConversations;
            });
        });

        return () => socket.off("newMessage");
    }, [socket, selectedConversation, setConversations]);

    useEffect(() => {
        if (messages.length) {
            const lastMessageIsFromOtherUser =
                messages[messages.length - 1].sender !== currentUser._id;
            if (lastMessageIsFromOtherUser) {
                setConversations((prev) => {
                    const updatedConversations = prev.map((conv) => {
                        if (
                            conv._id ===
                            messages[messages.length - 1].conversationId
                        ) {
                            return {
                                ...conv,
                                lastMessage: {
                                    ...conv.lastMessage,
                                    seen: true,
                                },
                            };
                        }
                        return conv;
                    });
                    return updatedConversations;
                });
                socket.emit("markMessagesAsSeen", {
                    conversationId: selectedConversation._id,
                    userId: selectedConversation.userId,
                });
            }
        }

        socket.on("messagesSeen", ({ conversationId }) => {
            if (selectedConversation._id === conversationId) {
                setMessages((prev) => {
                    const updatedMessages = prev.map((message) => {
                        if (!message.seen) {
                            return {
                                ...message,
                                seen: true,
                            };
                        }
                        return message;
                    });
                    return updatedMessages;
                });
            }
        });
    }, [socket, currentUser._id, messages]);

    useEffect(() => {
        const getMessages = async () => {
            setLoadingMessages(true);
            setMessages([]);
            try {
                if (selectedConversation.mock) return;
                const res = await fetch(
                    `/api/messages/${selectedConversation.userId}`
                );
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setMessages(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoadingMessages(false);
            }
        };
        getMessages();
    }, [showToast, selectedConversation.userId, selectedConversation.mock]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Flex
            flex={"70"}
            bg={useColorModeValue("gray.200", "gray.dark")}
            borderRadius={"md"}
            p={2}
            flexDirection={"column"}
        >
            <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
                <Avatar
                    src={
                        selectedConversation.userProfilePic ||
                        "/default-avatar.png"
                    }
                    size={"sm"}
                    onClick={() =>
                        navigate(`/${selectedConversation.username}`)
                    }
                    cursor={"pointer"}
                />
                <Text
                    display={"flex"}
                    alignItems={"center"}
                    onClick={() =>
                        navigate(`/${selectedConversation.username}`)
                    }
                    cursor={"pointer"}
                >
                    {selectedConversation.username}{" "}
                    <Image src="/verified.png" w={4} h={4} ml={1} />
                </Text>
            </Flex>
            <Divider />
            <Flex
                flexDir={"column"}
                gap={4}
                my={4}
                p={2}
                height={"400px"}
                overflowY={"auto"}
            >
                {loadingMessages &&
                    [...Array(5)].map((_, i) => (
                        <Flex
                            key={i}
                            gap={2}
                            alignItems={"center"}
                            p={1}
                            borderRadius={"md"}
                            alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
                        >
                            {i % 2 === 0 && <SkeletonCircle size={7} />}
                            <Flex flexDir={"column"} gap={2}>
                                <Skeleton h={"8px"} w={"250px"} />
                                <Skeleton h={"8px"} w={"250px"} />
                                <Skeleton h={"8px"} w={"250px"} />
                            </Flex>
                            {i % 2 !== 0 && <SkeletonCircle size={7} />}
                        </Flex>
                    ))}

                {!loadingMessages &&
                    messages.map((message) => (
                        <Flex
                            key={message._id}
                            direction={"column"}
                            ref={
                                messages.length - 1 ===
                                messages.indexOf(message)
                                    ? messageEndRef
                                    : null
                            }
                        >
                            <Message
                                message={message}
                                ownMessage={message.sender === currentUser._id}
                                isLastUserSeen={
                                    lastUserSeen?._id === message._id
                                }
                            />
                        </Flex>
                    ))}
            </Flex>
            <MessageInput setMessages={setMessages} />
        </Flex>
    );
};

export default MessageContainer;
