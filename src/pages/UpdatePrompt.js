import React, { useState, useEffect } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import { Row, Col,  Label, Form } from "reactstrap";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import axios from "axios";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  PreviewCard,
  Button
} from "../components/Component";
import { axiosConfig } from "../utils/Utils";

const UpdatePrompt = ({ alter, id }) => {
  const [prompt, setPrompt] = useState(null);
  const [content, setContent] = useState('');
  const { errors, register } = useForm();
  const formClass = classNames({
    "form-validate": true,
    "is-alter": alter,
  });
  const [disableStatus, setDisableStatus] = useState(true);

  useEffect(() => {
    const data = JSON.stringify({
      query: `query {
          getPrompt
          }`
    });

    axios(axiosConfig(data))
      .then((res) => {
        setPrompt(res.data.data.getPrompt);
      })
      .catch((error) => {
          alert(`Error updating prompt: ${error.message}`);
      });
  }, [])

  const handleContentChange = (event) => {
    if (event.target.value !== '') {
      setDisableStatus(false);
    }
    setContent(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (content === '') {
      alert('Prompt cannot be empty');
      return;
    }
    const data = JSON.stringify({
        query: `mutation($question: String!) {
            updatePrompt(question: $question)
            }`,
            variables: {
                question: content
            }
      });
  
      axios(axiosConfig(data))
        .then(() => {
            alert('Prompt updated successfully');
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
      </Content>
    </React.Fragment>
  );
};

export default UpdatePrompt;
