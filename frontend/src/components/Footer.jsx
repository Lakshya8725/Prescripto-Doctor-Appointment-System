import React from "react";
import Logo from "../assets/assets_frontend/logo.svg";

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-16">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-700">
        {/* Left Section */}
        <div>
          <img src={Logo} alt="logo" className="w-40 mb-4" />
          <p className="text-sm leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </p>
        </div>

        {/* Centre Section */}
        <div>
          <p className="font-semibold mb-4">Company</p>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-600 cursor-pointer">Home</li>
            <li className="hover:text-blue-600 cursor-pointer">About Us</li>
            <li className="hover:text-blue-600 cursor-pointer">Contact Us</li>
            <li className="hover:text-blue-600 cursor-pointer">
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className="font-semibold mb-4">GET IN TOUCH</p>
          <ul className="space-y-2 text-sm">
            <li>+91-7701972021</li>
            <li>lakshya8725@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-10">
        <hr className="border-gray-300" />
      </div>

      {/* Copyright */}
      <p className="text-center text-sm text-gray-500 py-6">
        Copyright © 2024 GreatStack - All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
