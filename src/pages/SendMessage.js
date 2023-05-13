import React, { useState, useEffect } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import classNames from "classnames";
import axios from "axios";
const tableClass = classNames({
  table: true,
  "table-bordered": true,
  "table-borderless": false,
  "table-striped": true,
  "table-hover": true,
});
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockBetween,
  BlockTitle,
  PreviewCard,
  Row,
  Col,
} from "../components/Component";
import { axiosConfig } from "../utils/Utils";
import { useHistory } from "react-router";

const SendMessage = ({ headColor, striped, border, hover, responsive }) => {
  const history = useHistory();
  const [emailDatas, setEmailDatas] = useState([]);
  const [customRows, setCustomRows] = useState([]);
  const d = [{ name: "", email: "" }];
  const [loggedInName, setLoggedInName] = useState(null);
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [loggedInAppPassword, setLoggedInAppPassword] = useState(null);
  const [loggedInCompany, setLoggedInCompany] = useState(null);
  const [loggedInBalance, setLoggedInBalance] = useState(0);
  const regex = /(?:<|\[)(\w*?(?:company|business|firm)\w*?)(?:>|])/gi;
  const placeholderRegex1 = /\[(.*?)\]/g;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
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
        setLoggedInName(response.data.data.returnToken.name);
        setLoggedInEmail(response.data.data.returnToken.email);
        setLoggedInAppPassword(response.data.data.returnToken.app_password);
        setLoggedInCompany(response.data.data.returnToken.company);
        if (response.data.data.returnToken.role === "company admin") {
          setLoggedInBalance(response.data.data.returnToken.balance);
        } else if (response.data.data.returnToken.role === "super admin") {
          setLoggedInBalance(response.data.data.returnToken.balance);
        } else {
          const getCompanyAdmin = JSON.stringify({
            query: `query($company: String!, $role: String!) {
              getUserCompanyAdmin(company: $company, role: $role)
            }`,
            variables: {
              company: response.data.data.returnToken.company,
              role: "company admin",
            },
          });
          axios(axiosConfig(getCompanyAdmin))
            .then((caResponse) => setLoggedInBalance(caResponse.data.data.getUserCompanyAdmin[0].balance))
            .catch((err) => console.log(err));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const data = JSON.stringify({
      query: `query($loggedInEmail: String!) {
        getMsgs(loggedInEmail: $loggedInEmail) {
                    body
                    csvName
                    number
                }
              }`,
      variables: {
        loggedInEmail,
      },
    });

    axios(axiosConfig(data))
      .then((response) => {
        setEmailDatas(response.data.data.getMsgs);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [loggedInEmail]);

  const formFieldsArray = Array.from({ length: emailDatas.length }, () => [...d]);

  const handleSubmit = (event) => {
    event.preventDefault();
    let name = [];
    let number = [];
    let emailSubject = [];
    let emailBody = [];
    let o = [];
    for (let i = 0; i <= event.target.length - 1; i++) {
      if (event.target[i].name === "name") {
        name.push(event.target[i].value);
      }
      if (event.target[i].name === "number") {
        number.push(event.target[i].value);
      }
      if (event.target[i].name === "subject") {
        emailSubject.push(event.target[i].value);
      }
      if (event.target[i].name === "body") {
        emailBody.push(event.target[i].value);
      }
    }

    for (let j = 0; j <= name.length - 1 && j <= number.length; j++) {
      o.push({ subject: emailSubject[j], body: emailBody[j], name: name[j], number: number[j] });
    }

    for (let i = 0; i <= o.length - 1; i++) {
      const data = JSON.stringify({
        query: `mutation($body: String!, $name: String!, $number: String!, $fromEmail: String!) {
              sendMessage(input: [{
                        body: $body
                        name: $name
                        number: $number
                        fromEmail: $fromEmail
                    }])
                    }`,
        variables: {
          body: o[i].body,
          name: o[i].name,
          number: o[i].number,
          fromEmail: loggedInEmail,
        },
      });

      axios(axiosConfig(data))
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        });
    }
    alert("All SMS sent successfully");

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const addCustomRow = () => {
    setCustomRows((prevRows) => [...prevRows, { name: "", number: "" }]);
  };

  const redirectToPayments = () => {
    history.push("/payments");
  };

  return (
    <React.Fragment>
      <Head title="Send SMS" />
      {Number(loggedInBalance) > 1 ? (
        <>
          <Content>
            <BlockHead size="sm">
              <BlockBetween>
                <BlockHeadContent>
                  <BlockTitle page>Send SMS</BlockTitle>
                </BlockHeadContent>
              </BlockBetween>
            </BlockHead>
            <Block size="lg">
              <PreviewCard>
                <div>
                  <form onSubmit={handleSubmit}>
                    <table className={tableClass}>
                      <thead className={`${headColor ? `table-${headColor}` : ""}`}>
                        <tr>
                          <td>#</td>
                          <td>Body</td>
                          <td>Name</td>
                          <td>Number</td>
                        </tr>
                      </thead>
                      <tbody>
                        {emailDatas.map((item, index) => {
                          return (
                            <tr key={index + 1}>
                              <th>{index + 1}</th>
                              <td>
                                <textarea
                                  id={`body-${index + 1}`}
                                  name="body"
                                  defaultValue={item.body}
                                  cols={50}
                                  rows={5}
                                ></textarea>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  id={`name-${index + 1}`}
                                  name="name"
                                  defaultValue={item.csvName}
                                ></input>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  id={`number-${index + 1}`}
                                  name="number"
                                  defaultValue={item.number}
                                ></input>
                              </td>
                            </tr>
                          );
                        })}
                        {customRows.map((_, index) => (
                          <tr key={`custom-${index}`}>
                            <th>{emailDatas.length + index + 1}</th>
                            <td>
                              <textarea id={`body-custom-${index}`} name="body" cols={50} rows={5}></textarea>
                            </td>
                            <td>
                              <input type="text" id={`name-custom-${index}`} name="name"></input>
                            </td>
                            <td>
                              <input type="text" id={`number-custom-${index}`} name="number"></input>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <br />
                    <div className="d-flex justify-content-center align-items-center">
                      <button type="submit" className="btn-round btn btn-primary">
                        Send SMS
                      </button>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <button
                        type="button"
                        className="btn-round btn btn-primary"
                        style={{ marginTop: 10 + "px" }}
                        onClick={addCustomRow}
                      >
                        Add Row
                      </button>
                    </div>
                  </form>
                </div>
              </PreviewCard>
            </Block>
          </Content>
        </>
      ) : (
        <>
          <Content page="component">
            <Block size="lg">
              <Row className="g-gs">
                <Col lg="3"></Col>
                <Col lg="6">
                  <PreviewCard className="h-100">
                    <div className="card-head">
                      <h5 className="card-title">Generate Your AI Response</h5>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <p>Please recharge your wallet to continue.</p>
                      <p>
                        <button onClick={redirectToPayments} class="btn-round btn btn-primary btn-sm">
                          Go to Payments
                        </button>
                      </p>
                    </div>
                  </PreviewCard>
                </Col>
                <Col lg="3"></Col>
              </Row>
            </Block>
          </Content>
        </>
      )}
    </React.Fragment>
  );
};

export default SendMessage;
