import { inject as service } from "@ember/service";
const errorMessageMap = service();
const errorMessageConfig = service();
export function formatErrorMessage(xhrError) {
  let errorJSON = errorMessageConfig.getJSONErrorMap(),
    error = {
      showError: true,
      errorTitle: errorJSON.genericErrorMsg.errorCaption,
      errors: [errorJSON.genericErrorMsg.generalError],
    },
    errors = xhrError.errors;

  if (errors !== undefined && errors[0]) {
    if (errors[0].status === undefined || errors[0].status >= "500") {
      error.errors = [errorJSON.genericErrorMsg.serverSideError];
    } else if (errors[0].status && errors[0].status >= "400") {
      /**
       * Model specific server errors (400, 401, 403 etc).
       *
       * titleKey & messageKey are keys used to lookup for error title & error message in error-config
       * To pick the right title & message, pass these 2 values from component/route where this mixin is used.
       * If this is not passed, 'title' will be looked up in 'genericErrorMsg'.
       *  'message' will be looked up in entire errorMap file using the "detail" & "status" key of the error response.
       *  But this has the risk of picking up first error msg if there are duplicate error keys.
       */

      let titleKey = xhrError.titleKey ? xhrError.titleKey : "genericErrorMsg",
        messageKey = xhrError.messageKey;

      error.errorTitle = errorJSON[titleKey].errorCaption;

      if (xhrError.messageKey) {
        error.errors = errors.map(
          (error) => errorJSON[messageKey][error.detail]
        );
      } else {
        let errorMessages = [],
          message = null;

        errors.forEach((error) => {
          message = errorMessageMap.getErrorMessage(error.status, error.detail);
          errorMessages.push(message);
        });
        error.errors = errorMessages;
      }
    }
  }
  return error;
}
