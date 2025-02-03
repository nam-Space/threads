import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState, useSetRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";

const UserPage = () => {
    const { loading, user } = useGetUserProfile();
    const setUser = useSetRecoilState(userAtom);
    const { username } = useParams();
    const showToast = useShowToast();
    const [fetchingPosts, setFetchingPosts] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom);

    useEffect(() => {
        if (!user) return;
        const getPosts = async () => {
            setPosts([]);
            setFetchingPosts(true);
            try {
                const res = await fetch(`/api/posts/user/${username}`);
                const data = await res.json();
                if (data.message === "Unauthorized") {
                    localStorage.removeItem("user-threads");
                    setUser(null);
                    showToast("Error", data.message, "error");
                    return;
                }
                setPosts(data);
            } catch (error) {
                showToast("Error", error, "error");
                if (error.message === "Unauthorized") {
                    localStorage.removeItem("user-threads");
                    setUser(null);
                }
            } finally {
                setFetchingPosts(false);
            }
        };
        getPosts();
    }, [username, showToast, setPosts, user]);

    if (!user && loading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"} />
            </Flex>
        );
    }

    if (!user && !loading) return <h1>User not found</h1>;

    return (
        <>
            <UserHeader user={user} />
            {!fetchingPosts && posts.length === 0 && (
                <h1>User has not posts.</h1>
            )}
            {fetchingPosts && (
                <Flex justifyContent={"center"} my={12}>
                    <Spinner size={"xl"} />
                </Flex>
            )}
            {!fetchingPosts &&
                posts.length > 0 &&
                posts.map((post) => (
                    <Post key={post._id} post={post} postedBy={post.postedBy} />
                ))}
        </>
    );
};

export default UserPage;
