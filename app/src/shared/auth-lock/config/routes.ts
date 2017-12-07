import { AuthLockConfig, Constants } from "shared/auth-lock/base-config";
import { Container } from "aurelia-dependency-injection";

const config = (<AuthLockConfig>Container.instance.get(AuthLockConfig)).current;
export default [
    {
        route: config.loginUrl,
        moduleId: "shared/auth-lock/account/login",
        title: "Login",
        name: Constants.LOGIN_ROUTE_NAME
    },
    {
        route: config.unauthorizedUrl,
        moduleId: "shared/auth-lock/account/unauthorized",
        title: "Unauthorized",
        name: Constants.UNAUTHORIZED_ROUTE_NAME
    },
    {
        route: config.changePasswordUrl,
        moduleId: "shared/auth-lock/account/change-password",
        title: "Reset Password",
        ssoUser: false,
        name: Constants.PASSWORD_CHANGE_ROUTE_NAME
    },
    {
        route: "/silent",
        moduleId: "shared/auth-lock/account/silent",
        title: "Silent Auth",
        name: "AuthLockSilentRoute"
    }
];