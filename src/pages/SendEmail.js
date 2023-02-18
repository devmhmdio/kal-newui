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
} from "../components/Component";

const SendEmail = ({ headColor, striped, border, hover, responsive }) => {
  const [emailDatas, setEmailDatas] = useState([]);
  const d = [{ name: '', email: '' }];

  useEffect(() => {
    const data = JSON.stringify({
      query: `query {
                getEmails {
                    subject
                    body
                    name
                    emailId
                }
              }`,
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
        console.log('line 33', response.data.data.getEmails);
        setEmailDatas(response.data.data.getEmails);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const formFieldsArray = Array.from({ length: emailDatas.length }, () => [
    ...d,
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    let name = [];
    let email = [];
    let emailSubject = [];
    let emailBody = [];
    let o = [];
    console.log(JSON.stringify(formFieldsArray))
    for (let i = 0; i <= event.target.length - 1; i++) {
        if (event.target[i].name === 'name') {
          name.push(event.target[i].value)
      }
      if (event.target[i].name === 'email') {
        email.push(event.target[i].value)
      }
      if (event.target[i].name === 'subject') {
          emailSubject.push(event.target[i].value)
      }
      if (event.target[i].name === 'body') {
          emailBody.push(event.target[i].value)
      }
    }
    for (let j = 0;j<=name.length-1 && j<=email.length;j++) {
        o.push(formFieldsArray[j][0] = {subject: emailSubject[j], body: emailBody[j], name: name[j], email: email[j]})
    }

    for(let i=0;i<=o.length-1;i++) {
        const data = JSON.stringify({
            query: `mutation($subject: String!, $body: String!, $name: String!, $email: String!) {
                      sendEmail(input: [{
                        subject: $subject
                        body: $body
                        name: $name
                        toEmail: $email
                    }])
                    }`,
                    variables: {
                        subject: o[i].subject,
                        body: o[i].body,
                        name: o[i].name,
                        email: o[i].email
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
              console.log('line 33', response.data.data.sendEmail);
            alert('Emails sent successfully');
            })
            .catch((error) => {
              console.log(error);
            });
            
    }
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <React.Fragment>
      <Head title="Send Emails" />
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
          </tr>
            </thead>
            <tbody>
              {emailDatas.map((item, index) => {
                return (
                  <tr key={index+1}>
                    <th>{index+1}</th>
                    <td><textarea
                    id={`subject-${index+1}`}
                    name="subject"
                    defaultValue={item.subject}
                  ></textarea></td>
                    <td><textarea
                    id={`body-${index+1}`}
                    name="body"
                    defaultValue={item.body}
                    cols={50}
                    rows={5}
                  ></textarea></td>
                    <td><input
                    type="text"
                    id={`name-${index+1}`}
                    name="name"
                    value={item.name}
                  ></input></td>
                    <td><input
                    type="text"
                    id={`email-${index+1}`}
                    name="email"
                    value={item.emailId}
                  ></input></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <br />
          <div className="d-flex justify-content-center align-items-center">
          <button type="submit" className="btn-round btn btn-primary">Send Emails</button>
          </div>
          </form>
        </div>
          </PreviewCard>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default SendEmail;
