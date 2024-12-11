import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function RegistrationForm() {
  const { t } = useTranslation();
  const [formData, setFormData]: any = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors]: any = useState({});
  const [success, setSuccess]: any = useState({});
  const [passwordType, setPasswordType] = useState("password");

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData: any) => ({ ...prevFormData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.fullName) {
      newErrors.fullName = t("fullName-required");
    }

    if (!formData.email) {
      newErrors.email = t("email-required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("email-valid");
    }

    if (!formData.password) {
      newErrors.password = t("password-required");
    } else if (formData.password.length < 6) {
      newErrors.password = t("password-valid");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const handleSubmit = async (event: any) => {
    //Prevent page reload
    event.preventDefault();

    if (validateForm()) {
      var authLoginInput = new gluedin.GluedInAuthModule();
      formData.termConditionAccepted = true;
      var userSignUpResponse = await authLoginInput.SignupRawData(formData);
      const responseError: any = {};
      if (userSignUpResponse.status == 200) {
        if (userSignUpResponse.data.statusCode == 2003) {
          formData.fullName = "";
          formData.email = "";
          formData.password = "";
          setSuccess({
            registerSuccess: userSignUpResponse?.data?.statusMessage,
          });
        } else {
          responseError.registerResponseError =
            userSignUpResponse?.data?.statusMessage;
          setErrors(responseError);
        }
      } else {
        responseError.registerResponseError =
          userSignUpResponse?.data?.statusMessage;
        setErrors(responseError);
      }
    }
  };

  return (
    <div className="sign-full">
      <div className="sign-body">
        <div className="res-logo desk-none text-center">
          <Link to="/">
            <img
              src="./gluedin/images/Brand.svg"
              style={{ width: "200px", height: "80px" }}
              className="m-auto"
              alt=""
            />
          </Link>
        </div>

        <h3 className="text-blk ft-600 res-none tab-res-none">
          {t("Welcome-GluedIn")}
        </h3>

        <form
          action=""
          method="post"
          id="signupForm"
          className="mt-t-40"
          onSubmit={handleSubmit}
        >
          {errors.registerResponseError && (
            <div className="alert alert-danger" role="alert">
              {errors.registerResponseError}
            </div>
          )}
          {success.registerSuccess && (
            <div className="alert alert-success success-alert" role="alert">
              {success.registerSuccess}
            </div>
          )}
          <div className="input-grp first-input-box">
            <label>{t("label-fullname")}</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder=""
              value={formData.fullName}
              onChange={handleInputChange}
            />
            {errors.fullName && (
              <span className="error">{errors.fullName}</span>
            )}
          </div>

          <div className="input-grp">
            <label>{t("label-email")}</label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder=""
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input-grp">
            <label>{t("label-password")}</label>
            <div className="over-icon">
              <input
                type={passwordType}
                id="password"
                name="password"
                placeholder=""
                value={formData.password}
                onChange={handleInputChange}
              />
              <span onClick={togglePassword}>
                {" "}
                {passwordType === "password" ? (
                  <img src="./gluedin/images/eye.svg" />
                ) : (
                  <i className="fa fa-eye-slash"></i>
                )}
              </span>
            </div>
            {errors?.password && (
              <span className="error">{errors?.password}</span>
            )}
          </div>

          <div className="input-grp">
            <input
              type="submit"
              className="submit-button"
              value={t("btn-signUp") || ""}
              name=""
            />
          </div>
          <div className="input-grp text-center">
            <div className="link-text" style={{ display: `block` }}>
              <span>{t("text-account")}</span>&nbsp;
              <a href="/vertical-player" className="link">
                {t("guest-Login")}
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;
