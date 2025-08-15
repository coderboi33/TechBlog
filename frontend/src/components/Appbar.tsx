import axios from "axios";
import { Avatar } from "./BlogCard"
import { Link, useNavigate } from "react-router-dom"

interface AppbarProps {
    authorName: string;
}

export const Appbar = ({ authorName }: AppbarProps) => {
    const navigate = useNavigate();

    const signOut = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/user/signout`);

            if (response.status === 200) {
                // Assuming the token is stored in local storage
                localStorage.removeItem('jwt'); // or sessionStorage.removeItem('jwt') if stored in session storage
                console.log('Successfully signed out');
                navigate('/signin');
            } else {
                console.error('Sign out failed');
            }
        } catch (error) {
            console.error('Error during sign out:', error);
        }
    }
    return (
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to={'/blogs'} className="flex items-center space-x-2 group">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-teal-600 group-hover:to-blue-600">
                            Tech Blog
                        </span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <Link to={`/publish`}>
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Post
                            </button>
                        </Link>

                        <div className="relative group">
                            <Avatar size={"big"} name={authorName} />
                            <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Profile
                                </Link>
                                {/* <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Settings
                                </Link> */}
                                <button onClick={signOut} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}