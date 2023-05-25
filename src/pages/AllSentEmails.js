import React, { useState, useEffect } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import { Block, PreviewCard, ReactDataTable } from "../components/Component";
import { dataTableColumnsSentEmails } from "./components/table/TableData";
import axios from "axios";
import { axiosConfig } from "../utils/Utils";

const AllSentEmails = () => {
  const [allSentEmails, setAllSentEmails] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
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
        setUserId(response.data.data.returnToken.userId);
        const loggedInUserId = (response.data.data.returnToken.userId);
        const loggedInUserEmail = (response.data.data.returnToken.email);
        let loggedInUserCompany;
        const getUserRole = JSON.stringify({
            query: `query($id: String!) {
                findByUserId(id: $id) {
                    data {
                        role
                    }
                }
            }`,
            variables: {
                id: loggedInUserId,
            }
        });
        axios(axiosConfig(getUserRole)).then((res) => {
          setUserRole(res.data.data.findByUserId.data.role);
          const roleOfUser = res.data.data.findByUserId.data.role;
          if (roleOfUser === "super admin") {
           loggedInUserCompany = '';
          } else {
            loggedInUserCompany = response.data.data.returnToken.company;
          }
        }).catch(() => "Unauthorised access")
        
        const data = JSON.stringify({
            query: `mutation($id: String!, $company: String) {
              viewAllEmailsSent(id: $id, company: $company) {
                        toEmail
                        toName
                        fromEmail
                        body
                        company
                    }
                }`,
            variables: {
              id: loggedInUserId,
              company: loggedInUserCompany,
            },
          });
          axios(axiosConfig(data))
            .then((res) => {
              console.log("line 42", res.data.data.viewAllEmailsSent);
              setAllSentEmails(res.data.data.viewAllEmailsSent);
            })
            .catch((e) => console.log(e));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <React.Fragment>
      <Head title="All Sent Emails" />
      {(userRole === "super admin" || userRole === "company admin") && (
        <Content page="component">
          <Block size="lg">
            <PreviewCard>
              {allSentEmails.length > 0 && (
                <ReactDataTable data={allSentEmails} columns={dataTableColumnsSentEmails} expandableRows pagination actions />
              )}
            </PreviewCard>
          </Block>
        </Content>
      )}
    </React.Fragment>
  );
};
export default AllSentEmails;
