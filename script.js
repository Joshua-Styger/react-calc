const buttonTypes = {
  CLEAR_ALL: "clear-all",
  CLEAR_ENTRY: "clear-entry",
  EQUALS: "equals",
  DIGIT: "digit",
  OP: "op"
};
const MAX_ENTRY_LENGTH = 19;
const MAX_DISPLAY_LENGTH = 10;
math.config({
  number: "BigNumber",
  precision: 32
});

const formatNumberString = (numString, maxLength = math.config.precision) => {
  if (numString.length <= maxLength) {
    return numString;
  } else {
    if (numString.includes("e")) {
      let numberParts = numString.split("e");
      return numberParts[0].slice(0, maxLength - numberParts[1].length - 1) + "E" + numberParts[1];
    } else {
      return numString.slice(0, maxLength);
    }
  }
};

const solveEquation = expression => {
  let result = math.evaluate(expression);
  return math.format(result, {
    upperExp: 10
  });
};

const states = {
  INIT: "init",
  NUM_ACC: "number accumulation",
  NUM_ACC_DEC: "number accumulation after decimal",
  OP_ENTRY: "op entry",
  EQUALS_STATE: "equals state",
  OVERFLOW: "overflow"
};
let buttonData = [{
  id: "clear",
  display: "C",
  span: 2,
  actionPayload: ["clear-all", null],
  style: "special-button"
}, {
  id: "clear-entry",
  display: "CE",
  actionPayload: ["clear-entry", null],
  style: "special-button"
}, {
  id: "divide",
  display: "/",
  actionPayload: ["op-entry", "/"],
  keycode: 111,
  style: "op-button"
}, {
  id: "seven",
  display: "7",
  actionPayload: ["number-entry", "7"],
  keycode: 103,
  style: "numeric-button"
}, {
  id: "eight",
  display: "8",
  actionPayload: ["number-entry", "8"],
  keycode: 104,
  style: "numeric-button"
}, {
  id: "nine",
  display: "9",
  actionPayload: ["number-entry", "9"],
  keycode: 105,
  style: "numeric-button"
}, {
  id: "multiply",
  display: "*",
  actionPayload: ["op-entry", "*"],
  keycode: 106,
  style: "op-button"
}, {
  id: "four",
  display: "4",
  actionPayload: ["number-entry", "4"],
  keycode: 100,
  style: "numeric-button"
}, {
  id: "five",
  display: "5",
  actionPayload: ["number-entry", "5"],
  keycode: 101,
  style: "numeric-button"
}, {
  id: "six",
  display: "6",
  actionPayload: ["number-entry", "6"],
  keycode: 102,
  style: "numeric-button"
}, {
  id: "subtract",
  display: "-",
  actionPayload: ["op-entry", "-"],
  keycode: 109,
  style: "op-button"
}, {
  id: "one",
  display: "1",
  actionPayload: ["number-entry", "1"],
  keycode: 97,
  style: "numeric-button"
}, {
  id: "two",
  display: "2",
  actionPayload: ["number-entry", "2"],
  keycode: 98,
  style: "numeric-button"
}, {
  id: "three",
  display: "3",
  actionPayload: ["number-entry", "3"],
  keycode: 99,
  style: "numeric-button"
}, {
  id: "add",
  display: "+",
  actionPayload: ["op-entry", "+"],
  keycode: 107,
  style: "op-button"
}, {
  id: "negate",
  display: "⁺⁄₋",
  actionPayload: ["negate", null],
  style: "numeric-button"
}, {
  id: "zero",
  display: "0",
  actionPayload: ["number-entry", "0"],
  keycode: 96,
  style: "numeric-button"
}, {
  id: "decimal",
  display: ".",
  actionPayload: ["decimal-entry", "."],
  keycode: 110,
  style: "numeric-button"
}, {
  id: "equals",
  display: "=",
  actionPayload: ["solve", null],
  keycode: 13,
  style: "op-button"
}];

function createButtons(buttonHandler) {
  return buttonData.map(x => /*#__PURE__*/React.createElement("button", {
    id: x.id,
    key: x.id,
    className: (x.span == 2 ? "doubleButton" : "singleButton") + " " + x.style,
    value: x.display,
    "data-keycode": x.keycode,
    onClick: () => buttonHandler(...x.actionPayload)
  }, x.display));
}

class ButtonArea extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
    document.addEventListener("keyup", this.releaseKey);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
    document.removeEventListener("keyup", this.releaseKey);
  }

  handleKeyPress(e) {
    let button = $('[data-keycode="' + e.keyCode + '"]');

    if (button.length > 0) {
      e.preventDefault();
      button.click();
      button.addClass("active-button");
    } else {}
  }

  releaseKey(e) {
    let button = $('[data-keycode="' + e.keyCode + '"]');

    if (button) {
      button.removeClass("active-button");
    }
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "button-area"
    }, " ", createButtons(this.props.buttonHandler), " ");
  }

}

