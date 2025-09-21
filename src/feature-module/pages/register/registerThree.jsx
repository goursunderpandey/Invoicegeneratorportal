import React, { useState } from "react";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { Link,  useNavigate } from "react-router-dom";
import { all_routes } from "../../../Router/all_routes";
import axios from "axios";
import config from "../../../config";

const RegisterThree = () => {
  const route = all_routes;

  const navigate = useNavigate()

  const [formdata, setformdata] = useState({
    Name: '',
    Email: '',
    Password: '',
    confirmPassword: ''

  })


  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handlechange = (e) => {

    const { name, value } = e.target;

    setformdata({ ...formdata, [name]: value })

  }
  const Handlesubmit = async (e) => {
    e.preventDefault();

    if (formdata.Password !== formdata.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(`${config.Backendurl}/auth/signup`, {
        name: formdata.Name,
        email: formdata.Email,
        password: formdata.Password,
      });

        
      navigate(route.signintwo)
      console.log(res);
     
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };


  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper login-new">
          <div className="login-content user-login">
            <div className="login-logo">
              <ImageWithBasePath src="assets/img/logo.png" alt="img" />
              <Link to={route.dashboard} className="login-logo logo-white">
                <ImageWithBasePath src="assets/img/logo-white.png" alt />
              </Link>
            </div>
            <form onSubmit={Handlesubmit}>

              <div className="login-userset">
                <div className="login-userheading">
                  <h3>Register</h3>
                  <h4>Create New Krishnapos Account</h4>
                </div>
                <div className="form-login">
                  <label>Name</label>
                  <div className="form-addons">
                    <input type="text" name="Name" className="form-control" value={formdata.Name} onChange={handlechange} />
                    <ImageWithBasePath
                      src="assets/img/icons/user-icon.svg"
                      alt="img"
                    />
                  </div>
                </div>
                <div className="form-login">
                  <label>Email Address</label>
                  <div className="form-addons">
                    <input type="email" name="Email" className="form-control" value={formdata.Email} onChange={handlechange} />
                    <ImageWithBasePath
                      src="assets/img/icons/mail.svg"
                      alt="img"
                    />
                  </div>
                </div>
                <div className="form-login">
                  <label>Password</label>
                  <div className="pass-group">
                    <input
                      type={passwordVisibility.password ? "text" : "password"}
                      className="pass-input form-control"
                      name="Password"
                      value={formdata.password} onChange={handlechange}
                    />
                    <span
                      className={`fas toggle-password ${passwordVisibility.password ? "fa-eye" : "fa-eye-slash"
                        }`}
                      onClick={() => togglePasswordVisibility("password")}
                    ></span>
                  </div>
                </div>
                <div className="form-login">
                  <label>Confirm Passworrd</label>
                  <div className="pass-group">
                    <input
                      type={
                        passwordVisibility.confirmPassword ? "text" : "password"

                      }
                      name="confirmPassword"
                      className="pass-input form-control"
                      value={formdata.confirmPassword} onChange={handlechange}
                    />
                    <span
                      className={`fas toggle-password ${passwordVisibility.confirmPassword
                        ? "fa-eye"
                        : "fa-eye-slash"
                        }`}
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                    ></span>
                  </div>
                </div>
                <div className="form-login authentication-check">
                  <div className="row">
                    <div className="col-sm-8">
                      <div className="custom-control custom-checkbox justify-content-start">
                        <div className="custom-control custom-checkbox">
                          <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                            <input type="checkbox" />
                            <span className="checkmarks" />I agree to the{" "}
                            <Link to="#" className="hover-a">
                              Terms &amp; Privacy
                            </Link>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-login">
                  <button type="submit" className="btn btn-login">
                    Sign Up
                  </button>

                </div>
                <div className="signinform">
                  <h4>
                    Already have an account ?{" "}
                    <Link to={route.signintwo} className="hover-a">
                      Sign In Instead
                    </Link>
                  </h4>
                </div>
                <div className="form-setlogin or-text">
                  <h4>OR</h4>
                </div>
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
                </div>

              </div>
            </form>
          </div>
          <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
            <p>Copyright © 2023 DreamsPOS. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterThree;
