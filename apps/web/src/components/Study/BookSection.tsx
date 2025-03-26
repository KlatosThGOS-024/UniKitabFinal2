"use client";
import { addFileUrl } from "@/functions/docs/file";
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";

import { fetchPdfUrl, getPdfBook } from "@/Hooks/pdfBook";
import { SearchBooks } from "../Landing/SearchBooks";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  cnBooks,
  csaBooks,
  dbmsBooks,
  DSbooks,
} from "../../../public/constants";

interface Book {
  subject: string;
  title: string;
  imgSrc: string;
  pdfPath?: string;
  description: string;
}
const BookCard = ({ book }: { book: Book }) => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBookClick = async () => {
    if (!book.fileId) {
      console.warn("No fileId available for this book");
      return;
    }

    if (!mounted) return;

    try {
      setIsLoading(true);

      const response = await fetchPdfUrl(book.fileId);
      const fileUrl = response.data.downloadUrl;
      console.log(fileUrl);
      try {
        dispatch(addFileUrl("pdfUrl"));

        setTimeout(() => {
          router.push("/pdf/pdf-ai");
        }, 2000);
      } catch (urlError) {
        console.error("Invalid URL construction:", urlError);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching PDF URL:", error);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col rounded-lg  shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 relative"
      onClick={handleBookClick}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      <a
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer overflow-hidden"
      >
        <div className="h-48 relative w-full">
          <Image
            className=" object-cover transform 
            hover:scale-105 transition-transform 
            duration-300"
            fill
            sizes="5"
            loading="lazy"
            src={book.imgSrc}
            alt={book.title}
          />
        </div>
      </a>
      <div className="p-4 flex-grow border-t border-gray-200 bg-white">
        <h3 className="text-lg font-semibold mb-1 text-gray-800">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">Category: {book.subject}</p>
        <p className="text-sm text-gray-600 line-clamp-3">{book.description}</p>
      </div>
    </div>
  );
};

const SubjectTabs = ({
  activeSubject,
  onSubjectChange,
}: {
  activeSubject: string;
  onSubjectChange: (subject: string) => void;
}) => {
  const subjects = [
    { id: "ds", name: "Data Structure", data: DSbooks },
    { id: "csa", name: "Computer Architecture", data: csaBooks },
    { id: "cn", name: "Computer Networks", data: cnBooks },
    { id: "dbms", name: "Database Management System", data: dbmsBooks },
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex rounded-md shadow-sm">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => onSubjectChange(subject.name)}
            className={`
              px-4 py-2 text-sm font-medium 
              ${
                activeSubject === subject.name
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }
              border border-gray-300
              first:rounded-l-lg last:rounded-r-lg
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-300
            `}
          >
            {subject.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const BooksGrid = ({ books }: { books: Book[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book, index) => (
        <BookCard key={index} book={book} />
      ))}
    </div>
  );
};
interface Book {
  fileId: string;
  subject: string;
  title: string;
  imgSrc: string;
  description: string;
}
export const BookSection = () => {
  const [activeSubject, setActiveSubject] = useState("Data Structure");
  const [books, setBooks] = useState<Book[]>(DSbooks);
  const [showSearch, setShowSearch] = useState(false);
  const [searchProp, setSearchProp] = useState<Book[]>([]);
  const searchBook = (inputWord: string) => {
    setShowSearch(!true);
    if (inputWord !== "") {
      const allBooks = [...DSbooks, ...dbmsBooks, ...cnBooks, ...csaBooks];
      setShowSearch(true);
      const result = allBooks.filter((book) =>
        book.title.toLowerCase().startsWith(inputWord.toLowerCase())
      );
      result.length >= 4
        ? setSearchProp(result.slice(0, 4))
        : setSearchProp(result);
      return (
        <div className="flex h-screen relative justify-center items-center">
          <div role="status" className=" z-50  absolute ">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
  };

  const handleSubjectChange = (subject: string) => {
    setActiveSubject(subject);

    switch (subject) {
      case "Data Structure":
        setBooks(DSbooks);
        break;
      case "Computer Architecture":
        setBooks(csaBooks);
        break;
      case "Computer Networks":
        setBooks(cnBooks);
        break;
      case "Database Management System":
        setBooks(dbmsBooks);
        break;
      default:
        setBooks(DSbooks);
    }
  };

  return (
    <section className="bg-gray-50 pb-16">
      <div className="relative mb-16">
        <div className="absolute inset-0 bg-gradient-to-r opacity-90"></div>
        <div className="w-full h-96 relative">
          {" "}
          <Image
            priority
            fill
            className=" object-cover"
            src="/images/heading-bg.jpg"
            alt="Books Banner"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Notebank
          </h1>
          <p className="text-xl text-black max-w-2xl mb-8">
            Your go-to place for Computer Science PYQs, PDFs, and
            books—everything you need to study, all in one spot!
          </p>
          <div className="relative mt-4 w-2xl  max-xl:hidden">
            <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-lg">
              <input
                onChange={(e) => {
                  searchBook(e.target.value);
                }}
                className="w-full px-6 py-4  text-xl
                 text-gray-700 placeholder-gray-500
                  focus:outline-none"
                placeholder="Search study resources"
                aria-label="Search study resources"
              />
              {showSearch && (
                <div className=" w-full border-t-[1px]  break-words z-50  absolute top-11">
                  <SearchBooks searchProp={searchProp} />
                </div>
              )}
              <button className="px-6 py-4 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 transition-colors duration-300">
                <IoSearchOutline className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <SubjectTabs
          activeSubject={activeSubject}
          onSubjectChange={handleSubjectChange}
        />

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {activeSubject} Books
        </h2>

        <BooksGrid books={books} />
      </div>
    </section>
  );
};
