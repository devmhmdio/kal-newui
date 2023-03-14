import React, { useState, useEffect } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import { Row, Col } from "reactstrap";
import classNames from "classnames";
import { Block, PreviewCard, Button } from "../components/Component";
import axios from "axios";
import { axiosConfig } from "../utils/Utils";
import { useHistory } from "react-router";
import jwt_decode from "jwt-decode";

const Homepage = ({ headColor, striped, border, hover, responsive }) => {
  let [prompt, setPrompt] = useState(null);
  const [businessKeywords, setBusinessKeywords] = useState([]);
  const [clientKeywords, setClientKeywords] = useState([]);
  const [responseData, setResponseData] = useState();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disableStatus, setDisableStatus] = useState(false);
  const [formData, setFormData] = useState({
    businessKeyword: "",
    clientKeyword: [],
  });
  const [loggedInName, setLoggedInName] = useState(null);
  const [loggedInCompany, setLoggedInCompany] = useState(null);
  const [loggedInPosition, setLoggedInPosition] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      const decodedToken = jwt_decode(token);

      if (decodedToken.exp * 1000 < Date.now()) {
        clearInterval(interval);
        setToken(null);
        localStorage.removeItem("accessToken");
        history.push("/auth-login");
      }
    }, 1000);

    
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
        setLoggedInCompany(response.data.data.returnToken.company);
        setLoggedInName(response.data.data.returnToken.name);
        setLoggedInPosition(response.data.data.returnToken.position);
      })
      .catch((error) => {
        console.log(error);
      });

    const dataPrompt = JSON.stringify({
      query: `query {
            getPrompt
            }`,
    });

    axios(axiosConfig(dataPrompt)).then((res) => {
      setPrompt(res.data.data.getPrompt);
    });

    return () => clearInterval(interval);
  }, [token]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleChangeBusiness = (event) => {
    event.preventDefault();
    setBusinessKeywords((prevState) => {
      return [...prevState, formData.businessKeyword];
    });
    setFormData({ businessKeyword: "" });
  };

  const handleChangeClient = (event) => {
    event.preventDefault();
    setClientKeywords((prevState) => [...prevState, formData.clientKeyword]);
    setFormData({ clientKeyword: [] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setDisableStatus(true);
    prompt = prompt.replace("the sender", loggedInName);
    prompt = prompt.replace("<Sender's Name>", loggedInName);
    prompt = prompt.replace("<Sender Position>", loggedInPosition);
    prompt = prompt.replace("sender's business/services", loggedInCompany);
    const data = JSON.stringify({
      query: `mutation($businessKeyword: String!, $clientKeyword: [String!]!, $prompt: String) {
              createConnection(input: {
                  businessKeyword: $businessKeyword
                  clientKeyword: $clientKeyword
                  prompt: $prompt
              }) {
                  subject
                  body
              }
          }`,
      variables: {
        businessKeyword: businessKeywords[0],
        clientKeyword: clientKeywords,
        prompt: prompt,
      },
    });

    axios(axiosConfig(data))
      .then((response) => {
        const allData = response.data.data.createConnection;
        for (let i = 0; i <= allData.length - 1; i++) {}
        setResponseData(allData);
        setLoading(false);
        setDisableStatus(false);
      })
      .catch((error) => {
        console.log(error);
      });
    setFormData({ businessKeyword: "", clientKeyword: [] });
  };

  const tableClass = classNames({
    table: true,
    "table-bordered": border,
    "table-borderless": !border,
    "table-striped": striped,
    "table-hover": hover,
  });
  return (
    <React.Fragment>
      <Head title="Dashboard" />
      <Content page="component">
        <Block size="lg">
          <Row className="g-gs">
            <Col lg="3"></Col>
            <Col lg="6">
              <PreviewCard className="h-100">
                <div className="card-head">
                  <h5 className="card-title">Generate Your AI Response</h5>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-full-name">
                      Sender Value Proposition
                    </label>
                    <br />
                    {businessKeywords.map((keyword) => (
                      <span style={{ paddingRight: 10 + "px" }}>{keyword}</span>
                    ))}
                    <input
                      type="text"
                      id="businessKeyword"
                      name="businessKeyword"
                      value={formData.businessKeyword}
                      className="form-control"
                      onChange={handleChange}
                    />
                    <br />
                    <button class="btn-round btn btn-primary btn-sm" onClick={handleChangeBusiness}>
                      Add Sender Value Proposition
                    </button>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-email-address">
                      Recipient Personal Statement
                    </label>
                    <br />
                    {clientKeywords.map((keyword) => (
                      <span style={{ paddingRight: 10 + "px" }}>{keyword}</span>
                    ))}
                    <input
                      type="text"
                      id="clientKeyword"
                      name="clientKeyword"
                      value={formData.clientKeyword}
                      className="form-control"
                      onChange={handleChange}
                    />
                    <br />
                    <button class="btn-round btn btn-primary btn-sm" onClick={handleChangeClient}>
                      Add Recipient Personal Statement
                    </button>
                  </div>
                  <div className="form-group">
                    <Button color="primary" type="submit" size="lg" disabled={disableStatus}>
                      Generate
                    </Button>
                  </div>
                </form>
              </PreviewCard>
            </Col>
            <Col lg="3"></Col>
          </Row>
        </Block>
      </Content>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        responseData !== undefined && (
          <Content>
            <Block>
              <Row>
                <Block size="lg">
                  <PreviewCard>
                    <div className={responsive ? "table-responsive" : ""}>
                      <table className={tableClass}>
                        <thead className={`${headColor ? `table-${headColor}` : ""}`}>
                          <tr>
                            <td>#</td>
                            <td>Subject</td>
                            <td>Body</td>
                          </tr>
                        </thead>
                        <tbody>
                          {responseData.map((item, index) => {
                            return (
                              <tr key={index + 1}>
                                <th>{index + 1}</th>
                                <td>{item.subject}</td>
                                <td>{item.body}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </PreviewCard>
                </Block>
              </Row>
            </Block>
          </Content>
        )
      )}
    </React.Fragment>
  );
};
export default Homepage;
