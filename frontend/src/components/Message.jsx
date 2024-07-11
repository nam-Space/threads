import { Avatar, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { useState } from "react";

const Message = ({ message, ownMessage, isLastUserSeen }) => {
    const [selectedConversation, setSelectedConversation] = useRecoilState(
        selectedConversationAtom
    );
    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <>
            {ownMessage ? (
                <Flex gap={2} flexDirection={"column"} alignSelf={"flex-end"}>
                    <Flex alignItems={"flex-end"} flexDirection={"column"}>
                        {message.text && (
                            <Text
                                maxW={"350px"}
                                bg={"blue.400"}
                                p={1}
                                borderRadius={"md"}
                            >
                                {message.text}
                            </Text>
                        )}
                        {message.img && !imgLoaded && (
                            <Flex w={"200px"}>
                                <Image
                                    src={message.img}
                                    hidden
                                    onLoad={() => setImgLoaded(true)}
                                    alt="Message image"
                                    borderRadius={4}
                                />
                                <Skeleton w={"200px"} h={"200px"} />
                            </Flex>
                        )}
                        {message.img && imgLoaded && (
                            <Flex w={"200px"}>
                                <Image
                                    src={message.img}
                                    alt="Message image"
                                    borderRadius={4}
                                />
                            </Flex>
                        )}
                    </Flex>

                    {isLastUserSeen && (
                        <Flex alignSelf={"flex-end"}>
                            <Avatar
                                src={
                                    selectedConversation.userProfilePic ||
                                    "/default-avatar.png"
                                }
                                w={"3"}
                                h={"3"}
                            />
                        </Flex>
                    )}
                </Flex>
            ) : (
                <Flex gap={2}>
                    <Avatar
                        src={
                            selectedConversation.userProfilePic ||
                            "/default-avatar.png"
                        }
                        w={"7"}
                        h={7}
                    />
                    <Flex flexDirection={"column"}>
                        {message.text && (
                            <Text
                                maxW={"350px"}
                                bg={"gray.400"}
                                p={1}
                                borderRadius={"md"}
                                color={"black"}
                            >
                                {message.text}
                            </Text>
                        )}
                        {message.img && !imgLoaded && (
                            <Flex w={"200px"}>
                                <Image
                                    src={message.img}
                                    hidden
                                    onLoad={() => setImgLoaded(true)}
                                    alt="Message image"
                                    borderRadius={4}
                                />
                                <Skeleton w={"200px"} h={"200px"} />
                            </Flex>
                        )}
                        {message.img && imgLoaded && (
                            <Flex w={"200px"}>
                                <Image
                                    src={message.img}
                                    alt="Message image"
                                    borderRadius={4}
                                />
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            )}
        </>
    );
};

export default Message;
