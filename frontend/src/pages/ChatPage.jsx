import { SearchIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Flex,
    Input,
    Skeleton,
    SkeletonCircle,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import Conversations from "../components/Conversations";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
    conversationsAtom,
    selectedConversationAtom,
} from "../atoms/messagesAtom";
import { useSocket } from "../context/SocketContext";
import SelectAConversation from "../components/SelectAConversation";

const ChatPage = () => {
    const showToast = useShowToast();
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [conversations, setConversations] = useRecoilState(conversationsAtom);
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const [searchText, setSearchText] = useState("");
    const [searchingUser, setSearchingUser] = useState(false);
    const { socket, onlineUsers } = useSocket();

    useEffect(() => {
        socket?.on("messagesSeen", ({ conversationId }) => {
            setConversations((prev) => {
                const updatedConversation = prev.map((conversation) => {
                    if (conversation._id === conversationId) {
                        return {
                            ...conversation,
                            lastMessage: {
                                ...conversation.lastMessage,
                                seen: true,
                            },
                        };
                    }
                    return conversation;
                });
                return updatedConversation;
            });
        });
    }, [socket, setConversations]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await fetch("/api/messages/conversations");
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setConversations(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoadingConversations(false);
            }
        };

        getConversations();
    }, [showToast, setConversations]);

    const handleConversationSearch = async (e) => {
        e.preventDefault();
        setSearchingUser(true);
        try {
            const res = await fetch(
                `/api/users/get-all-users-chat?username=${searchText}`
            );
            const searchedUsers = await res.json();
            const arrMockUsersFound = [];
            const timeNow = new Date();
            searchedUsers.forEach((seachedUser, index) => {
                const isExistInConversation = conversations.find(
                    (conversation) =>
                        conversation.participants[0]._id === seachedUser._id &&
                        !conversation.mock
                );
                if (!isExistInConversation) {
                    const mockConversation = {
                        mock: true,
                        lastMessage: {
                            text: "",
                            sender: "",
                        },
                        _id: new Date().getTime() + index,
                        participants: [
                            {
                                _id: seachedUser._id,
                                username: seachedUser.username,
                                profilePic: seachedUser.profilePic,
                            },
                        ],
                        createdAt: timeNow.toISOString(),
                        updatedAt: timeNow.toISOString(),
                    };
                    arrMockUsersFound.push(mockConversation);
                }
            });
            const arrUsersFoundSort = [
                ...arrMockUsersFound,
                ...conversations.filter((conversation) => !conversation.mock),
            ].sort((a, b) => {
                if (new Date(a).getTime() !== new Date(b).getTime())
                    return new Date(a).getTime() - new Date(b).getTime();
                return a.participants[0].username.localeCompare(
                    b.participants[0].username
                );
            });
            setConversations(arrUsersFoundSort);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setSearchingUser(false);
        }
    };

    return (
        <Box
            position={"absolute"}
            left={"50%"}
            w={{
                base: "100%",
                md: "80%",
                lg: "850px",
            }}
            p={4}
            transform={"translateX(-50%)"}
        >
            <Flex
                gap={4}
                flexDirection={{
                    base: "column",
                    md: "row",
                }}
                maxW={{
                    sm: "400px",
                    md: "full",
                }}
                mx={"auto"}
            >
                <Flex
                    flex={30}
                    gap={2}
                    flexDirection={"column"}
                    maxW={{ sm: "250px", md: "full" }}
                >
                    <Text
                        fontWeight={700}
                        color={useColorModeValue("gray.600", "gray.400")}
                    >
                        Your Conversations
                    </Text>
                    <form onSubmit={handleConversationSearch}>
                        <Flex alignItems={"center"} gap={2}>
                            <Input
                                placeholder="Search for a user"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            <Button
                                size={"sm"}
                                onClick={handleConversationSearch}
                                isLoading={searchingUser}
                            >
                                <SearchIcon />
                            </Button>
                        </Flex>
                    </form>
                    {loadingConversations &&
                        [...Array(5)].map((_, i) => (
                            <Flex
                                key={i}
                                gap={4}
                                alignItems={"center"}
                                p={"1"}
                                borderRadius={"md"}
                            >
                                <Box>
                                    <SkeletonCircle size={"10"} />
                                </Box>
                                <Flex
                                    w={"full"}
                                    flexDirection={"column"}
                                    gap={3}
                                >
                                    <Skeleton h={"10px"} w={"80px"} />
                                    <Skeleton h={"8px"} w={"90%"} />
                                </Flex>
                            </Flex>
                        ))}
                    {!loadingConversations &&
                        conversations.map((conversation) => (
                            <Conversations
                                key={conversation._id}
                                conversation={conversation}
                                isOnline={onlineUsers.includes(
                                    conversation.participants[0]._id
                                )}
                            />
                        ))}
                </Flex>
                {!selectedConversation._id && <SelectAConversation />}
                {selectedConversation._id && <MessageContainer />}
            </Flex>
        </Box>
    );
};

export default ChatPage;
