import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import { useRecoilState, useSetRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import userAtom from "../atoms/userAtom";

const HomePage = () => {
    const setUser = useSetRecoilState(userAtom);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState(true);
    const showToast = useShowToast();
    useEffect(() => {
        const getFeedPosts = async () => {
            setPosts([]);
            setLoading(true);
            try {
                const res = await fetch("/api/posts/feed");
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setPosts(data);
            } catch (error) {
                showToast("Error", error.message, "error");
                if (error.message === "Unauthorized") {
                    localStorage.removeItem("user-threads");
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };

        getFeedPosts();
    }, [showToast, setPosts]);

    return (
        <Flex gap={10} alignItems={"flex-start"}>
            <Box flex={70}>
                {loading && (
                    <Flex justify={"center"}>
                        <Spinner size={"xl"} />
                    </Flex>
                )}
                {posts.map((post) => (
                    <Post key={post._id} post={post} postedBy={post.postedBy} />
                ))}
            </Box>
            <Box
                flex={30}
                display={{
                    base: "none",
                    md: "block",
                }}
                position={"sticky"}
                top={"96px"}
            >
                <SuggestedUsers />
            </Box>
        </Flex>
    );
};

export default HomePage;
