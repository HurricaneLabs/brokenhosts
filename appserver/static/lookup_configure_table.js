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
            "| table * Edit, Remove",
        earliest_time: "-1m",
        latest_time: "now",
        autostart: false
    });

	var initialRun = function() {

        getResults("expectedTimeSearch").done(function(results, backup_available) {

            new BHTableView({
                id: "BHTableView",
                results: results,
                el: $("#BHTableWrapper"),
                eventBus: eventBus,
                backup_available: backup_available
            }).render();

        });

    };

	function getResults(search_name) {
        var deferred = new $.Deferred();
	    var results_obj = [];
        var backup_available = false;

        expectedTimeSearch.startSearch();

        expectedTimeSearch.on("search:done", function(state, job) {

            if (state.content.resultCount === 0) {
                //check the backup search
                expectedTimeBackupSearch.startSearch();
            } else {
                var results = expectedTimeSearch.data("results", { output_mode : "json_rows", count: 0 });

                results.on("data", function () {

                    var headers = results.data().fields;
                    var rows = results.data().rows;
                    var results_obj = [];

                    _.each(rows, function (row, key) {

                        var row_arr = [];

                        _.each(row, function (v, k) {

                            var header = headers[k];

                            if (v === null) {
                                v = "";
                            }

                            row_arr[header] = v;

                        });

                        results_obj.push(row_arr);

                    });

                    deferred.resolve(results_obj, backup_available);

                });

            }

        });

        expectedTimeBackupSearch.on("search:done", function(state, job) {

            if (state.content.resultCount > 0) {
                backup_available = true;
            }

            deferred.resolve(results_obj, backup_available);

        });

        expectedTimeBackupSearch.on("search:done", function(state, job) {

            if (state.content.resultCount === 0) {
                backup_available = false;
                results_obj = [];
                deferred.resolve(results_obj, backup_available);
            } else {
                backup_available = true;
                results_obj = [];
                deferred.resolve(results_obj, backup_available);
            }

        });

        return deferred.promise();

    }

    initialRun();

});