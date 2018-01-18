require.config({
    paths: {
        "BHTableView" : '../app/broken_hosts/components/BHTableView'
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
    'splunkjs/mvc/simplexml/ready!'
], function(_, Backbone, $, mvc, BHTableView, TableView, SearchManager) {

    var lateSecsValue = "";
    //var tableElement = mvc.Components.getInstance("lookupTable");
    var now = new Date();

    var expectedTimeSearch = new SearchManager({
        id: "expectedTimeSearch",
        search: "| inputlookup expectedTime\n" +
            "| eval Remove=\"Remove\" | eval key=_key | eval Edit=\"Edit\"\n" +
            "| table * Edit, Remove",
        earliest_time: "-1m",
        latest_time: "now"
    });

    var results = expectedTimeSearch.data("results", { output_mode : "json_rows", count: 0 });

    results.on("data", function() {

        var headers = results.data().fields;
        var rows = results.data().rows;
        var results_obj = [];

        console.log("Headers: ", headers);
        console.log("Rows: ", rows);

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


        new BHTableView({
            id: "BHTableView",
            results: results_obj,
            el: $("#BHTableWrapper")
        }).render();

    });

    /*
    var StatusRenderer = TableView.BaseCellRenderer.extend({

        canRender: function(cell) {
            // Enable this custom cell renderer for both the active_hist_searches and the active_realtime_searches field
            return _(['lateSecs', 'suppressUntil', ]).contains(cell.field);
        },
        render: function($td, cell) {
            // Add a class to the cell based on the returned value
            // Apply interpretation for number of realtime searches
            var value = cell.value;
            var field = cell.field;

            if (field === "lateSecs" && parseInt(value) > 0) {
                console.log("lateSecs is greater than 0");
            } else if (field === "lateSecs" && parseInt(value) === 0) {

                value = "Always Suppress";

                lateSecsValue = value;

            }
            if (field === 'suppressUntil') {

                var suppressUntilDate = new Date(value);

                if (parseInt(value) === 0) {

                    value = "No Suppression";

                } else if (lateSecsValue === "Always Suppress") {

                    $td.addClass('range-cell').addClass('status-warning');

                }

                if (value !== "No Suppression" && suppressUntilDate < now) {
                    $td.addClass('range-cell').addClass('status-past');
                }

                lateSecsValue = "";


            }

            $td.text(value).addClass('numeric');

        }

    });

    tableElement.getVisualization(function(tableView) {
        tableView.on('rendered', function() {
            tableView.$el.find('td.range-cell').each(function() {
                $(this).parents('tr').addClass(this.className);
            });

            tableView.addCellRenderer(new StatusRenderer());

        });

    });
    */

});