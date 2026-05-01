import React from "react";
import { specialityData } from "../assets/assets_frontend/assets.js";
import { Link } from "react-router-dom";
import "./SpecialityMenu.css";

const SpecialityMenu = () => {
  return (
    <div id="speciality" className="speciality">
      <h1>Find By Speciality</h1>
      <p>
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>

      <div className="speciality-grid">
        {specialityData.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            key={index}
            to={`/doctors/${item.speciality}`}
            className="speciality-card"
          >
            <img src={item.image} alt={item.speciality} />
            <p>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
