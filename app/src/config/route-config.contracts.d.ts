interface IRoute {
    route: string | string[];
    moduleId: string;
    title?: string;
    auth?: boolean;
    admin?: boolean;
    elementId?: string;
    name?: string;
    ssoUser?: boolean;
}