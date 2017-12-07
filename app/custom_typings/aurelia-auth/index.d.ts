interface IBaseConfig {
    httpInterceptor: boolean;
    loginOnSignup: boolean;
    baseUrl: string;
    loginRedirect: string;
    logoutRedirect: string;
    signupRedirect: string;
    loginUrl: string;
    signupUrl: string;
    profileUrl: string;
    loginRoute: string;
    signupRoute: string;
    tokenRoot: boolean;
    tokenName: string;
    tokenPrefix: string;
    unlinkUrl: string;
    unlinkMethod: string;
    authHeader: string;
    authToken: string;
    withCredentials: boolean;
    platform: string;
    storage: string;
    clientId: string;
}

declare module "aurelia-auth/authentication" {
    export class Authentication {
        setToken(response: any, redirect?: any);
    }
}

declare module "aurelia-auth/base-config" {
    export class BaseConfig {
        configure(incomingConfig: any): void;
        current: IBaseConfig;
    }

    export var IBaseConfig: IBaseConfig;
}

declare module "aurelia-auth/storage" {
    export class Storage {
        get(key: string): any;
        set(key: string, value: string): any;
        remove(key: string): any;
    }
}