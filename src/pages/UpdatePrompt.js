import React, { useState, useEffect } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import { Row, Col, Label, Form } from "reactstrap";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import axios from "axios";
import { Block, BlockHead, BlockHeadContent, BlockTitle, PreviewCard, Button } from "../components/Component";
import { axiosConfig } from "../utils/Utils";

const UpdatePrompt = ({ alter, id }) => {
  const [prompt, setPrompt] = useState(null);
  const [promptStatus, setPromptStatus] = useState(null);
  const [userRole, setUserRole] = useState(null);
  // let userRole;
  const [content, setContent] = useState("");
  const { errors, register } = useForm();
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const formClass = classNames({
    "form-validate": true,
    "is-alter": alter,
  });
  const [disableStatus, setDisableStatus] = useState(true);

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
        const email = response.data.data.returnToken.email;
        const userId = response.data.data.returnToken.userId;
        setLoggedInEmail(email);
        const dataPrompt = JSON.stringify({
          query: `query($email: String!) {
                    getPrompt(email: $email)
                }`,
          variables: {
            email,
          },
        });

        axios(axiosConfig(dataPrompt))
          .then((res) => {
            setPrompt(res.data.data.getPrompt.question);
            const getUserRole = JSON.stringify({
              query: `query($id: String!) {
                            findByUserId(id: $id) {
                                data {
                                    role
                                }
                            }
                        }`,
              variables: {
                id: userId,
              },
            });
            axios(axiosConfig(getUserRole))
              .then((res) => {
                setUserRole(res.data.data.findByUserId.data.role);
                const tempUserRole = res.data.data.findByUserId.data.role;
                if (tempUserRole === "company admin") setPromptStatus(false);
              })
              .catch(() => "Unauthorised access");
            setPromptStatus(res.data.data.getPrompt.status);
          })
          .catch((error) => {
            alert(`Error updating prompt: ${error.message}`);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    return () => clearInterval(interval);
  }, [token]);

  const handleContentChange = (event) => {
    if (event.target.value !== "") {
      setDisableStatus(false);
    }
    setContent(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (content === "") {
      alert("Prompt cannot be empty");
      return;
    }
    const data = JSON.stringify({
      query: `mutation($question: String!, $email: String!) {
            updatePrompt(question: $question, email: $email)
            }`,
      variables: {
        question: content,
        email: loggedInEmail,
      },
    });

    axios(axiosConfig(data))
      .then(() => {
        alert("Prompt updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        alert(`Error updating prompt: ${error.message}`);
      });
  };

  return (
    <React.Fragment>
      <Head title="Update Prompt"></Head>
      <Content page="component">
        <BlockHead size="lg" wide="sm">
          <BlockHeadContent>
            <BlockTitle tag="h2" className="fw-normal">
              Update Prompt
            </BlockTitle>
          </BlockHeadContent>
        </BlockHead>

        <Block size="lg">
          <PreviewCard>
            <Row>
              <Col size="lg">
                <h6>Your current prompt:</h6>
                <p>{prompt}</p>
              </Col>
            </Row>
          </PreviewCard>
        </Block>

        {(userRole === "member" || userRole === "super admin") && (
          <Block size="lg">
            <PreviewCard>
              <Row>
                <Col size="lg">
                  <h6>You cannot edit this prompt</h6>
                </Col>
              </Row>
            </PreviewCard>
          </Block>
        )}

        {userRole === "company admin" && (
          <Block size="lg">
            <PreviewCard>
              <Form className={formClass} onSubmit={handleSubmit}>
                <Row className="g-gs">
                  <Col md="12">
                    <div className="form-group">
                      <Label className="form-label" htmlFor="fv-message">
                        Enter Your Updated Prompt Here:
                      </Label>
                      <div className="form-control-wrap">
                        <textarea
                          type="textarea"
                          className="form-control form-control-sm"
                          id="prompt"
                          name="prompt"
                          placeholder="Write your prompt"
                          onChange={handleContentChange}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md="12">
                    <div className="form-group">
                      <Button color="primary" size="lg" disabled={disableStatus}>
                        Save Prompt
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </PreviewCard>
          </Block>
        )}
      </Content>
    </React.Fragment>
  );
};

export default UpdatePrompt;
