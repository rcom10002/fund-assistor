import React, { Component } from 'react';
import { LineChart, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, Bar, Area, ReferenceLine } from 'recharts';
import { Container, Row, Col } from 'react-bootstrap';

class RechartsDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(['RechartsBar', this.props.fundData])

    let chartData = this.props.fundData
    let potentialSaleDays = []

    if (chartData) {
      chartData.forEach(e => {
        if (e['PERIODICAL_1W_JZZZL'] > 0 && e['PERIODICAL_3W_JZZZL'] > 10 && (e['PERIODICAL_3W_JZZZL'] - e['PERIODICAL_1W_JZZZL'] > 5) &&
          e['PERIODICAL_3W_JZZZL'] > e['PERIODICAL_2W_JZZZL'] && e['PERIODICAL_2W_JZZZL'] > e['PERIODICAL_1W_JZZZL']) {
          potentialSaleDays.push(e['FSRQ']);
        }
      });

      potentialSaleDays = potentialSaleDays.map((saleDay) =>
        <ReferenceLine x={saleDay} stroke="red" strokeDasharray="1" key={saleDay} />
      );
    }
    return (
      <Container fluid={true}>
        <Row>
          <Col>
            <ResponsiveContainer width="100%" height={500}>
              <ComposedChart data={this.props.fundData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                width={500}
                height={300}>
                <CartesianGrid strokeDasharray="3" />
                <XAxis dataKey="FSRQ" reversed={true} angle={90} height={100} interval={5} tickSize={50}/>
                <YAxis type="number" scale="linear" domain={[dataMin => (dataMin * 0.99).toFixed(3), dataMax => (dataMax * 1.01).toFixed(3)]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="PERIODICAL_MAX_LJJZ" stroke="red" r={2} />
                <Line type="monotone" dataKey="LJJZ" stroke="blue" r={2} />
                <Line type="monotone" dataKey="PERIODICAL_MIN_LJJZ" stroke="green" r={2} />
              </ComposedChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={500}>
              <ComposedChart data={this.props.fundData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                width={500}
                height={300}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="FSRQ" reversed={true} angle={90} height={100} interval={5} tickSize={50}/>
                <YAxis
                  type="number"
                  tickCount={10}
                  scale="linear"
                  domain={[dataMin => (dataMin * 0.99).toFixed(3), dataMax => (dataMax * 1.01).toFixed(3)]}
                  tickFormatter={(value, index) => `${(value - 0).toFixed(2)}%`}
                />
                <Tooltip />
                <Legend />
                {potentialSaleDays}
                <Area type="monotone" dataKey="PERIODICAL_1W_JZZZL" stroke="DarkSlateBlue" />
                <Area type="monotone" dataKey="PERIODICAL_2W_JZZZL" stroke="MediumPurple" />
                <Area type="monotone" dataKey="PERIODICAL_3W_JZZZL" stroke="Violet" />
              </ComposedChart>
            </ResponsiveContainer>

            <RechartsBar data={this.props.fundData} dataKey="JZZZL_BUCKET_RANK" colorName="Orange" />

            <RechartsBar data={this.props.fundData} dataKey="PERIODICAL_1W_JZZZL" colorName="DarkSlateBlue" />
            <RechartsBar data={this.props.fundData} dataKey="PERIODICAL_2W_JZZZL" colorName="MediumPurple" />
            <RechartsBar data={this.props.fundData} dataKey="PERIODICAL_3W_JZZZL" colorName="Violet" />
          </Col>
        </Row>
      </Container>
    );
  }
}



class RechartsBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    return (
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart data={this.props.data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="FSRQ" reversed={true} angle={90} height={100} interval={5} tickSize={50}/>
          <YAxis
            type="number"
            scale="linear"
            domain={[dataMin => (dataMin * 0.99).toFixed(3), dataMax => (dataMax * 1.01).toFixed(3)]}
            tickFormatter={(value, index) => `${(value - 0).toFixed(2)}%`}
          />
          <ReferenceLine y={this.props.data && this.props.data[0][this.props.dataKey]} stroke="red" strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar type="monotone" dataKey={this.props.dataKey} stroke="none" fill={this.props.colorName || "Tomato"} />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}

export default RechartsDemo;
