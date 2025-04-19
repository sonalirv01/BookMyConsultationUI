import React, { useState } from "react";
import {
  FormControl,
  Input,
  InputLabel,
  Button,
  withStyles,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import {
  generateFieldsErrorDefault,
  generateFormInitialValues,
} from "../../common/form/FormUtils";
import * as TokenUtil from "../../common/utils/TokenUtil";
import { login } from "../../common/utils/HttpConnector";

const style = (theme) => ({
  centerElement: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  fieldContainer: {
    marginBottom: theme.spacing(1),
  },
  emptyFieldErr: {
    border: "solid 2px #5b5b5b",
    backgroundColor: "#5b5b5b",
    borderRadius: theme.spacing(1 / 2),
    marginTop: theme.spacing(1),
    color: "white",
  },
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
});

const Login = (props) => {
  const { classes } = props;
  const formInputFields = [
    {
      name: "email",
      label: "Email",
      required: true,
      type: "text",
      autoFocus: true,
    },
    {
      name: "password",
      label: "Password",
      required: true,
      type: "password",
      autoFocus: false,
    },
  ];

  const [formError, setFormError] = useState(generateFieldsErrorDefault(formInputFields));
  const [formData, setFormData] = useState(generateFormInitialValues(formInputFields));
  const [loginFailed, setLoginFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added submitting state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (loginFailed) {
      setLoginFailed(false);
    }
  };

  const resetForm = () => {
    setFormError(generateFieldsErrorDefault(formInputFields));
    setFormData(generateFormInitialValues(formInputFields));
  };

  const validate = (values) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = Object.keys(values).reduce((prev, current) => {
      const isValid = values[current] !== null && values[current] !== "" ? true : false;
      return { ...prev, [current]: { isValid, errMsg: "Please fill out this field.", isEmpty: !isValid }};
    }, {});

    if (errors.email.isValid && !regexEmail.test(values.email)) {
      errors.email = { isValid: false, errMsg: "Enter valid email", isEmpty: false };
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validate(formData);
    const canSubmitForm = Object.keys(errors).reduce((prev, key) => {
      return prev && errors[key].isValid;
    }, true);
    setFormError(errors);

    if (canSubmitForm) {
      setIsSubmitting(true); // Start submitting
      login(formData)
        .then((response) => {
          setIsSubmitting(false); // Stop submitting
          if (response.status === 200) {
            TokenUtil.setToken(response).then(() => {
              props.setAuthenticated(true);
              props.closePopup();
            });
          } else if (response.status >= 400 && response.status < 500) {
            setLoginFailed(true);
            resetForm();
          }
        })
        .catch((err) => {
          console.error(err);
          setIsSubmitting(false); // Stop submitting
          setLoginFailed(true);
        });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        className={classes.centerElement}
      >
        {formInputFields.map((field, index) => {
          return (
            <div className={classes.fieldContainer} key={`formfield_${index}_${field.label}`}>
              <FormControl fullWidth>
                <InputLabel required={field.required} htmlFor={field.name}>
                  {field.label}
                </InputLabel>
                <Input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  error={!formError[field.name].isValid}
                  onChange={handleChange}
                  value={formData[field.name]}
                  autoFocus={field.autoFocus}
                />
                {formError[field.name].isEmpty && (
                  <Typography className={classes.emptyFieldErr}>{formError[field.name].errMsg}</Typography>
                )}
                {!formError[field.name].isEmpty && !formError[field.name].isValid && (
                  <Typography color="error">{formError[field.name].errMsg}</Typography>
                )}
              </FormControl>

              <br />
            </div>
          );
        })}
        <br />
        {loginFailed && <Typography color="error">Invalid Credentials!</Typography>}
        <br />
        {isSubmitting ? (
          <div className={classes.loadingSpinner}>
            <CircularProgress />
          </div>
        ) : (
          <Button variant="contained" color="primary" type="submit">
            Login
          </Button>
        )}
      </form>
    </div>
  );
};

export default withStyles(style)(Login);
