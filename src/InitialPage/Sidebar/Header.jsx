import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Search, Settings, XCircle } from "react-feather";
import { all_routes } from "../../Router/all_routes";
import axios from "axios";
import config from "../../config";
import { useDispatch } from "react-redux";
import { setCompanyinformation } from "../../core/redux/action";

const Header = () => {
  const route = all_routes;
  const dispatch = useDispatch()
  const [toggle, SetToggle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageUrl, setimageUrl] = useState("")
  const [data, setdata] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    profileImage: ''
  })
  const storedUser = JSON.parse(localStorage.getItem('User'));

  const isElementVisible = (element) => {
    return element.offsetWidth > 0 || element.offsetHeight > 0;
  };


  useEffect(() => {
    const handleMouseover = (e) => {
      e.stopPropagation();

      const body = document.body;
      const toggleBtn = document.getElementById("toggle_btn");

      if (
        body.classList.contains("mini-sidebar") &&
        isElementVisible(toggleBtn)
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("mouseover", handleMouseover);

    return () => {
      document.removeEventListener("mouseover", handleMouseover);
    };
  }, []);
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");


        if (!storedUser?._id) {
          console.error('No user ID found');
          return;
        }

        const response = await axios.get(`${config.Backendurl}/auth/user-details/${storedUser._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log('API Response:', response.data);

        if (response.data.success && response.data.data) {
          const userData = response.data.data;

          // Update user details
          let resulobj = {
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            companyName: userData.companyName || '',
            GST_NO: userData.GST_NO || '',
            phone: userData.phone || '',
            address: userData.address || '',
            country: userData.country || '',
            state: userData.state || '',
            city: userData.city || '',
            postalCode: userData.postalCode || '',
            profileImage: userData.profileImage || ''

          };

          dispatch(setCompanyinformation(resulobj))
          setdata(resulobj)
          if (userData.profileImage) {
            let imageUrl = userData.profileImage;

            if (imageUrl.startsWith('uploads/')) {

              const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;

              imageUrl = `${config.cloudurl}/${cleanPath}`;
              console.log(imageUrl);
              setimageUrl(imageUrl)

            } else {
              // It's some other format, use as is
              console.log('Other image URL:', imageUrl);

            }
          }

          console.log(resulobj);


        }
      } catch (err) {
        console.error('Error fetching user data:', err);

      }
    };
    fetchUserData();
  }, []);
  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
    SetToggle((current) => !current);
  };
  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };
  const sidebarOverlay = () => {
    document?.querySelector(".main-wrapper")?.classList?.toggle("slide-nav");
    document?.querySelector(".sidebar-overlay")?.classList?.toggle("opened");
    document?.querySelector("html")?.classList?.toggle("menu-opened");
  };

  let pathname = location.pathname;

  const exclusionArray = [
    "/reactjs/template/dream-pos/index-three",
    "/reactjs/template/dream-pos/index-one",
  ];
  if (exclusionArray.indexOf(window.location.pathname) >= 0) {
    return "";
  }

  const toggleFullscreen = (elem) => {
    elem = elem || document.documentElement;
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };





  return (
    <>
      <div className="header">
        {/* Logo */}
        <div
          className={`header-left ${toggle ? "" : "active"}`}
          onMouseLeave={expandMenu}
          onMouseOver={expandMenuOpen}
        >
          <Link to={route.dashboard} className="logo logo-normal">
            <ImageWithBasePath src={imageUrl} alt="img" />
          </Link>
          <Link to={route.dashboard} className="logo logo-white">
            <ImageWithBasePath src={imageUrl} alt="img" />
          </Link>
          <Link to={route.dashboard} className="logo-small">
            <ImageWithBasePath src={imageUrl} alt="img" />
          </Link>
          <Link
            id="toggle_btn"
            to="#"
            style={{
              display:
                pathname.includes("tasks") || pathname.includes("pos")
                  ? "none"
                  : pathname.includes("compose")
                    ? "none"
                    : "",
            }}
            onClick={handlesidebar}
          >
            <FeatherIcon icon="chevrons-left" className="feather-16" />
          </Link>
        </div>
        {/* /Logo */}
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#"
          onClick={sidebarOverlay}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        {/* Header Menu */}
        <ul className="nav user-menu">
          {/* Search */}
          <li className="nav-item nav-searchinputs">
            <div className="top-nav-search">
              <Link to="#" className="responsive-search">
                <Search />
              </Link>
              <form action="#" className="dropdown">
                <div
                  className="searchinputs dropdown-toggle"
                  id="dropdownMenuClickable"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="false"
                >
                  <input type="text" placeholder="Search" />
                  <div className="search-addon">
                    <span>
                      <XCircle className="feather-14" />
                    </span>
                  </div>
                </div>
                <div
                  className="dropdown-menu search-dropdown"
                  aria-labelledby="dropdownMenuClickable"
                >
                  <div className="search-info">
                    <h6>
                      <span>
                        <i data-feather="search" className="feather-16" />
                      </span>
                      Recent Searches
                    </h6>
                    <ul className="search-tags">
                      <li>
                        <Link to="#">Products</Link>
                      </li>
                      <li>
                        <Link to="#">Sales</Link>
                      </li>
                      <li>
                        <Link to="#">Applications</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="search-info">
                    <h6>
                      <span>
                        <i data-feather="help-circle" className="feather-16" />
                      </span>
                      Help
                    </h6>
                    <p>
                      How to Change Product Volume from 0 to 200 on Inventory
                      management
                    </p>
                    <p>Change Product Name</p>
                  </div>
                  <div className="search-info">
                    <h6>
                      <span>
                        <i data-feather="user" className="feather-16" />
                      </span>
                      Customers
                    </h6>
                    <ul className="customers">
                      <li>
                        <Link to="#">
                          Aron Varu
                          <ImageWithBasePath
                            src="assets/img/profiles/avator1.jpg"
                            alt
                            className="img-fluid"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          Jonita
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-01.jpg"
                            alt
                            className="img-fluid"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          Aaron
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-10.jpg"
                            alt
                            className="img-fluid"
                          />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </form>
            </div>
          </li>
          {/* /Search */}




          <li className="nav-item nav-item-box">
            <Link
              to="#"
              id="btnFullscreen"
              onClick={() => toggleFullscreen()}
              className={isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
            >
              {/* <i data-feather="maximize" /> */}
              <FeatherIcon icon="maximize" />
            </Link>
          </li>


          <li className="nav-item nav-item-box">
            <Link to="/general-settings">
              {/* <i data-feather="settings" /> */}
              <FeatherIcon icon="settings" />
            </Link>
          </li>
          <li className="nav-item dropdown has-arrow main-drop">
            <Link
              to="#"
              className="dropdown-toggle nav-link userset"
              data-bs-toggle="dropdown"
            >
              <span className="user-info">
                <span className="user-letter">
                  <ImageWithBasePath
                    src={imageUrl}
                    alt="img"
                    className="img-fluid"
                  />
                </span>
                <span className="user-detail">
                  <span className="user-name">{data?.companyName}</span>
                  <span className="user-role">{data?.companyName}</span>
                </span>
              </span>
            </Link>
            <div className="dropdown-menu menu-drop-user">
              <div className="profilename">
                <div className="profileset">
                  <span className="user-img">
                    <ImageWithBasePath
                      src={imageUrl}
                      alt="img"
                    />
                    <span className="status online" />
                  </span>
                  <div className="profilesets">
                    <h6>{data?.companyName}</h6>

                  </div>
                </div>
                <hr className="m-0" />

                <Link className="dropdown-item" to={route.generalsettings}>
                  <Settings className="me-2" />
                  Settings
                </Link>
                <hr className="m-0" />
                <Link className="dropdown-item logout pb-0" onClick={() => {
                  localStorage.removeItem("User")
                  localStorage.removeItem("token")
                }} to={route.signin}>
                  Logout
                </Link>
              </div>
            </div>
          </li>
        </ul>
        {/* /Header Menu */}
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu">
          <Link
            to="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">

            <Link className="dropdown-item" to={route.generalsettings}>
              Settings
            </Link>
            <Link className="dropdown-item" to="signin">
              Logout
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>
    </>
  );
};

export default Header;
