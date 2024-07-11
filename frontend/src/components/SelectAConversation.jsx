import { Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { GiConversation } from "react-icons/gi";
import { useSocket } from "../context/SocketContext";
import { conversationsAtom } from "../atoms/messagesAtom";
import { useSetRecoilState } from "recoil";
import messageSound from "../assets/sounds/message.mp3";

const SelectAConversation = () => {
    const { socket } = useSocket();
    const setConversations = useSetRecoilState(conversationsAtom);

    useEffect(() => {
        socket?.on("newMessage", (message) => {
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

        return () => socket?.off("newMessage");
    }, [socket, setConversations]);

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
