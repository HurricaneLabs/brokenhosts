"use strict";

import * as Splunk from './splunk_helpers.js'
import * as Config from './setup_configuration.js'
import { promisify } from './util.js'

const CUSTOM_CONF = 'bh'
const CUSTOM_CONF_STANZA = 'validation'


export async function perform(splunk_js_sdk, setup_options) {
    var app_name = "broken_hosts";

    var application_name_space = {
        owner: "nobody",
        app: app_name,
        sharing: "app",
    };

    try {
        // Create the Splunk JS SDK Service object
        const splunk_js_sdk_service = Config.create_splunk_js_sdk_service(
            splunk_js_sdk,
            application_name_space,
        );

        let { comments_must_have_ticket_number } = setup_options;

        // // Get conf and do stuff to it
        await Splunk.update_configuration_file(
            splunk_js_sdk_service,
            CUSTOM_CONF,
            CUSTOM_CONF_STANZA,
            { comments_must_have_ticket_number: + comments_must_have_ticket_number }
        )

        // Completes the setup, by access the app.conf's [install]
        // stanza and then setting the `is_configured` to true
        await Config.complete_setup(splunk_js_sdk_service);

        return 'success';

        // Reloads the splunk app so that splunk is aware of the
        // updates made to the file system
        //await Config.reload_splunk_app(splunk_js_sdk_service, app_name);

        // Redirect to the Splunk App's home page
        //Config.redirect_to_splunk_app_homepage(app_name);
    } catch (error) {
        // This could be better error catching.
        // Usually, error output that is ONLY relevant to the user
        // should be displayed. This will return output that the
        // user does not understand, causing them to be confused.
        console.error('Error:', error);
        return 'error';
    }
}

export async function get_initial_state(splunk_js_sdk) {
    var app_name = "broken_hosts";

    var application_name_space = {
        owner: "nobody",
        app: app_name,
        sharing: "app",
    };

    const splunk_js_sdk_service = Config.create_splunk_js_sdk_service(
        splunk_js_sdk,
        application_name_space,
    );

    var splunk_js_sdk_service_configurations = splunk_js_sdk_service.configurations(
        {
            // Name space information not provided
        },
    );

    function get_config_file_value(
        app_config_accessor,
        stanza_name,
        key_name
    ) {

        let stanzas_found = app_config_accessor.list();
        let value = false;

        for (var index = 0; index < stanzas_found.length; index++) {
            var stanza_data = stanzas_found[index];
            var stanza_found = stanza_data.name;
            if (stanza_found === stanza_name) {
                value = stanza_data._properties[key_name];
                break;
            }
        }

        return value;

    };

    splunk_js_sdk_service_configurations = await promisify(splunk_js_sdk_service_configurations.fetch)();

    // Retrieves the configuration file accessor
    var app_config_accessor = Splunk.get_configuration_file(
        splunk_js_sdk_service_configurations,
        'app',
    );

    var bh_config_accessor = Splunk.get_configuration_file(
        splunk_js_sdk_service_configurations,
        'bh',
    );

    app_config_accessor = await promisify(app_config_accessor.fetch)();
    bh_config_accessor = await promisify(bh_config_accessor.fetch)();

    let is_configured = get_config_file_value(
        app_config_accessor,
        'install',
        'is_configured'
    );

    let comments_must_have_ticket_number = get_config_file_value(
        bh_config_accessor,
        'validation',
        'comments_must_have_ticket_number'
    );

    return {
        'is_configured': is_configured,
        'comments_must_have_ticket_number': !!Number(comments_must_have_ticket_number)
    };

}