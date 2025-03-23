import { Blog, useCurrentUser } from "../hooks"
import { Appbar } from "./Appbar"
import { Avatar } from "./BlogCard"

export const FullBlog = ({ blog }: { blog: Blog }) => {
    const { user } = useCurrentUser();
    return (
        <div className="min-h-screen bg-blue-50">
            <Appbar authorName={user?.name || "Anonymous"} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <article className="bg-white rounded-xl border border-blue-100 shadow-sm p-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                                {blog.title}
                            </h1>
                            <div className="flex items-center text-blue-600 mb-8">
                                <span className="text-sm">
                                    Posted on December 2, 2023
                                </span>
                            </div>
                            <div className="prose prose-lg max-w-none prose-blue">
                                {blog.content}
                            </div>
                        </article>
                    </div>

                    {/* Author Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-8 sticky top-8">
                            <h2 className="text-lg font-semibold text-blue-900 mb-6">
                                About the Author
                            </h2>
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4">
                                    <Avatar size="big" name={blog.author?.name || "Anonymous"} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-blue-900 mb-2">
                                        {blog.author?.name || "Anonymous"}
                                    </h3>
                                    <p className="text-blue-600 text-sm">
                                        Technology Enthusiast
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}