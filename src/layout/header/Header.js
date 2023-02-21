import React from "react";
import classNames from "classnames";
import Toggle from "../sidebar/Toggle";
import Logo from "../logo/Logo";
import News from "../news/News";
import User from "./dropdown/user/User";
import Notification from "./dropdown/notification/Notification";
import axios from "axios";

const Header = ({ fixed, theme, className, setVisibility, ...props }) => {
  const headerClass = classNames({
    "nk-header": true,
    "nk-header-fixed": fixed,
    [`is-light`]: theme === "white",
    [`is-${theme}`]: theme !== "white" && theme !== "light",
    [`${className}`]: className,
  });

  const deletePreviousResponses = async () => {
    const data = JSON.stringify({
      query: `mutation {
        deleteAllResponsesFromDB {
                  status {
                    code
                    header
                    description
                    moreInfo
                  }
              }
          }`,
    });

    const config = {
      method: 'post',
      url: process.env.AXIOS_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        console.log('line 63', response.data.data.deleteAllResponsesFromDB);
        alert('All previous responses are deleted successfully')
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={headerClass}>
      <div className="container-fluid">
        <div className="nk-header-wrap">
          <div className="nk-menu-trigger d-xl-none ms-n1">
            <Toggle
              className="nk-nav-toggle nk-quick-nav-icon d-xl-none ms-n1"
              icon="menu"
              click={props.sidebarToggle}
            />
          </div>
          <div className="nk-header-brand d-xl-none">
            <Logo />
          </div>
          <div className="nk-header-news d-none d-xl-block">
            <News />
          </div>
          <div className="nk-header-tools">
            <ul className="nk-quick-nav">
              <li className="user-dropdown"  onClick={() => setVisibility(false)}>
                <User />
              </li>
              <li className="notification-dropdown me-n1"  onClick={() => setVisibility(false)}>
                <Notification />
              </li>
              <li>
                <button className="btn-round btn btn-primary btn-sm" onClick={deletePreviousResponses}>Clear All Responses</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
