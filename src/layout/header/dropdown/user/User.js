import React, { useState, useEffect } from "react";
import UserAvatar from "../../../../components/user/UserAvatar";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Icon } from "../../../../components/Component";
import { LinkList, LinkItem, MyLinkItem } from "../../../../components/links/Links";
import axios from "axios";
import { axiosConfig, findUpper } from "../../../../utils/Utils";

const User = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState(null);
  const [balance, setBalance] = useState(0);
  const [role, setRole] = useState('member');
  const [initial, setInitial] = useState("AA");

  const handleSignout = () => {
    localStorage.removeItem("accessToken");
  };
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const data = JSON.stringify({
      query: `mutation($token: String) {
                returnToken(token: $token)
          }`,
      variables: {
        token
      },
    });

    axios(axiosConfig(data))
      .then((response) => {
        setName(response.data.data.returnToken.name);
        setEmail(response.data.data.returnToken.email);
        setBalance(response.data.data.returnToken.balance);
        setRole(response.data.data.returnToken.role);
        if (response.data.data.returnToken.role === 'member') {
          const getCompanyAdmin = JSON.stringify({
            query: `query($company: String!, $role: String!) {
              getUserCompanyAdmin(company: $company, role: $role)
            }`,
            variables: {
              company: response.data.data.returnToken.company,
              role: 'company admin',
            },
          });
          axios(axiosConfig(getCompanyAdmin)).then(caResponse => setBalance(caResponse.data.data.getUserCompanyAdmin[0].balance)).catch(err => console.log(err));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])

  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <UserAvatar icon="user-alt" className="sm" />
          <div className="user-info d-none d-md-block">
            <div className="user-status">Administrator</div>
            <div className="user-name dropdown-indicator">{name}</div>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
          <div className="user-card sm">
            <div className="user-avatar">
              <span>{findUpper(name)}</span>
            </div>
            <div className="user-info">
              <span className="lead-text">{name}</span>
              <span className="sub-text">{email}</span>
            </div>
          </div>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <LinkItem link="/user-profile-regular" icon="user-alt" onClick={toggle}>
              View Profile
            </LinkItem>
            <LinkItem link="/user-profile-setting" icon="setting-alt" onClick={toggle}>
              Account Setting
            </LinkItem>
            <MyLinkItem icon="user">
              Role: {role}
            </MyLinkItem>
          </LinkList>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <a href={`${process.env.PUBLIC_URL}/auth-login`} onClick={handleSignout}>
              <Icon name="signout"></Icon>
              <span>Sign Out</span>
            </a>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
