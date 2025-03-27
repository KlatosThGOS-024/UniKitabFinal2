import React from "react";
import { BsTwitterX } from "react-icons/bs";
import { CiLinkedin } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-[#2E2E2E] mt-16 py-12">
      <div className="container mx-auto px-4">
        {/* Logo and Main Content */}
        <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0">
          {/* Logo */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl mb-4 text-[#C34326]">
              Uni<span className="text-[#A4A4A4]">Kitab</span>
            </h2>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 w-full md:w-auto">
            {/* Column 1 */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-[#A4A4A4] hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-[#A4A4A4] hover:text-white transition-colors"
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-[#A4A4A4] hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold mb-2">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-[#A4A4A4] hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-[#A4A4A4] hover:text-white transition-colors"
                  >
                    Follow on Twitter
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[#A4A4A4] my-8 opacity-20" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Copyright */}
          <p className="text-[#737373] text-center md:text-left">
            © 2025 UniKitab. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            <Link
              href="#"
              className="text-white border border-[#A4A4A4] rounded-full p-3 hover:bg-white/10 transition-colors"
              aria-label="Twitter"
            >
              <BsTwitterX />
            </Link>
            <Link
              href="#"
              className="text-white border border-[#A4A4A4] rounded-full p-3 hover:bg-white/10 transition-colors"
              aria-label="LinkedIn"
            >
              <CiLinkedin />
            </Link>
            <Link
              href="#"
              className="text-white border border-[#A4A4A4] rounded-full p-3 hover:bg-white/10 transition-colors"
              aria-label="Email"
            >
              <MdEmail />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
