import { Router } from "aurelia-router";
import { inject } from "aurelia-framework";
import { AuthenticationHelper } from "shared/auth-lock/helpers/authentication-helper";
import { RouteConfiguration } from "config/route-config";
import projectInfo from "config/project-info";
import { AuthComponent } from "shared/auth-lock/helpers/auth-component";

@inject(AuthenticationHelper, RouteConfiguration)
export class App extends AuthComponent {
    router: Router;

    constructor(private authenticationHelper: AuthenticationHelper, private routeConfiguration: RouteConfiguration, ...dependencies) {
        super(...dependencies);
    }


    configureRouter(config, router: Router) {
        config.title = projectInfo.projectTitle;

        //configuring routes    
        this.routeConfiguration.configure(config);

        //configuring authentication
        this.authenticationHelper.configureAuth(config);
        this.router = router;
    }
}