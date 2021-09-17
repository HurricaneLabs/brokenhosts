import * as Setup from "./setup_page.js";
import * as Validation from "./validation.js";
import "../../components/lib/regenerator-runtime/runtime.js";

require.config({
  paths: {
      React: "../app/" + app_name + "/javascript/vendor/React.production.min",
  },
  scriptType: "module",
});

 define(["React", "splunkjs/splunk"], function(React, splunk_js_sdk){
   const e = React.createElement;
 
   class SetupPage extends React.Component {
     constructor(props) {
       super(props);
 
       this.state = {
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
 
       this.handleChange = this.handleChange.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
       this.toggleChange = this.toggleChange.bind(this);
     }
     
     handleChange(event) {
       const newState = Object.assign({}, this.state);
       newState.form[event.target.name] = event.target.value;
       this.setState(newState);
     }

     toggleChange(event) {
        const newState = Object.assign({}, this.state);
        newState.form[event.target.name] = !this.state.form.comments_must_have_ticket_number;
        this.setState(newState);
    }
 
     async handleSubmit(event) {
       event.preventDefault();
       
       let validation_check = await Validation.check(this.state);

      if (validation_check.errors) {
        const newState = Object.assign({}, validation_check.original);
        this.setState(newState);
      } else {
        let response = await Setup.perform(splunk_js_sdk, this.state.form);
        if (response === 'success') {
          this.setState(prevState => ({
            ...prevState,
            is_configured: 1,
            successfullyUpdated: true,
            form: {
              ...prevState.form,
              token: ''
            },
          }));

          setTimeout(() => {
            this.setState({
              successfullyUpdated: null
            });
          }, 3500)

        } else if (response === 'error') {
          this.setState({
            successfullyUpdated: false
          });
        }
      }
      
     }
 
     async componentWillMount() {

      await Setup.get_initial_state(splunk_js_sdk).then(data => {

        this.setState(prevState => ({
          ...prevState,
          loading: false,
          is_configured: data.is_configured,
          form: {
            ...prevState.form,
            comments_must_have_ticket_number: data.comments_must_have_ticket_number
          }
        }));

      });

     }
 
     render() {

      const isLoading = this.state.loading;
      let view;

      if (isLoading) {
        view = <p>Loading...</p>
      } else {
        view =            
        <div>
          { this.state.successfullyUpdated ? 
            <div className="success"><p>Successfully Updated</p></div> : 
            this.state.successfullyUpdated === false ? 
            <div className="error"><p>Could not save.<br/>An error occurred.</p></div> : '' }
            {  this.state.is_configured == 1 ? 
              <div className="grey"><p>This app is configured.</p></div> : 
              <div className="warn"><p>This app is not currently configured.</p></div>
            }
          <h2>Optional Configuration</h2>
          <form onSubmit={this.handleSubmit}> 
            <div className="control-group">
                <label>
                <input className="checkbox"
                  type="checkbox" 
                  checked={this.state.form.comments_must_have_ticket_number} 
                  defaultValue={this.state.form.comments_must_have_ticket_number} 
                  name="comments_must_have_ticket_number" 
                  onChange={this.toggleChange}></input>
                  <strong> Comments Must Have Ticket Number</strong>
                { this.state.form.validation.comments_must_have_ticket_number.non_boolean ? <p className="input-error">Value must be true or false.</p> : '' }
                <p><small className="help">When creating and updating comments associated with a specific host on the 'Configure Broken Hosts Lookup' page,
                  you may want to require users to include a ticket number associated with any changes. Check the above if you do.</small></p>
                </label>
            </div>
            <button type="submit" className="btn btn-primary">
              Save Configuration
            </button>
        </form>
        <hr></hr>
           <div>
             <h2>Other Optional Configuration Options</h2>
             <p>Broken Hosts ships with multiple macros for further configuration of the app. <a target="_blank" href="/manager/launcher/admin/macros?ns=broken_hosts&pwnr=-&app_only=1&search=&count=25">
               View Macros
               </a></p>
             <p>
               The following are descriptions for the available macros:
                <ul>
                  <li>
                    <h3>bh_stats_gen_constraints</h3>

                    <p><small className="help">The <pre>bh_stats_gen_constraints</pre> macro is used to control what data is examined by the <pre>bh_stats_gen</pre> search when generating the metrics used by the alerting searches. The default behavior is to exclude all data in the <pre>summary</pre> index, and all data from the <pre>stash</pre> sourcetype, but include all other data.
                    <br/>
                    <strong>NOTE:</strong> This macro is used within a <pre>tstats</pre> command, and therefore the macro’s must be valid <pre>tstats</pre> syntax.
                    </small></p>
                  </li>
                  <li>
                    <h3>bh_stats_gen_additions</h3>
                    <p><small className="help">The <pre>bh_stats_gen_additions</pre> macro is used to insert arbitrary SPL into the <pre>bh_stats_gen</pre> search in order to transform data before it is written to the summary index.
                    <br/>
                    <strong>Example:</strong> use <pre>eventstats</pre> and <pre>eval</pre> statements to calculate custom metrics to be stored in the summary data.</small></p>
                  </li>
                  <li>
                    <h3>bh_alert_additions</h3>
                    <p><small className="help">The <pre>bh_alert_additions</pre> macro is used to insert arbitrary SPL into the alerting searches, in order to transform data before it is written to the summary index.
                    <br/>
                    <strong>Example:</strong> Apply subsearch logic from a monitoring system to automatically exclude hosts that are known to be offline.</small></p>
                  </li>
                  <li>
                    <h3>default_contact</h3>

                    <p><small className="help">The <pre>default_contact</pre> macro is used only for the <pre>Broken Hosts Alert - by contact</pre> search. It is used to set the default email address for items that don’t have a separate contact listed in the contact column of the lookup table.</small></p>
                  </li>
                  <li>
                    <h3>default_expected_time</h3>

                    <p><small className="help">The <pre>default_expected_time</pre> macro is used to set a default <pre>lateSecs</pre> value for things not defined in the lookup. The <pre>lateSecs</pre> value tells Broken Hosts how long a specific source of data is allowed to go without sending data before an alert should be triggered. This setting is in seconds, and defaults to 14400 (4 hours).</small></p>
                  </li>
                </ul>
             </p>
           </div>
        </div>
      }

      return (
        view
      );

     }
   }
 
   return e(SetupPage);
 });
 