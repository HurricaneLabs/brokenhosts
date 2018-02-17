require.config({
    paths: {
        text: "../app/broken_hosts/components/lib/text",
        "modalTemplate" : "../app/broken_hosts/components/templates/modalTemplate.html",
        "flatPickr" : "../app/broken_hosts/components/lib/flatpickr/dist/flatpickr.min",
        "validate" : "../app/broken_hosts/components/lib/jquery-validation/jquery.validate.min"
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
    "splunkjs/mvc/dropdownview",
    "splunkjs/mvc/timerangeview"
    ], function(_, Backbone, $, mvc, modalTemplate, flatpickr, validate, SearchManager, DropdownView, TimeRangeView) {

        var ModalView = Backbone.View.extend({
    
            initialize: function(options) {
                this.options = options;
                this.mode = options.mode;
                this.model = options.model;
                this.tokens = options.tokens;
                this.sourcetypeInputSearch = options.searches.sourcetypeInputSearch;
                this.hostInputSearch = options.searches.hostInputSearch;
                this.indexInputSearch = options.searches.indexInputSearch;
                this.options = _.extend({}, this.defaults, this.options);
				this.eventBus = this.options.eventBus;
				this.childViews = [];
				this.sourcetypeDropdown = "";

                _.bindAll(this, "changed");
            },
            
            events: {
                "click .close": "close",
                "click .modal-backdrop": "close",
                "click #submitData": "validateData",
                "change input" : "changed",
                "change select" : "changed",
                "change textarea" : "changed"
            },

            changed:function (evt) {
                var changed = evt.currentTarget;
                var value = $(evt.currentTarget).val();
                var obj = {};
                obj[changed.id] = value;

                this.model.set(obj);
            },

            splunkComponentsInit: function() {
                // Instantiate components

                var that = this;

                this.sourcetypeDropdown = new DropdownView({
                    id: "sourcetype",
                    managerid: "sourcetype-input-search",
                    default: "",
                    labelField: "sourcetype",
                    valueField: "sourcetype",
                    el: $("#inputWrapper_sourcetypeSelector")
                }).render();

                this.hostDropdown = new DropdownView({
                    id: "host",
                    managerid: "host-input-search",
                    default: "",
                    labelField: "host",
                    valueField: "host",
                    el: $("#inputWrapper_hostSelector")
                }).render();

                this.indexDropdown = new DropdownView({
                    id: "index",
                    managerid: "index-input-search",
                    default: "",
                    labelField: "index",
                    valueField: "index",
                    el: $("#inputWrapper_indexSelector")
                }).render();

                this.sourcetypeDropdown.on('change', function(val) {
                    if(val) {
                        $("#sourcetype").val(val);
                        that.model.set({ "sourcetype" : val });
                    }
                });

                this.hostDropdown.on('change', function(val) {
                    if(val) {
                        $("#host").val(val);
                        that.model.set({ "host" : val });
                    }
                });

                this.indexDropdown.on('change', function(val) {
                    if(val) {
                        $("#index").val(val);
                        that.model.set({ "index" : val });
                    }
                });

                this.childViews.push(this.sourcetypeDropdown);
                this.childViews.push(this.hostDropdown);
                this.childViews.push(this.indexDropdown);

            },
    
            render: function() {

                $(this.$el).html(_.template(modalTemplate, this.model.toJSON()));

                //this.unsetSplunkComponents();

                return this;

            },

            unsetSplunkComponents: function() {

                this.tokens.unset("host_add_tok");
                this.tokens.unset("index_add_tok");
                this.tokens.unset("comments_add_tok");
                this.tokens.unset("late_secs_add_tok");
                this.tokens.unset("contact_add_tok");
                this.tokens.unset("sourcetype_add_tok");
                this.tokens.unset("suppress_until_add_tok");

                this.tokens.unset("host_update_tok");
                this.tokens.unset("index_update_tok");
                this.tokens.unset("comments_update_tok");
                this.tokens.unset("late_secs_update_tok");
                this.tokens.unset("contact_update_tok");
                this.tokens.unset("sourcetype_update_tok");
                this.tokens.unset("suppress_until_update_tok");

                _.each(this.childViews, function(childView) {
                    childView.unbind();
                    childView.remove();
                });

            },
    
            show: function() {

                $(document.body).append(this.render().el);

                $(this.el).find(".modal").css({
                    width:"40%",
                    height:"auto",
                    left: "30%",
                    "margin-left": "0"
                });

                $(this.el).find(".modal-body").css({
                    "max-height": "750px"
                });

                $(this.el).find(".form-group #suppressUntil").flatpickr({
                    minDate : new Date(),
                    enableTime : "true",
                    dateFormat: "m/d/Y H:i:S",
                    allowInput: "true",
                    time_24hr: "true"
                });

                splunkjs.mvc.Components.revokeInstance("sourcetype");
                splunkjs.mvc.Components.revokeInstance("host");
                splunkjs.mvc.Components.revokeInstance("index");

                this.splunkComponentsInit();

            },

            validateData: function() {

                var that = this;

                $.validator.addMethod("are_valid_emails",
                    function (value, element) {
                        if (this.optional(element)) {
                            return true;
                        }

                        var emails = value.split(",");
                        var valid = true;
                        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                        for (var i = 0; i < emails.length; i++) {
                             if( emails[i] == "" || ! regex.test(emails[i])){
                                 valid = false;
                             }
                        }

                    return valid;
                 }, "Invalid email address(es). Please use a comma to separate multiple email addresses.");

                $.validator.addMethod("bh_date",
                    function(value, element) {

                        if (value === 0) {
                            return true;
                        } else {
                            return value.match(/(^\d\d?\/\d\d?\/\d\d\d\d?\s\d\d?:\d\d?:\d\d$|^0$)/);
                        }
                    }, "Please enter a date in the format MM/DD/YYYY HH:MM:SS or 0 to always suppress.");

                $.validator.addMethod("is_not_in_past",
                    function(value, element) {

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
                    function(value, element) {

                        return value.match(/(((?:([-]+)(\d{1,})((seconds$|seconds@|second$|second@|secs$|secs@|sec$|sec@|minutes$|minutes@|minute$|minute@|min$|min@|hours$|hours@|hour$|hour@|hrs$|hrs@|hr$|hr@|days$|days@|day$|day@|weeks$|weeks@|week$|w[0-6]|months$|months@|month$|month@|mon$|mon@|quarters$|quarts@|quarter$|quarter@|qtrs$|qtrs@|qtr$|qtr@|years$|years@|year$|year@|yrs$|yrs@|yr$|yr@|s$|s@|h$|h@|m$|m@|d$|d@|w$|w@|y$|y@|w$|w@|q$|q@){1}))([\@]?)(((seconds|second|secs|sec|minutes|minute|min|hours|hour|hrs|hr|days|day|weeks|week|w[0-6]|months|month|mon|quarters|quarter|qtrs|qtr|years|year|yrs|yr|s$|h$|m$|d$|w$|y$|w$|q$){1})?$)|^0$)|^\d+$)/);

                    }, "Value must be in seconds or Splunk's relative time format.");

                $.validator.addMethod("has_ticket_number",
                    function(value, element) {
                        var hasNumber = /(#\d{5,}.*)/;
                        return hasNumber.test(value);
                    }, "You must include a ticket number for reference (e.g. #12345)");

                $("#brokenHostForm", this.el).validate({

                    rules: {
                        host: 'required',
                        sourcetype: 'required',
                        index: 'required',
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
                            has_ticket_number: true
                        }
                    },

                    messages: {
                        host: {
                            required: "The Host field is required."
                        },
                        sourcetype: {
                            required: "The Sourcetype field is required."
                        },
                        index: {
                            required: "The Index field is required."
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

                    submitHandler: function(form) {

                        that.submitData();

                    }

                });

            },

            submitData: function() {
                console.log("SUBMIT DATA!");
				if(this.mode === "New") {

					this.tokens.set("host_add_tok", this.model.get("host"));
					this.tokens.set("index_add_tok", this.model.get("index"));
					this.tokens.set("comments_add_tok", this.model.get("comments"));
					this.tokens.set("late_secs_add_tok", this.model.get("lateSecs"));
					this.tokens.set("contact_add_tok", this.model.get("contact"));
					this.tokens.set("sourcetype_add_tok", this.model.get("sourcetype"));
					this.tokens.set("suppress_until_add_tok", this.model.get("suppressUntil"));

					this.eventBus.trigger("row:new", this.model.attributes);

				} else if(this.mode === "Edit") {

					this.tokens.set("key_update_tok", this.model.get("_key"));
					this.tokens.set("host_update_tok", this.model.get("host"));
					this.tokens.set("index_update_tok", this.model.get("index"));
					this.tokens.set("comments_update_tok", this.model.get("comments"));
					this.tokens.set("late_secs_update_tok", this.model.get("lateSecs"));
                    this.tokens.set("contact_update_tok", this.model.get("contact"));
					this.tokens.set("sourcetype_update_tok", this.model.get("sourcetype"));
					this.tokens.set("suppress_until_update_tok", this.model.get("suppressUntil"));
					this.eventBus.trigger("row:update", this.model.attributes);

				}

                this.close();
            },
    
            close: function() {

                this.unsetSplunkComponents();
                this.unbind();
                this.remove();

            }

        });
        
        return ModalView;

});