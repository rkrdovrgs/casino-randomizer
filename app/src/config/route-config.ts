import * as _ from "lodash";
import routes from "config/routes";

export class RouteConfiguration {
    private getRoutes(): Array<IRoute> {
        return _.map(routes, (r: IRoute) => {
            r.auth = r.auth !== false;
            r.elementId = r.elementId || r.name;
            return r;
        });
    }

    configure(config): void {
        config.options.pushState = true;
        config.options.hashChange = false;

        config.map(this.getRoutes());
    }
}