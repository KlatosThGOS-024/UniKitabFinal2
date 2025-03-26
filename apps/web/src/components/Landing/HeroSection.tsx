"use client";
import React, { useState, useEffect, useCallback } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

const images = [
  "https://www.studypool.com/img/backgrounds/homepage_bg_v2/splash_4.jpg",
  "https://www.studypool.com/img/backgrounds/homepage_bg_v2/splash_5.jpg",
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get("authRequired") === "true") {
      toast.info("Please log in to access that page", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [searchParams]);
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative overflow-hidden">
      <div className="relative w-full h-[500px] max-lg:h-[280px]">
        {images.map((img, index) => (
          <div
            key={`hero-slide-${index}`}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              priority
              src={img}
              alt="Hero Image"
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-opacity-40"></div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
          aria-label="Previous slide"
        >
          <BsChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
          aria-label="Next slide"
        >
          <BsChevronRight size={24} />
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentSlide(index);
                  setTimeout(() => setIsTransitioning(false), 500);
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-white scale-110"
                  : "bg-white bg-opacity-50 hover:bg-opacity-70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full z-20 flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl space-y-6 text-white">
            <h1 className="text-4xl max-lg:text-2xl font-bold leading-tight">
              Find & Solve PYQs with AI Assistance
            </h1>

            <p className="text-xl max-md:hidden">
              Get access to a vast collection of PYQs and book PDFs in one
              place.
            </p>

            <div className="relative mt-4 max-w-lg max-xl:hidden">
              <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-lg">
                <input
                  className="w-full px-6 py-4 text-gray-700 placeholder-gray-500 focus:outline-none"
                  placeholder="Search study resources"
                  aria-label="Search study resources"
                />
                <button className="px-6 py-4 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 transition-colors duration-300">
                  <IoSearchOutline className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
