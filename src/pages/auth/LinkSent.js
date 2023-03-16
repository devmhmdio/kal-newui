import React, { useEffect } from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle } from "../../components/Component";
import { Link } from "react-router-dom";

const LinkSent = ({ history }) => {

  useEffect(() => {
    setTimeout(() => history.push(`${process.env.PUBLIC_URL}/auth-login`), 5000);
  }, []);

  return (
    <React.Fragment>
      <Head title="Success" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body">
          <div className="brand-logo pb-5">
            <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
              <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
            </Link>
          </div>
          <BlockHead>
            <BlockContent>
              <BlockTitle tag="h4">Reset link is sent on your email</BlockTitle>
            </BlockContent>
          </BlockHead>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default LinkSent;
