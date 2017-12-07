interface IErrorResponse extends Error, Response {
    handled: boolean;
}