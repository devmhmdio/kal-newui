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
  const [loggedInEmail, setLoggedInEmail] = useState('');
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
        setLoggedInEmail(response.data.data.returnToken.email);
        const email = response.data.data.returnToken.email;
        const dataPrompt = JSON.stringify({
          query: `query($email: String!) {
                getPrompt(email: $email)
                }`,
                variables: {
                  email
                }
        });
    
        axios(axiosConfig(dataPrompt)).then((res) => {
          setPrompt(res.data.data.getPrompt);
        });
      })
      .catch((error) => {
        console.log(error);
      });

    return () => clearInterval(interval);
  }, [token]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleChangeBusiness = (event) => {
    event.preventDefault();
    if (businessKeywords.length === 0) {
      if (formData.businessKeyword.trim() === "") {
        alert("You cannot add an empty business keyword");
        return;
      }
      setBusinessKeywords((prevState) => {
        return [...prevState, formData.businessKeyword];
      });
    } else {
      alert("You cannot add more than 1 business keyword")
      setFormData({ businessKeyword: "" });
    }
    setFormData({ businessKeyword: "" });
  };

  const handleChangeClient = (event) => {
    event.preventDefault();
    console.log(formData)
    if (formData.clientKeyword.length === 0 || formData.clientKeyword.trim() === "") {
      alert("You cannot add an empty client keyword");
      return;
    }
    setClientKeywords((prevState) => [...prevState, formData.clientKeyword]);
    setFormData({ ...formData, clientKeyword: "" });
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
      query: `mutation($businessKeyword: String!, $clientKeyword: [String!]!, $prompt: String, $emailLoggedInUser: String!) {
              createConnection(input: {
                  businessKeyword: $businessKeyword
                  clientKeyword: $clientKeyword
                  prompt: $prompt
                  emailLoggedInUser: $emailLoggedInUser
              }) {
                  subject
                  body
              }
          }`,
      variables: {
        businessKeyword: businessKeywords[0],
        clientKeyword: clientKeywords,
        prompt: prompt,
        emailLoggedInUser: loggedInEmail
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

  const removeWord = (index) => {
    const newWords = [...clientKeywords]
    newWords.splice(index, 1);
    setClientKeywords(newWords);
  };

  const removeWordBusiness = (index) => {
    const newWords = [...businessKeywords]
    newWords.splice(index, 1);
    setBusinessKeywords(newWords);
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
      <Head title="Start Here" />
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
                    {businessKeywords.map((keyword, index) => (
                      <span style={{ paddingRight: 10 + "px", paddingLeft: 10 + "px", paddingTop: 5 + "px", paddingBottom: 5 + "px", background: "#798bff", color: "#fff", borderRadius: 25 + "px" }}>{keyword}
                        <span onClick={() => removeWordBusiness(index)} style={{marginLeft: 7 + "px", cursor: "pointer"}}>x</span>
                      </span>
                    ))}
                    <p style={{marginBottom: 10 + "px"}}></p>
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
                      Recipient Persona Statement
                    </label>
                    <br />
                    {clientKeywords.map((keyword, index) => (
                      <span style={{marginRight: 5 + "px"}}>
                        <span style={{ paddingRight: 10 + "px", paddingLeft: 10 + "px", paddingTop: 5 + "px", paddingBottom: 5 + "px", background: "#798bff", color: "#fff", borderRadius: 25 + "px" }}>{keyword}
                          <span onClick={() => removeWord(index)} style={{marginLeft: 7 + "px", cursor: "pointer"}}>x</span>
                        </span>
                      </span>
                    ))}
                    <p style={{marginBottom: 10 + "px"}}></p>
                    <input
                      type="text"
                      id="clientKeyword"
                      name="clientKeyword"
                      value={formData.clientKeyword}
                      className="form-control"
                      onChange={handleChange}
                      disabled={businessKeywords.length === 0}
                    />
                    <br />
                    <button class="btn-round btn btn-primary btn-sm" onClick={handleChangeClient} disabled={businessKeywords.length === 0}>
                      Add Recipient Persona Statement
                    </button>
                  </div>
                  <div className="form-group">
                    <Button color="primary" type="submit" size="lg" disabled={disableStatus || businessKeywords.length === 0 || clientKeywords.length === 0}>
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
