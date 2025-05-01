export default function UserProfil({user}) {
    return (
        <div>
            <h1>Profil de {user?.nom}</h1>
        </div>
    );
}