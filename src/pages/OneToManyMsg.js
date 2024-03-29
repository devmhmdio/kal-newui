import React, { useState, useEffect } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Papa from "papaparse";
import { Block, BlockHead, BlockHeadContent, BlockTitle, PreviewCard } from "../components/Component";
import { Col, Row, Input } from "reactstrap";
import { axiosConfig } from "../utils/Utils";
import jwt_decode from "jwt-decode";

const OneToManyMsg = () => {
  const history = useHistory();
  let file;
  const [csvData, setCSVData] = useState(null);
  const [columnData, setColumnData] = useState(null);
  let emailIds = [];
  let numbers = [];
  let names = [];
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disableStatus, setDisableStatus] = useState(true);
  let [prompt, setPrompt] = useState(null);
  const [loggedInName, setLoggedInName] = useState(null);
  const [loggedInCompany, setLoggedInCompany] = useState(null);
  const [loggedInPosition, setLoggedInPosition] = useState(null);
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  let responseDatas = [];
  let datas = [];

  useEffect(() => {
    // const interval = setInterval(() => {
    //   const decodedToken = jwt_decode(token);

    //   if (decodedToken.exp * 1000 < Date.now()) {
    //     clearInterval(interval);
    //     setToken(null);
    //     localStorage.removeItem("accessToken");
    //     history.push("/auth-login");
    //   }
    // }, 1000);

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
            getMessagePrompt(email: $email)
                }`,
                variables: {
                  email
                }
        });
    
        axios(axiosConfig(dataPrompt)).then((res) => {
          setPrompt(res.data.data.getMessagePrompt.question);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const routeChange = () => {
    let path = `/send-message`;
    history.push(path);
  };

  const handleFileUpload = (event) => {
    event.preventDefault();
    file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async () => {
      setLoading(true);
      const csv = reader.result;
      setCSVData(csv);
      const parsedCSV = Papa.parse(csv, { header: true, dynamicTyping: true });
      setColumnData(parsedCSV.data);
      parsedCSV.data.forEach((d) => {
        names.push(d["Names"]);
        numbers.push('+' + d["Numbers"]);
      });

      prompt = prompt.replace("[Name]", loggedInName);
      const businessKeyword = parsedCSV.data[0]["Business Keyword"];
      const clientKeyword = parsedCSV.data[0]["Client Keywords"];
      let data;

      for (let i = 0; i < parsedCSV.data.length - 1; i++) {
        data = JSON.stringify({
          query: `mutation($businessKeyword: String!, $clientKeyword: [String!]!, $name: [String], $number: [String], $prompt: String, $emailLoggedInUser: String!) {
              createConnectionForMessage(input: {
                  businessKeyword: $businessKeyword
                  clientKeyword: $clientKeyword
                  csvName: $name
                  number: $number
                  prompt: $prompt
                  emailLoggedInUser: $emailLoggedInUser
              }) {
                  body
              }
            }`,
          variables: {
            businessKeyword,
            clientKeyword,
            name: [names[i]],
            number: [numbers[i]],
            prompt,
            emailLoggedInUser: loggedInEmail
          },
        });
        await axios(axiosConfig(data))
          .then((response) => {
            console.log("line 124", response.data.data.createConnectionForMessage[0]);
            responseDatas.push(response.data.data.createConnectionForMessage[0]);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      setLoading(false);
      setDisableStatus(false);
      setResponseData(responseDatas);
    };

    reader.onerror = () => {
      console.error("Error reading CSV file");
    };
  };

  return (
    <React.Fragment>
      <Head title="One To Many SMS Generations"></Head>
      <Content page="component">
        <BlockHead size="lg" wide="sm">
          <BlockHeadContent>
            <BlockTitle tag="h2" className="fw-normal">
              One To Many SMS Generations
            </BlockTitle>
          </BlockHeadContent>
        </BlockHead>

        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Upload file below</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <PreviewCard>
            <Row className="g-4">
              <Col sm="3"></Col>
              <Col sm="6">
                <div className="form-group">
                  <label className="form-label">Default File Upload</label>
                  <div className="form-control-wrap">
                    <div className="form-file">
                      <Input type="file" id="customFile" accept=".csv" onChange={handleFileUpload} />
                    </div>
                  </div>
                </div>
              </Col>
              <Col sm="3"></Col>
            </Row>
            <Row>
              <Col sm="12">
                <br />
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  csvData && (
                    <table>
                      <thead>
                        <tr>
                          <th>S. No.</th>
                          <th>Body</th>
                        </tr>
                      </thead>
                      <tbody>
                        {responseData.map((rowData, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{rowData.body}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                )}
                <br />
                <div className="d-flex justify-content-center align-items-center">
                  <button className="btn-round btn btn-primary" onClick={routeChange} disabled={disableStatus}>
                    Send SMS
                  </button>
                </div>
              </Col>
            </Row>
          </PreviewCard>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default OneToManyMsg;
