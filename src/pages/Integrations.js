import React, { useState, useEffect } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Papa from 'papaparse';
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  PreviewCard,
} from "../components/Component";
import { Col, Row, Input } from "reactstrap";

const Integrations = () => {
  
  return (
    <React.Fragment>
      <Head title="Form Upload"></Head>
      <Content page="component">
        <BlockHead size="lg" wide="sm">
          <BlockHeadContent>
            
            <BlockTitle tag="h2" className="fw-normal">
              Coming Soon, Stay Tuned!!
            </BlockTitle>
          </BlockHeadContent>
        </BlockHead>
      </Content>
    </React.Fragment>
  );
};

export default Integrations;
