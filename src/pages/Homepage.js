import React, { useState } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import { Row, Col } from "reactstrap";
import classNames from "classnames";
import {
  Block,
  PreviewCard,
  Button,
} from "../components/Component";
import axios from "axios";

const Homepage = ({ headColor, striped, border, hover, responsive }) => {
  const [businessKeywords, setBusinessKeywords] = useState([]);
  const [clientKeywords, setClientKeywords] = useState([]);
  const [responseData, setResponseData] = useState();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disableStatus, setDisableStatus] = useState(false);
  const [formData, setFormData] = useState({
    businessKeyword: '',
    clientKeyword: [],
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleChangeBusiness = (event) => {
    event.preventDefault();
    setBusinessKeywords((prevState) => {
      return [...prevState, formData.businessKeyword];
    });
    setFormData({ businessKeyword: '' });
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
    console.log('this is business keywords', businessKeywords[0].toString());
    console.log('this is client keywords', clientKeywords);
    const data = JSON.stringify({
      query: `mutation($businessKeyword: String!, $clientKeyword: [String!]!) {
              createConnection(input: {
                  businessKeyword: $businessKeyword
                  clientKeyword: $clientKeyword
              }) {
                  subject
                  body
              }
          }`,
      variables: {
        businessKeyword: businessKeywords[0],
        clientKeyword: clientKeywords,
      },
    });

    const config = {
      method: 'post',
      url: 'https://starfish-app-fzf2t.ondigitalocean.app/graphql',
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
    setFormData({ businessKeyword: '', clientKeyword: [] });
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
      <Head title="Form Layouts" />
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
                      Business Keyword
                    </label>
                    <br />
                    {businessKeywords.map((keyword) => (
                      <span style={{paddingRight: 10 + 'px'}}>{keyword}</span>
                    ))}
                    <input type="text" id="businessKeyword" name="businessKeyword" value={formData.businessKeyword} className="form-control" onChange={handleChange} />
                    <br />
                    <button class="btn-round btn btn-primary btn-sm" onClick={handleChangeBusiness}>Add Business Keyword</button>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-email-address">
                      Client Keywords
                    </label>
                    <br />
                    {clientKeywords.map((keyword) => (
                      <span style={{paddingRight: 10 + 'px'}}>{keyword}</span>
                    ))}
                    <input type="text" id="clientKeyword" name="clientKeyword" value={formData.clientKeyword} className="form-control" onChange={handleChange} />
                    <br />
                    <button class="btn-round btn btn-primary btn-sm" onClick={handleChangeClient}>Add Client Keyword</button>
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
      ) : (responseData !== undefined && 
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
                          <tr key={index+1}>
                            <th>{index+1}</th>
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
      )}
    </React.Fragment>
  );
};
export default Homepage;
