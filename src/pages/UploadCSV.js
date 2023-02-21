import React, { useState, useEffect } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Papa from 'papaparse';
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  PreviewCard,
} from "../components/Component";
import { Col, Row, Input } from "reactstrap";

const UploadCSV = () => {
  const history = useHistory();
  let file;
  const [csvData, setCSVData] = useState(null);
  const [columnData, setColumnData] = useState(null);
  let clientKeywords = [];
  let names = [];
  let emailIds = [];
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disableStatus, setDisableStatus] = useState(true);

  const routeChange = () =>{ 
    let path = `/send-email`; 
    history.push(path);
  }

  const handleFileUpload = (event) => {
    event.preventDefault();
    file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      setLoading(true);
      const csv = reader.result;
      setCSVData(csv);
      const parsedCSV = Papa.parse(csv, { header: true, dynamicTyping: true });
      setColumnData(parsedCSV.data);
      parsedCSV.data.forEach((d) => {
        if (typeof d['Client Keywords'] == 'string') {
          clientKeywords.push(d['Client Keywords'])
          names.push(d['Names'])
          emailIds.push(d['Emails'])
        }
      })

      const data = JSON.stringify({
        query: `mutation($businessKeyword: String!, $clientKeyword: [String!]!, $name: [String], $emailId: [String]) {
          createConnection(input: {
              businessKeyword: $businessKeyword
              clientKeyword: $clientKeyword
              name: $name,
              emailId: $emailId
          }) {
              subject
              body
          }
        }`,
        variables: {
          businessKeyword: parsedCSV.data[0]['Business Keyword'],
          clientKeyword: clientKeywords,
          name: names,
          emailId: emailIds
        },
      });

      const config = {
        method: 'post',
        url: process.env.AXIOS_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      axios(config)
      .then((response) => {
        console.log('line 63', response.data.data.createConnection);
        setResponseData(response.data.data.createConnection);
        setLoading(false);
        setDisableStatus(false);
      })
      .catch((error) => {
        console.log(error);
      });
    };

    reader.onerror = () => {
      console.error('Error reading CSV file');
    };

    console.log('this is csv Data', csvData)
    // if (csvData) {}
  };
  
  return (
    <React.Fragment>
      <Head title="Upload CSV"></Head>
      <Content page="component">
        <BlockHead size="lg" wide="sm">
          <BlockHeadContent>
            
            <BlockTitle tag="h2" className="fw-normal">
              CSV Upload
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
                      <Input
                        type="file"
                        id="customFile"
                        accept=".csv"
                        onChange={handleFileUpload}
                      />
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
              ) : (csvData && (
                <table>
                  <thead>
                    <tr>
                      <th>S. No.</th>
                      <th>Subject</th>
                      <th>Body</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseData.map((rowData, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{rowData.subject}</td>
                        <td>{rowData.body}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
              <br />
              <div className="d-flex justify-content-center align-items-center">
              <button className="btn-round btn btn-primary" onClick={routeChange} disabled={disableStatus}>Send Emails</button>
              </div>
              </Col>
            </Row>
          </PreviewCard>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default UploadCSV;
