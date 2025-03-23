import { useNavigate } from 'react-router-dom';
import { Appbar } from '../components/Appbar';
import { useCurrentUser } from '../hooks';

export const Profile = () => {
    const { user } = useCurrentUser();
    const navigate = useNavigate();



    if (!user) {
        navigate('/signin');
    }

    return (
        <div>
            <Appbar authorName={user?.name || "Anonymous"} />
            <div className="bg-green-100 h-screen flex items-center justify-center">
                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-md max-w-md w-full">
                    <h1 className="text-2xl mb-5 text-gray-800">Profile</h1>
                    {user ? (
                        <div>
                            <p className="text-lg text-gray-700">Name: {user?.name}</p>
                            <p className="text-lg text-gray-700">Email: {user?.email}</p>
                        </div>
                    ) : (
                        <p className="text-lg text-gray-700">Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
