import React, { useState, useEffect } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import { Block, PreviewCard, ReactDataTable } from "../components/Component";
import { dataTableColumns } from "./components/table/TableData";
import axios from "axios";
import { axiosConfig } from "../utils/Utils";

const AllUsers = () => {
  const [allUsers, setAllusers] = useState([]);
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
        axios(axiosConfig(getUserRole)).then((res) => setUserRole(res.data.data.findByUserId.data.role)).catch(() => "Unauthorised access")
        
        const data = JSON.stringify({
            query: `mutation($id: String!, $regex: String) {
                    getAllUsers(id: $id, regex: $regex) {
                        name
                        email
                        phone
                        company
                        position
                        role
                        createdAt
                    }
                }`,
            variables: {
              id: loggedInUserId,
              regex: loggedInUserEmail.split('@').pop().toLowerCase(),
            },
          });
          axios(axiosConfig(data))
            .then((res) => {
              return setAllusers(res.data.data.getAllUsers);
            })
            .catch((e) => console.log(e));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <React.Fragment>
      <Head title="All Users" />
      {userRole === "super admin" && (
        <Content page="component">
          <Block size="lg">
            <PreviewCard>
              {allUsers.length > 0 && (
                <ReactDataTable data={allUsers} columns={dataTableColumns} expandableRows pagination actions />
              )}
            </PreviewCard>
          </Block>
        </Content>
      )}
    </React.Fragment>
  );
};
export default AllUsers;
