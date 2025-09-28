import React, { useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { all_routes } from "../../../Router/all_routes";
import { Link, useLocation } from "react-router-dom";
import {
  Settings,
} from "feather-icons-react/build/IconComponents";


const SettingsSideBar = (props) => {
  const route = all_routes;
  const location = useLocation();

  const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false);
 


  const toggleGeneralSettings = () => {
    setIsGeneralSettingsOpen(!isGeneralSettingsOpen);
  };

  
  return (
    <div>
      <div
        className="sidebars settings-sidebar theiaStickySidebar"
        id="sidebar2"
      >
        <div className="stickybar">
          <div className="sidebar-inner slimscroll">
            <Scrollbars
              style={{ width: 255, height: 800 }}
              autoHide
              autoHeight
              autoHeightMin={400} // Set a minimum height for the scrollbar
              {...props}
            // width={100}
            // autoHideTimeout={1000}
            // autoHideDuration={200}
            // autoHeight
            // autoHeightMin={0}
            // autoHeightMax="95vh"
            // thumbMinSize={30}
            // universal={false}
            // hideTracksWhenNotNeeded={true}
            >
              <div id="sidebar-menu5" className="sidebar-menu">
                <ul>
                  <li className="submenu-open">
                    <ul>
                      <li className="submenu">
                        <Link to="#" onClick={toggleGeneralSettings}>
                          <Settings />
                          <span>General Settings</span>
                          <span className="menu-arrow" />
                        </Link>
                        <ul
                          style={{
                            display: isGeneralSettingsOpen ? "block" : "none",
                          }}
                        >
                          <li>
                            <Link
                              to={route.generalsettings}
                              className={
                                location.pathname === route.generalsettings
                                  ? "active"
                                  : ""
                              }
                            >
                              Profile
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={route.securitysettings}
                              className={
                                location.pathname === route.securitysettings
                                  ? "active"
                                  : ""
                              }
                            >
                              Security
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={route.notification}
                              className={
                                location.pathname === route.notification
                                  ? "active"
                                  : ""
                              }
                            >
                              Notifications
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={route.connectedapps}
                              className={
                                location.pathname === route.connectedapps
                                  ? "active"
                                  : ""
                              }
                            >
                              Connected Apps
                            </Link>
                          </li>
                        </ul>
                      </li>


                    </ul>
                  </li>
                </ul>
              </div>
            </Scrollbars>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsSideBar;
