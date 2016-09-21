require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, TableView) {
     // Row Coloring Example with custom, client-side range interpretation

    var CriticalEventRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            // Enable this custom cell renderer for both the active_hist_searches and the active_realtime_searches field
            return _(['Minutes Since Last Event']).contains(cell.field);
        },
        render: function($td, cell) {

            var value = cell.value;

            if (value >= 120 && value < 240) {
                $td.addClass('range-cell').addClass('range-med');
            }
            if (value >= 240) {
                $td.addClass('range-cell').addClass('range-high');
            }

            $td.text(value);

        }
    });

    mvc.Components.get('eventHosts').getVisualization(function(tableView) {
        tableView.table.addCellRenderer(new CriticalEventRenderer());
        tableView.table.render();
    });

    mvc.Components.get('infosecCritical').getVisualization(function(tableView) {
        tableView.table.addCellRenderer(new CriticalEventRenderer());
        tableView.table.render();
    });


    //Hiding Sources Functionality

    var eventSourcesSearch = mvc.Components.get("eventHostsSearch");
    var infosecCriticalSearch = mvc.Components.get("infosecCriticalSearch");
    var populateLookupSearch = mvc.Components.get("populateLookup");

    if(populateLookupSearch != null) {
        populateLookupSearch.on("search:done", function(props) {

            eventSourcesSearch.startSearch();
            infosecCriticalSearch.startSearch();

        });
    }

});
