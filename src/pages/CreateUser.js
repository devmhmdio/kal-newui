import React, { useState, useEffect } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  PreviewCard,
  Row,
  Col,
} from "../components/Component";
import axios from "axios";
import { axiosConfig } from "../utils/Utils";
import { useForm } from "react-hook-form";
import { Spinner } from "reactstrap";

const CreateUser = ({ history }) => {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [userId, setUserId] = useState(null);
  const [loggedInUserCompany, setLoggedInUserCompany] = useState(null);
  const { errors, register, handleSubmit } = useForm();
  const [passState, setPassState] = useState(false);
  const [appPassState, setAppPassState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);
  const [appPassword, setAppPassword] = useState(null);
  const [phone, setPhone] = useState(null);
  const [company, setCompany] = useState(null);
  const [position, setPosition] = useState(null);

  useEffect(() => {
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
        setUserId(response.data.data.returnToken.userId);
        setLoggedInUserCompany(response.data.data.returnToken.company);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (event) => {
    const et = event.target;
    if (et.name === 'name') setName(et.value);
    if (et.name === 'email') setEmail(et.value);
    if (et.name === 'phone') setPhone(et.value);
    if (et.name === 'password') setPassword(et.value);
    if (et.name === 'app_password') setAppPassword(et.value);
    if (et.name === 'company') loggedInUserCompany;
    if (et.name === 'position') setPosition(et.value);
  };

  const handleFormSubmit = (e) => {
    setLoading(true);
    const data = JSON.stringify({
      query: `mutation($email: String, $password: String, $name: String, $phone: String, $app_password: String, $company: String, $position: String, $role: String) {
        addUser(input: {
            email: $email
            name: $name
            password: $password,
            phone: $phone
            app_password: $app_password
            company: $company
            position: $position
            role: $role
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
              company
              position
            }
        }
      }`,
      variables: {
        email,
        password,
        name,
        phone,
        app_password: appPassword,
        company: loggedInUserCompany,
        position,
        role: 'member'
      },
    });

    axios(axiosConfig(data))
    .then(() => {
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
    });

    setTimeout(() => history.push(`${process.env.PUBLIC_URL}/all-users`), 2000);
  };

  return (
    <React.Fragment>
      <Head title="Create User" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Create Company User</BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <PreviewCard>
            <div>
              <form className="is-alter" onSubmit={handleSubmit(handleFormSubmit)}>
                <Row className="g-gs">
                  <Col lg="4">
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
                  </Col>
                  <Col lg="4">
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
                  </Col>
                  <Col lg="4">
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
                  </Col>
                </Row>
                <div style={{paddingTop: 20 + 'px'}}></div>
                <Row className="g-gs">
                  <Col lg="4">
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
                          className={`form-icon lg form-icon-right passcode-switch ${
                            passState ? "is-hidden" : "is-shown"
                          }`}
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
                  </Col>
                  <Col lg="4">
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
                          className={`form-icon lg form-icon-right passcode-switch ${
                            appPassState ? "is-hidden" : "is-shown"
                          }`}
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
                        <div style={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "5px", color: "#3c4d62" }}>
                          <span>
                            App Password can be generated from Google. It is required to generate as this will be used
                            to send emails. You can follow steps{" "}
                            <a href="https://support.google.com/mail/answer/185833?hl=en">here</a>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg="4">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">
                        Company Name
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          id="company"
                          name="company"
                          placeholder="Enter your company name"
                          ref={register({ required: true })}
                          className="form-control-lg form-control"
                          onChange={handleChange}
                          value={loggedInUserCompany}
                          disabled
                        />
                        {errors.name && <p className="invalid">This field is required</p>}
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="g-gs">
                  <Col lg="4">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">
                        Position in Company
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          id="position"
                          name="position"
                          placeholder="CEO"
                          ref={register({ required: true })}
                          className="form-control-lg form-control"
                          onChange={handleChange}
                        />
                        {errors.name && <p className="invalid">This field is required</p>}
                      </div>
                    </div>
                  </Col>
                  <Col lg="4">
                    <div className="form-group">
                    <label className="form-label" htmlFor="name" style={{color: "#fff"}}>
                        Register Button
                      </label>
                      <Button type="submit" color="primary" size="lg" className="btn-block">
                        {loading ? <Spinner size="sm" color="light" /> : "Register"}
                      </Button>
                    </div>
                  </Col>
                  <Col lg="4"></Col>
                </Row>
              </form>
            </div>
          </PreviewCard>
        </Block>
      </Content>
    </React.Fragment>
  );
};
export default CreateUser;
