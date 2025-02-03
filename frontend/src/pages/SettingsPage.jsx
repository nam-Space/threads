import { Button, Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

const SettingsPage = () => {
    const showToast = useShowToast();
    const logout = useLogout();
    const setUser = useSetRecoilState(userAtom);

    const freezeAccount = async () => {
        if (!window.confirm("Are you sure you want to freeze your account?"))
            return;

        try {
            const res = await fetch("/api/users/freeze", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data.message === "Unauthorized") {
                localStorage.removeItem("user-threads");
                setUser(null);
                showToast("Error", data.message, "error");
                return;
            }
            if (data.error) {
                return showToast("Error", data.error, "error");
            }
            if (data.success) {
                await logout();
                showToast("Success", "Your account has been frozen", "success");
            }
        } catch (error) {
            showToast("Error", error.message, "error");
            if (error.message === "Unauthorized") {
                localStorage.removeItem("user-threads");
                setUser(null);
            }
        }
    };

    return (
        <>
            <Text my={1} fontWeight={"bold"}>
                Freeze Your Account
            </Text>
            <Text my={1} fontWeight={"bold"}>
                You can unfreeze your account anytime by logging in.
            </Text>
            <Button size={"sm"} colorScheme="red" onClick={freezeAccount}>
                Freeze
            </Button>
        </>
    );
};

export default SettingsPage;
