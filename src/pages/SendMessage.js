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
import { axiosConfig } from "../utils/Utils";

const SendMessage = ({ headColor, striped, border, hover, responsive }) => {
  const [emailDatas, setEmailDatas] = useState([]);
  const d = [{ name: '', email: '' }];
  const [loggedInName, setLoggedInName] = useState(null);
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [loggedInAppPassword, setLoggedInAppPassword] = useState(null);
  const [loggedInCompany, setLoggedInCompany] = useState(null);
  const regex = /(?:<|\[)(\w*?(?:company|business|firm)\w*?)(?:>|])/gi;
  const placeholderRegex1 = /\[(.*?)\]/g;

  useEffect(() => {
    

    const token = localStorage.getItem("accessToken");
      const dataToken = JSON.stringify({
        query: `mutation($token: String) {
                  returnToken(token: $token)
            }`,
        variables: {
          token
        },
      });
  
      axios(axiosConfig(dataToken))
        .then((response) => {
          setLoggedInName(response.data.data.returnToken.name);
          setLoggedInEmail(response.data.data.returnToken.email);
          setLoggedInAppPassword(response.data.data.returnToken.app_password);
          setLoggedInCompany(response.data.data.returnToken.company);
          const data = JSON.stringify({
            query: `query($loggedInEmail: String!) {
                      getEmails {
                          subject
                          body
                          csvName
                          number
                      }
                    }`,
                    variables: {
                      loggedInEmail
                    }
          });
      
          axios(axiosConfig(data))
            .then((response) => {
              setEmailDatas(response.data.data.getEmails);
            })
            .catch((error) => {
              console.log(error);
            });
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
    let number = [];
    let emailSubject = [];
    let emailBody = [];
    let o = [];
    for (let i = 0; i <= event.target.length - 1; i++) {
        if (event.target[i].name === 'name') {
          name.push(event.target[i].value)
      }
      if (event.target[i].name === 'number') {
        number.push(event.target[i].value)
      }
      if (event.target[i].name === 'subject') {
          emailSubject.push(event.target[i].value)
      }
      if (event.target[i].name === 'body') {
          emailBody.push(event.target[i].value)
      }
    }
    for (let j = 0;j<=name.length-1 && j<=number.length;j++) {
        o.push(formFieldsArray[j][0] = {subject: emailSubject[j], body: emailBody[j], name: name[j], number: number[j]})
    }

    for(let i=0;i<=o.length-1;i++) {
        const data = JSON.stringify({
            query: `mutation($subject: String!, $body: String!, $name: String!, $number: String!) {
              sendMessage(input: [{
                        subject: $subject
                        body: $body
                        name: $name
                        number: $number
                    }])
                    }`,
                    variables: {
                        subject: o[i].subject,
                        body: o[i].body,
                        name: o[i].name,
                        number: o[i].number,
                      },
          });
      
          axios(axiosConfig(data))
            .then((response) => {
            
            })
            .catch((error) => {
              console.log(error);
            });

            
          }
          alert('All messages sent successfully');
    
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1000);
  };

  return (
    <React.Fragment>
      <Head title="Send Messages" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Send Messages</BlockTitle>
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
            <td>Number</td>
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
                    defaultValue={item.csvName}
                  ></input></td>
                    <td><input
                    type="text"
                    id={`number-${index+1}`}
                    name="number"
                    defaultValue={item.number}
                  ></input></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <br />
          <div className="d-flex justify-content-center align-items-center">
          <button type="submit" className="btn-round btn btn-primary">Send Messages</button>
          </div>
          </form>
        </div>
          </PreviewCard>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default SendMessage;
