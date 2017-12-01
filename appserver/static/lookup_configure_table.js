require([
    'underscore',
    'backbone',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc/simplexml/ready!'
], function(_, Backbone, $, mvc, TableView) {

    var lateSecsValue = "";
    var tableElement = mvc.Components.getInstance("lookupTable");
    var now = new Date();

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

});
