define([
    'underscore',
    'backbone',
], function (_, Backbone) {
    "use strict";

    var ModalModel = Backbone.Model.extend({

        defaults: {
            _key: "",
            comments: "",
            contact: "",
            host: "",
            index: "",
            lateSecs: "",
            sourcetype: "",
            suppressUntil: "",
            delimiter: "",
            mode: "Edit",
            error: false,
            errorMsg: "",
            loading_indexes: true,
        }

    });

    return new ModalModel();

});