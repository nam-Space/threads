import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
    const user = useRecoilValue(userAtom);
    const { pathname } = useLocation();

    return (
        <Box position={"relative"} w={"full"}>
            <Header />
            <Container
                maxW={
                    pathname === "/"
                        ? {
                              base: "620px",
                              md: "900px",
                          }
                        : "620px"
                }
            >
                <Routes>
                    <Route
                        path="/"
                        element={
                            user ? (
                                <>
                                    {" "}
                                    <HomePage />
                                    <CreatePost />
                                </>
                            ) : (
                                <Navigate to={"/auth"} />
                            )
                        }
                    />
                    <Route
                        path="/auth"
                        element={!user ? <AuthPage /> : <Navigate to={"/"} />}
                    />
                    <Route
                        path="/update"
                        element={
                            user ? (
                                <UpdateProfilePage />
                            ) : (
                                <Navigate to={"/auth"} />
                            )
                        }
                    />
                    <Route
                        path="/:username"
                        element={
                            user ? (
                                <>
                                    <UserPage />
                                    <CreatePost />
                                </>
                            ) : (
                                <Navigate to={"/auth"} />
                            )
                        }
                    />
                    <Route
                        path="/:username/post/:pid"
                        element={
                            user ? <PostPage /> : <Navigate to={"/auth"} />
                        }
                    />
                    <Route
                        path="/chat"
                        element={
                            user ? <ChatPage /> : <Navigate to={"/auth"} />
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            user ? <SettingsPage /> : <Navigate to={"/auth"} />
                        }
                    />
                </Routes>
            </Container>
        </Box>
    );
}

export default App;
