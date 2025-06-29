import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useAuth } from "../context/useAuth";

export default function Deconnexion( { user } ) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    useEffect(() => {
        if(!user) return (toast.error("Veuillez d'abord vous connecter") && navigate("/"));
    }, [user, navigate]);

    useEffect(() => {
        if(user) {
            setTimeout(() => {
                try {
                    logout();
                    navigate("/", { replace: true });
                    window.location.reload();
                    // toast.success("Deconnexion réussie");
                } catch (error) {
                    toast.error("Erreur lors de la déconnexion");
                    console.error("Logout error:", error);
                }
                
            }, 1000);
        }
    }, [navigate, logout, user]);

    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen">
                <img src="https://res.cloudinary.com/ds5zfxlhf/image/upload/v1745237611/Logo-EasyService.png" alt="Logo de Easy Service" aria-label="Logo de Easy Service" />
                <h1 className="text-3xl font-bold text-orange-500 animate-pulse mt-3">Deconnexion en cours...</h1>
            </div>
        </>
    )
}