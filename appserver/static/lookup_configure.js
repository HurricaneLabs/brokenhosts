require.config({
    paths: {
        "modalModel" : '../app/broken_hosts/components/models/modalModel'
    }
});

require([
    'underscore',
    'backbone',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/searchmanager',
    '../app/broken_hosts/components/ModalView',
    "modalModel",
    'splunkjs/mvc/simplexml/ready!'
], function(_, Backbone, $, mvc, TableView, SearchManager, ModalView, ModalModel) {

    var tokens = mvc.Components.get("submitted");

	var eventBus = _.extend({}, Backbone.Events);
	var lookupTable = mvc.Components.get("lookupTable");
	var lookupSearch = mvc.Components.get("lookupSearch");
	var removeRow = mvc.Components.get("removeRow");
	var addRow = mvc.Components.get("addRow");
	var updateRow = mvc.Components.get("updateRow");
	var model = ModalModel;
	var searches = [];

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

	$(document).find('.dashboard-body').append('<button id="addNewRow" class="btn btn-primary">Add New</button>');

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
            suppressUntil: ""
		});

		var modal = new ModalView({ model : model,
			eventBus : eventBus,
			mode : 'New',
			searches : searches,
			tokens : tokens });

		modal.show();

	});

	/*
	lookupTable.on("click", function(e) {
        e.preventDefault();
		var target = $(e.data)[0]["click.value2"];

		var event = $(e.data)[0];

		model.set({
			_key: event['row.key'],
			comments: event['row.comments'],
			contact: event['row.contact'],
			host: event['row.host'],
			index: event['row.index'],
			lateSecs: event['row.lateSecs'],
			sourcetype: event['row.sourcetype'],
			suppressUntil: event['row.suppressUntil']
		});

		if(target === 'Edit') {

			tokens.set('key_update_tok',$(e.data)[0]['row.key']);
			var modal = new ModalView({ model : model,
				eventBus : eventBus,
				mode : 'Edit',
				searches : searches,
				tokens : tokens });
			modal.show();
		}

		if(target === 'Remove') {
			console.log('REMOVE');
			tokens.set('key_remove_tok', model.get("_key"));
			tokens.set('comments_remove_tok', model.get("comments"));
			tokens.set('contact_remove_tok', model.get("contact"));
			tokens.set('host_remove_tok', model.get("host"));
			tokens.set('index_remove_tok', model.get("index"));
			tokens.set('sourcetype_remove_tok', model.get("sourcetype"));
			tokens.set('lateSecs_remove_tok', model.get("lateSecs"));
			tokens.set('suppress_until_remove_tok', model.get("suppressUntil"));

			eventBus.trigger("remove:row");

			//removeRow.startSearch();
		}

    });

	lookupSearch.on("search:done", function(props) {
		console.log('DONE');
	});

	eventBus.on("add:row", function(e) {
		addRow.startSearch();
	});

	eventBus.on("update:row", function(e) {
		updateRow.startSearch();
	});

	eventBus.on("remove:row", function(e) {
		removeRow.startSearch();
	});

	addRow.on('search:failed', function(properties) {
		console.error("FAILED:", properties);
	});

	addRow.on("search:done", function(props) {
		lookupSearch.startSearch();
	});

	updateRow.on("search:done", function(props) {
		lookupSearch.startSearch();
	});

	removeRow.on("search:done", function(props) {
		lookupSearch.startSearch();
	});

*/

});
//# sourceURL=lookup_configure.js