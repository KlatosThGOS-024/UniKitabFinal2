"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store/store";
import { Account } from "./SignUp";
import { SearchBooks } from "./SearchBooks";
import { logOutUser } from "@/Hooks/userApi";
import { authenticated } from "@/functions/userAccount/User";
import {
  cnBooks,
  csaBooks,
  dbmsBooks,
  DSbooks,
} from "../../../public/constants";
import { IoIosOptions } from "react-icons/io";

interface Book {
  fileId: string;
  subject: string;
  title: string;
  imgSrc: string;
  description: string;
}

const SearchBar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchProp, setSearchProp] = useState<Book[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchBook = (inputWord: string) => {
    if (inputWord !== "") {
      const allBooks = [...DSbooks, ...dbmsBooks, ...cnBooks, ...csaBooks];
      setShowSearch(true);
      const result = allBooks.filter((book) =>
        book.title.toLowerCase().startsWith(inputWord.toLowerCase())
      );
      result.length >= 4
        ? setSearchProp(result.slice(0, 4))
        : setSearchProp(result);
    } else {
      setShowSearch(false);
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={searchRef}
      className="relative w-full rounded-lg flex items-center bg-white border hover:shadow-sm hover:shadow-[#69D4F3]"
    >
      <input
        onChange={(e) => searchBook(e.target.value)}
        className="w-full placeholder:text-gray-500 px-4 py-3 rounded-lg outline-none bg-white"
        placeholder="Search study resources"
      />
      {showSearch && searchProp.length > 0 && (
        <div className="absolute top-full left-0 w-full z-50 bg-white border-t">
          <SearchBooks searchProp={searchProp} />
        </div>
      )}
      <div className="px-4 border-l rounded-l-none py-2">
        <IoSearchOutline className="w-[21px] h-[21px] text-[#69D4F3]" />
      </div>
    </div>
  );
};

export const NavBar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(
    (state: IRootState) => state.userAccountReducer.userLoggedIn
  );

  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const showModalSignUp = () => {
    setShowModal2(!showModal2);
    setShowMobileMenu(false);
  };

  const handleLogout = () => {
    logOutUser();
    localStorage.removeItem("accessToken");
    dispatch(authenticated({ userLoggedIn: false }));
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("user");
    setShowProfile(false);
    window.location.href = "/home";
  };

  return (
    <section className="relative">
      {showModal2 && (
        <Account showModalSignUp={showModalSignUp} param={"signUp"} />
      )}

      <div className="flex items-center justify-between bg-[#111111] px-2 py-[8px]">
        {/* Logo and Search */}
        <div className="flex items-center px-4 gap-5 w-full">
          <a
            href="/home"
            className="text-[#C34326] hover:scale-110 text-[28px] transition-all duration-200 ease-in-out"
          >
            Uni<span className="text-[#A4A4A4]">Kitab</span>
          </a>
          <div className="flex-grow max-md:hidden">
            <SearchBar />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="items-center px-4 max-md:hidden flex gap-6">
          <ul className="flex gap-7 items-center text-[18px]">
            <li className="hover:text-[#69D4F3] font-[500] text-[#423e3e]">
              <a href="/document">Sell Docs</a>
            </li>
            <li className="hover:text-[#69D4F3] font-[500] text-[#423e3e]">
              Educators
            </li>
            {!isLoggedIn && (
              <li
                onClick={showModalSignUp}
                className="cursor-pointer hover:text-[#69D4F3]"
              >
                Login
              </li>
            )}
          </ul>
          {!isLoggedIn ? (
            <button
              onClick={showModalSignUp}
              className="rounded-full transition-all duration-150 ease-out
              max-lg:hidden lg:block px-4 text-[18px] font-[500] py-2 
              bg-[#EC497D] text-white hover:bg-[#645656] hover:text-[#EC497D]"
            >
              Sign Up
            </button>
          ) : (
            <div
              onClick={() => setShowProfile(!showProfile)}
              className="relative cursor-pointer"
            >
              <FaRegUserCircle className="w-9 h-9" />
              {showProfile && (
                <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-md p-4">
                  <div className="flex flex-col space-y-2">
                    <span>Profile</span>
                    <span>Complaint</span>
                    <button
                      onClick={handleLogout}
                      className="rounded-full transition-all duration-150 ease-out 
                      px-4 text-[18px] font-[500] py-2 bg-[#EC497D] text-white
                      hover:bg-[#645656] hover:text-[#EC497D]"
                    >
                      LogOut
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <div className="block md:hidden">
            <SearchBar />
          </div>
          {showMobileMenu ? (
            <IoCloseOutline
              onClick={toggleMobileMenu}
              className="w-[28px] h-[28px] text-white cursor-pointer"
            />
          ) : (
            <IoIosOptions
              onClick={toggleMobileMenu}
              className="w-[28px] h-[28px] text-white cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        >
          <div
            className="absolute top-[70px] left-0 right-0 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="flex flex-col text-start gap-4 p-4 text-[18px]">
              <li>
                <a
                  href="/document"
                  className="hover:text-[#69D4F3] cursor-pointer font-[500] text-[#423e3e]"
                  onClick={toggleMobileMenu}
                >
                  Sell Docs
                </a>
              </li>
              <li className="hover:text-[#69D4F3] cursor-pointer font-[500] text-[#423e3e]">
                Educators
              </li>
              {!isLoggedIn ? (
                <>
                  <li
                    onClick={showModalSignUp}
                    className="transition-all duration-150 ease-out text-[18px] font-[500] 
                    text-black cursor-pointer hover:text-[#EC497D]"
                  >
                    Login
                  </li>
                  <li
                    onClick={showModalSignUp}
                    className="transition-all duration-150 ease-out text-[18px] font-[500] 
                    text-white bg-[#EC497D] rounded-full px-4 py-2 hover:bg-[#645656]"
                  >
                    Sign Up
                  </li>
                </>
              ) : (
                <>
                  <li className="text-[18px] font-[500]">Profile</li>
                  <li
                    onClick={handleLogout}
                    className="transition-all duration-150 ease-out text-[18px] font-[500] 
                    text-white bg-[#EC497D] rounded-full px-4 py-2 hover:bg-[#645656]"
                  >
                    LogOut
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
