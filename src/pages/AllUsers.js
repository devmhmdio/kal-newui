import React, { useState, useEffect } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import { Block, Button, PreviewCard, ReactDataTable } from "../components/Component";
// import { dataTableColumns } from "./components/table/TableData";
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
        const loggedInUserId = response.data.data.returnToken.userId;
        const loggedInUserEmail = response.data.data.returnToken.email;
        const loggedInUserCompany = response.data.data.returnToken.company;
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
          },
        });
        axios(axiosConfig(getUserRole))
          .then((res) => setUserRole(res.data.data.findByUserId.data.role))
          .catch(() => "Unauthorised access");

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
                        balance
                    }
                }`,
          variables: {
            id: loggedInUserId,
            regex: loggedInUserCompany,
          },
        });
        axios(axiosConfig(data))
          .then((res) => {
            console.log(res.data.data.getAllUsers);
            setAllusers(res.data.data.getAllUsers);
          })
          .catch((e) => console.log(e));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = (email) => {
    console.log('this is id', email)
    const deleteQuery = JSON.stringify({
      query: `mutation($email: String) {
          deleteUser(email: $email) {
              status {
                code
                header
                description
                moreInfo
              }
          }
      }`,
      variables: {
        email,
      },
    });
    axios(axiosConfig(deleteQuery))
      .then((response) => {
        console.log(response.data.data.deleteUser.status.header);
        // If successful, remove the user from the local state so the UI updates
        // if (response.data.data.deleteUser && response.data.data.deleteUser.status.header === 'SUCCESS') {
        //   setAllusers(allUsers.filter(user => user.email !== email));
        // }
        alert('User deleted successfully');
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const dataTableColumns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      hide: 370,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
      hide: "sm",
    },
    {
      name: "Company",
      selector: (row) => row.company,
      sortable: true,
      hide: "sm",
    },
    {
      name: "Position",
      selector: (row) => row.position,
      sortable: true,
      hide: "sm",
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      hide: "sm",
    },
    {
      name: "Balance",
      selector: (row) => row.balance,
      sortable: true,
      hide: "sm",
    },
    {
      name: "Start Date",
      selector: ({ createdAt }) => createdAt.split("T").slice(0, 1),
      sortable: true,
      hide: "md",
    },
    {
      name: "Actions",
      selector: (row) => <Button color="danger" size="sm" onClick={() => handleDelete(row.email)}>Delete</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <React.Fragment>
      <Head title="All Users" />
      {(userRole === "company admin" || userRole === "super admin") && (
        <Content page="component">
          <Block>
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
