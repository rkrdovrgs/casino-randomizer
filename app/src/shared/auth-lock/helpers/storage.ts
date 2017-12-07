const StorageKeys = {
    UserFullName: "userFullName",
    LastRequest: "lastRequest",
    Token: "id_token",
    RefreshToken: "refresh_token",
    ReturnUrl: "returnUrl",
    Username: "username",
    LoggedIn: "loggedIn",
    PermissionClaims: "permissionClaims",
    IsSsoUser: "isSsoUser",
    Connection: "connection"
};

export class Storage {
    get userFullName(): string {
        return sessionStorage.getItem(StorageKeys.UserFullName);
    }
    set userFullName(value: string) {
        sessionStorage.setItem(StorageKeys.UserFullName, value);
    }

    get lastRequest(): string {
        return sessionStorage.getItem(StorageKeys.LastRequest);
    }
    set lastRequest(value: string) {
        sessionStorage.setItem(StorageKeys.LastRequest, value);
    }

    get token(): string {
        return sessionStorage.getItem(StorageKeys.Token);
    }
    set token(value: string) {
        sessionStorage.setItem(StorageKeys.Token, value);
    }

    get refreshToken(): string {
        return sessionStorage.getItem(StorageKeys.RefreshToken);
    }
    set refreshToken(value: string) {
        sessionStorage.setItem(StorageKeys.RefreshToken, value);
    }

    get returnUrl(): string {
        return sessionStorage.getItem(StorageKeys.ReturnUrl);
    }
    set returnUrl(value: string) {
        sessionStorage.setItem(StorageKeys.ReturnUrl, value);
    }

    get username(): string {
        return sessionStorage.getItem(StorageKeys.Username);
    }
    set username(value: string) {
        sessionStorage.setItem(StorageKeys.Username, value);
    }

    get loggedIn(): string {
        return sessionStorage.getItem(StorageKeys.LoggedIn);
    }
    set loggedIn(value: string) {
        sessionStorage.setItem(StorageKeys.LoggedIn, value);
    }


    get permissionClaims(): string[] {
        var claims = sessionStorage.getItem(StorageKeys.PermissionClaims);
        return !!claims ? claims.split(",") : [];
    }
    set permissionClaims(value: string[]) {
        sessionStorage.setItem(StorageKeys.PermissionClaims, value.join(","));
    }

    get isSsoUser(): boolean {
        return sessionStorage.getItem(StorageKeys.IsSsoUser) === "true";
    }
    set isSsoUser(value: boolean) {
        sessionStorage.setItem(StorageKeys.IsSsoUser, value.toString());
    }

    get connection(): string {
        return sessionStorage.getItem(StorageKeys.Connection);
    }
    set connection(value: string) {
        sessionStorage.setItem(StorageKeys.Connection, value);
    }

    clearAll() {
        Object.keys(StorageKeys).forEach(k => {
            let sessionKey: string = StorageKeys[k];
            if (sessionKey !== StorageKeys.ReturnUrl) {
                sessionStorage.removeItem(sessionKey);
            }
        });
    }
}