import React from "react";

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="relative w-24 h-24">
                {/* Outer Circle with Animation */}
                <div className="absolute w-full h-full border-t-4 border-red-600 border-solid rounded-full animate-spin"></div>

                {/* Static Outer Circle */}
                <div className="w-full h-full border-4 border-red-200 rounded-full"></div>

                {/* Logo Inside the Circle */}
                <img
                    src="/Frontend/src/assets/logo.svg"
                    alt="NutriLuna Logo"
                    className="w-14 h-14 absolute inset-0 m-auto animate-bounce"
                />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mt-4">NutriLuna</h1>
            <p className="text-md mt-2 text-red-600 font-semibold animate-pulse">
                Loading...
            </p>
        </div>
    );
};

export default Loader;