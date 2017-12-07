import "whatwg-fetch";
import "url-search-params";
import { HttpClient, json as serializer } from "aurelia-fetch-client";
import * as toastr from "toastr";

export const json = serializer;

/**
 * Provides utility methods to call APIs using the Fetch browser API.
 */
export class ApiService extends HttpClient {
    constructor() {
        super();
        this.configure(config => {
            config.useStandardConfiguration()
                //.withBaseUrl("/api/")
                .withInterceptor({
                    request: (request) => {
                        request.headers.append("cache-control", "no-cache");
                        return request;
                    }
                });
        });
    }

    /**
     * Raises a toast message indicating that an error occurred, and throws an Error with an appropriate message.
     * @param error An Error or Response instance that indicates what kind of error happened.
     */
    static handleError(error: Error | Response): void {
        const message = error instanceof Error ? error.message : error.statusText;
        setTimeout(() => {
            if (!(error as IErrorResponse).handled) {
                toastr.error(message);
            }
        }, 10);
        throw error;
    }

    /**
     * Issues a GET request to the specified url.
     * @param url The URL to invoke. This URL will be prefixed with "/api/".
     */
    get<T>(url: string, params: Object = {}): Promise<T> {
        let request;

        if (!!Object.keys(params).length) {
            let searchParams = new URLSearchParams();
            Object.keys(params).forEach((key) => {
                searchParams.set(key, params[key]);
            });
            url = `${url}?${searchParams.toString()}`;
        }

        return request = this.fetch(url)
            .then(x => x.json())
            .catch(ApiService.handleError);
    }

    /**
     * Issues a POST request to the specified url.
     * @param url The URL to invoke. This URL will be prefixed with "/api/".
     * @param content An object that will be serialized to JSON and sent as the body of the POST request.
     */
    post(url: string, content: any): Promise<Response> {
        return <any>this
            .fetch(url, {
                method: "POST",
                body: json(content)
            })
            .catch(ApiService.handleError);
    }

    /**
     * Issues a PUT request to the specified url.
     * @param url The URL to invoke. This URL will be prefixed with "/api/".
     * @param content An object that will be serialized to JSON and sent as the body of the POST request.
     */
    put(url: string, content: any): Promise<Response> {
        return <any>this
            .fetch(url, {
                method: "PUT",
                body: json(content)
            })
            .catch(ApiService.handleError);
    }

    /**
     * Issues a DELETE request to the specified url.
     * @param url The URL to invoke. This URL will be prefixed with "/api/".
     * @param content An object that will be serialized to JSON and sent as the body of the POST request.
     */
    delete(url: string, content?: any): Promise<Response> {
        return <any>this
            .fetch(url, {
                method: "DELETE",
                body: json(content),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
            .catch(ApiService.handleError);
    }
}

