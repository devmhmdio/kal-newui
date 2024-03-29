import React, {useEffect, useState} from "react";
import classNames from "classnames";
import Toggle from "../sidebar/Toggle";
import Logo from "../logo/Logo";
import News from "../news/News";
import User from "./dropdown/user/User";
import Notification from "./dropdown/notification/Notification";
import axios from "axios";
import { axiosConfig } from "../../utils/Utils";

const Header = ({ fixed, theme, className, setVisibility, ...props }) => {
  const headerClass = classNames({
    "nk-header": true,
    "nk-header-fixed": fixed,
    [`is-light`]: theme === "white",
    [`is-${theme}`]: theme !== "white" && theme !== "light",
    [`${className}`]: className,
  });

  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [loggedInCompany, setLoggedInCompany] = useState('');
  const [loggedInRole, setLoggedInRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const dataToken = JSON.stringify({
      query: `mutation($token: String) {
                  returnToken(token: $token)
            }`,
      variables: {
        token,
      },
    });

    axios(axiosConfig(dataToken))
      .then((response) => {
        setLoggedInEmail(response.data.data.returnToken.email);
        setLoggedInCompany(response.data.data.returnToken.company);
        setLoggedInRole(response.data.data.returnToken.role);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])

  const deletePreviousResponses = async () => {
    const data = JSON.stringify({
      query: `mutation($loggedInUser: String!) {
        deleteAllResponsesFromDB(loggedInUser: $loggedInUser) {
                  status {
                    code
                    header
                    description
                    moreInfo
                  }
              }
          }`,
          variables: {
            loggedInUser: loggedInEmail
          }
    });

    axios(axiosConfig(data))
      .then((response) => {
        alert('All previous responses are deleted successfully')
        setTimeout(() => {
          window.location.reload();
        }, 1000)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUserBalance = async () => {
    const data = JSON.stringify({
      query: `query($email: String!, $company: String!, $role: String!) {
        getUserBalance(email: $email, company: $company, role: $role)
          }`,
          variables: {
            email: loggedInEmail,
            company: loggedInCompany,
            role: loggedInRole,
          }
    });

    axios(axiosConfig(data))
      .then((response) => {
        alert(`Your current balance is USD${response.data.data.getUserBalance}`)
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
          <div className="nk-header-tools">
            <ul className="nk-quick-nav">
              <li className="user-dropdown"  onClick={() => setVisibility(false)}>
                <User />
              </li>
              <li>
                <button className="btn-round btn btn-primary btn-sm" onClick={getUserBalance}>Check Balance</button>
              </li>
              <li>
                <button className="btn-round btn btn-danger btn-sm" onClick={deletePreviousResponses}>Clear All Responses</button>
              </li>
              
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
