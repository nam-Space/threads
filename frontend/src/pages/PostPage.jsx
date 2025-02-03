import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    Image,
    Spinner,
    Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
    const { loading, user } = useGetUserProfile();
    const currentUser = useRecoilValue(userAtom);
    const setUser = useSetRecoilState(userAtom);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const showToast = useShowToast();
    const { pid } = useParams();
    const navigate = useNavigate();
    const [isDeletePost, setIsDeletePost] = useState(false);

    const currentPost = posts[0];

    useEffect(() => {
        const getPost = async () => {
            setPosts([]);
            try {
                const res = await fetch(`/api/posts/${pid}`);
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
                setPosts([data]);
            } catch (error) {
                showToast("Error", error.message, "error");
                if (error.message === "Unauthorized") {
                    localStorage.removeItem("user-threads");
                    setUser(null);
                }
            }
        };

        getPost();
    }, [showToast, pid, setPosts]);

    if (!user && loading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"} />
            </Flex>
        );
    }

    const handleDeletePost = async () => {
        if (isDeletePost) return;
        setIsDeletePost(true);

        try {
            if (!window.confirm("Are you sure you want to delete this post?"))
                return;

            const res = await fetch(`/api/posts/${currentPost._id}`, {
                method: "DELETE",
            });

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
            showToast("Success", "Post deleted", "success");
            navigate(`/${user.username}`);
        } catch (error) {
            showToast("Error", error.message, "error");
            if (error.message === "Unauthorized") {
                localStorage.removeItem("user-threads");
                setUser(null);
            }
        } finally {
            setIsDeletePost(false);
        }
    };

    if (!currentPost) return null;

    return (
        <div style={{ opacity: isDeletePost ? 0.5 : 1 }}>
            <Flex>
                <Flex w={"full"} alignItems={"center"} gap={3}>
                    <Avatar
                        src={user.profilePic || "/default-avatar.png"}
                        size={"md"}
                        name={user.name}
                        onClick={() => navigate(`/${user.username}`)}
                        cursor={"pointer"}
                    />
                    <Flex>
                        <Text
                            fontSize={"sm"}
                            fontWeight={"bold"}
                            onClick={() => navigate(`/${user.username}`)}
                            cursor={"pointer"}
                        >
                            {user.username}
                        </Text>
                        <Image src="/verified.png" w={"4"} h={4} ml={4} />
                    </Flex>
                </Flex>
                <Flex gap={4} alignItems={"center"}>
                    <Text
                        fontSize={"xs"}
                        width={36}
                        textAlign={"right"}
                        color={"gray.light"}
                    >
                        {formatDistanceToNow(new Date(currentPost.createdAt))}{" "}
                        ago
                    </Text>
                    {currentUser._id === user._id && (
                        <DeleteIcon
                            size={20}
                            cursor={"pointer"}
                            onClick={handleDeletePost}
                        />
                    )}
                </Flex>
            </Flex>
            <Text my={3}>{currentPost.text}</Text>
            {currentPost.img && (
                <Box
                    borderRadius={6}
                    overflow={"hidden"}
                    border={"1px solid"}
                    borderColor={"gray.light"}
                >
                    <Image src={currentPost.img} w={"full"} />
                </Box>
            )}

            <Flex gap={3} my={3}>
                <Actions post={currentPost} />
            </Flex>

            <Divider my={4} />

            <Flex justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"2xl"}>👋</Text>
                    <Text color={"gray.light"}>
                        Get the app to like, reply and post.
                    </Text>
                </Flex>
                <Button>Get</Button>
            </Flex>

            <Divider my={4} />
            {currentPost.replies.length > 0 &&
                currentPost.replies.map((reply) => (
                    <div key={reply._id}>
                        <Comment
                            post={currentPost}
                            reply={reply}
                            lastReply={
                                reply._id ===
                                currentPost.replies[
                                    currentPost.replies.length - 1
                                ]._id
                            }
                        />
                    </div>
                ))}
        </div>
    );
};

export default PostPage;
