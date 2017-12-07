import { BaseConfig as AureliaAuthBaseConfig } from "aurelia-auth/base-config";

export const Constants = {
    LOGIN_ROUTE_NAME: "AuthLockLoginRoute",
    UNAUTHORIZED_ROUTE_NAME: "AuthLockUnauthorizedRoute",
    PASSWORD_CHANGE_ROUTE_NAME: "PasswordChangeRoute",
    SCOPE: "openid offline_access email app_metadata user_metadata identities"
};

export class AuthLockConfig extends AureliaAuthBaseConfig {
    private _current: IAuthConfig;
    get current(): IAuthConfig {
        return this._current;
    }

    constructor() {
        super();
        let base = Object.getOwnPropertyDescriptor(AureliaAuthBaseConfig.prototype, "current").get.apply(this);
        this._current = Object.assign(base, <IAuthConfig>{
            //defaults
            tenantHeader: "X-Tenant",
            defaultReturnUrl: "/",
            unauthorizedUrl: "/unauthorized",
            changePasswordUrl: "/account/change-password",
            unauthorizedMessage: "You do not have permission to access this application",
            ssoPasswordChangeUrl: "account/sso/password-change"
        });
    }
}