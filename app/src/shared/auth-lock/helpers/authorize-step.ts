import { Redirect, PipelineStep, Next, NavigationInstruction } from "aurelia-router";
import { inject, Container } from "aurelia-framework";
import { AuthLockConfig, Constants } from "../base-config";
import { Storage } from "./storage";

@inject(AuthLockConfig, Storage)
export class AuthorizeStep implements PipelineStep {
    config: IAuthConfig;

    constructor(private baseConfig: AuthLockConfig, private storage: Storage) {
        this.config = baseConfig.current;
    }

    run(instruction: NavigationInstruction, next: Next) {
        let isAuthenticated = AuthorizeStep.isAuthenticated(),
            loginRoute = this.config.loginUrl,
            isAdmin = AuthorizeStep.isAdmin(),
            isSsoUser = this.storage.isSsoUser;
        if (!isAuthenticated && instruction.config.name === Constants.LOGIN_ROUTE_NAME && (!location.hash || !location.hash.startsWith("access_token"))) {
            this.storage.clearAll();
        }

        if (!isAuthenticated) {
            if (instruction.getAllInstructions().some(i => (<IRoute>i.config).auth)) {
                let returnUrl = `${instruction.fragment}`;
                if (!!instruction.queryString) {
                    returnUrl += `?${instruction.queryString}`;
                }
                this.storage.returnUrl = returnUrl;
                return next.cancel(new Redirect(loginRoute));
            }
        } else {
            // If the user is already authenticated 
            // and for some reason comes back to the login
            // then redirecto to previous URL
            if (instruction.config.name === Constants.LOGIN_ROUTE_NAME) {
                return next.cancel(new Redirect(this.storage.returnUrl));
            }

            // If the user is already authenticated
            // but is not and admin, and the current route requires admin privileges
            // then redirect the user to the default return url
            if (!isAdmin && instruction.getAllInstructions().some(i => (<IRoute>i.config).admin)) {
                this.storage.returnUrl = this.config.defaultReturnUrl;
                return next.cancel(new Redirect(loginRoute));
            }

            // If the user is already authenticated
            // but is a sso user, and the current route requires non sso user
            // then redirect the user to the default return url
            if (isSsoUser && instruction.getAllInstructions().some(i => !(<IRoute>i.config).ssoUser)) {
                this.storage.returnUrl = this.config.defaultReturnUrl;
                return next.cancel(new Redirect(loginRoute));
            }
        }

        return next();
    }

    /**
     * Returns whether the user is authenticated
     */
    static isAuthenticated(): boolean {
        let storage: Storage = Container.instance.get(Storage),
            token = storage.token;

        if (!token) {
            return false;
        }

        if (token.split(".").length !== 3) {
            return false;
        }

        let exp;
        try {
            let base64Url = token.split(".")[1];
            let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            exp = JSON.parse(window.atob(base64)).exp;
        } catch (error) {
            return false;
        }

        if (exp) {
            return Math.floor(new Date().getTime() / 1000) <= exp;
        }

        return true;
    }

    /**
     * Returns whether the user has admin rights
     */
    static isAdmin(): boolean {
        let storage: Storage = Container.instance.get(Storage),
            permissionClaims = storage.permissionClaims;

        return permissionClaims.some(c => c.toLowerCase().startsWith("admin:"));
    }
}