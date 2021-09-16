function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * This is an example using pure React, with no JSX
 * If you would like to use JSX, you will need to use Babel to transpile your code
 * from JSK to JS. You will also need to use a task runner/module bundler to
 * help build your app before it can be used in the browser.
 * Some task runners/module bundlers are : gulp, grunt, webpack, and Parcel
 */
import * as Setup from "./setup_page.js";
import * as Validation from "./validation.js";

require.config({
  paths: {
    React: "../app/" + app_name + "/javascript/vendor/React.production.min"
  },
  scriptType: "module"
});

define(["React", "splunkjs/splunk"], function (React, splunk_js_sdk) {
  var e = React.createElement;

  var SetupPage = /*#__PURE__*/function (_React$Component) {
    _inherits(SetupPage, _React$Component);

    var _super = _createSuper(SetupPage);

    function SetupPage(props) {
      var _this;

      _classCallCheck(this, SetupPage);

      _this = _super.call(this, props);
      _this.state = {
        loading: true,
        is_configured: 0,
        successfullyUpdated: null,
        form: {
          comments_must_have_ticket_number: false,
          validation: {
            comments_must_have_ticket_number: {
              non_boolean: false
            }
          }
        }
      };
      _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
      _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
      _this.toggleChange = _this.toggleChange.bind(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(SetupPage, [{
      key: "handleChange",
      value: function handleChange(event) {
        var newState = Object.assign({}, this.state);
        newState.form[event.target.name] = event.target.value;
        this.setState(newState);
      }
    }, {
      key: "toggleChange",
      value: function toggleChange(event) {
        var newState = Object.assign({}, this.state);
        newState.form[event.target.name] = !this.state.form.comments_must_have_ticket_number;
        this.setState(newState);
      }
    }, {
      key: "handleSubmit",
      value: function () {
        var _handleSubmit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
          var _this2 = this;

          var validation_check, newState, response;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  event.preventDefault();
                  _context.next = 3;
                  return Validation.check(this.state);

                case 3:
                  validation_check = _context.sent;

                  if (!validation_check.errors) {
                    _context.next = 9;
                    break;
                  }

                  newState = Object.assign({}, validation_check.original);
                  this.setState(newState);
                  _context.next = 13;
                  break;

                case 9:
                  _context.next = 11;
                  return Setup.perform(splunk_js_sdk, this.state.form);

                case 11:
                  response = _context.sent;

                  if (response === 'success') {
                    this.setState(function (prevState) {
                      return _objectSpread(_objectSpread({}, prevState), {}, {
                        is_configured: 1,
                        successfullyUpdated: true,
                        form: _objectSpread(_objectSpread({}, prevState.form), {}, {
                          token: ''
                        })
                      });
                    });
                    setTimeout(function () {
                      _this2.setState({
                        successfullyUpdated: null
                      });
                    }, 3500);
                  } else if (response === 'error') {
                    this.setState({
                      successfullyUpdated: false
                    });
                  }

                case 13:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function handleSubmit(_x) {
          return _handleSubmit.apply(this, arguments);
        }

        return handleSubmit;
      }()
    }, {
      key: "componentWillMount",
      value: function () {
        var _componentWillMount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          var _this3 = this;

          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return Setup.get_initial_state(splunk_js_sdk).then(function (data) {
                    _this3.setState(function (prevState) {
                      return _objectSpread(_objectSpread({}, prevState), {}, {
                        loading: false,
                        is_configured: data.is_configured,
                        form: _objectSpread(_objectSpread({}, prevState.form), {}, {
                          comments_must_have_ticket_number: data.comments_must_have_ticket_number
                        })
                      });
                    });
                  });

                case 2:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function componentWillMount() {
          return _componentWillMount.apply(this, arguments);
        }

        return componentWillMount;
      }()
    }, {
      key: "render",
      value: function render() {
        var isLoading = this.state.loading;
        var view;

        if (isLoading) {
          view = /*#__PURE__*/React.createElement("p", null, "Loading...");
        } else {
          view = /*#__PURE__*/React.createElement("div", null, this.state.successfullyUpdated ? /*#__PURE__*/React.createElement("div", {
            className: "success"
          }, /*#__PURE__*/React.createElement("p", null, "Successfully Updated")) : this.state.successfullyUpdated === false ? /*#__PURE__*/React.createElement("div", {
            className: "error"
          }, /*#__PURE__*/React.createElement("p", null, "Could not save.", /*#__PURE__*/React.createElement("br", null), "An error occurred.")) : '', this.state.is_configured == 1 ? /*#__PURE__*/React.createElement("div", {
            className: "grey"
          }, /*#__PURE__*/React.createElement("p", null, "This app is configured.")) : /*#__PURE__*/React.createElement("div", {
            className: "warn"
          }, /*#__PURE__*/React.createElement("p", null, "This app is not currently configured. Click the 'Save Configuration' button below to configure.")), /*#__PURE__*/React.createElement("h2", null, "Optional Configuration"), /*#__PURE__*/React.createElement("form", {
            onSubmit: this.handleSubmit
          }, /*#__PURE__*/React.createElement("div", {
            className: "control-group"
          }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("input", {
            className: "checkbox",
            type: "checkbox",
            checked: this.state.form.comments_must_have_ticket_number,
            defaultValue: this.state.form.comments_must_have_ticket_number,
            name: "comments_must_have_ticket_number",
            onChange: this.toggleChange
          }), /*#__PURE__*/React.createElement("strong", null, " Comments Must Have Ticket Number"), this.state.form.validation.comments_must_have_ticket_number.non_boolean ? /*#__PURE__*/React.createElement("p", {
            className: "input-error"
          }, "Value must be true or false.") : '', /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("small", {
            className: "help"
          }, "When creating and updating comments associated with a specific host on the 'Configure Broken Hosts Lookup' page, you may want to require users to include a ticket number associated with any changes. Check the above if you do.")))), /*#__PURE__*/React.createElement("button", {
            type: "submit",
            className: "btn btn-primary"
          }, "Save Configuration")), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Other Optional Configuration Options"), /*#__PURE__*/React.createElement("p", null, "Broken Hosts ships with multiple macros for further configuration of the app. ", /*#__PURE__*/React.createElement("a", {
            target: "_blank",
            href: "/manager/broken_hosts/data/macros?ns=broken_hosts&pwnr=-&app_only=1&search=&count=25"
          }, "View Macros")), /*#__PURE__*/React.createElement("p", null, "The following are descriptions for the available macros:", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("h3", null, "bh_stats_gen_constraints"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("small", {
            className: "help"
          }, "The ", /*#__PURE__*/React.createElement("pre", null, "bh_stats_gen_constraints"), " macro is used to control what data is examined by the ", /*#__PURE__*/React.createElement("pre", null, "bh_stats_gen"), " search when generating the metrics used by the alerting searches. The default behavior is to exclude all data in the ", /*#__PURE__*/React.createElement("pre", null, "summary"), " index, and all data from the ", /*#__PURE__*/React.createElement("pre", null, "stash"), " sourcetype, but include all other data.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "NOTE:"), " This macro is used within a ", /*#__PURE__*/React.createElement("pre", null, "tstats"), " command, and therefore the macro\u2019s must be valid ", /*#__PURE__*/React.createElement("pre", null, "tstats"), " syntax."))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("h3", null, "bh_stats_gen_additions"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("small", {
            className: "help"
          }, "The ", /*#__PURE__*/React.createElement("pre", null, "bh_stats_gen_additions"), " macro is used to insert arbitrary SPL into the ", /*#__PURE__*/React.createElement("pre", null, "bh_stats_gen"), " search in order to transform data before it is written to the summary index.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Example:"), " Use ", /*#__PURE__*/React.createElement("pre", null, "eventstats"), " and ", /*#__PURE__*/React.createElement("pre", null, "eval"), " statements to calculate custom metrics to be stored in the summary data."))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("h3", null, "bh_alert_additions"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("small", {
            className: "help"
          }, "The ", /*#__PURE__*/React.createElement("pre", null, "bh_alert_additions"), " macro is used to insert arbitrary SPL into the alerting searches, in order to transform data before it is written to the summary index.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Example:"), " Apply subsearch logic from a monitoring system to automatically exclude hosts that are known to be offline."))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("h3", null, "default_contact"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("small", {
            className: "help"
          }, "The ", /*#__PURE__*/React.createElement("pre", null, "default_contact"), " macro is used only for the ", /*#__PURE__*/React.createElement("pre", null, "Broken Hosts Alert - by contact"), " search. It is used to set the default email address for items that don\u2019t have a separate contact listed in the contact column of the lookup table."))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("h3", null, "default_expected_time"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("small", {
            className: "help"
          }, "The ", /*#__PURE__*/React.createElement("pre", null, "default_expected_time"), " macro is used to set a default ", /*#__PURE__*/React.createElement("pre", null, "lateSecs"), " value for things not defined in the lookup. The ", /*#__PURE__*/React.createElement("pre", null, "lateSecs"), " value tells Broken Hosts how long a specific source of data is allowed to go without sending data before an alert should be triggered. This setting is in seconds, and defaults to 14400 (4 hours).")))))));
        }

        return view;
      }
    }]);

    return SetupPage;
  }(React.Component);

  return e(SetupPage);
});