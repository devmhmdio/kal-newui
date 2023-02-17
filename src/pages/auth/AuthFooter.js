import React from "react";
import { Row, Col } from "../../components/Component";

const AuthFooter = () => {
  return (
    <div className="nk-footer nk-auth-footer-full">
      <div className="container wide-lg">
        <Row className="g-3">
          <Col lg="12">
            <div className="nk-block-content text-center text-lg-start">
              <p className="text-soft">&copy; 2023 BYI. All Rights Reserved.</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default AuthFooter;
