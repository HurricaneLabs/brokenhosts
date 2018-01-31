require.config({
    paths: {
        "BHTableView" : '../app/broken_hosts/components/BHTableView',
        "modalModel" : '../app/broken_hosts/components/models/modalModel'
    }
});


require([
    'underscore',
    'backbone',
    'jquery',
    'splunkjs/mvc',
    'BHTableView',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/searchmanager',
    '../app/broken_hosts/components/ModalView',
    "modalModel",
    'splunkjs/mvc/simplexml/ready!'
], function(_, Backbone, $, mvc, BHTableView, TableView, SearchManager, ModalView, ModalModel) {

    var eventBus = _.extend({}, Backbone.Events);

    var expectedTimeSearch = new SearchManager({
        id: "expectedTimeSearch",
        search: "| inputlookup expectedTime\n" +
            "| eval Remove=\"Remove\" | eval key=_key | eval Edit=\"Edit\"\n" +
            "| table * Edit, Remove",
        earliest_time: "-1m",
        latest_time: "now",
        autostart: false
    });

    var expectedTimeBackupSearch = new SearchManager({
        id: "expectedTimeSearch_tmp",
        search: "| inputlookup expectedTime_tmp\n" +
            "| eval Remove=\"Remove\" | eval key=_key | eval Edit=\"Edit\"\n" +
            "| table * Edit, Remove | outputlookup  expectedTime",
        earliest_time: "-1m",
        latest_time: "now",
        autostart: false
    });

	var initialRun = function() {

        expectedTimeSearch.startSearch();

	    //Check if there is data in expectedTime
        expectedTimeSearch.on("search:done", function(state, job) {

            console.log("expectedTimeSearch: ", state);

            //No data? Then pull from _tmp backup KVStore
            if(state.content.resultCount === 0) {

                console.log("expected time results are empty...");
                //no results -- check backup
                checkBackup("expectedTimeSearch_tmp").done(function(results) {

                    var bhTable = new BHTableView({
                        id: "BHTableView",
                        results: results,
                        el: $("#BHTableWrapper"),
                        eventBus: eventBus,
                        restored: true
                    }).render();

                });

            } else {

                //Has results
                getResults("expectedTimeSearch").done(function(results) {

                    var bhTable = new BHTableView({
                        id: "BHTableView",
                        results: results,
                        el: $("#BHTableWrapper"),
                        eventBus: eventBus,
                        restored: false
                    }).render();

                });

            }

        });

    };

	function checkBackup() {
	    var deferred = new $.Deferred();
	    var results = [];

	    expectedTimeBackupSearch.startSearch();

	    expectedTimeBackupSearch.on("search:done", function(state, job) {

	        if(state.content.resultCount === 0) {

	            console.log("backup results are empty...");
	            results = [];
	            deferred.resolve(results);

            } else {

	            console.log("attempting to get backup results...");

	            getResults("expectedTimeSearch_tmp").done(function(results) {

	                console.log("backup results? ", results);
	                deferred.resolve(results);

                });

            }

        });

	    return deferred.promise();

    };

	function getResults(search_name) {
        var deferred = new $.Deferred();

	    if(search_name === "expectedTimeSearch_tmp") {
	        var results = expectedTimeBackupSearch.data("results", { output_mode : "json_rows", count: 0 });
        } else if(search_name === "expectedTimeSearch") {
	        var results = expectedTimeSearch.data("results", { output_mode : "json_rows", count: 0 });
        }

        results.on("data", function() {

            console.log("results? ", results);
            var headers = results.data().fields;
            var rows = results.data().rows;
            var results_obj = [];

            _.each(rows, function(row,key) {

                var row_arr = [];

                _.each(row, function(v,k) {

                    var header = headers[k];
                    var obj = {};

                    if(v === null) {
                        v = "";
                    }

                    row_arr[header] = v;

                });

                results_obj.push(row_arr);

            });

            console.log("getResults results_obj: ", results_obj);
            deferred.resolve(results_obj);

        });

	    return deferred.promise();

    };

    initialRun();

});