import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  Button,
  Row,
  ProjectCard,
  Col,
} from "../../../components/Component";
import axios from "axios";
import { axiosConfig } from "../../../utils/Utils";

const stripePromise = loadStripe("pk_test_vtUu95bAR4Ki4kzmIYBdaC3A00yharGIkO");

const CheckoutForm = ({ email, onPayment }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);

    if (result.error) {
      console.log('line 37',result.error.message);
    } else {
      console.log('line 39',result.token);
      onPayment(5); // Pass the amount you want to charge here
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <div style={{marginTop: 15 + "px" }}></div>
      <Button color="primary" type="submit" size="md" disabled={!stripe}>
        Make Payment
      </Button>
    </form>
  );
};

const ProjectCardPage = () => {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [formData, setFormData] = useState({
    customAmount: "",
  });

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
      .then((response) => setLoggedInEmail(response.data.data.returnToken.email))
      .catch((error) => console.log("line 52", error));
  }, []);

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onPayment = (amount) => {
    const data = JSON.stringify({
      query: `mutation($amount: Int!, $email: String!) {
          capturePayment(amount: $amount, email: $email)
        }`,
      variables: {
        amount,
        email: loggedInEmail,
      },
    });

    axios(axiosConfig(data))
      .then((res) => console.log("this is res", res))
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      <Head title="Pricing Plans"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Pricing Plans</BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row className="g-gs">
            <Col sm="12" lg="6" xxl="6">
              <ProjectCard>
                <div className="project-head">
                  <div className="project-info">
                    <h6 className="title">Recharge for USD 5</h6>
                    <span className="sub-text" style={{marginBottom: 25 + "px" }}>
                      Recharge your balance to USD 5 for generating emails and messages
                   
                      </span>
                      <Elements stripe={stripePromise}>
                        <CheckoutForm email={loggedInEmail} onPayment={onPayment} />
                      </Elements>
                    </div>
                  </div>
                </ProjectCard>
              </Col>
            </Row>
          </Block>
        </Content>
      </React.Fragment>
    );
  };
  export default ProjectCardPage;
  