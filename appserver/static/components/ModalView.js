var app_name = "broken_hosts"

require.config({
    paths: {
        text: "../app/" + app_name + "/components/lib/text",
        "modalTemplate": "../app/" + app_name + "/components/templates/modalTemplate.html",
        "flatPickr": "../app/" + app_name + "/components/lib/flatpickr/dist/flatpickr.min",
        "validate": "../app/" + app_name + "/components/lib/jquery-validation/jquery.validate.min",
        "select2_custom": "../app/" + app_name + "/components/lib/select2/dist/js/select2.min",
    }
});

define([
    "underscore",
    "backbone",
    "jquery",
    "splunkjs/mvc",
    "text!modalTemplate",
    "flatPickr",
    "validate",
    "splunkjs/mvc/searchmanager",
    'select2_custom',
], function (_, Backbone, $, mvc, modalTemplate, flatpickr, validate, SearchManager, select2) {

    return Backbone.View.extend({

        initialize: function (options) {
            this.options = options;
            this.mode = options.mode;
            this.model = options.model;
            this.tokens = options.tokens;
            this.validate_ticket_number = true;
            this.parsed_hosts = [];
            this.options = _.extend({}, this.defaults, this.options);
            this.eventBus = this.options.eventBus;
            this.childViews = [];
            this.sourcetypeDropdown = "";
            this.hosts_results = [];
            this.indexInputSearch = new SearchManager({
                id: "index-input-search",
                search: "| eventcount summarize=false index=* | dedup index | fields index",
                autoStart: false,
                earliest_time: '-24h@h'
            });
            this.sourcetypeInputSearch = new SearchManager({
                id: "sourcetype-input-search",
                search: "| tstats count WHERE index=* sourcetype=* by sourcetype",
                autoStart: false,
                earliest_time: '-24h@h'
            });
            this.hostInputSearch = new SearchManager({
                id: "host-input-search",
                search: "| tstats count WHERE index=* host=* by host",
                autoStart: false,
                earliest_time: '-7d@d'
            });
            _.bindAll(this, "changed");
        },

        events: {
            "click .close": "close",
            "click .modal-backdrop": "close",
            "click #submitData": "validateData",
            "change input": "changed",
            "change select": "changed",
            "change textarea": "changed"
        },

        changed: function (evt) {
            var changed = evt.currentTarget;
            var value = $(evt.currentTarget).val();
            var obj = {};
            obj[changed.id] = value;

            this.model.set(obj);
        },

        startDropdownSearches: function () {
            this.indexInputSearch.startSearch();
            this.sourcetypeInputSearch.startSearch();
            this.hostInputSearch.startSearch();
            //this.getHostDropdownResults();

            let indexDropdown = {
                inputSearch: this.indexInputSearch,
                final_results: [],
                wrapperID: '#indexSelect_wrapper',
                dropdownID: '#indexInput',
                getResults: this.getResults,
                bind: this.select2Binding,
                associatedTextInputID: '#index',
                associatedModelAttr: 'index',
                model: this.model,
            };

            let sourcetypeDropdown = {
                inputSearch: this.sourcetypeInputSearch,
                final_results: [],
                wrapperID: '#sourcetypeSelect_wrapper',
                dropdownID: '#sourcetypeInput',
                getResults: this.getResults,
                bind: this.select2Binding,
                associatedTextInputID: '#sourcetype',
                associatedModelAttr: 'sourcetype',
                model: this.model,
            };

            let hostDropdown = {
                inputSearch: this.hostInputSearch,
                final_results: [],
                wrapperID: '#hostSelect_wrapper',
                dropdownID: '#hostInput',
                getResults: this.getResults,
                bind: this.select2Binding,
                associatedTextInputID: '#host',
                associatedModelAttr: 'host',
                model: this.model,
            };

            indexDropdown.getResults();
            hostDropdown.getResults();
            sourcetypeDropdown.getResults();

            this.indexInputSearch.on('search:done', () => {
                $('#indexInput').parent().children('.loading').hide();
            });

            this.sourcetypeInputSearch.on('search:done', () => {
                $('#sourcetypeInput').parent().children('.loading').hide();
            });

            this.hostInputSearch.on('search:done', () => {
                $('#hostInput').parent().children('.loading').hide();
            });

        },

        getResults: function () {
            $(this.dropdownID).prop('disabled', true);
            $(this.dropdownID).parent().children('.loading').show().css({ 'display': 'block' });
            let int = 0;
            let results = this.inputSearch.data('results', { count: 0 });
            let dropdownID = this.dropdownID;

            results.on('data', () => {

                let search_results = results.data().rows;
                search_results.forEach((row) => {
                    let obj = {};
                    obj['id'] = int;
                    obj['text'] = row[0];
                    this.final_results.push(obj);
                    int++;
                });
                $(dropdownID).prop('disabled', false);
                $(dropdownID).parent().children('.loading').hide();

                this.bind(this.dropdownID, this.final_results);
            });

        },

        select2Binding: function (div_id_str, data) {

            $(div_id_str).select2({
                theme: "classic",
                data: data
            });

            $(div_id_str).on('select2:select', (e) => {
                var model_value = e.params.data.text;
                let model_key = this.associatedModelAttr;
                let tmp_model = {};
                tmp_model[model_key] = model_value;
                this.model.set(tmp_model);
                $(this.associatedTextInputID).val(model_value);
                $(div_id_str).val(null).trigger('change')
            });

        },

        getValidationConfig: function () {
            const service = mvc.createService();
            const promise = new $.Deferred();

            service.get("/servicesNS/-/" + app_name + "/properties/bh/validation/comments_must_have_ticket_number", "",
                (err, response) => {
                    if (err) {
                        console.error('Could not retrieve validation status: ', err);
                        promise.reject();
                    } else {
                        if (response.data === '0') {
                            this.validate_ticket_number = false;
                        }
                        promise.resolve();
                    }
                });

            return promise;

        },

        render: function () {

            $(this.$el).html(_.template(modalTemplate, this.model.toJSON()));

            return this;

        },

        unsetSplunkComponents: function () {

            this.tokens.unset("index_add_tok");
            this.tokens.unset("sourcetype_add_tok");
            this.tokens.unset("host_add_tok");
            this.tokens.unset("late_secs_add_tok");
            this.tokens.unset("suppress_until_add_tok");
            this.tokens.unset("contact_add_tok");
            this.tokens.unset("comments_add_tok");

            this.tokens.unset("index_update_tok");
            this.tokens.unset("sourcetype_update_tok");
            this.tokens.unset("host_update_tok");
            this.tokens.unset("late_secs_update_tok");
            this.tokens.unset("suppress_until_update_tok");
            this.tokens.unset("contact_update_tok");
            this.tokens.unset("comments_update_tok");

            _.each(this.childViews, function (childView) {
                childView.unbind();
                childView.remove();
            });

        },

        show: function () {

            this.getValidationConfig().done(() => {

                $(document.body).addClass("modal-shown").append(this.render().el);

                $(this.el).find(".modal").css({
                    width: "100%",
                    height: "100%",
                    left: "0",
                    "margin-top": "-40px",
                    "margin-left": "0"
                });

                $(this.el).find(".modal-body").css({
                    "max-height": "750px"
                });

                $(this.el).find(".form-group #suppressUntil").flatpickr({
                    minDate: new Date(),
                    enableTime: "true",
                    dateFormat: "m/d/Y H:i:S",
                    allowInput: "true",
                    time_24hr: "true"
                });

                this.startDropdownSearches();

            });

        },

        validateData: function () {

            var that = this;

            $.validator.addMethod("are_valid_emails",
                function (value, element) {
                    if (this.optional(element)) {
                        return true;
                    }

                    var emails = value.split(",");
                    var valid = true;
                    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                    for (let emailValue of emails) {
                        if (emailValue == "" || !regex.test(emailValue.trim())) {
                            valid = false;
                        }
                    }

                    return valid;
                }, "Invalid email address(es). Please use a comma to separate multiple email addresses.");

            $.validator.addMethod("bh_date",
                function (value, element) {

                    if (value === 0) {
                        return true;
                    } else {
                        return value.match(/(^\d\d?\/\d\d?\/\d\d\d\d?\s\d\d?:\d\d?:\d\d$|^0$)/);
                    }
                }, "Please enter a date in the format MM/DD/YYYY HH:MM:SS or 0 to always suppress.");

            $.validator.addMethod("is_not_in_past",
                function (value, element) {

                    if (value === "0") {
                        return true;
                    } else {
                        var date = new Date(value);
                        var now = new Date();

                        if (date >= now) {
                            return true;
                        }
                    }


                }, "You cannot choose a date & time in the past.");

            $.validator.addMethod("is_relative_time",
                function (value, element) {

                    return value.match(/(((?:([-]+)(\d{1,})((seconds$|seconds@|second$|second@|secs$|secs@|sec$|sec@|minutes$|minutes@|minute$|minute@|min$|min@|hours$|hours@|hour$|hour@|hrs$|hrs@|hr$|hr@|days$|days@|day$|day@|weeks$|weeks@|week$|w[0-6]|months$|months@|month$|month@|mon$|mon@|quarters$|quarts@|quarter$|quarter@|qtrs$|qtrs@|qtr$|qtr@|years$|years@|year$|year@|yrs$|yrs@|yr$|yr@|s$|s@|h$|h@|m$|m@|d$|d@|w$|w@|y$|y@|w$|w@|q$|q@){1}))([\@]?)(((seconds|second|secs|sec|minutes|minute|min|hours|hour|hrs|hr|days|day|weeks|week|w[0-6]|months|month|mon|quarters|quarter|qtrs|qtr|years|year|yrs|yr|s$|h$|m$|d$|w$|y$|w$|q$){1})?$)|^0$)|^\d+$)/);

                }, "Value must be in seconds or Splunk's relative time format.");

            $.validator.addMethod("has_ticket_number",
                function (value, element) {
                    var hasNumber = /(#\d{5,}.*)/;
                    return hasNumber.test(value);
                }, "You must include a ticket number for reference (e.g. #12345)");

            $("#brokenHostForm", this.el).validate({

                rules: {
                    index: 'required',
                    sourcetype: 'required',
                    host: 'required',
                    lateSecs: {
                        required: true,
                        //number: true
                        is_relative_time: true
                    },
                    suppressUntil: {
                        required: true,
                        bh_date: true,
                        is_not_in_past: true
                    },
                    contact: {
                        are_valid_emails: true
                    },
                    comments: {
                        required: true,
                        has_ticket_number: that.validate_ticket_number
                    }
                },

                messages: {
                    index: {
                        required: "The Index field is required."
                    },
                    sourcetype: {
                        required: "The Sourcetype field is required."
                    },
                    host: {
                        required: "The Host field is required."
                    },
                    lateSecs: {
                        required: "The Late Seconds field is required.",
                        //number: "Not a valid number."
                    },
                    suppressUntil: {
                        required: "The Suppress Until field is required.",
                        date: "Not a valid date."
                    },
                    comments: {
                        required: "You must provide a comment."
                    }
                },

                submitHandler: function (form) {

                    that.submitData();

                }

            });

        },

        submitData: function () {

            if (this.mode === "New") {

                this.tokens.set("index_add_tok", this.model.get("index"));
                this.tokens.set("sourcetype_add_tok", this.model.get("sourcetype"));
                this.tokens.set("host_add_tok", this.model.get("host"));
                this.tokens.set("late_secs_add_tok", this.model.get("lateSecs"));
                this.tokens.set("suppress_until_add_tok", this.model.get("suppressUntil"));
                this.tokens.set("contact_add_tok", this.model.get("contact"));
                this.tokens.set("comments_add_tok", this.model.get("comments"));
                this.eventBus.trigger("row:new", this.model.attributes);

            } else if (this.mode === "Edit") {

                this.tokens.set("key_update_tok", this.model.get("_key"));
                this.tokens.set("index_update_tok", this.model.get("index"));
                this.tokens.set("sourcetype_update_tok", this.model.get("sourcetype"));
                this.tokens.set("host_update_tok", this.model.get("host"));
                this.tokens.set("late_secs_update_tok", this.model.get("lateSecs"));
                this.tokens.set("suppress_until_update_tok", this.model.get("suppressUntil"));
                this.tokens.set("contact_update_tok", this.model.get("contact"));
                this.tokens.set("comments_update_tok", this.model.get("comments"));

                this.eventBus.trigger("row:update", this.model.attributes);

            }

            this.close();
        },

        close: function () {

            splunkjs.mvc.Components.revokeInstance("index-input-search");
            splunkjs.mvc.Components.revokeInstance("sourcetype-input-search");
            splunkjs.mvc.Components.revokeInstance("host-input-search");

            $(document.body).removeClass("modal-shown");
            this.unsetSplunkComponents();
            this.unbind();
            this.remove();

        }

    });

});
