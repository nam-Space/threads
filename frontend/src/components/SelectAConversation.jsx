import { Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { GiConversation } from "react-icons/gi";
import { useSocket } from "../context/SocketContext";
import { conversationsAtom } from "../atoms/messagesAtom";
import { useRecoilState } from "recoil";
import messageSound from "../assets/sounds/message.mp3";

const SelectAConversation = () => {
    const { socket } = useSocket();
    const [conversations, setConversations] = useRecoilState(conversationsAtom);

    useEffect(() => {
        socket?.on("newMessage", async (message) => {
            const sound = new Audio(messageSound);
            sound.play();

            const conversationFound = conversations.find(
                (conversation) => conversation._id === message.conversationId
            );

            if (conversationFound) {
                setConversations((prev) => {
                    const updatedConversations = prev.map((conversation) => {
                        if (conversation._id === message.conversationId) {
                            return {
                                ...conversation,
                                lastMessage: {
                                    text: message.text,
                                    sender: message.sender,
                                    img: message.img,
                                },
                            };
                        }
                        return conversation;
                    });
                    return updatedConversations;
                });
            } else {
                const res = await fetch(`/api/users/find/${message.sender}`);
                const data = await res.json();
                setConversations((prev) => [
                    ...prev,
                    {
                        _id: message.conversationId,
                        participants: [
                            {
                                _id: data._id,
                                username: data.username,
                                profilePic: data.profilePic,
                            },
                        ],
                        lastMessage: {
                            text: message.text,
                            sender: message.sender,
                            img: message.img,
                        },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                ]);
            }
        });

        return () => socket?.off("newMessage");
    }, [socket, setConversations, conversations]);

    return (
        <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
        >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
        </Flex>
    );
};

export default SelectAConversation;
