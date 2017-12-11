import "jquery";
import "bootstrap";
import { Aurelia } from "aurelia-framework";
import environment from "environment";
//import reducers from "appState/reducers";
import authConfig from "config/auth";
import { AuthLockConfig } from "shared/auth-lock/base-config";

//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
(<any>Promise).config({
    warnings: {
        wForgottenReturn: false
    }
});

export function configure(aurelia: Aurelia) {
    speechSynthesis.getVoices();

    //needed to add as global variable to be used with kendo export excel
    //window["JSZip"] = window["JSZip"] || JSZip;
    aurelia.use
        .standardConfiguration()
        //globalize features
        .feature("resources")
        //load plugins
        .plugin("aurelia-dialog")
        //.plugin("shared/redux-base/config", (createStore: IReduxStoreCreator) => createStore(reducers, environment.debug))
        .plugin("shared/auth-lock/auth0", (baseConfig: AuthLockConfig) => {
            baseConfig.configure(authConfig);
        })
        .plugin("aurelia-computed", {
            enableLogging: environment.debug
        });

    if (environment.debug) {
        aurelia.use.developmentLogging();
    }

    if (environment.testing) {
        aurelia.use.plugin("aurelia-testing");
    }

    aurelia.start().then(() => aurelia.setRoot());
}
