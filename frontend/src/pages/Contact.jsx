import React from "react";
import contactImage from "../assets/assets_frontend/contact_image.png";

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-16">
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
          CONTACT <span className="text-blue-600">US</span>
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          We’re here to help and answer any question you might have
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* LEFT: Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={contactImage}
            alt="Contact"
            className="w-full max-w-md rounded-xl shadow-md object-cover"
          />
        </div>

        {/* RIGHT: Contact Info */}
        <div className="md:w-1/2 space-y-10">
          {/* Office Info */}
          <div>
            <p className="text-lg font-semibold text-gray-800 mb-4">
              OUR OFFICE
            </p>

            <p className="text-sm text-gray-600 leading-relaxed">
              Noida Sector-62, A-Block <br />
              Rajat Vihar Duplex No-14
            </p>

            <p className="text-sm text-gray-600 mt-4">
              <span className="font-medium">Phone:</span> +91 7701972021
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-medium">Email:</span> lakshya8725@gmail.com
            </p>
          </div>

          {/* Careers */}
          <div>
            <p className="text-lg font-semibold text-gray-800 mb-3">
              CAREERS AT PRESCRIPTO
            </p>

            <p className="text-sm text-gray-600 mb-5 max-w-md">
              Learn more about our teams, culture, and current job openings.
            </p>

            <button
              className="inline-flex items-center justify-center
                         px-6 py-2.5 text-sm font-medium
                         border border-blue-600 text-blue-600
                         rounded-md
                         hover:bg-blue-600 hover:text-white
                         transition duration-200"
            >
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
