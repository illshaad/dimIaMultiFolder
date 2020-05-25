import React from "react";
import axios from "axios";

export default class AutoCompletText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggesstions: [],
      text: "",
      data: []
    };
  }

  textChange = e => {
    const value = e.target.value;
    let suggesstions = [];
    if (value.length > 0) {
      const regex = new RegExp(`^\\(${value}`, "i");
      const regex2 = new RegExp(`^\\(.*\\) .*${value}`, "i");
      suggesstions = this.state.data
        .sort()
        .filter(v => regex.test(v) || regex2.test(v));
    }
    this.setState({
      suggesstions,
      text: value
    });
  };

  suggesstionsSelected = value => {
    this.setState({
      text: value,
      suggesstions: []
    });
  };

  componentDidMount = () => {
    axios.post("http://localhost:3001/auto").then(res => {
      console.log(res.data);
      let dataDiag = res.data.diag;
      this.setState({
        data: dataDiag
      });
    });
  };

  renderSuggestions = () => {
    if (this.state.suggesstions.length === 0) {
      return null;
    }
    return (
      <ul>
        {this.state.suggesstions.map(data => (
          <li onClick={() => this.suggesstionsSelected(data)}>{data}</li>
        ))}
      </ul>
    );
  };

  render() {
    const { selectedCheckbox } = this.props;
    return (
      <div className="AutoComplete">
        <input
          value={this.state.text}
          onChange={this.textChange}
          id="formGroupExampleInput"
          placeholder={selectedCheckbox[0].diag}
          type="text"
        />
        {this.renderSuggestions()}
      </div>
    );
  }
}
