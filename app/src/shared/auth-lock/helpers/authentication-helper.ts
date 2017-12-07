import { ApiService } from "shared/api-service/api";
import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import * as moment from "moment";
import * as toastr from "toastr";
import * as alertify from "alertifyjs";
import { DialogService } from "aurelia-dialog";
import { StoreRoute } from "./store-route";
import { AuthorizeStep } from "./authorize-step";
import { AuthLockConfig, Constants } from "../base-config";
import { Storage } from "./storage";
import routes from "shared/auth-lock/config/routes";
import { EventAggregator } from "aurelia-event-aggregator";
import * as auth0 from "auth0-js";

@inject(ApiService, Router, DialogService, AuthLockConfig, Storage, EventAggregator)
export class AuthenticationHelper {
    config: IAuthConfig;
    username: string;
    runningExpiryCheck: boolean = false;
    expiryTimer: NodeJS.Timer;
    isRefreshingToken: boolean = false;
    auth0: auth0.Authentication;

    constructor(private api: ApiService, private router: Router, private dialogService: DialogService, baseConfig: AuthLockConfig, private storage: Storage, private eventPipeline: EventAggregator) {
        this.config = baseConfig.current;
        this.auth0 = new auth0.Authentication({
            clientID: this.config.clientId,
            domain: this.config.domain,
            //redirectUri: window.location.href
        });
    }

    configureAuth(config: any) {
        config.addPipelineStep("authorize", StoreRoute);
        config.addPipelineStep("authorize", AuthorizeStep);

        this.configureHttpClient();

        routes.forEach((r: IRoute) => {
            r.ssoUser = r.ssoUser !== false;
            this.router.addRoute(r);
        });
        this.router.refreshNavigation();
    }

    private configureHttpClient() {
        this.api.configure(config => {
            config.withInterceptor({
                request: (request) => {
                    this.storage.lastRequest = moment().toISOString();

                    // to make a call to external services with different authentication header
                    // add authorization header only if it is not yet defined on the `request`
                    if (AuthorizeStep.isAuthenticated() && this.config.httpInterceptor && !request.headers.has(this.config.authHeader)) {
                        const token = this.storage.token;
                        request.headers.set(this.config.authHeader, `Bearer ${token}`);
                    }

                    // if the authorization is empty then remove it from the request
                    // useful when calling external services indicating empty flag 
                    // to avoid sending default auth header
                    if (request.headers.has(this.config.authHeader) && !request.headers.get(this.config.authHeader)) {
                        request.headers.delete(this.config.authHeader);
                    }
                    return request;
                }
            });
        });
    }

    setAuthenticationInformation(authInfo: IAuthResult) {
        const claims = authInfo.idTokenPayload.claims || [];

        this.storage.username = authInfo.idTokenPayload.email;
        this.storage.loggedIn = moment().toISOString();
        this.storage.token = authInfo.idToken;
        this.storage.refreshToken = authInfo.refreshToken;
        this.storage.isSsoUser = authInfo.idTokenPayload.identities[0].provider !== "auth0";
        this.storage.connection = authInfo.idTokenPayload.identities[0].connection;


        this.runningExpiryCheck = false;

        // store permission claims on session storage
        this.storage.permissionClaims = claims
            .filter(c => c.name.toLowerCase() === "permission")
            .map(c => c.value);

        // if it is admin and do not have access to any filings
        // then return to default admin url
        if (this.isAdmin() && !claims.some(c => c.name.toLowerCase() === "groupaccess" && !!c.value)) {
            this.storage.returnUrl = this.config.defaultAdminUrl;
        }

        return this;
    }

    isAuthenticated(): boolean {
        return AuthorizeStep.isAuthenticated();
    }

    isAdmin(): boolean {
        return AuthorizeStep.isAdmin();
    }

    clearTokenFromHistory() {
        history.go(-1);
        setTimeout(() => {
            history.replaceState(undefined, undefined, this.config.loginUrl);
            let returnUrl = this.storage.returnUrl;
            this.router.navigate(returnUrl || this.config.defaultReturnUrl);
        }, 10);

        return this;
    }

    logout() {
        this.storage.clearAll();
        /*this.auth0.logout({
            returnTo: `${location.origin}/${this.config.loginUrl}`,
            client_id: this.config.clientId
        });*/
        window.location.href = this.auth0.buildLogoutUrl({
            returnTo: `${location.origin}/${this.config.loginUrl}`
        });
    }
}