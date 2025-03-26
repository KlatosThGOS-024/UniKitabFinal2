import Image from "next/image";
import React from "react";

const services = [
  {
    imgSrc:
      "https://s3.us-east-005.backblazeb2.com/sp-uploads/uploads/services/588776/20191203163751revised_simulations_thumbnail.png",
    title: "Featured Document 1",
  },
  {
    imgSrc:
      "https://s3.us-east-005.backblazeb2.com/sp-uploads/uploads/services/588776/20191203163751revised_simulations_thumbnail.png",
    title: "Featured Document 2",
  },
  {
    imgSrc:
      "https://s3.us-east-005.backblazeb2.com/sp-uploads/uploads/services/588776/20191203163751revised_simulations_thumbnail.png",
    title: "Featured Document 3",
  },
  {
    imgSrc:
      "https://s3.us-east-005.backblazeb2.com/sp-uploads/uploads/services/588776/20191203163751revised_simulations_thumbnail.png",
    title: "Featured Document 4",
  },
];

export const FeaturedDocuments = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Featured Documents
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Explore our collection of featured resources
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((document, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="h-48 w-full relative overflow-hidden">
                <Image
                  src={document.imgSrc}
                  alt={document.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {document.title}
                </h3>
                <p className="text-sm text-gray-600">
                  View this featured document to learn more about our services
                  and solutions.
                </p>
                <div className="mt-4">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center">
                    Read More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
