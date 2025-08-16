import { Appbar } from "../components/Appbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { useCurrentUser } from "../hooks";

// Your TextEditor component remains unchanged.
function TextEditor({ onChange }: { onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }) {
    return (
        <div className="mt-2">
            <div className="w-full mb-4">
                <div className="flex items-center justify-between border">
                    <div className="my-2 bg-white rounded-b-lg w-full">
                        <label className="sr-only">Publish post</label>
                        <textarea
                            onChange={onChange}
                            id="editor"
                            rows={8}
                            className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2"
                            placeholder="Write an article..."
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    const { user } = useCurrentUser();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');

    if (!user) {
        navigate('/signin');
        return null; // It's good practice to return null if you navigate away
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handlePublish = async () => {
        if (!title || !description) {
            alert("Please fill in both title and description.");
            return;
        }

        let finalContent = description;

        try {
            if (selectedFile) {
                // 1. Ask our backend for a secure upload URL.
                const { data: uploadData } = await axios.post(
                    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/upload-url`,
                    { filename: selectedFile.name },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );

                const { uploadUrl, finalImageUrl } = uploadData;

                // 2. Upload the file directly to S3.
                await axios.put(uploadUrl, selectedFile, {
                    headers: { 'Content-Type': selectedFile.type },
                });

                // 3. Get the final image URL and add it to the content.
                finalContent = `![](${finalImageUrl})\n\n${description}`;
            }

            // Now, create the blog post with the final content
            const response = await axios.post(
                `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/blog`,
                { title, content: finalContent },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            navigate(`/blog/${response.data.id}`);

        } catch (error) {
            console.error("Error publishing the post:", error);
            alert("Failed to publish post. Please try again.");
        }
    };

    return (
        <div>
            <Appbar authorName={user?.name || "Anonymous"} />
            <div className="flex justify-center w-full pt-8">
                <div className="max-w-screen-lg w-full">
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Title"
                    />

                    <div className="mt-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Cover Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        />
                        {previewUrl && (
                            <div className="mt-4">
                                <img src={previewUrl} alt="Preview" className="rounded-lg max-w-xs" />
                            </div>
                        )}
                    </div>

                    <TextEditor onChange={(e) => setDescription(e.target.value)} />
                    <button
                        onClick={handlePublish}
                        type="submit"
                        className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                    >
                        Publish post
                    </button>
                </div>
            </div>
        </div>
    );
};