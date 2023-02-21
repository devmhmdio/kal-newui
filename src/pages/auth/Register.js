import React, { useState } from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import axios from "axios";
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
import { Spinner } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const Register = ({ history }) => {
  const [passState, setPassState] = useState(false);
  const [appPassState, setAppPassState] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errors, register, handleSubmit } = useForm();
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);
  const [appPassword, setAppPassword] = useState(null);
  const [phone, setPhone] = useState(null);

  const handleChange = (event) => {
    const et = event.target;
    if (et.name === 'name') setName(et.value);
    if (et.name === 'email') setEmail(et.value);
    if (et.name === 'phone') setPhone(et.value);
    if (et.name === 'password') setPassword(et.value);
    if (et.name === 'app_password') setAppPassword(et.value);
  };

  const handleFormSubmit = (e) => {
    setLoading(true);
    const data = JSON.stringify({
      query: `mutation($email: String, $password: String, $name: String, $phone: String, $app_password: String) {
        addUser(input: {
            email: $email
            name: $name
            password: $password,
            phone: $phone
            app_password: $app_password
        }) {
            status {
              code
              header
              description
              moreInfo
            }
            data {
              email
              name
              phone
            }
        }
      }`,
      variables: {
        email,
        password,
        name,
        phone,
        app_password: appPassword
      },
    });

    const config = {
      method: 'post',
      url: "https://starfish-app-fzf2t.ondigitalocean.app/graphql",
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
    .then(() => {
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
    });

    setTimeout(() => history.push(`${process.env.PUBLIC_URL}/auth-success`), 2000);
  };
  return (
    <React.Fragment>
      <Head title="Register" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <div className="brand-logo pb-4 text-center">
            <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
              <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
            </Link>
          </div>
          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h4">Register</BlockTitle>
                <BlockDes>
                  <p>Create New Account</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            <form className="is-alter" onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    ref={register({ required: true })}
                    className="form-control-lg form-control"
                    onChange={handleChange}
                  />
                  {errors.name && <p className="invalid">This field is required</p>}
                </div>
              </div>
              <div className="form-group">
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Email
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    bssize="lg"
                    id="default-01"
                    name="email"
                    ref={register({ required: true })}
                    className="form-control-lg form-control"
                    placeholder="Enter your email address"
                    onChange={handleChange}
                  />
                  {errors.email && <p className="invalid">This field is required</p>}
                </div>
              </div>
              <div className="form-group">
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Phone
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="tel"
                    bssize="lg"
                    id="default-01"
                    name="phone"
                    ref={register({ required: true })}
                    className="form-control-lg form-control"
                    placeholder="Enter your phone number"
                    onChange={handleChange}
                  />
                  {errors.email && <p className="invalid">This field is required</p>}
                </div>
              </div>
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
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                    App Password
                  </label>
                </div>
                <div className="form-control-wrap">
                  <a
                    href="#app_password"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setAppPassState(!appPassState);
                    }}
                    className={`form-icon lg form-icon-right passcode-switch ${appPassState ? "is-hidden" : "is-shown"}`}
                  >
                    <Icon name="eye" className="passcode-icon icon-show"></Icon>

                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                  </a>
                  <input
                    type={appPassState ? "text" : "password"}
                    id="app_password"
                    name="app_password"
                    ref={register({ required: "This field is required" })}
                    placeholder="Enter your app password"
                    className={`form-control-lg form-control ${appPassState ? "is-hidden" : "is-shown"}`}
                    onChange={handleChange}
                  />
                  {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
                </div>
              </div>
              <div className="form-group">
                <Button type="submit" color="primary" size="lg" className="btn-block">
                  {loading ? <Spinner size="sm" color="light" /> : "Register"}
                </Button>
              </div>
            </form>
            <div className="form-note-s2 text-center pt-4">
              {" "}
              Already have an account?{" "}
              <Link to={`${process.env.PUBLIC_URL}/auth-login`}>
                <strong>Sign in instead</strong>
              </Link>
            </div>
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default Register;
