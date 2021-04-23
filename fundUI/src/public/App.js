import React, { Component } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Form, FormControl, Dropdown, ButtonGroup, Button, SplitButton, DropdownButton, InputGroup } from 'react-bootstrap';

import FundDataServiceBroker from './FundDataServiceBroker'
import FundCharts from './FundCharts'
import CockpitPanelModalWindow from './CockpitPanelModalWindow'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { fundCode: "", fundStatisticalPeriod: "", fundDataRange: "", fundData: "", token: "cbabca3e-ca05-4953-bc65-124db8c839dd-woody", recents: [] };

    this.showCockpitPanel = this.showCockpitPanel.bind(this);
    this.saveRecent = this.saveRecent.bind(this);
    this.setFundStatisticalPeriod = this.setFundStatisticalPeriod.bind(this);
    this.setFundDataRange = this.setFundDataRange.bind(this);
    this.setFundCode = this.setFundCode.bind(this);
    this.retrieveFundDetail = this.retrieveFundDetail.bind(this);
  }

  componentDidMount() {
    let fundCode = 161725;
    let fundDataRange = 240;
    let fundStatisticalPeriod = 22;

    FundDataServiceBroker.getFundDetail(
      this.state.token,
      fundCode,
      fundStatisticalPeriod,
      fundDataRange,
      (fundData) => {
        this.setState({ fundCode, fundDataRange, fundStatisticalPeriod, fundData });
      }
    );

    FundDataServiceBroker.getRecents(
      this.state.token,
      (recents) => {
        this.setState({ recents });
      }
    );
  }

  showCockpitPanel() {
    this.setState({ isCockpitPanelShown: true })
  }

  retrieveFundDetail() {
    console.log(["retrieving ...", this.state])
    FundDataServiceBroker.getFundDetail(
      this.state.token,
      this.state.fundCode,
      this.state.fundStatisticalPeriod,
      this.state.fundDataRange,
      (fundData) => {
        this.setState({ fundData });
        FundDataServiceBroker.getRecents(
          this.state.token,
          (recents) => {
            this.setState({ recents });
          }
        );
      }
    )
  }

  saveRecent(fundCode, fundDataRange, fundStatisticalPeriod) {
    this.setState({ fundCode, fundDataRange, fundStatisticalPeriod });
  }

  deleteRecent(fundCode) {
    FundDataServiceBroker.deleteRecent(
      this.state.token,
      fundCode,
      (recents) => {
        this.setState({ recents });
      }
    );
  }

  setFundDataRange(event) {
    console.log(event.target.value)
    this.setState({ fundDataRange: event.target.value });
  }

  setFundStatisticalPeriod(event) {
    console.log(event.target.value)
    this.setState({ fundStatisticalPeriod: event.target.value });
  }

  setFundCode(event) {
    console.log(event.target.value)
    this.setState({ fundCode: event.target.value });
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
                  <Recents recents={this.state.recents} onRencentItemClick={this.saveRecent} onRencentItemDeleteButtonClick={this.deleteRecent} />
                </Nav>
                <Form inline>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>Statistical Period</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl type="text" placeholder="Statistical Period" className="mr-sm-2" value={this.state.fundStatisticalPeriod} onChange={this.setFundStatisticalPeriod} style={{width: 66}} />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>Data Range</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl type="text" placeholder="Data Range" className="mr-sm-2" value={this.state.fundDataRange} onChange={this.setFundDataRange} style={{width: 66}} />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>Fund Code</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl type="text" placeholder="Fund Code" className="mr-sm-2" value={this.state.fundCode} onChange={this.setFundCode} style={{width: 88}} />
                  </InputGroup>

                  <Button variant="primary" onClick={this.retrieveFundDetail}>Search</Button>
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


class Recents extends Component {
  constructor(props) {
    super(props);
    this.applySelectedRecent = this.applySelectedRecent.bind(this);
    this.handleDeletion = this.handleDeletion.bind(this);
  }

  applySelectedRecent(fundCode, specificRecent) {
    console.log(['applySelectedRecent', fundCode, specificRecent])
    this.props.onRencentItemClick(fundCode, specificRecent.fundDataRange, specificRecent.fundStatisticalPeriod)
  }

  handleDeletion(fundCode) {
    console.log(['handleDeletion', fundCode])
    this.props.onRencentItemDeleteButtonClick(fundCode)
  }

  render() {
    console.log(['recents', this.props.recents])
    const recentItemList = Object.keys(this.props.recents).map((fundCode) =>
      <NavDropdown.Item onClick={(e) => this.applySelectedRecent(fundCode, this.props.recents[fundCode])} href="" key={fundCode}>
        <Button variant="outline-danger" onClick={(e) => { e.preventDefault(); this.handleDeletion(fundCode); }}>&#10007;</Button>
        {' '}
        {fundCode} - {this.props.recents[fundCode].name}
      </NavDropdown.Item>
    );
    return (
      <NavDropdown title="Recent" id="basic-nav-dropdown">{recentItemList}</NavDropdown>
    )
  }
}
export default App;

// https://react-bootstrap.github.io/
// https://recharts.org/en-US
// https://reactjs.org/docs/hello-world.html
