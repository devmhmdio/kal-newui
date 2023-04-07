import React, { useState, useEffect } from "react";
import { Icon, RSelect, Col, PreviewCard, Block, Button, Row } from "../../../../components/Component";
import { useForm } from "react-hook-form";
import Head from "../../../../layout/head/Head";
import Content from "../../../../layout/content/Content";
import { ModalBody } from "reactstrap";
import axios from "axios";
import { axiosConfig } from "../../../../utils/Utils";
const ProfileUpdate = ({ formData, setFormData, setModal }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const data = JSON.stringify({
      query: `mutation($token: String) {
                returnToken(token: $token)
          }`,
      variables: {
        token,
      },
    });

    axios(axiosConfig(data))
      .then((response) => {
        setLoading(false);
        setName(response.data.data.returnToken.name);
        setEmail(response.data.data.returnToken.email);
        setPhone(response.data.data.returnToken.phone);
        setCompany(response.data.data.returnToken.company);
        setPosition(response.data.data.returnToken.position);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const submitForm = (formVal) => {
    let newForm = {
      name: formVal.name,
      position: formVal.position,
      phone: formVal.phone,
      company: formVal.company,
      password: formVal.password,
      app_password: formVal.app_password
    };
    const updateData = JSON.stringify({
      query: `mutation($email: String, $name: String, $password: String, $phone: String, $app_password: String, $company: String, $position: String) {
      updateUser(input: {
        email: $email
        name: $name
        password: $password,
        phone: $phone
        app_password: $app_password
        company: $company
        position: $position
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
      password: formVal.password,
      name: formVal.name,
      phone: formVal.phone,
      app_password: formVal.app_password,
      company: formVal.company,
      position: formVal.position
    },
    });
    axios(axiosConfig(updateData)).then(() => console.log('success')).catch((e) => console.log(e))
  };

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      {position !== '' && (
        <Content page="component">
          <Block size="lg">
            <Row className="g-gs">
              <Col lg="1"></Col>
              <Col lg="10">
                <PreviewCard>
                  <div className="p-2">
                    <h5 className="title">Update Profile</h5>
                    <div className="mt-4">
                        <form className="row gy-4" onSubmit={handleSubmit(submitForm)}>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="fm-name">
                                Name</label>
                              <input
                                type="text"
                                id="fm-name"
                                className="form-control"
                                name="name"
                                ref={register()}
                                defaultValue={name}
                                placeholder="Enter name"
                              />
                              {errors.name && <p className="invalid">This field is required</p>}
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="phone-no">
                                Phone Number
                              </label>
                              <input
                                type="number"
                                id="phone-no"
                                className="form-control"
                                name="phone"
                                ref={register()}
                                defaultValue={phone}
                                placeholder="Phone Number"
                              />
                              {errors.phone && <p className="invalid">This field is required</p>}
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="phone-no">
                                Company
                              </label>
                              <input
                                type="text"
                                id="company"
                                className="form-control"
                                name="company"
                                ref={register()}
                                defaultValue={company}
                                placeholder="Company"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="position">
                                Position
                              </label>
                              <input
                                type="text"
                                id="position"
                                className="form-control"
                                name="position"
                                ref={register()}
                                defaultValue={position}
                                placeholder="Position"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="password">
                                Password
                              </label>
                              <input
                                type="text"
                                id="password"
                                className="form-control"
                                name="password"
                                ref={register()}
                                defaultValue={password}
                                placeholder="Password"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="app_password">
                                App Password
                              </label>
                              <input
                                type="text"
                                id="app_password"
                                className="form-control"
                                name="app_password"
                                ref={register()}
                                defaultValue={password}
                                placeholder="App Password"
                              />
                            </div>
                          </Col>
                          <Col size="12">
                            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                              <li>
                                <Button color="primary" size="md" type="submit">
                                  Update Profile
                                </Button>
                              </li>
                              <li>
                                <a
                                  href="#dropdownitem"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setModal(false);
                                  }}
                                  className="link link-light"
                                >
                                  Cancel
                                </a>
                              </li>
                            </ul>
                          </Col>
                        </form>
                    </div>
                  </div>
                </PreviewCard>
              </Col>
              <Col lg="1"></Col>
            </Row>
          </Block>
        </Content>
      )}
    </React.Fragment>
  );
};

export default ProfileUpdate;
