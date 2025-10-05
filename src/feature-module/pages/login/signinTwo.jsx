import React, { useState } from "react";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../../Router/all_routes";
import axios from "axios";
import config from "../../../config";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const SigninTwo = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${config.Backendurl}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });


      localStorage.setItem("token", res.data.token);
      localStorage.setItem("User", JSON.stringify(res.data.User));

      MySwal.fire({
        title: "Success",
        text: "Login SuccessFully ",

      });
      navigate(route.dashboard); // redirect after login
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper">
          <div className="login-content">
            <form onSubmit={handleSubmit}>
              <div className="login-userset">
                <div className="login-logo logo-normal">
                  <ImageWithBasePath src="assets/img/logo.png" alt="img" />
                </div>
                <Link to={route.dashboard} className="login-logo logo-white">
                  <ImageWithBasePath src="assets/img/logo-white.png" alt />
                </Link>
                <div className="login-userheading">
                  <h3>Sign In</h3>
                  <h4>Access the Dreamspos panel using your email and passcode.</h4>
                </div>

                {/* Email */}
                <div className="form-login">
                  <label>Email Address</label>
                  <div className="form-addons">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <ImageWithBasePath src="assets/img/icons/mail.svg" alt="img" />
                  </div>
                </div>

                {/* Password */}
                <div className="form-login">
                  <label>Password</label>
                  <div className="pass-group">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      name="password"
                      className="pass-input form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className={`fas toggle-password ${isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                        }`}
                      onClick={togglePasswordVisibility}
                    ></span>
                  </div>
                </div>

                {/* Remember me + Forgot password */}
                <div className="form-login authentication-check">
                  <div className="row">
                    <div className="col-6">
                      <div className="custom-control custom-checkbox">
                        <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          Remember me
                        </label>
                      </div>
                    </div>
                    <div className="col-6 text-end">
                      <Link className="forgot-link" to={route.forgotPasswordTwo}>
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="form-login">
                  <button type="submit" className="btn btn-login">
                    Sign In
                  </button>
                </div>

                {/* Sign up link */}
                <div className="signinform">
                  <h4>
                    New on our platform?
                    <Link to={route.registerTwo} className="hover-a">
                      {" "}
                      Create an account
                    </Link>
                  </h4>
                </div>

                <div className="form-setlogin or-text">
                  <h4>OR</h4>
                </div>

                {/* Social logins */}
                <div className="form-sociallink">
                  <ul className="d-flex">
                    <li>
                      <Link to="#" className="facebook-logo">
                        <ImageWithBasePath
                          src="assets/img/icons/facebook-logo.svg"
                          alt="Facebook"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/icons/google.png"
                          alt="Google"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="apple-logo">
                        <ImageWithBasePath
                          src="assets/img/icons/apple-logo.svg"
                          alt="Apple"
                        />
                      </Link>
                    </li>
                  </ul>
                  <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                    <p>Copyright © 2023 DreamsPOS. All rights reserved</p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="login-img">
            <ImageWithBasePath
              src="assets/img/authentication/login02.png"
              alt="img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninTwo;
