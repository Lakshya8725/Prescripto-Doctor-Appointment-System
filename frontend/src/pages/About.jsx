import React from "react";
import aboutImg from "../assets/assets_frontend/about_image.png";

const About = () => {
  return (
    <div className="px-4 md:px-10 py-12">
      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-3xl font-semibold">
          ABOUT <span className="text-blue-600">US</span>
        </p>
      </div>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row gap-10 items-center mb-16">
        {/* Left: Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={aboutImg}
            alt="About Us"
            className="w-full max-w-md rounded-lg"
          />
        </div>

        {/* Right: Text */}
        <div className="md:w-1/2 text-gray-600 text-sm leading-relaxed space-y-4">
          <p>
            Welcome to <span className="font-semibold">Prescripto</span>, your
            trusted partner in managing your healthcare needs conveniently and
            efficiently. At Prescripto, we understand the challenges individuals
            face when it comes to scheduling doctor appointments and managing
            their health records.
          </p>

          <p>
            Prescripto is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, Prescripto is here to support you every step of the
            way.
          </p>

          <p className="text-gray-800 font-semibold">Our Vision</p>

          <p>
            Our vision at Prescripto is to create a seamless healthcare
            experience for every user. We aim to bridge the gap between patients
            and healthcare providers, making it easier for you to access the
            care you need, when you need it.
          </p>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="mb-16">
        {/* Section Title */}
        <p className="text-xl font-semibold mb-8">
          WHY <span className="text-blue-600">CHOOSE US</span>
        </p>

        {/* Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-200">
          {/* Box 1 */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-gray-200">
            <p className="font-semibold mb-3">EFFICIENCY</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Streamlined appointment scheduling that fits into your busy
              lifestyle.
            </p>
          </div>

          {/* Box 2 */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-gray-200">
            <p className="font-semibold mb-3">CONVENIENCE</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Access to a network of trusted healthcare professionals in your
              area.
            </p>
          </div>

          {/* Box 3 */}
          <div className="p-8">
            <p className="font-semibold mb-3">PERSONALIZATION</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Tailored recommendations and reminders to help you stay on top of
              your health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
