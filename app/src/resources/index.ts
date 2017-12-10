import { FrameworkConfiguration } from "aurelia-framework";

export function configure(config: FrameworkConfiguration) {
    let resources = [
        "./value-converters/number"
    ];

    config.globalResources(resources);
}
