import React, { useState } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
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

const ProjectCardPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    lead: "",
    tasks: 0,
    team: [],
    totalTask: 0,
    date: new Date(),
  });

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            <Col sm="6" lg="3" xxl="3">
              <ProjectCard>
                <div className="project-head">
                  <div className="project-info">
                    <h6 className="title">USD 5</h6>
                    <span className="sub-text">Recharge your balance to USD 5 for generating emails and messages</span>
                    <Button color="primary" type="submit" size="md">Make Payment</Button>
                  </div>
                </div>
              </ProjectCard>
            </Col>
            <Col sm="6" lg="3" xxl="3">
              <ProjectCard>
                <div className="project-head">
                  <div className="project-info">
                    <h6 className="title">USD 10</h6>
                    <span className="sub-text">Recharge your balance to USD 10 for generating emails and messages</span>
                    <Button color="primary" type="submit" size="md">Make Payment</Button>
                  </div>
                </div>
              </ProjectCard>
            </Col>
            <Col sm="6" lg="3" xxl="3">
              <ProjectCard>
                <div className="project-head">
                  <div className="project-info">
                    <h6 className="title">USD 15</h6>
                    <span className="sub-text">Recharge your balance to USD 15 for generating emails and messages</span>
                    <Button color="primary" type="submit" size="md">Make Payment</Button>
                  </div>
                </div>
              </ProjectCard>
            </Col>
            <Col sm="6" lg="3" xxl="3">
              <ProjectCard>
                <div className="project-head">
                  <div className="project-info">
                    <h6 className="title">Recharge Custom Amount</h6>
                    <span className="sub-text">Minimum Amount USD 5</span>
                    <input type="text" className="form-control" placeholder="20"/>
                    <Button color="primary" type="submit" size="md">Make Payment</Button>
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