const LCD_Display = props => {
  return /*#__PURE__*/React.createElement("div", {
    className: "lcd-display",
    id: "display"
  }, /*#__PURE__*/React.createElement("div", {
    className: "formula-area"
  }, /*#__PURE__*/React.createElement(Formula, {
    formula: props.formula
  })), /*#__PURE__*/React.createElement("p", {
    className: "entry"
  }, " ", props.entry, " "));
};

const Formula = props => {
  return /*#__PURE__*/React.createElement("div", {
    className: "formula"
  }, /*#__PURE__*/React.createElement("p", null, props.formula));
};

function Decorations() {
  return /*#__PURE__*/React.createElement("div", {
    className: "decals"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "logo"
  }, "SquidgeTech"), /*#__PURE__*/React.createElement("div", {
    className: "solar-charger"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "model"
  }, "GS-C01"), /*#__PURE__*/React.createElement("p", {
    className: "detail"
  }, "REACT POWER")));
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formula: [],
      entry: "0",
      result: "0",
      lastAction: ""
    };
    this.handleButtonPress = this.handleButtonPress.bind(this);
  }

  handleButtonPress(actionType, data) {
    let newStateObject = {};
    let currentEntry = this.state.entry;

    switch (actionType) {
      case "number-entry":
        currentEntry = this.state.entry;

        if (this.state.lastAction == "op-entry") {
          newStateObject.entry = "0";
          currentEntry = "0";
        }

        if (this.state.lastAction == "solve") {
          newStateObject.formula = [];
          newStateObject.entry = "0";
          currentEntry = "0";
        }

        if (data == "0" && currentEntry == "0") {} else if (currentEntry.length < MAX_ENTRY_LENGTH) {
          newStateObject.entry = (currentEntry == "0" ? "" : currentEntry) + data;
        }

        break;

      case "negate":
        currentEntry = this.state.entry;
        if (currentEntry != "0") newStateObject.entry = currentEntry[0] == "-" ? currentEntry.slice(1) : "-" + this.state.entry;else return;

        if (this.state.lastAction == "solve") {
          newStateObject.formula = [];
        }

        break;

      case "op-entry":
        let lastAction = this.state.lastAction;
        let currentFormula = this.state.formula;
        if (lastAction == "op-entry") newStateObject.formula = [...currentFormula.slice(0, -1), data];else {
          newStateObject.formula = [...(lastAction == "solve" ? [] : currentFormula), this.state.entry, data];
        }
        break;

      case "decimal-entry":
        if (!this.state.entry.includes(".")) {
          this.handleButtonPress("number-entry", data);
        } else {}

        return;

      case "solve":
        let formula;

        if (this.state.lastAction == "solve") {
          formula = this.state.formula.length == 2 ? [this.state.entry] : [this.state.entry, ...this.state.formula.slice(-3, -1)];
        } else {
          formula = [...this.state.formula, this.state.entry];
        }

        let result = solveEquation(formula.join(""));
        newStateObject.entry = result;
        newStateObject.formula = [...formula, "="];
        break;

      case "clear-all":
        newStateObject = this.getInitialState();
        break;

      case "clear-entry":
        newStateObject = this.getInitialEntry();
        break;

      default:
        return;
    }

    newStateObject.lastAction = actionType;
    this.setState(newStateObject);
  }

  getInitialState() {
    return {
      formula: [],
      entry: "0",
      result: "0",
      lastAction: ""
    };
  }

  getInitialEntry() {
    return {
      entry: "0"
    };
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "calculator-frame"
    }, /*#__PURE__*/React.createElement("div", {
      className: "calculator-container"
    }, /*#__PURE__*/React.createElement(Decorations, null), /*#__PURE__*/React.createElement(LCD_Display, {
      entry: formatNumberString(this.state.entry, MAX_ENTRY_LENGTH + (this.state.entry[0] == "-" ? 1 : 0)),
      formula: this.state.formula.map((x, index) => index % 2 == 0 ? formatNumberString(x, MAX_ENTRY_LENGTH) : x).join(" ")
    }), /*#__PURE__*/React.createElement(ButtonArea, {
      buttonHandler: this.handleButtonPress
    })), /*#__PURE__*/React.createElement("p", {
      className: "about"
    }, "Designed and coded by ", /*#__PURE__*/React.createElement("span", {
      className: "purple-text"
    }, "Joshua Styger")));
  }

}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("root"));
