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

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ email, onPayment, customAmount }) => {
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
      console.log("line 37", result.error.message);
    } else {
      console.log("line 39", result.token);
      onPayment(customAmount); // Pass the custom amount
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <div style={{ marginTop: 15 + "px" }}></div>
      <Button color="primary" type="submit" size="md" disabled={!stripe}>
        Make Payment
      </Button>
    </form>
  );
};

const ProjectCardPage = () => {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [loggedInRole, setLoggedInRole] = useState("");
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
      .then((response) => {
        setLoggedInEmail(response.data.data.returnToken.email);
        setLoggedInRole(response.data.data.returnToken.role);
      })
      .catch((error) => console.log("line 52", error));
  }, []);

  // OnChange function to get the input data
  const onInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setFormData({ ...formData, [e.target.name]: value });
    } else {
      setFormData({ ...formData, [e.target.name]: '' });
    }
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
      .then((res) => {
        console.log(res.data.data.capturePayment.message);
        alert(res.data.data.capturePayment.message);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  if (loggedInRole !== "company admin") {
    return (
      <React.Fragment>
        <Head title="Unauthorized"></Head>
        <Content>
          <h3>Please ask your company admin to make payment.</h3>
        </Content>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Head title="Pricing Plans"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Pricing Plans</BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row className="g-gs">
            <Col sm="12" lg="6" xxl="6">
              <ProjectCard>
                <div className="project-head">
                  <div className="project-info">
                    <h6 className="title">Recharge Custom Amount</h6>
                    <span className="sub-text" style={{ marginBottom: 25 + "px" }}>
                      Enter the custom amount you want to recharge (Minimum USD 10)<br/>$0.05 per email and $0.025 per SMS. 
                    </span>
                    <input
                      type="number"
                      id="customAmount"
                      name="customAmount"
                      className="form-control"
                      placeholder="20"
                      onChange={onInputChange}
                      min="10"
                    />
                    <div style={{ marginTop: 15 + "px" }}></div>
                    <Elements stripe={stripePromise}>
                      <CheckoutForm
                        email={loggedInEmail}
                        onPayment={onPayment}
                        customAmount={formData.customAmount}
                      />
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
