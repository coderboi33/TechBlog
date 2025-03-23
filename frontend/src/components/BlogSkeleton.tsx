import { Circle } from "./BlogCard"

export const BlogSkeleton = () => {
    return (
        <div className=" bg-green-100">
            <div role="status" className="animate-pulse">
                <div className="p-4 border rounded-lg shadow-md bg-blue-50 w-screen max-w-screen-lg cursor-pointer">
                    <div className="flex">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <div className="font-extralight pl-2 text-sm flex justify-center flex-col">
                            <div className="h-4 bg-gray-300 rounded-full w-24"></div>
                        </div>
                        <div className="pl-2 flex justify-center flex-col">
                            <Circle />
                        </div>
                        <div className="pl-2 font-thin text-slate-500 text-sm flex justify-center flex-col">
                            <div className="h-4 bg-gray-300 rounded-full w-20"></div>
                        </div>
                    </div>
                    <div className="text-xl font-semibold pt-2">
                        <div className="h-6 bg-gray-300 rounded-full w-3/4"></div>
                    </div>
                    <div className="text-md font-thin">
                        <div className="h-4 bg-gray-300 rounded-full w-full mt-2"></div>
                        <div className="h-4 bg-gray-300 rounded-full w-5/6 mt-2"></div>
                        <div className="h-4 bg-gray-300 rounded-full w-4/6 mt-2"></div>
                    </div>
                    <div className="text-slate-500 text-sm font-thin pt-4">
                        <div className="h-4 bg-gray-300 rounded-full w-24"></div>
                    </div>
                </div>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}