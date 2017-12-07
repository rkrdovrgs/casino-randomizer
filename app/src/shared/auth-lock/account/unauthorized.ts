import { inject } from "aurelia-framework";
import { AuthLockConfig } from "../base-config";

@inject(AuthLockConfig)
export class Unauthorized {
    unauthorizedMessage: string;

    constructor(baseConfig: AuthLockConfig) {
        this.unauthorizedMessage = baseConfig.current.unauthorizedMessage;
    }
}