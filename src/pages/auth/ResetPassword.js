import React, { useEffect, useState } from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../components/Component";
import { Form, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import { axiosConfig } from "../../utils/Utils";
import { useHistory } from "react-router";

const ResetPassword = (props) => {
    const history = useHistory();
  const resetToken = props.location.search.replace("?", "");
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [password, setPassword] = useState("");

  const submitParClick = () => {
    console.log('this is token', resetToken);
    console.log('this is password', password);
    const data = JSON.stringify({
        query: `mutation($password: String!, $token: String!) {
            resetPassword(input: {
                password: $password,
                token: $token
            })
      }`,
        variables: {
          password,
          token: resetToken
        },
      });
  
      axios(axiosConfig(data))
        .then(() => {
            setLoading(true);
            setTimeout(() => {
                history.push(`${process.env.PUBLIC_URL}/auth-login`)
            }, 2000)
        })
        .catch((error) => console.log(error));
  }

  const { errors, register, handleSubmit } = useForm();

  const handleChange = (e) => {
    setPassword(e.target.value);
  }

  return (
    <React.Fragment>
      <Head title="Login" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <div className="brand-logo pb-4 text-center">
            <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
              <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
            </Link>
          </div>

          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h4">Reset Password</BlockTitle>
                <BlockDes>
                  <p>Enter your new password here.</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            <Form className="is-alter" onSubmit={handleSubmit(submitParClick)}>
              <div className="form-group">
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                </div>
                <div className="form-control-wrap">
                  <a
                    href="#password"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setPassState(!passState);
                    }}
                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                  >
                    <Icon name="eye" className="passcode-icon icon-show"></Icon>

                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                  </a>
                  <input
                    type={passState ? "text" : "password"}
                    id="password"
                    name="password"
                    ref={register({ required: "This field is required" })}
                    placeholder="Enter your password"
                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                    onChange={handleChange}
                  />
                  {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
                </div>
              </div>
              <div className="form-group">
                <Button size="lg" className="btn-block" type="submit" color="primary">
                  {loading ? <Spinner size="sm" color="light" /> : "Reset Password"}
                </Button>
              </div>
            </Form>
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default withRouter(ResetPassword);
