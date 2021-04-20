import React, { Component } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Form, FormControl, Button } from 'react-bootstrap';

import FundDataServiceBroker from './FundDataServiceBroker'
import FundCharts from './FundCharts'
import CockpitPanelModalWindow from './CockpitPanelModalWindow'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { fundCode: "", fundData: "", fundDataSize: "" };

    this.showCockpitPanel = this.showCockpitPanel.bind(this);
    this.retrieveFundDetail = this.retrieveFundDetail.bind(this);
    this.setFundCode = this.setFundCode.bind(this);
    this.setFundDataSize = this.setFundDataSize.bind(this);
  }

  componentDidMount() {
    let fundCode = 161725;
    let fundDataSize = 240;
    FundDataServiceBroker.getFundDetail(
      fundCode,
      fundDataSize,
      (fundData) => {
        console.log(['test', fundData]);
        this.setState({ fundCode, fundData, fundDataSize });
      }
    );
  }

  showCockpitPanel() {
    this.setState({ isCockpitPanelShown: true })
  }

  retrieveFundDetail() {
    console.log(['FundDataServiceBroker', FundDataServiceBroker])
    FundDataServiceBroker.getFundDetail(
      this.state.fundCode,
      this.state.fundDataSize,
      (v) => {
        console.log(['test', v]);
        this.setState({ fundData: v })
      })
  }

  setFundCode(event) {
    console.log(event.target.value)
    this.setState({ fundCode: event.target.value });
  }

  setFundDataSize(event) {
    console.log(event.target.value)
    this.setState({ fundDataSize: event.target.value });
  }

  render() {
    return (
      <Container fluid={true} className="Container">
        <Row>
          <Col>
            <Navbar bg="light" expand={true}>
              <Navbar.Brand href="#home">Your Fund Assistor</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link href="#home" onSelect={this.showCockpitPanel}>Cockpit</Nav.Link>
                  <Nav.Link href="#link">Settings</Nav.Link>
                  <NavDropdown title="Recent" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                <Form inline>
                  <FormControl type="text" placeholder="Data Size" className="mr-sm-2" value={this.state.fundDataSize} onChange={this.setFundDataSize} />
                  <FormControl type="text" placeholder="Search" className="mr-sm-2" value={this.state.fundCode} onChange={this.setFundCode} />
                  <Button variant="outline-primary" onClick={this.retrieveFundDetail}>Search</Button>
                </Form>
              </Navbar.Collapse>
            </Navbar>
          </Col>
        </Row>

        <Row>
          <Col>
            <CockpitPanelModalWindow isCockpitPanelShown={this.state.isCockpitPanelShown} />
          </Col>
        </Row>

        <Row>
          <Col>
            <FundCharts fundData={this.state.fundData} />
          </Col>
        </Row>
      </Container>
    );
  }
}


export default App;



// https://react-bootstrap.github.io/
// https://recharts.org/en-US
// https://reactjs.org/docs/hello-world.html

