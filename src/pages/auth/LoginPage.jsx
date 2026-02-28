import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Hardcoded login
    const HARD_USERNAME = "admin";
    const HARD_PASSWORD = "12345";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === HARD_USERNAME && password === HARD_PASSWORD) {
            // Login muvaffaqiyatli
            localStorage.setItem("auth", "true");
            navigate("/packages"); // logindan keyin PackagesPage ga o'tadi
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">Kirish parolini kiriting</h1>
                {error && <p className="text-red-500 mb-3">{error}</p>}
                <input

                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="outline-none border-gray-200 w-full mb-4 p-3 border rounded-xl"
                    required
                />
                <input

                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="outline-none border-gray-200 w-full mb-4 p-3 border rounded-xl"
                    required
                />
                <button className="w-full cursor-pointer py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                    Login
                </button>
                <div className="flex items-center gap-2 mt-2">
                    <p className="text-[12px]">Parol esingizdan chiqan bo'lsa tiklash uchun murotaj</p>
                    <span>
                        <a
                            href="https://t.me/bakhadirivich_7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12px] block text-blue-600 border-b-0 hover:border-b hover:border-blue-600 transition-all duration-200"
                        >
                            bakhadirivich_7
                        </a>
                    </span>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;