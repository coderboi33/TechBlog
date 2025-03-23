import { Link } from "react-router-dom";
interface BlogCardProps {
    title: string;
    content: string;
    publishedDate: string;
    id: string;
    authorName: string;
}

export const BlogCard = ({
    id,
    title,
    content,
    publishedDate,
    authorName
}: BlogCardProps) => {
    return <Link to={`/blog/${id}`}>
        <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 bg-blue-50 w-screen max-w-screen-lg cursor-pointer">
            <div className="flex">
                <Avatar name={authorName} />
                <div className="font-extralight pl-2 text-sm flex justify-center flex-col">
                    {authorName}
                </div>
                <div className=" justify-center pl-2 flex  flex-col">
                    <Circle />
                </div>
                <div className="pl-2 font-thin text-slate-500 text-sm flex justify-center flex-col">
                    {publishedDate}
                </div>
            </div>
            <div className="text-xl font-semibold pt-2">
                {title}
            </div>
            <div className="text-md font-thin">
                {content.slice(0, 100) + "..."}
            </div>
            <div className="text-slate-500 text-sm font-thin pt-4">
                {`${Math.ceil(content.length / 100)} minute(s) read`}
            </div>
        </div>
    </Link>
}

export function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-500">

    </div>
}

export function Avatar({ name = "U", size = "small" }: { name?: string, size?: "small" | "big" }) {
    return (
        <div className={`relative inline-flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-700 to-purple-800 rounded-full ${size === "small" ? "w-6 h-6" : "w-12 h-12"} shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-20"></div>
            <span className={`${size === "small" ? "text-xs" : "text-lg"} font-semibold text-white relative z-10`}>
                {name ? name[0].toUpperCase() : "U"}
            </span>
        </div>
    );
}
