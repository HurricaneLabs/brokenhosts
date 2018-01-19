require.config({
    paths: {
        "datatables.net": "../app/broken_hosts/components/lib/DataTables/DataTables-1.10.16/js/jquery.dataTables.min",
        datatables: "../app/broken_hosts/components/lib/DataTables/DataTables-1.10.16/js/jquery.dataTables",
        bootstrapDataTables: "../app/broken_hosts/components/lib/DataTables/DataTables-1.10.16/js/dataTables.bootstrap",
        rowreorders: "../app/broken_hosts/components/lib/DataTables/RowReorder-1.2.3/js/dataTables.rowReorder",
        clipboard : "../app/broken_hosts/components/lib/clipboard/clipboard.min",
        text: "../app/broken_hosts/components/lib/text",
        'BHTableTemplate' : '../app/broken_hosts/components/templates/BHTableTemplate.html',
    },
    shim: {
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
    "clipboard",
    "text!BHTableTemplate",
    "splunkjs/mvc/searchmanager",
    "splunkjs/mvc/dropdownview",
    "splunkjs/mvc/timerangeview"
    ], function(_, Backbone, $, mvc, dataTable, rowReorder, Clipboard, BHTableTemplate, SearchManager, DropdownView, TimeRangeView) {

        var BHTableView = Backbone.View.extend({
    
            initialize: function(options) {
                this.options = options;
                this.options = _.extend({}, this.defaults, this.options);
                this.mode = options.mode;
                this.model = options.model;
                this.tokens = options.tokens;
				this.eventBus = this.options.eventBus;
				this.childViews = [];
				this.sourcetypeDropdown = "";
                this.data_table = null;
                this.results = this.options.results;
                this.eventBus.on("row:update:done", this.getUpdatedData, this);
                //_.bindAll(this, "changed");
            },

            events: {
                'click .edit' : 'editRow',
                'click .remove' : 'removeRow',
                'click .clipboard' : 'copyRow'
            },

            editRow: function(e) {

                var row_data = this.data_table.row( $(e.target).parents('tr') ).data();
                this.eventBus.trigger("row:edit", row_data);

            },

            copyRow: function(e) {

                new Clipboard('.clipboard', {
                    text: function(trigger) {

                        var comments, contact, host, index, sourcetype, lateSecs, suppressUntil = "";

                        $(trigger).parents('tr').each(function(i, el) {

                            var td = $(this).find('td');
                            comments = td.eq(1).text();
                            contact = td.eq(2).text();
                            host = td.eq(3).text();
                            index = td.eq(4).text();
                            sourcetype = td.eq(5).text();
                            lateSecs = td.eq(6).text();
                            suppressUntil = td.eq(7).text();

                        });

                        var final_output = "Comments: " + comments + "\n" +
                            "Contact: " + contact + "\n" + "Host: " + host + "\n" + "Index: " + index + "\n" +
                            "Sourcetype: " + sourcetype + "\n" + "Late Seconds: " + lateSecs + "\n" +
                            "Suppress Until: " + suppressUntil;

                        return final_output;

                    }
                });

            },

            removeRow: function(e) {
                console.log("e ", e);
                console.log("e.parent", $(e.currentTarget).parents('tr'));

                this.data_table.row($(e.currentTarget).parents('tr')).remove().draw();

                this.processDataForUpdate();

            },

            reDraw: function(data) {

                var that = this;
                this.results = data;

                setTimeout(function() {
                    that.renderList(false);
                }.bind(this), 100);

                return;
            },

            getUpdatedData: function(data) {

                var service = mvc.createService({ owner: "nobody" });
                var that = this;
                var auth = "";
                //var done = false;
                //var res = "";


                service.get('storage/collections/data/expectedTime', auth, function(err,res) {

                    if(err) {
                        console.log("Error getting KVStore data: ", err);
                        return;
                    }

                    var cleaned_data = [];

                    function fix_key(key) {
                        console.log("the key is: ", key);
                        return key.replace(/^_key/, "key"); }

                    _.each(res.data, function(row_obj, row_k) {
                        var row =
                        _.object(
                            _.map(_.keys(row_obj), fix_key),
                            _.values(row_obj)
                        );

                        row['Edit'] = 'Edit';
                        row['Remove'] = 'Remove';

                        cleaned_data.push(row);

                    });


                     console.log("Success getting KVStore data: ",cleaned_data);

                     that.reDraw(cleaned_data);

                });

            },


            renderList: function(retain_datatables_state) {

                var bh_template = $('#bhTable-template', this.$el).text();
                var that = this;

                if(this.results === null) {
                    return;
                }

                console.log('this.results', this.results);

                $("#bh-content", this.$el).html(_.template(bh_template, {
                    suppressions: this.results
                }));

                this.data_table = $('#bhTable', this.$el).DataTable( {
                    rowReorder: {
                        selector: 'td:first-child',
                    },
                    select: true,
                    ordering: false,
                    "iDisplayLength" : 10,
                    "bLengthChange" : false,
                    "searching" : true,
                    "bFilter" : false,
                    "pagingType" : "simple_numbers",
                    "language" : { search: "" },
                    //"oLanguage": { "sSearch": "" },
                    "aLengthMenu" : [[5,10,15,-1], [5,10,15,"All"]],
                    //"ordering" : false,
                    "fnStateLoadParams": function (oSettings, oData) {
                        return retain_datatables_state;
                    }
                });

                $('div.dataTables_filter input').addClass('search-query');
                $('div.dataTables_filter input[type="search"]').attr('placeholder', 'Filter');



                this.data_table.on('row-reorder', function (e, details, changes) {

                    that.data_table.draw();

                    that.processDataForUpdate();

                });

            },

            processDataForUpdate: function() {

                var that = this;

                setTimeout(function() {
                    var headers_data = that.data_table.columns().header();
                    var updatedData = that.data_table.rows({order: 'applied'}).data();
                    var headers = [];
                    var mappedHeaders = [
                        {header: "Key", mapped: "_key"},
                        {header: "Comments", mapped: "comments"},
                        {header: "Contact", mapped: "contact"},
                        {header: "Host", mapped: "host"},
                        {header: "Index", mapped: "index"},
                        {header: "Sourcetype", mapped: "sourcetype"},
                        {header: "Late Seconds", mapped: "lateSecs"},
                        {header: "Suppress Until", mapped: "suppressUntil"}
                    ];
                    //var updatedData = that.data_table.columns().data(0);

                    _.each(headers_data, function (header, k) {

                        var header_val = header.innerText;

                        _.each(mappedHeaders, function (mapping, k) {

                            if (header_val === mapping['header']) {

                                var mapped_val = mapping["mapped"];

                                headers.push(mapped_val);

                            }

                        });

                    });

                    console.log('updatedData ', updatedData);
                    console.log('headers ', headers);
                    that.mapData(updatedData, headers);

                }, 1000);

            },


            mapData: function(updatedData, headers) {

                var results = [];

                _.each(updatedData, function(row, row_k) {

                   var row_arr = [];
                   var row_obj = {};

                   _.each(row, function(col, col_k) {

                       if(headers[col_k]) {

                           console.log('column header: ', headers[col_k]);

                           var header = headers[col_k];

                           row_obj[header] = col;

                           //row_arr.push(row_obj);

                           console.log("row_obj ", row_obj);
                       }

                   });

                   results.push(row_obj);

                });

                console.log('Final results: ', JSON.stringify(results));

                var data = JSON.stringify(results);

                this.updateKVStore(data);

            },

            updateKVStore: function(data) {

                var rand = Math.random();
                var service = mvc.createService({ owner: "nobody" });

                var emptyExpectedTime = new SearchManager({
                    id: "emptyExpectedTime"+rand,
                    earliest_time: "-1m",
                    latest_time: "now",
                    preview: true,
                    cache: false,
                    search: "| outputlookup expectedTime"
                });

                emptyExpectedTime.on("search:done", function() {
                    service.request(
                    "storage/collections/data/expectedTime/batch_save",
                    "POST",
                    null,
                    null,
                    data,
                    {"Content-Type": "application/json"}, null)
                    .done(function() {

                    });
                });

            },

            render: function() {

                var retain_datatables_state = (typeof retain_datatables_state === "undefined") ? false : true;

                this.$el.html(BHTableTemplate);

                this.renderList(retain_datatables_state);

                return this;

            }

        });
        
        return BHTableView;

});