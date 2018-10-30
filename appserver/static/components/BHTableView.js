require.config({
    paths: {
        "datatables.net": "../app/broken_hosts/components/lib/DataTables/DataTables-1.10.16/js/jquery.dataTables.min",
        datatables: "../app/broken_hosts/components/lib/DataTables/DataTables-1.10.16/js/jquery.dataTables",
        bootstrapDataTables: "../app/broken_hosts/components/lib/DataTables/DataTables-1.10.16/js/dataTables.bootstrap",
        rowreorders: "../app/broken_hosts/components/lib/DataTables/RowReorder-1.2.3/js/dataTables.rowReorder",
        selects: "../app/broken_hosts/components/lib/DataTables/Select-1.2.4/js/dataTables.select.min",
        clipboard: "../app/broken_hosts/components/lib/clipboard/clipboard.min",
        text: "../app/broken_hosts/components/lib/text",
        'BHTableTemplate': '../app/broken_hosts/components/templates/bhTableTemplate.html',
        "modalModel": '../app/broken_hosts/components/models/modalModel'

    },
    shim: {
        'datatables.net': {
            deps: ['datatables']
        },
        'bootstrapDataTables': {
            deps: ['datatables']
        }
    }
});

define([
    "underscore",
    "backbone",
    "jquery",
    "splunkjs/mvc",
    "datatables",
    "rowreorders",
    "selects",
    "clipboard",
    "text!BHTableTemplate",
    '../app/broken_hosts/components/ModalView',
    "modalModel",
    "splunkjs/mvc/searchmanager",
    "bootstrap.dropdown",
], function (_, Backbone, $, mvc, dataTable, rowReorder, selects, Clipboard,
             BHTableTemplate, ModalView, ModalModel, SearchManager) {

    var BHTableView = Backbone.View.extend({

        initialize: function (options) {
            this.options = options;
            this.options = _.extend({}, this.defaults, this.options);
            this.mode = options.mode;
            this.model = options.model;
            this.tokens = options.tokens;
            this.eventBus = this.options.eventBus;
            this.childComponents = [];
            this.sourcetypeDropdown = "";
            this.data_table = null;
            this.current_row = "";
            //this.initial_load = this.options.initial_load;
            this.results = this.options.results;
            //this.restored = this.options.restored; //restored from backup?
            this.backup_available = this.options.backup_available;
            this.updating = false;
            this.per_page = 50;
            this.modal = null;
            this.modalModel = ModalModel;
            this.updateRow = mvc.Components.get("updateRow");
            this.addRow = "";
            this.tokens = mvc.Components.get("submitted");
            this.eventBus.on("row:update:done", this.getUpdatedData, this);
            //this.eventBus.on("populated:kvstore", this.renderList, this);
            this.eventBus.on("row:edit", this.showEditModal, this);
            this.eventBus.on("row:update", this.runUpdateSearch, this); //triggered from modal view
            this.eventBus.on("row:new", this.runAddNewSearch, this); //triggered from modal view

            this.on("updating", this.updateStatus, this);
            this.searches = [];
            var indexInputSearch = new SearchManager({
                id: "index-input-search",
                search: "| tstats count WHERE index=* by index"
            });
            var sourcetypeInputSearch = new SearchManager({
                id: "sourcetype-input-search",
                search: "| metadata type=sourcetypes index=* | table sourcetype"
            });
            var hostInputSearch = new SearchManager({
                id: "host-input-search",
                search: "| metadata type=hosts index=* | table host"
            });

            this.searches.push(indexInputSearch);
            this.searches.push(sourcetypeInputSearch);
            this.searches.push(hostInputSearch);
            //_.bindAll(this, "changed");
        },

        events: {
            'click .edit': 'editRow',
            'click .remove': 'removeRow',
            'click .clipboard': 'copyRow',
            'click .per-page': 'pageCountChanged',
            'click #populateDefault': 'populateTable',
            'click #populateBackup': 'populateFromBackup',
            'click #addNewRow': 'addNewRow'
        },

        updateStatus: function (updating) {
            var that = this;
            this.updating = updating;
            if (this.updating === true) {
                that.data_table.rowReorder.disable();
                $(".updating").fadeIn();
                $("#addNewRow").prop("disabled", true);
                $(".pageDropDown").addClass("disabled");
                $(".dataTables_paginate a").addClass("disabled");
                that.data_table.rows().every(function (rowIdx, tableLoop, rowLoop) {
                    var rowNode = this.node();
                    $(rowNode).find("td").each(function () {
                        $(this).addClass("disabled");
                    });
                    $(rowNode).find("td > a").each(function () {
                        $(this).addClass("disabled");
                    });
                });

            } else {
                that.data_table.rowReorder.enable();
                $(".updating").fadeOut();
                $("#addNewRow").prop("disabled", false);
                $(".pageDropDown").removeClass("disabled");
                $(".dataTables_paginate a").removeClass("disabled");
                that.data_table.rows().every(function (rowIdx, tableLoop, rowLoop) {
                    var rowNode = this.node();
                    $(rowNode).find("td").each(function () {
                        $(this).removeClass("disabled");
                    });
                    $(rowNode).find("td > a").each(function () {
                        $(this).removeClass("disabled");
                    });
                });
            }

        },

        editRow: function (e) {

            e.preventDefault();
            this.current_row = this.data_table.row($(e.target).parents('tr'));
            var current_row_data = this.current_row.data();
            this.eventBus.trigger("row:edit", current_row_data);

        },

        addNewRow: function () {

            var that = this;

            this.unsetModal();

            this.modalModel.set({
                _key: "",
                comments: "",
                contact: "",
                index: "",
                sourcetype: "",
                host: "",
                lateSecs: "",
                suppressUntil: "",
                mode: "New"
            });

            this.modal = new ModalView({
                model: that.modalModel,
                eventBus: that.eventBus,
                mode: 'New',
                searches: that.searches,
                tokens: that.tokens
            });

            this.childComponents.push(this.modal);

            this.modal.show();

        },

        showEditModal: function (row_data) {

            //this.unsetModal();

            var that = this;

            this.modalModel.set({
                _key: row_data[0],
                comments: row_data[1],
                contact: row_data[2],
                index: row_data[3],
                sourcetype: row_data[4],
                host: row_data[5],
                lateSecs: row_data[6],
                suppressUntil: row_data[7],
                mode: "Edit"
            });

            this.modal = new ModalView({
                model: that.modalModel,
                eventBus: that.eventBus,
                mode: 'Edit',
                searches: that.searches,
                tokens: that.tokens
            });

            this.childComponents.push(this.modal);

            this.modal.show();

        },

        runAddNewSearch: function (row_data) {

            this.trigger("updating", true);

            var that = this;

            //this.addRow = mvc.Components.get("addRow");

            this.addRow = new SearchManager({
                id: "addRow",
                autostart: false,
                search: "| inputlookup  expectedTime | eval key=_key" +
                    "      | append [| stats count" +
                    "      | eval index=lower(\"" + this.tokens.get("index_add_tok") + "\")" +
                    "      | eval sourcetype=lower(\"" + this.tokens.get("sourcetype_add_tok") + "\")" +
                    "      | eval host=lower(\"" + this.tokens.get("host_add_tok") + "\")" +
                    "      | eval lateSecs=\"" + this.tokens.get("late_secs_add_tok") + "\"" +
                    "      | eval suppressUntil=\"" + this.tokens.get("suppress_until_add_tok") + "\"" +
                    "      | eval contact=\"" + this.tokens.get("contact_add_tok") + "\"" +
                    "      | eval comments=\"" + this.tokens.get("comments_add_tok") + "\"]" +
                    "      | table key,index,sourcetype,host,lateSecs,suppressUntil,contact,comments | outputlookup expectedTime"
            });

            //Run addRow search created in dashboard simple XML
            this.addRow.startSearch();

            this.addRow.on("search:done", function () {

                var service = mvc.createService({owner: "nobody"});
                var auth = "";

                //Get all updated KVStore data
                service.get('/servicesNS/nobody/broken_hosts/storage/collections/data/expectedTime',
                    auth, function (err, res) {

                        if (err) {
                            return;
                        }

                        var cleaned_data = [];

                        function fix_key(key) {
                            return key.replace(/^_key/, "key");
                        }

                        _.each(res.data, function (row_obj, row_k) {

                            var row = _.object(
                                _.map(_.keys(row_obj), fix_key),
                                _.values(row_obj)
                            );

                            cleaned_data.push(row);

                        });

                        var new_row_idx = cleaned_data.length - 1;
                        var new_row_data = cleaned_data[cleaned_data.length - 1];

                        //Add new row content
                        var new_row = that.data_table.row.add([
                            new_row_data["key"],
                            new_row_data["comments"],
                            new_row_data["contact"],
                            new_row_data["index"],
                            new_row_data["sourcetype"],
                            new_row_data["host"],
                            new_row_data["lateSecs"],
                            new_row_data["suppressUntil"],
                            "<a class=\"edit\" href=\"#\">Edit</a>",
                            "<a class=\"remove\" href=\"#\">Remove</a>",
                            "<a class=\"clipboard\" data-clipboard-target=\"#row-" + new_row_idx + "\" href=\"#\">Copy</a>"
                        ]).draw(false).node();

                        var arr = [];
                        that.results = arr.push(that.data_table.rows().data());
                        if (that.data_table.rows().count() === 1) {
                            $("#emptyKVNotice").fadeOut();
                            $("#backupNotice").fadeOut();
                        }
                        that.trigger("updating", false);
                        that.processDataForUpdate();

                    });

            });

        },

        runUpdateSearch: function (row_data) {
            var that = this;

            that.trigger("updating", true);

            this.updateRow.startSearch();

            var temp = this.current_row.data();

            temp[1] = row_data["comments"];
            temp[2] = row_data["contact"];
            temp[3] = row_data["index"];
            temp[4] = row_data["sourcetype"];
            temp[5] = row_data["host"];
            temp[6] = row_data["lateSecs"];
            temp[7] = row_data["suppressUntil"];

            this.current_row.data(temp).invalidate();

            this.updateRow.on("search:done", function () {
                that.trigger("updating", false);
            });

        },

        copyRow: function (e) {

            new Clipboard('.clipboard', {
                text: function (trigger) {

                    var comments, contact, index, sourcetype, host, lateSecs, suppressUntil = "";

                    $(trigger).parents('tr').each(function (i, el) {

                        var td = $(this).find('td');
                        comments = td.eq(0).text();
                        contact = td.eq(1).text();
                        index = td.eq(2).text();
                        sourcetype = td.eq(3).text();
                        host = td.eq(4).text();
                        lateSecs = td.eq(5).text();
                        suppressUntil = td.eq(6).text();

                    });

                    var final_output = "Comments: " + comments + "\n" +
                        "Contact: " + contact + "\n" + "\n" + "Index: " + index + "\n" + "Sourcetype: " + sourcetype +
                        "Host: " + host + "\n" + "Late Seconds: " + lateSecs + "\n" + "Suppress Until: " + suppressUntil;

                    return final_output;

                }
            });

        },

        pageCountChanged: function (e) {

            var per_page = $(e.currentTarget).data('page-count');
            this.per_page = parseInt(per_page);
            $(".pageDropDown").html(per_page + " per page <span class=\"caret\"></span>");
            this.data_table.page.len(this.per_page).draw();

        },

        removeRow: function (e) {

            var service = mvc.createService({owner: "nobody"});
            this.trigger("updating", true);
            var that = this;
            var _key = this.data_table.row($(e.currentTarget).parents('tr')).data()[0];
            this.data_table.row($(e.currentTarget).parents('tr')).remove().draw(false);

            //this.processDataForUpdate();
            service.request(
                "/servicesNS/nobody/broken_hosts/storage/collections/data/expectedTime/" + _key,
                "DELETE",
                null,
                null,
                null,
                {"Content-Type": "application/json"}, null)
                .done(function () {
                    that.trigger("updating", false);
                    that.data_table.rowReorder.enable();
                    //splunkjs.mvc.Components.revokeInstance("addRow");
                });

        },

        reDraw: function (data) {

            var that = this;
            this.results = data;

            setTimeout(function () {
                that.renderList(true);
            }.bind(this), 100);

            return;
        },

        getUpdatedData: function () {

            var service = mvc.createService({owner: "nobody"});
            var that = this;
            var auth = "";
            //var done = false;
            //var res = "";


            service.get('/servicesNS/nobody/broken_hosts/storage/collections/data/expectedTime', auth,
                function (err, res) {

                    if (err) {
                        return;
                    }

                    var cleaned_data = [];

                    function fix_key(key) {
                        return key.replace(/^_key/, "key");
                    }

                    _.each(res.data, function (row_obj, row_k) {
                        var row = _.object(
                            _.map(_.keys(row_obj), fix_key),
                            _.values(row_obj)
                        );

                        row['Edit'] = 'Edit';
                        row['Remove'] = 'Remove';

                        cleaned_data.push(row);

                    });

                    that.reDraw(cleaned_data);

                });

        },

        renderList: function (retain_datatables_state) {

            var bh_template = $('#bhTable-template', this.$el).text();
            var that = this;

            if (this.results === null) {
                return;
            }

            $("#bh-content", this.$el).html(_.template(bh_template, {
                suppressions: this.results,
                per_page: this.per_page,
                restored: this.restored,
                backup_available: this.backup_available
            }));

            this.data_table = $('#bhTable', this.$el).DataTable({
                rowReorder: true,
                columnDefs: [
                    {
                        "targets": [0],
                        "visible": false
                    },
                    {
                        "targets": [1],
                        "className": "reorder"
                    }
                ],
                ordering: true,
                "iDisplayLength": this.per_page,
                "bLengthChange": false,
                "searching": true,
                "bFilter": false,
                "stateSave": true,
                "pagingType": "simple_numbers",
                "language": {search: ""},
                //"oLanguage": { "sSearch": "" },
                "aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
                //"ordering" : false,
                "fnStateLoadParams": function (oSettings, oData) {
                    return retain_datatables_state;
                }
            });

            $('div.dataTables_filter input').addClass('search-query');
            $('div.dataTables_filter input[type="search"]').attr('placeholder', 'Filter');

            this.data_table.on('row-reorder', function (e, details, changes) {

                that.trigger("updating", true);

                that.processDataForUpdate();

            });

        },

        populateFromBackup: function () {

            var service = mvc.createService({owner: "nobody"});
            var that = this;

            $("#populateDefault").text("Populating...");

            var backupSearch = new SearchManager({
                id: "backupSearch",
                search: "| inputlookup expectedTime_tmp\n" +
                    "| eval Remove=\"Remove\" | eval key=_key | eval Edit=\"Edit\"\n" +
                    "| table * Edit, Remove | outputlookup expectedTime",
                earliest_time: "-1m",
                latest_time: "now",
                autostart: false
            });

            backupSearch.startSearch();

            backupSearch.on("search:done", function (props) {
                that.backup_available = false;
                splunkjs.mvc.Components.revokeInstance("backupSearch");
                that.getUpdatedData();
            });

        },

        populateTable: function () {

            var service = mvc.createService({owner: "nobody"});
            var that = this;

            $("#populateDefault").text("Populating...");

            service.request(
                "/servicesNS/nobody/broken_hosts/bhosts/bhosts_setup/setup",
                "POST",
                null,
                null,
                null,
                {"Content-Type": "application/json"}, null)
                .done(function (response) {

                    //that.results = null;

                    that.getUpdatedData();

                });

        },

        processDataForUpdate: function () {

            var that = this;

            setTimeout(function () {
                var headers_data = that.data_table.columns().header();
                var updatedData = that.data_table.rows({order: 'applied'}).data();
                var headers = [];
                var mappedHeaders = [
                    {header: "Key", mapped: "_key"},
                    {header: "Comments", mapped: "comments"},
                    {header: "Contact", mapped: "contact"},
                    {header: "Index", mapped: "index"},
                    {header: "Sourcetype", mapped: "sourcetype"},
                    {header: "Host", mapped: "host"},
                    {header: "Late Seconds", mapped: "lateSecs"},
                    {header: "Suppress Until", mapped: "suppressUntil"}
                ];
                //var updatedData = that.data_table.columns().data(0);

                _.each(headers_data, function (header, k) {

                    var header_val = header.innerText;

                    _.each(mappedHeaders, function (mapping, k) {

                        console.log('mapping header ', mapping['header']);

                        headers.push(mapping['mapped']);

                    });

                });

                that.mapData(updatedData, _.uniq(headers));

            }, 1000);

        },

        mapData: function (updatedData, headers) {

            var results = [];

            _.each(updatedData, function (row, row_k) {

                var row_arr = [];
                var row_obj = {};

                _.each(row, function (col, col_k) {

                    if (headers[col_k]) {

                        var header = headers[col_k];

                        row_obj[header] = col;

                    }

                });

                results.push(row_obj);

            });

            var data = JSON.stringify(results);

            this.updateKVStore(data);

        },

        updateKVStore: function (data) {

            console.log('updateKVStore ', data);

            var that = this;
            var rand = Math.random();
            var service = mvc.createService({owner: "nobody"});

            //Back it up
            var backupExpectedTime = new SearchManager({
                id: "backupExpectedTime" + rand,
                earliest_time: "-1m",
                latest_time: "now",
                preview: true,
                cache: false,
                search: "| inputlookup expectedTime | outputlookup expectedTime_tmp"
            });

            var emptyExpectedTime = new SearchManager({
                id: "emptyExpectedTime" + rand,
                earliest_time: "-1m",
                latest_time: "now",
                preview: true,
                cache: false,
                autostart: false,
                search: "| outputlookup expectedTime"
            });

            console.log('DIRT DOG');

            //once backup is complete, empty out the kvstore
            backupExpectedTime.on("search:done", function (prop) {
                console.log('backupExpectedTime finished! ', prop);
                emptyExpectedTime.startSearch()
            });

            backupExpectedTime.on("search:failed", function (prop) {
                console.log('backupExpectedTime error: ', prop);
            });

            backupExpectedTime.on("search:progress", function (prop) {
                console.log('backupExpectedTime progress: ', prop);
            });

            emptyExpectedTime.on("search:done", function () {
                console.log('emtpyExpectedTime is done ', data);

                service.request(
                    "/servicesNS/nobody/broken_hosts/storage/collections/data/expectedTime/batch_save",
                    "POST",
                    null,
                    null,
                    data,
                    {"Content-Type": "application/json"}, function(err, response) {
                        if(err) {
                            console.err('error updating expectedTime: ', err);
                        } else {
                            console.log('updated expectedTime: ', response);
                            that.data_table.rowReorder.enable();
                            splunkjs.mvc.Components.revokeInstance("addRow");
                        }
                    }).done(function() {
                        that.trigger("updating", false);
                });
            });


        },

        render: function () {

            var that = this;

            var retain_datatables_state = (typeof retain_datatables_state === "undefined") ? false : true;

            this.$el.html(BHTableTemplate);

            this.renderList(retain_datatables_state);

            if (this.restored) {
                setTimeout(function () {
                    $(".restored").fadeOut();
                    that.restored = false;
                }, 4000);
            }

            return this;

        },

        unsetModal: function () {
            _.each(this.childComponents, function (c) {

                c.unbind();
                c.remove();
            });


        }

    });

    return BHTableView;

});
