"use client";
import { fetchPdfUrl } from "@/Hooks/pdfBook";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addFileUrl } from "@/functions/docs/file";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Book {
  fileId: string;
  subject: string;
  title: string;
  imgSrc: string;

  description: string;
}
export const SearchBooks = ({ searchProp }: { searchProp: Book[] }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBookClick = async (fileid: string) => {
    if (!mounted) return;

    try {
      const response = await fetchPdfUrl(fileid);
      const fileUrl = response.data.downloadUrl;
      const pdfEndpoint = `http://localhost:8000/${fileUrl}`;
      console.log(pdfEndpoint);
      dispatch(addFileUrl(pdfEndpoint));

      setTimeout(() => {
        router.push("/pdf/pdf-ai");
      }, 3000);
    } catch (error) {
      console.error("Error fetching PDF URL:", error);
    }
  };

  if (!searchProp?.length) {
    return null;
  }

  return (
    <div className=" rounded-lg break-words">
      {searchProp.map((value: Book, index: number) => (
        <div
          key={index}
          onClick={() => handleBookClick(value.fileId)}
          className="bg-white w-full border-y-[1px]
           border-black cursor-pointer gap-5
           rounded-lg  flex items-center px-3 py-4"
        >
          <div className=" relative w-[64px] h-[64px]">
            <Image
              loading="lazy"
              src={value.imgSrc}
              alt={value.title}
              fill
              sizes="5"
            />
          </div>
          <p
            className="text-black 
          break-words text-xl font-semibold overflow-hidden"
          >
            {value.title}
          </p>
        </div>
      ))}
    </div>
  );
};
