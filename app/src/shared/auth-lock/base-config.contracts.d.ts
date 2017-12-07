interface IAuthConfig extends IBaseConfig {
    domain: string;
    callbackUrl?: string;
    tenantHeader: string;
    defaultReturnUrl: string;
    defaultAdminUrl: string;
    unauthorizedUrl: string;
    unauthorizedMessage: string;
    changePasswordUrl: string;
    ssoPasswordChangeUrl: string;
    theme: {
        logo: string;
    };
}