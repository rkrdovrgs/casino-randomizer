// Type definitions for alertify 0.3.11
// Project: http://fabien-d.github.io/alertify.js/
// Definitions by: John Jeffery <http://github.com/jjeffery>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


interface IAlertifyStatic {
    /**
     * Create an alert dialog box
     * @param message   The message passed from the callee
     * @param fn        Callback function
     * @param cssClass  Class(es) to append to dialog box
     * @return alertify (ie this)
     * @since 0.0.1
     */
    alert(message?: string, fn?: Function, cssClass?: string): IAlertifyStatic;

    /**
     * Create a confirm dialog box
     * @param message   The message passed from the callee
     * @param fn        Callback function
     * @param cssClass  Class(es) to append to dialog box
     * @return alertify (ie this)
     * @since 0.0.1
     */
    confirm(message?: string, fn?: Function, cssClass?: string): IAlertifyStatic;

    /**
     * Extend the log method to create custom methods
     * @param type  Custom method name
     * @return function for logging
     * @since 0.0.1
     */
    extend(type: string): (message: string, wait?: number) => IAlertifyStatic;

    /**
     * Initialize Alertify and create the 2 main elements.
     * Initialization will happen automatically on the first
     * use of alert, confirm, prompt or log.
     * @since 0.0.1
     */
    init(): void;

    show(): void;
    /**
     * Show a new log message box
     * @param message   The message passed from the callee
     * @param type      Optional type of log message
     * @param wait      Optional time (in ms) to wait before auto-hiding
     * @return alertify (ie this)
     * @since 0.0.1
     */
    log(message: string, type?: string, wait?: number): IAlertifyStatic;

    /**
     * Create a prompt dialog box
     * @param message   The message passed from the callee
     * @param fn        Callback function
     * @param placeholder Default value for prompt input
     * @param cssClass  Class(es) to append to dialog
     * @return alertify (ie this)
     * @since 0.0.1
     */
    prompt(message?: string, fn?: Function, placeholder?: string, cssClass?: string): IAlertifyStatic;

    /**
     * Shorthand for log messages
     * @param message The message passed from the callee
     * @return alertify (ie this)
     * @since 0.0.1
     */
    success(message?: string): IAlertifyStatic;

    /**
     * Shorthand for log messages
     * @param message The message passed from the callee
     * @return alertify (ie this)
     * @since 0.0.1
     */
    error(message?: string): IAlertifyStatic;

    /**
     * Used to set alertify properties
     * @param Properties
     * @since 0.2.11
     */
    set(args: IProperties): IAlertifyStatic;

    setting(args: IProperties): IAlertifyStatic;

    /**
     * The labels used for dialog buttons
     */
    labels: ILabels;

    /**
     * Attaches alertify.error to window.onerror method
     * @since 0.3.8
     */
    debug(): void;

    /**
     * The defaults used
     */
    defaults: IDefaults;

    autoCancel(timeInSeconds: number): IAlertifyStatic;
}

/**
 * Properties for alertify.set function
 */
interface IProperties {
    message?: string;
    onok?: () => void;
    oncancel?: () => void;
    /** Default value for milliseconds display of log messages */
    delay?: number;

    /** Default values for display of labels */
    labels?: ILabels;

    title?: string;
    reverseButtons?: boolean;
    defaultFocus?: string;
    closableByDimmer?: boolean;
    /** Default button for focus */
    buttonFocus?: string;

    /** Should buttons be displayed in reverse order */
    buttonReverse?: boolean;
}

/** Labels for altertify.set function */
interface ILabels {
    ok?: string;
    cancel?: string;
}

interface IDefaults {
    modal: boolean;
    basic: boolean;
    frameless: boolean;
    movable: boolean;
    resizable: boolean;
    closable: boolean;
    closableByDimmer: boolean;
    maximizable: boolean;
    startMaximized: boolean;
    pinnable: boolean;
    pinned: boolean;
    padding: boolean;
    overflow: boolean;
    maintainFocus: boolean;
    transition: string;
    autoReset: boolean;
    notifier: {
        delay: number,
        position: string
    };
    glossary: {
        title: string;
        ok: string;
        cancel: string;
        acccpt: string;
        deny: string;
        confirm: string;
        decline: string;
        close: string;
        maximize: string;
        restore: string;
    };
    theme: {
        input: string;
        ok: string;
        cancel: string;
    };
}


declare var alertify: IAlertifyStatic;

declare module "alertifyjs" {
    export = alertify;
} 