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
import { Block, BlockHead, BlockHeadContent, BlockBetween, BlockTitle, PreviewCard, Row, Col } from "../components/Component";
import { axiosConfig } from "../utils/Utils";
import { useHistory } from "react-router";

const SendEmail = ({ headColor, striped, border, hover, responsive }) => {
  const history = useHistory();
  const [emailDatas, setEmailDatas] = useState([
    {
      subject: "",
      body: "",
      csvName: "",
      emailId: "",
    },
  ]);
  const d = [{ name: "", email: "" }];
  const [loggedInName, setLoggedInName] = useState(null);
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [loggedInAppPassword, setLoggedInAppPassword] = useState(null);
  const [loggedInCompany, setLoggedInCompany] = useState(null);
  const [loggedInBalance, setLoggedInBalance] = useState(0);

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
        if (response.data.data.returnToken.role === 'company admin') {
          setLoggedInBalance(response.data.data.returnToken.balance);
        } else if (response.data.data.returnToken.role === 'super admin') {
          setLoggedInBalance(response.data.data.returnToken.balance);
        } else {
          const getCompanyAdmin = JSON.stringify({
            query: `query($company: String!, $role: String!) {
              getUserCompanyAdmin(company: $company, role: $role)
            }`,
            variables: {
              company: response.data.data.returnToken.company,
              role: 'company admin',
            },
          });
          axios(axiosConfig(getCompanyAdmin)).then(caResponse => setLoggedInBalance(caResponse.data.data.getUserCompanyAdmin[0].balance)).catch(err => console.log(err));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const addRow = () => {
    setEmailDatas([
      ...emailDatas,
      {
        subject: "",
        body: "",
        csvName: "",
        emailId: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    setEmailDatas(emailDatas.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const data = JSON.stringify({
      query: `query($loggedInEmail: String!) {
                getEmails(loggedInEmail: $loggedInEmail) {
                    subject
                    body
                    csvName
                    emailId
                }
              }`,
      variables: {
        loggedInEmail,
      },
    });

    axios(axiosConfig(data))
      .then((response) => {
        setEmailDatas(response.data.data.getEmails);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [loggedInEmail]);

  const formFieldsArray = Array.from({ length: emailDatas.length }, () => [...d]);

  const handleSubmit = (event) => {
    event.preventDefault();
    let name = [];
    let email = [];
    let emailSubject = [];
    let emailBody = [];
    let o = [];
    console.log(JSON.stringify(formFieldsArray));
    for (let i = 0; i <= event.target.length - 1; i++) {
      if (event.target[i].name === "name") {
        name.push(event.target[i].value);
      }
      if (event.target[i].name === "email") {
        email.push(event.target[i].value);
      }
      if (event.target[i].name === "subject") {
        emailSubject.push(event.target[i].value);
      }
      if (event.target[i].name === "body") {
        emailBody.push(event.target[i].value);
      }
    }
    for (let j = 0; j <= name.length - 1 && j <= email.length; j++) {
      o.push(
        (formFieldsArray[j][0] = { subject: emailSubject[j], body: emailBody[j], name: name[j], email: email[j] })
      );
    }

    for (let i = 0; i <= o.length - 1; i++) {
      const data = JSON.stringify({
        query: `mutation($subject: String!, $body: String!, $name: String!, $email: String!, $fromEmail: String!, $appPassword: String!, $company: String) {
                      sendEmail(input: [{
                        subject: $subject
                        body: $body
                        name: $name
                        toEmail: $email
                        fromEmail: $fromEmail
                        app_password: $appPassword
                        company: $company
                    }])
                    }`,
        variables: {
          subject: o[i].subject,
          body: o[i].body,
          name: o[i].name,
          email: o[i].email,
          fromEmail: loggedInEmail,
          appPassword: loggedInAppPassword,
          company: loggedInCompany,
        },
      });

      axios(axiosConfig(data))
        .then((response) => {
          alert("Emails sent successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    }

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const redirectToPayments = () => {
    history.push("/payments");
  };

  return (
    <React.Fragment>
      <Head title="Send Emails" />
      {Number(loggedInBalance) > 1 ? (
        <>
        <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Send Emails</BlockTitle>
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
                      <td>Subject</td>
                      <td>Body</td>
                      <td>Name</td>
                      <td>Email</td>
                      <td>Delete</td>
                    </tr>
                  </thead>
                  <tbody>
                    {emailDatas.map((item, index) => {
                      return (
                        <tr key={index + 1}>
                          <th>{index + 1}</th>
                          <td>
                            <textarea id={`subject-${index + 1}`} name="subject" defaultValue={item.subject}></textarea>
                          </td>
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
                            <input type="text" id={`name-${index + 1}`} name="name" defaultValue={item.csvName}></input>
                          </td>
                          <td>
                            <input
                              type="text"
                              id={`email-${index + 1}`}
                              name="email"
                              defaultValue={item.emailId}
                            ></input>
                          </td>
                          <td>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteRow(index)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <br />
                <div className="d-flex justify-content-center align-items-center">
                  <button type="submit" className="btn-round btn btn-primary">
                    Send Emails
                  </button>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                <button
                  type="button"
                  className="btn-round btn btn-primary"
                  onClick={addRow}
                  style={{ marginRight: "10px", marginTop: "10px" }}
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

export default SendEmail;
