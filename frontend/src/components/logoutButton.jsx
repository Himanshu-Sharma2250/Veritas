import { useAuthStore } from "../store/useAuthStore";

const logoutButton = () => {
    const {logout} = useAuthStore();

    const onLogout = async () => {
        await logout();
    }

    return (
        <button className="btn-soft btn-warning sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl" onClick={onLogout}>
            {childern}
        </button>
    )
}

export default logoutButton;