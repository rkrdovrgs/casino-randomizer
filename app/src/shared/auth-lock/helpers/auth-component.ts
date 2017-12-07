import { inject } from "aurelia-framework";
import { AuthenticationHelper } from "shared/auth-lock/helpers/authentication-helper";
import { Storage } from "shared/auth-lock/helpers/storage";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";

@inject(AuthenticationHelper, Storage, EventAggregator)
export abstract class AuthComponent {
    navEvent: Subscription;
    isAuthenticated: boolean;
    isAdmin: boolean;
    ssoUser: boolean;
    userFullName: string;

    constructor(...dependencies)
    constructor(private auth: AuthenticationHelper, private storage: Storage, private eventAggregator: EventAggregator) { }

    bind() {
        this.navEvent = this.eventAggregator.subscribe("router:navigation:complete", this.attached.bind(this));
    }

    unbind() {
        this.navEvent.dispose();
    }

    logout() {
        this.auth.logout();
    }

    attached() {
        this.isAuthenticated = this.auth.isAuthenticated();
        this.isAdmin = this.auth.isAdmin();
        this.userFullName = this.storage.userFullName;
        this.ssoUser = this.storage.isSsoUser;
    }
} 