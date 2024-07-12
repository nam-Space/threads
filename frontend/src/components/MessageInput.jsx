import {
    Flex,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
    conversationsAtom,
    selectedConversationAtom,
} from "../atoms/messagesAtom";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";

const MessageInput = ({ setMessages }) => {
    const [messageText, setMessageText] = useState("");
    const showToast = useShowToast();
    const [selectedConversation, setSelectedConversation] = useRecoilState(
        selectedConversationAtom
    );
    const setConversations = useSetRecoilState(conversationsAtom);
    const imageRef = useRef(null);
    const { onClose } = useDisclosure();
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim() && !imgUrl) return;
        if (isSending) return;
        setIsSending(true);
        try {
            const res = await fetch(`/api/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipientId: selectedConversation.userId,
                    message: messageText,
                    img: imgUrl,
                }),
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            setMessages((prev) => [...prev, data]);
            setConversations((prev) => {
                const updatedConversations = prev.map((conversation) => {
                    if (conversation._id === selectedConversation._id) {
                        return {
                            ...conversation,
                            _id: data.conversationId,
                            lastMessage: {
                                text: messageText,
                                sender: data.sender,
                                img: data.img,
                            },
                            mock: false,
                        };
                    }
                    return conversation;
                });
                return updatedConversations;
            });
            setSelectedConversation((prev) => ({
                ...prev,
                _id: data.conversationId,
            }));

            setMessageText("");
            setImgUrl("");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Flex gap={2} alignItems={"center"}>
            <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
                <InputGroup>
                    <Input
                        w={"full"}
                        placeholder="Type a message"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                    />
                    <InputRightElement
                        cursor={"pointer"}
                        onClick={handleSendMessage}
                    >
                        <IoSendSharp />
                    </InputRightElement>
                </InputGroup>
            </form>
            <Flex flex={5} cursor={"pointer"}>
                <BsFillImageFill
                    size={20}
                    onClick={() => imageRef.current.click()}
                />
                <Input
                    type={"file"}
                    hidden
                    ref={imageRef}
                    onChange={handleImageChange}
                />
            </Flex>
            <Modal
                isOpen={imgUrl}
                onClose={() => {
                    onClose();
                    setImgUrl("");
                }}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex mt={5} w={"full"}>
                            <Image src={imgUrl} />
                        </Flex>
                        <Flex justifyContent={"flex-end"} my={2}>
                            {!isSending ? (
                                <IoSendSharp
                                    size={24}
                                    cursor={"pointer"}
                                    onClick={handleSendMessage}
                                />
                            ) : (
                                <Spinner size={"md"} />
                            )}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default MessageInput;
