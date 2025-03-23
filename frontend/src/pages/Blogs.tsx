import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs, useCurrentUser } from "../hooks";

export const Blogs = () => {
    const { loading, blogs } = useBlogs();
    const { user } = useCurrentUser();
    console.log(user);

    if (loading) {
        return <div>
            <Appbar authorName={""} />
            <div className="flex justify-center">
                <div>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        </div>
    }


    return (
        <div>
            <Appbar authorName={user?.name || "Anonymous"} />
            <div className="flex justify-center bg-green-100 h-screen">
                <div>
                    {blogs.map(blog => <BlogCard
                        key={blog.id}
                        id={blog.id}
                        title={blog.title}
                        content={blog.content}
                        publishedDate={""}
                        authorName={blog.author?.name || "Anonymous"}
                    />)}
                </div>
            </div>
        </div>
    )
}
