import { Aurelia } from "aurelia-framework";
import { AuthLockConfig } from "./base-config";

export function configure(aurelia: Aurelia, configCallback) {
    let baseConfig: AuthLockConfig = aurelia.container.get(AuthLockConfig);
    if (configCallback !== undefined && typeof (configCallback) === "function") {
        configCallback(baseConfig);
    }
}