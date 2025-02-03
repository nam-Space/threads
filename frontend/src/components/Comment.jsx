import { Avatar, Box, Divider, Flex, Image, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";
import postsAtom from "../atoms/postsAtom";
import { useState } from "react";

const Comment = ({ post, reply, lastReply }) => {
    const setUser = useSetRecoilState(userAtom);
    const currentUser = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [isDeleteReply, setIsDeleteReply] = useState(false);

    const handleDeleteReply = async () => {
        if (isDeleteReply) return;
        setIsDeleteReply(true);
        try {
            if (!window.confirm("Are you sure you want to delete this reply?"))
                return;

            const res = await fetch(
                `/api/posts/delete/${post._id}/${reply._id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();
            if (data.message === "Unauthorized") {
                localStorage.removeItem("user-threads");
                setUser(null);
                showToast("Error", data.message, "error");
                return;
            }
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            const updatedPosts = posts.map((p) => {
                if (p._id === post._id) {
                    return {
                        ...p,
                        replies: p.replies.filter(
                            (rep) => rep._id !== reply._id
                        ),
                    };
                }
                return p;
            });
            setPosts(updatedPosts);
            showToast("Success", "Reply deleted", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
            if (error.message === "Unauthorized") {
                localStorage.removeItem("user-threads");
                setUser(null);
            }
        } finally {
            setIsDeleteReply(false);
        }
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    opacity: isDeleteReply ? "0.5" : "1",
                }}
            >
                <div>
                    <Flex gap={4} py={2} my={2} w={"full"}>
                        <Avatar
                            src={reply.userProfilePic}
                            size={"sm"}
                            onClick={() => navigate(`/${reply.username}`)}
                            cursor={"pointer"}
                        />
                        <Flex gap={1} w={"full"} flexDirection={"column"}>
                            <Flex
                                w={"full"}
                                justifyContent={"space-between"}
                                alignItems={"center"}
                            >
                                <Text
                                    fontSize={"sm"}
                                    fontWeight={"bold"}
                                    onClick={() =>
                                        navigate(`/${reply.username}`)
                                    }
                                    cursor={"pointer"}
                                >
                                    {reply.username}
                                </Text>
                            </Flex>
                            <Text>{reply.text}</Text>
                            {reply.img && (
                                <Box
                                    borderRadius={6}
                                    overflow={"hidden"}
                                    border={"1px solid"}
                                    borderColor={"gray.light"}
                                >
                                    <Image src={reply.img} w={"full"} />
                                </Box>
                            )}
                        </Flex>
                    </Flex>
                </div>
                <Flex gap={4} alignItems={"center"} mt={"16px"}>
                    <Text
                        fontSize={"xs"}
                        width={36}
                        textAlign={"right"}
                        color={"gray.light"}
                    >
                        {formatDistanceToNow(new Date(reply.createdAt))} ago
                    </Text>
                    {currentUser._id === reply.userId && (
                        <DeleteIcon
                            size={20}
                            cursor={"pointer"}
                            onClick={handleDeleteReply}
                        />
                    )}
                </Flex>
            </div>
            {!lastReply && <Divider />}
        </>
    );
};

export default Comment;
