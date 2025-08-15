import { useEffect, useState } from "react"
import axios from "axios";

export interface Blog {
    id: string;
    title: string;
    content: string;
    published: boolean;
    authorId: string;
    author: {
        name: string | null;
    };
}

export interface User {
    id: string;
    name: string;
    email: string;
    // Add other user properties as needed
}

export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => {
                setBlog(response.data.blog);
                setLoading(false);
            })
    }, [id])

    return {
        loading,
        blog
    }

}
export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => {
                console.log("Blogs response:", response.data);
                setBlogs(response.data.blogs);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching blogs:", error);
                setLoading(false);
            });
    }, [])

    return {
        loading,
        blogs
    }
}

export const useCurrentUser = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/blog/current`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => {
                setUser(response.data.user);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching current user:", error);
                setLoading(false);
            });
    }, [])
    console.log("User:", user);

    return {
        loading,
        user
    }
}