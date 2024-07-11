import {
    Button,
    Container,
    Flex,
    Image,
    Link,
    useColorMode,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";

const Header = () => {
    const { pathname } = useLocation();
    const { colorMode, toggleColorMode } = useColorMode();
    const user = useRecoilValue(userAtom);
    const logout = useLogout();
    const setAuthScreen = useSetRecoilState(authScreenAtom);

    return (
        <Container
            maxW={
                pathname === "/"
                    ? {
                          base: "620px",
                          md: "900px",
                      }
                    : "620px"
            }
            position={"sticky"}
            top={0}
            zIndex={50}
            backdropFilter={"blur(5px)"}
        >
            <Flex justifyContent={"space-between"} pt={"24px"} pb={"24px"}>
                {user && (
                    <Link as={RouterLink} to={"/"}>
                        <AiFillHome size={24} />
                    </Link>
                )}
                {!user && (
                    <Link
                        as={RouterLink}
                        onClick={() => setAuthScreen("login")}
                    >
                        Login
                    </Link>
                )}

                <Image
                    cursor={"pointer"}
                    alt="logo"
                    w={6}
                    src={
                        colorMode === "dark"
                            ? "/light-logo.svg"
                            : "/dark-logo.svg"
                    }
                    onClick={toggleColorMode}
                />

                {user && (
                    <Flex alignItems={"center"} gap={4}>
                        <Link as={RouterLink} to={`/${user.username}`}>
                            <RxAvatar size={24} />
                        </Link>
                        <Link as={RouterLink} to={`/chat`}>
                            <BsFillChatQuoteFill size={20} />
                        </Link>
                        <Link as={RouterLink} to={`/settings`}>
                            <MdOutlineSettings size={20} />
                        </Link>
                        <Button size={"xs"}>
                            <FiLogOut size={20} onClick={logout} />
                        </Button>
                    </Flex>
                )}

                {!user && (
                    <Link
                        as={RouterLink}
                        onClick={() => setAuthScreen("signup")}
                    >
                        Sign up
                    </Link>
                )}
            </Flex>
        </Container>
    );
};

export default Header;
