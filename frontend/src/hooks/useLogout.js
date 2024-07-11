
import { useRecoilState, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';
import { selectedConversationAtom } from '../atoms/messagesAtom';

const useLogout = () => {
    const setUser = useSetRecoilState(userAtom)
    const [selectedConversation, setSelectedConversation] = useRecoilState(
        selectedConversationAtom
    );
    const showToast = useShowToast();

    const logout = async () => {
        try {
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            if (selectedConversation._id) {
                setSelectedConversation({
                    _id: '',
                    userId: '',
                    username: '',
                    userProfilePic: ''
                })
            }
            localStorage.removeItem("user-threads");
            setUser(null);
        } catch (error) {
            showToast("Error", error, "error");
        }
    };

    return logout
}

export default useLogout