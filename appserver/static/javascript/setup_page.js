"use strict";

var app_name = "./broken_hosts";

require.config({
    paths: {
        // $SPLUNK_HOME/etc/apps/SPLUNK_APP_NAME/appserver/static/javascript/views/setup_page_example
        myApp: "../app/" + app_name + "/javascript/views/app",
        // React v16.13.1
        react: "../app/" + app_name + "/javascript/vendor/react.production.min",
        ReactDOM: "../app/" + app_name + "/javascript/vendor/react-dom.production.min",
    },
    scriptType: "module",
});

require([
    // Splunk Web Framework Provided files
    // Custom files
    "react", // this needs to be lowercase because ReactDOM refers to it as lowercase
    "ReactDOM",
    "myApp",
], function(react, ReactDOM, myApp) {
    ReactDOM.render(myApp, document.getElementById('setupView'));
});
