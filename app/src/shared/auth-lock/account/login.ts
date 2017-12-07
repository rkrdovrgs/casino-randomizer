import { inject } from "aurelia-framework";
import { AuthenticationHelper } from "../helpers/authentication-helper";
import * as Auth0Lock from "auth0Lock";
import { AuthLockConfig, Constants } from "../base-config";
import { Router } from "aurelia-router";
import { Storage } from "shared/auth-lock/helpers/storage";

enum LoginStep {
    AuthLock,
    LoggedIn
}

@inject(AuthenticationHelper, AuthLockConfig, Router, Storage)
export class Login {
    private lock: Auth0LockStatic;
    private loginStep: LoginStep = LoginStep.AuthLock;
    private config: IAuthConfig;

    constructor(private authHelper: AuthenticationHelper, private baseConfig: AuthLockConfig, private router: Router, private storage: Storage) {
        this.config = baseConfig.current;
        this.loginStep = this.authHelper.isAuthenticated() ? LoginStep.LoggedIn : LoginStep.AuthLock;
        const authLockOptions: Auth0LockConstructorOptions = {
            theme: {
                logo: this.config.theme.logo,
                primaryColor: "#3580BF"
            },
            languageDictionary: {
                title: "POS"
            },
            container: "login-box",
            auth: {
                params: {
                    scope: Constants.SCOPE
                },
                sso: true
            },
            rememberLastLogin: true,
            avatar: null
        };

        this.lock = new Auth0Lock(this.config.clientId, this.config.domain, authLockOptions);
        this.lock.on("authenticated", (authResult) => {
            this.loginStep = LoginStep.LoggedIn;
            this.lock.hide();
            this.authHelper.setAuthenticationInformation(<IAuthResult>authResult)
                .clearTokenFromHistory();
        });

        this.lock.on("authorization_error", (err: any) => {
            if (err.error_description) {
                let error = JSON.parse(err.error_description);
                if (error[0] === "password_expired") {
                    this.storage.username = error[1];
                    this.storage.connection = error[2];
                    this.storage.token = error[3];
                    this.router.navigateToRoute(Constants.PASSWORD_CHANGE_ROUTE_NAME);
                }
            }
        });
    }

    attached() {
        switch (this.loginStep) {
            case LoginStep.AuthLock:
                this.lock.show();
                break;
        }
    }

    detached() {
        this.lock.hide();
    }
}