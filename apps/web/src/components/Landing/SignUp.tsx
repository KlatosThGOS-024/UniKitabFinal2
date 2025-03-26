"use client";
import { addAccount, authenticated } from "@/functions/userAccount/User";
import { createAccount, logInUser } from "@/Hooks/userApi";
import React, { useState } from "react";
import { MdEmail, MdOutlineCancel, MdLock, MdPerson } from "react-icons/md";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Image from "next/image";
import Error from "next/error";

export const Account = ({
  param,
  showModalSignUp,
}: {
  param: string;
  showModalSignUp: (show: boolean) => void;
}) => {
  const [action, setAction] = useState(param);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const validateForm = () => {
    if (action === "signUp" && !email) {
      toast.error("Email is required");
      return false;
    }
    if (!username) {
      toast.error("Username is required");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const accountLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (action === "signUp") {
        const response = await createAccount({
          email,
          username,
          password,
        });
        const data = await response.json();

        if (data?.success) {
          toast.success("Account created successfully! Please log in.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });

          setAction("login");
          setPassword("");
        }
      } else {
        const response = await logInUser({ username, password });
        const token = response.data.token;

        localStorage.setItem("accessToken", token);
        document.cookie = `accessToken=${token}; path=/; max-age=${24 * 60 * 60}; Secure`;

        if (response.success) {
          const userData = response.data;
          dispatch(
            addAccount({
              email: userData.email,
              username: userData.username,
              userLoggedIn: true,
            })
          );
          dispatch(authenticated({ userLoggedIn: true }));

          toast.success("Successfully logged in", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });

          setTimeout(() => showModalSignUp(false), 2000);
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        //@ts-ignore
        error?.response?.data?.message ||
        (action === "signUp"
          ? "Failed to create account. Please try again."
          : "Invalid credentials. Please try again.");

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setAction(action === "login" ? "signUp" : "login");
    setPassword("");
  };

  return (
    <section className="w-full fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg relative flex mx-auto py-4 w-[900px] max-lg:w-[500px] max-md:w-[90%]">
        <div className="w-3/5 max-lg:hidden">
          <div className=" relative h-full ">
            <Image
              fill
              src="/images/imgShuttStock.jpg"
              alt="Account illustration"
              className="object-cover rounded-l-lg"
            />
          </div>
        </div>

        <div className="w-2/5 max-lg:w-full px-6 relative">
          <button
            onClick={() => showModalSignUp(false)}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <MdOutlineCancel className="cursor-pointer w-7 h-7" />
          </button>

          <div className="mt-4 mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {action === "signUp" ? "Create an Account" : "Welcome Back"}
            </h1>

            <div className="flex gap-4 mt-4">
              <button
                className={`pb-2 px-1 font-medium ${
                  action === "login"
                    ? "border-b-2 border-[#1AB9F4] text-[#1AB9F4]"
                    : "text-gray-500"
                }`}
                onClick={() => setAction("login")}
              >
                Login
              </button>
              <span className="text-gray-400">or</span>
              <button
                className={`pb-2 px-1 font-medium ${
                  action === "signUp"
                    ? "border-b-2 border-[#1AB9F4] text-[#1AB9F4]"
                    : "text-gray-500"
                }`}
                onClick={() => setAction("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={accountLogin}>
            {action === "signUp" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="bg-[#FBFBFB] border border-[#e6e6e6] rounded-md hover:shadow-md flex items-center">
                  <span className="pl-3 pr-2">
                    <MdEmail className="text-gray-500 w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 outline-none bg-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="bg-[#FBFBFB] border border-[#e6e6e6] rounded-md hover:shadow-md flex items-center">
                <span className="pl-3 pr-2">
                  <MdPerson className="text-gray-500 w-5 h-5" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 outline-none bg-transparent"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="bg-[#FBFBFB] border border-[#e6e6e6] rounded-md hover:shadow-md flex items-center">
                <span className="pl-3 pr-2">
                  <MdLock className="text-gray-500 w-5 h-5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 outline-none bg-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#1AB9F4] w-full py-3 px-4 rounded-md text-white font-medium
                hover:bg-[#0da6e0] transition-colors duration-200 flex justify-center items-center"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : action === "signUp" ? (
                "CREATE ACCOUNT"
              ) : (
                "LOGIN"
              )}
            </button>

            {action === "login" && (
              <div className="text-right">
                <a href="#" className="text-sm text-[#1AB9F4] hover:underline">
                  Forgot password?
                </a>
              </div>
            )}
          </form>

          <p className="mt-4 text-sm text-gray-600 text-center">
            {action === "signUp"
              ? "Already have an account? "
              : "Don't have an account yet? "}
            <button
              onClick={switchMode}
              className="text-[#1AB9F4] hover:underline font-medium"
            >
              {action === "signUp" ? "Login" : "Sign up"}
            </button>
          </p>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">or continue with</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-[#4285F4] text-white py-3 px-4 rounded-md hover:bg-[#3367d6] transition-colors"
            >
              <FaGoogle className="w-4 h-4" />
              <span className="text-sm">Google</span>
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-[#3b5998] text-white py-3 px-4 rounded-md hover:bg-[#2d4373] transition-colors"
            >
              <FaFacebook className="w-4 h-4" />
              <span className="text-sm">Facebook</span>
            </button>
          </div>

          <p className="mt-6 text-xs text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </section>
  );
};
