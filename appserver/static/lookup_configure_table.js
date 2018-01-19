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

    var tokens = mvc.Components.get("submitted");
    var lookupSearch = mvc.Components.get("lookupSearch");
	var updateRow = mvc.Components.get("updateRow");
	var addRow = mvc.Components.get("addRow");
    var now = new Date();
    var eventBus = _.extend({}, Backbone.Events);
	var model = ModalModel;
	var searches = [];
	var childViews = [];
	var new_row = "";

	var sourcetypeInputSearch = new SearchManager({
		id: "sourcetype-input-search",
		search: "| metadata type=sourcetypes index=* | table sourcetype"
	});
	var hostInputSearch = new SearchManager({
		id: "host-input-search",
		search: "| metadata type=hosts index=* | table host"
	});
	var indexInputSearch = new SearchManager({
		id: "index-input-search",
		search: "| tstats count WHERE index=* by index"
	});

	searches.push(sourcetypeInputSearch);
	searches.push(hostInputSearch);
	searches.push(indexInputSearch);

    var expectedTimeSearch = new SearchManager({
        id: "expectedTimeSearch",
        search: "| inputlookup expectedTime\n" +
            "| eval Remove=\"Remove\" | eval key=_key | eval Edit=\"Edit\"\n" +
            "| table * Edit, Remove",
        earliest_time: "-1m",
        latest_time: "now"
    });

    var results = expectedTimeSearch.data("results", { output_mode : "json_rows", count: 0 });

    $(document).find('.dashboard-body .panel-body').prepend('');

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


        var bhTable = new BHTableView({
            id: "BHTableView",
            results: results_obj,
            el: $("#BHTableWrapper"),
            eventBus: eventBus
        }).render();

    });

    $(document).on('click', '#addNewRow', function(e) {

		e.preventDefault();

		model.set({
			_key: "",
            comments: "",
            contact: "",
            host: "",
            index: "",
            lateSecs: "",
            sourcetype: "",
            suppressUntil: "",
            mode: "New"
		});

		var modal = new ModalView({ model : model,
			eventBus : eventBus,
			mode : 'New',
			searches : searches,
			tokens : tokens });

		modal.show();

	});

    eventBus.on("row:edit", function(row_data) {

		console.log("Row data edit: ", row_data);

		model.set({
			_key: row_data[0],
			comments: row_data[1],
			contact: row_data[2],
			host: row_data[3],
			index: row_data[4],
            sourcetype: row_data[5],
			lateSecs: row_data[6],
			suppressUntil: row_data[7],
            mode: "Edit"
		});

		var modal = new ModalView({
            model : model,
			eventBus : eventBus,
			mode : 'Edit',
			searches : searches,
			tokens : tokens
		});

		modal.show();

	});

    eventBus.on("row:update", function(e) {
        console.log("row update");
		updateRow.startSearch();
	});

    eventBus.on("row:new", function(row_data) {
        console.log('new row ', row_data);
        new_row = row_data;
        addRow.startSearch();
    });

	addRow.on("search:done", function(props) {
		//lookupSearch.startSearch();
        //expectedTimeSearch.startSearch();
        //console.log("props: ", props);

        eventBus.trigger("row:update:done", new_row);
	});

	updateRow.on("search:done", function(props) {
		//eventBus.trigger("row:update:done");
        expectedTimeSearch.startSearch();
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