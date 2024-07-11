import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useState } from "react";

const Post = ({ post, postedBy }) => {
    const navigate = useNavigate();
    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom);
    const setPosts = useSetRecoilState(postsAtom);
    const [isDeletePost, setIsDeletePost] = useState(false);

    const handleDeletePost = async (e) => {
        if (isDeletePost) return;
        setIsDeletePost(true);

        try {
            e.preventDefault();

            if (!window.confirm("Are you sure you want to delete this post?"))
                return;

            const res = await fetch(`/api/posts/${post._id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("Success", "Post deleted", "success");
            setPosts((prev) => prev.filter((p) => p._id !== post._id));
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsDeletePost(false);
        }
    };

    return (
        <Link to={`/${postedBy.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5} opacity={isDeletePost ? 0.5 : 1}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar
                        size={"md"}
                        name={postedBy.name}
                        src={postedBy.profilePic || "/default-avatar.png"}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${postedBy.username}`);
                        }}
                    />
                    <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        {post.replies.length === 0 && (
                            <Text textAlign={"center"}>🥱</Text>
                        )}
                        {post.replies[0] && (
                            <Avatar
                                size={"xs"}
                                name={post.replies[0].name}
                                src={
                                    post.replies[0].userProfilePic ||
                                    "/default-avatar.png"
                                }
                                position={"absolute"}
                                top="0px"
                                left="15px"
                                padding="2px"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${post.replies[0].username}`);
                                }}
                            />
                        )}
                        {post.replies[1] && (
                            <Avatar
                                size={"xs"}
                                name={post.replies[1].name}
                                src={
                                    post.replies[1].userProfilePic ||
                                    "/default-avatar.png"
                                }
                                position={"absolute"}
                                bottom="0px"
                                right="-5px"
                                padding="2px"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${post.replies[1].username}`);
                                }}
                            />
                        )}
                        {post.replies[2] && (
                            <Avatar
                                size={"xs"}
                                name={post.replies[2].name}
                                src={
                                    post.replies[2].userProfilePic ||
                                    "/default-avatar.png"
                                }
                                position={"absolute"}
                                bottom="0px"
                                left="4px"
                                padding="2px"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${post.replies[2].username}`);
                                }}
                            />
                        )}
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text
                                fontSize={"sm"}
                                fontWeight={"bold"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${postedBy.username}`);
                                }}
                            >
                                {postedBy.username}
                            </Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text
                                fontSize={"xs"}
                                width={36}
                                textAlign={"right"}
                                color={"gray.light"}
                            >
                                {formatDistanceToNow(new Date(post.createdAt))}{" "}
                                ago
                            </Text>
                            {currentUser._id === postedBy._id && (
                                <DeleteIcon
                                    size={20}
                                    cursor={"pointer"}
                                    onClick={handleDeletePost}
                                />
                            )}
                        </Flex>
                    </Flex>
                    <Text fontSize={"sm"}>{post.text}</Text>
                    {post.img && (
                        <Box
                            borderRadius={6}
                            overflow={"hidden"}
                            border={"1px solid"}
                            borderColor={"gray.light"}
                        >
                            <Image src={post.img} w={"full"} />
                        </Box>
                    )}

                    <Flex gap={3} my={1}>
                        <Actions post={post} />
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default Post;
