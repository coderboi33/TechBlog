import { Link, useNavigate } from "react-router-dom";
import { LabelledInput } from "./LabelledInput";
import { useState } from "react";
import { SignupInput } from "techblog-common";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false); // State to track loading
    const navigate = useNavigate();

    async function sendRequest() {
        setLoading(true); // Set loading to true
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
                postInputs
            );
            const token = response.data.jwt; // Adjust based on your API response structure

            // Ensure you are accessing the token correctly

            localStorage.setItem("token", token);


            navigate("/blogs");
        } catch (e) {
            console.error("Error during request:", e); // Log error details
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false); // Set loading back to false
        }
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="flex flex-col w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                <div className="text-3xl font-extrabold text-center mb-4">
                    {type === "signup" ? "Create an account" : "Sign In"}
                </div>
                <div className="text-slate-400 text-center mb-4">
                    {type === "signup"
                        ? "Already have an account? "
                        : "Don't have an account? "}
                    <Link className="underline text-blue-500" to={type === "signup" ? "/signin" : "/signup"}>
                        {type === "signup" ? "Login" : "Sign up"}
                    </Link>
                </div>
                <div>
                    {type === "signup" && (
                        <LabelledInput
                            label="Name"
                            placeholder="Soumya..."
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    name: e.target.value,
                                });
                            }}
                        />
                    )}
                    <LabelledInput
                        label="Email"
                        placeholder="soumyapratimkundu@gmail.com"
                        onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                email: e.target.value,
                            });
                        }}
                    />
                    <LabelledInput
                        label="Password"
                        type="password"
                        placeholder="qwerty"
                        onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                password: e.target.value,
                            });
                        }}
                    />
                    <button
                        type="button"
                        onClick={sendRequest}
                        disabled={loading} // Disable button when loading
                        className={`py-2.5 px-5 mt-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "Loading..." : type === "signup" ? "Sign Up" : "Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
};
