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
        "mainModel": '../app/broken_hosts/components/models/mainModel',
        "modalModel": '../app/broken_hosts/components/models/modalModel',
        "bootstrap-dropdown": "../app/broken_hosts/components/lib/bootstrap/bootstrap-dropdown"

    },
    shim: {
        'datatables.net': {
            deps: ['datatables']
        },
        'bootstrapDataTables': {
            deps: ['datatables']
        },
        'bootstrap-dropdown': {
            deps: ['jquery']
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
    "bootstrap-dropdown",
], function (_, Backbone, $, mvc, _dataTable, _rowReorder, _selects, Clipboard,
             BHTableTemplate, ModalView, ModalModel) {

    return Backbone.View.extend({

        initialize: function (options) {
            this.options = options;
            this.options = _.extend({}, this.defaults, this.options);
            this.mode = options.mode;
            this.tokens = options.tokens;
            this.eventBus = this.options.eventBus;
            this.pageScrollPos = 0;
            this.childComponents = [];
            this.indexInputSearch = {};
            this.sourcetypeInputSearch = {};
            this.hostInputSearch = {};
            this.data_table = null;
            this.error = false;
            this.errorMsg = "";
            this.current_row = "";
            this.results = this.options.results;
            this.backup_available = this.options.backup_available;
            this.updating = false;
            this.per_page = 50;
            this.modal = null;
            this.modalModel = ModalModel;
            this.tokens = mvc.Components.get("submitted");
            this.eventBus.on("row:update:done", this.getData, this);
            this.eventBus.on("row:edit", this.showEditModal, this);
            this.eventBus.on("row:update", this.runUpdateSearch, this); //triggered from modal view
            this.eventBus.on("row:new", this.runAddNewRow, this); //triggered from modal view
            this.on("updating", this.updateStatus, this);
        },

        events: {
            'click .edit': 'editRow',
            'click .remove': 'removeRow',
            'click .clipboard': 'copyRow',
            'click .per-page': 'pageCountChanged',
            'click #populateDefault': 'populateTableWithDefaultData',
            'click #populateBackup': 'populateFromBackup',
            'click #addNewRow': 'addNewRow',
            'click #closeNotificationBtn': 'closeBackupNotification'
        },

        updateStatus: function (updating) {
            this.updating = updating;
            if (this.updating === true) {
                this.data_table.rowReorder.disable();
                $(".updating").fadeIn();
                $("#addNewRow").prop("disabled", true);
                $(".pageDropDown").addClass("disabled");
                $(".dataTables_paginate a").addClass("disabled");
                this.data_table.rows().every(function (_rowIdx, _tableLoop, _rowLoop) {
                    var rowNode = this.node();
                    $(rowNode).find("td").each(function () {
                        $(this).addClass("disabled");
                    });
                    $(rowNode).find("td > a").each(function () {
                        $(this).addClass("disabled");
                    });
                });
            } else {
                this.data_table.rowReorder.enable();
                $(".updating").fadeOut();
                $("#addNewRow").prop("disabled", false);
                $(".pageDropDown").removeClass("disabled");
                $(".dataTables_paginate a").removeClass("disabled");
                this.data_table.rows().every(function (_rowIdx, _tableLoop, _rowLoop) {
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

        isJSON: function(string) {
            try {
                JSON.parse(string);
            } catch (e) {
                console.error('Parse error :: ', e);
                return false;
            }
            return true;
        },

        toggleError: function(error, errorObj) {

            const errorMsgIsObject = errorObj.error && errorObj.status;
            let errorMsg = '';

            if (errorMsgIsObject) {
                errorMsg = `${errorObj.status} ${errorObj.error}`;
            } else {
                errorMsg = errorObj;
            }

            this.trigger("updating", false);
            if (error) {
                this.error = error;
                this.errorMsg = errorMsg;
                $("#bhError p").empty();
                $("#bhError p").append(this.errorMsg);
                $("#bhError").animate({ opacity : 1, top: 0 }, 1000, () => {
                    setTimeout(() => {
                        $("#bhError").animate({ opacity : 0, top: '-50px' }, 1000, () => {
                            // once its done displaying, empty it out
                            this.toggleError(false, '');
                        });
                    }, 3000);
                });
            } else {
                this.error = false;
                this.errorMsg = "";
                $("#bhError").animate({ opacity : 0, top: '-50px' }, 1000);
                $("#bhError p").empty();
            }
        },

        addNewRow: function () {

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
                model: this.modalModel,
                eventBus: this.eventBus,
                mode: 'New',
                searches: this.searches,
                tokens: this.tokens
            });

            this.childComponents.push(this.modal);

            this.modal.show();

        },

        showEditModal: function (row_data) {

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
                model: this.modalModel,
                eventBus: this.eventBus,
                mode: 'Edit',
                searches: this.searches,
                tokens: this.tokens
            });

            this.childComponents.push(this.modal);

            this.modal.show();

        },

        runAddNewRow: function (_row_data) {

            this.trigger("updating", true);

            let data = {
                'comments' : this.tokens.get("comments_add_tok"),
                'contact' : this.tokens.get("contact_add_tok"),
                'index' : this.tokens.get("index_add_tok"),
                'sourcetype' : this.tokens.get("sourcetype_add_tok"),
                'host' : this.tokens.get("host_add_tok"),
                'lateSecs' : this.tokens.get("late_secs_add_tok"),
                'suppressUntil' : this.tokens.get("suppress_until_add_tok")
            };

            var service = mvc.createService({owner: "nobody"});
            const jsonData = JSON.stringify(data);

            service.request(
                "/servicesNS/nobody/broken_hosts/storage/collections/data/expectedTime/",
                "POST",
                null,
                null,
                jsonData,
                {"Content-Type": "application/json"}, (err) => {
                    if (err) {
                        this.toggleError(true, "Could not create new suppression.");
                    }
                })
                .done(response => {
                    console.log('response ::: ', response);
                    const responseObj = JSON.parse(response);
                    this.trigger("updating", false);
                    const rowData = [
                        responseObj["_key"],
                        data["comments"],
                        data["contact"],
                        data["index"],
                        data["sourcetype"],
                        data["host"],
                        data["lateSecs"],
                        data["suppressUntil"],
                        "<a class=\"edit\" href=\"#\">Edit</a>",
                        "<a class=\"remove\" href=\"#\">Remove</a>",
                        "<a class=\"clipboard\" data-clipboard-target=\"#row-0\" href=\"#\">Copy</a>"
                    ];
                    this.data_table.row.add(rowData).draw();
                    this.data_table.rowReorder.enable();
                })
        },

        runUpdateSearch: function (row_data) {

            this.trigger("updating", true);

            let data = {
                'comments' : row_data["comments"],
                'contact' : row_data["contact"],
                'index' : row_data["index"],
                'sourcetype' : row_data["sourcetype"],
                'host' : row_data["host"],
                'lateSecs' : row_data["lateSecs"],
                'suppressUntil' :row_data["suppressUntil"]
            };

            var temp = this.current_row.data();
            temp[1] = row_data["comments"];
            temp[2] = row_data["contact"];
            temp[3] = row_data["index"];
            temp[4] = row_data["sourcetype"];
            temp[5] = row_data["host"];
            temp[6] = row_data["lateSecs"];
            temp[7] = row_data["suppressUntil"];

            this.current_row.data(temp).draw();

            var _key = row_data["_key"];
            var service = mvc.createService({owner: "nobody"});
            let jsonData = JSON.stringify(data);

            service.request(
                "/servicesNS/nobody/broken_hosts/storage/collections/data/expectedTime/" + _key,
                "POST",
                null,
                null,
                jsonData,
                {"Content-Type": "application/json"}, (err) => {
                    if (err) {
                        this.toggleError(true, err);
                    }
                })
                .done(() => {
                    this.trigger("updating", false);
                    this.data_table.rowReorder.enable();
                });

        },

        copyRow: function (_e) {

            new Clipboard('.clipboard', {
                text: function (trigger) {

                    var comments, contact, index, sourcetype, host, lateSecs, suppressUntil = "";

                    $(trigger).parents('tr').each(function (_i, _el) {

                        var td = $(this).find('td');
                        comments = td.eq(0).text();
                        contact = td.eq(1).text();
                        index = td.eq(2).text();
                        sourcetype = td.eq(3).text();
                        host = td.eq(4).text();
                        lateSecs = td.eq(5).text();
                        suppressUntil = td.eq(6).text();

                    });

                    return "Comments: " + comments + "\n" +
                        "Contact: " + contact + "\n" + "\n" + "Index: " + index + "\n" + "Sourcetype: " + sourcetype +
                        "Host: " + host + "\n" + "Late Seconds: " + lateSecs + "\n" + "Suppress Until: " + suppressUntil;

                }
            });

        },

        pageCountChanged: function (e) {

            var per_page = $(e.currentTarget).data('page-count');
            this.per_page = parseInt(per_page);
            $(".pageDropDown").html(per_page + " per page <span class=\"caret\"></span>");
            this.data_table.page.len(this.per_page).draw();

        },

        emptyKVStore: function(collection = 'expectedTime') {
            var service = mvc.createService({owner: "nobody"});
            this.trigger("updating", true);

            return new Promise((resolve, reject) => {
                service.request(
                    `/servicesNS/nobody/broken_hosts/storage/collections/data/${collection}/`,
                    "DELETE",
                    null,
                    null,
                    null,
                    {
                        "Content-Type" : "application/json",
                        "Accept" : "application/json"
                    },
                    (err) => {
                        if(err) {
                            console.error('error updating expectedTime: ', err);
                            reject(new Error("An Error occurred when attempting to backup the KV store."));
                        } else {
                            resolve();
                        }
                    })

            })
            .catch(err => {
                this.toggleError(true, err);
            });

        },

        removeRow: function (e) {
            e.preventDefault();
            var service = mvc.createService({owner: "nobody"});
            this.trigger("updating", true);

            var _key = this.data_table.row($(e.currentTarget).parents('tr')).data()[0];

            service.request(
                "/servicesNS/nobody/broken_hosts/storage/collections/data/expectedTime/" + _key,
                "DELETE",
                null,
                null,
                null,
                {
                    "Content-Type" : "application/json",
                    "Accept" : "application/json"
                },
                (err) => {
                    if (err) {
                        console.error('ERROR ::: ', err);
                        this.toggleError(true, err);
                    } else {
                        this.data_table.row($(e.currentTarget).parents('tr')).remove().draw(false);
                        this.trigger("updating", false);
                        this.data_table.rowReorder.enable();
                    }
                })
        },

        reDraw: function (data) {

            this.results = data;

            setTimeout(function () {
                this.renderList(true);
            }.bind(this), 100);

        },

        getData: function (collection = 'expectedTime') {
            var service = mvc.createService({owner: "nobody"});
            var auth = "";
            return new Promise((resolve, reject) => {
                service.get(`/servicesNS/nobody/broken_hosts/storage/collections/data/${collection}`, auth,
                function (err, res) {

                    if (err) {
                        reject(err);
                    }

                    resolve(res.data);

                });
            });
        },

        addUpdatedDataToTable: function(data) {
            var cleaned_data = [];


            function fix_key(key) {
                return key.replace(/^_key/, "key");
            }

            _.each(data, (row_obj, _row_k) => {
                const row = _.object(
                    _.map(_.keys(row_obj), fix_key),
                    _.values(row_obj)
                );

                row['Edit'] = 'Edit';
                row['Remove'] = 'Remove';

                cleaned_data.push(row);

            });

            this.reDraw(cleaned_data);
        },

        renderList: function (retain_datatables_state) {

            var bh_template = $('#bhTable-template', this.$el).text();


            if (this.results === null) {
                return;
            }

            $("#bh-content", this.$el).html(_.template(bh_template, {
                suppressions: this.results,
                per_page: this.per_page,
                restored: this.restored,
                backup_available: this.backup_available,
                error: this.error,
                errorMsg : this.errorMsg
            }));

            this.data_table = $('#bhTable', this.$el).DataTable({
                dom: '<"H"lfrp>t<"F"ip>',
                rowReorder: true,
                bSort: false,
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
                "aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
                "fnStateLoadParams": function (_oSettings, _oData) {
                    return retain_datatables_state;
                },
                "preDrawCallback": () => { this.pageScrollPos = $('body').scrollTop();},
                "drawCallback": () => { $('body').scrollTop(this.pageScrollPos);},
            });

            $('div.dataTables_filter input').addClass('search-query');
            $('div.dataTables_filter input[type="search"]').attr('placeholder', 'Filter');

            this.data_table.on('row-reorder', (_e, _details, _changes) => {
                this.trigger("updating", true);
                this.processDataForUpdate();
            });
        },

        closeBackupNotification: function () {
            $("#backupNotice").animate({ opacity : 0, top: '-50px' }, 1000);
        },

        populateFromBackup: async function (e) {

            e.preventDefault();
            $("#populateBackup").prop('disabled', true).text("Populating...");

            try {
                const data = await this.getData('expectedTime_tmp');
                await this.batchUpdate(data, null, null, 'expectedTime');
                this.backup_available = false;
                this.addUpdatedDataToTable(data);
                this.trigger("updating", false);
            } catch (error) {
                this.toggleError(true, error);
            }

        },

        populateTableWithDefaultData: function () {

            var service = mvc.createService({owner: "nobody"});

            $("#populateDefault").prop('disabled', true).text("Populating...");

            service.request(
                "/servicesNS/nobody/broken_hosts/bhosts/bhosts_setup/setup",
                "POST",
                null,
                null,
                null,
                {"Content-Type": "application/json"}, async (err) => {
                    if (err) {
                        console.error('error updating expectedTime: ', err);
                        reject(new Error("An Error occurred. Could not update."));
                    } else {
                        const currentData = await this.getData();
                        await this.addUpdatedDataToTable(currentData);
                    }
                });
        },

        processDataForUpdate: function () {

            setTimeout(() => {
                const headers_data = this.data_table.columns().header();
                const updatedData = this.data_table.rows({order: 'applied'}).data();
                let headers = [];
                const mappedHeaders = [
                    {header: "Key", mapped: "_key"},
                    {header: "Comments", mapped: "comments"},
                    {header: "Contact", mapped: "contact"},
                    {header: "Index", mapped: "index"},
                    {header: "Sourcetype", mapped: "sourcetype"},
                    {header: "Host", mapped: "host"},
                    {header: "Late Seconds", mapped: "lateSecs"},
                    {header: "Suppress Until", mapped: "suppressUntil"}
                ];

                _.each(headers_data, function () {

                    _.each(mappedHeaders, function (mapping) {

                        headers.push(mapping['mapped']);

                    });

                });

                this.mapData(updatedData, _.uniq(headers));

            }, 1000);

        },

        mapData: function (updatedData, headers) {

            let mappedData = [];

            _.each(updatedData, (row, _row_k) => {

                let row_obj = {};

                _.each(row, (col, col_k) => {

                    if (headers[col_k]) {

                        const header = headers[col_k];

                        row_obj[header] = col;

                    }

                });

                mappedData.push(row_obj);

            });

            this.updateKVStore(mappedData);

        },

        updateKVStore: async function(updatedData) {

            try {
                const currentData = await this.getData();
                await this.emptyKVStore('expectedTime_tmp');
                await this.batchUpdate(currentData, null, null, 'expectedTime_tmp');
                await this.emptyKVStore('expectedTime');
                await this.batchUpdate(updatedData);
                this.data_table.rowReorder.enable();
                this.trigger("updating", false);
            } catch (err) {
                this.toggleError(true, err);
            }

        },

        batchUpdate: function(data, start, end, collection = 'expectedTime') {

            var service = mvc.createService({owner: "nobody"});
            let total = data.length;
            let currentCollection = collection;

            if (start == null && end == null) {
                start = 0;
                end = 500;
            }

            let dataChunk = JSON.stringify(data.slice(start, end+1)); // non-inclusive so +1

            return new Promise((resolve, reject) => {
                service.request(
                    `/servicesNS/nobody/broken_hosts/storage/collections/data/${currentCollection}/batch_save`,
                    "POST",
                    null,
                    null,
                    dataChunk,
                    {"Content-Type": "application/json"}, (err, _response) => {
                        if(err) {
                            console.error('error updating expectedTime: ', err);
                            reject(new Error("An Error occurred. Could not update."));
                        } else {
                            if (end >= total) {
                                this.data_table.rowReorder.enable();
                                splunkjs.mvc.Components.revokeInstance("addRow");
                                resolve();
                            } else {
                                start = end;
                                end = end + 500;
                                resolve(this.batchUpdate(data, start, end, currentCollection));
                            }
                        }
                    })
            }).catch(err => {
                this.toggleError(true, err);
            });

        },

        render: function () {

            var retain_datatables_state = (typeof retain_datatables_state === "undefined") ? false : true;
            this.$el.html(BHTableTemplate);
            this.renderList(retain_datatables_state);

            if (this.restored) {
                setTimeout(() => {
                    $(".restored").fadeOut();
                    this.restored = false;
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

});
