import React from "react";
import { Link } from "react-router-dom";
import "./SignUpPage.css";

export const SignUpPage = () => {
  return (
    <div className="hero-side-image">
      <div className="overlap">
        <div className="overlap-group">
          <div className="browser">
            <div className="button" />
            <div className="div" />
            <div className="button-2" />
          </div>
          <div className="content">
            <div className="overlap-group-2">
              <p className="subtitle">
                At El7a2ni, we are dedicated to bringing the healing touch of
                medical expertise right to your fingertips. Whether you&#39;re a
                medical professional ready to offer your skills or a patient
                seeking trusted care, you&#39;re just a few clicks away from
                joining our community of health enthusiasts.
              </p>
              <div className="title">Where Health Meets Technology</div>
            </div>
            <div className="text-wrapper">Sign up as a:</div>
          </div>
          <Link to="/signuppage/doctor">
            <button class="button-27">Doctor</button>
          </Link>
          <Link to="/signuppage/patient">
            <button className="button-28">Patient</button>
          </Link>
        </div>
        <img
          className="background"
          alt="Background"
          src="https://i.ibb.co/NYRJwwf/logotransparent.png"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
