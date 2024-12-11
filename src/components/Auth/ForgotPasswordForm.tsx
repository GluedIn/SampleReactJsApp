import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function ForgotPasswordForm() {
  const { t } = useTranslation();
  const defaultLanguage = localStorage.getItem("defaultLanguage");
  // const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [success, setSuccess]: any = useState({});
  const [errors, setErrors]: any = useState({});

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.email) {
      newErrors.email = t("email-required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("email-valid");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: any) => {
    //Prevent page reload
    event.preventDefault();
    console.log("validateForm()", validateForm());
    if (validateForm()) {
      const authLoginInput = new gluedin.GluedInUserModule();
      var userSignInResponse = await authLoginInput.userForgotpassword(
        formData.email
      );
      console.log("API Response DATA", userSignInResponse);
      if (userSignInResponse.status == 200) {
        if (userSignInResponse.data.statusCode == 2001) {
          setSuccess({ forgotPasswordSuccess: t("email-verify") });
        } else {
          setErrors({
            forgotPasswordError: userSignInResponse.data.statusMessage,
          });
        }
      } else {
        setErrors({
          forgotPasswordError: userSignInResponse.data.statusMessage,
        });
      }
    }
  };

  return (
    <div className="sign-full">
      <div className="sign-body forgot-password-body">
        <div className="back-arrow-btn-parent mt-b-20">
          <a href="/sign-in" className="back-arrow-btn">
            <img
              src={
                defaultLanguage == "en"
                  ? "/gluedin/images/back-arrow.svg"
                  : "/gluedin/images/back-arrow-right.svg"
              }
            />
            {t("back-btn")}
          </a>
        </div>
        <div className="clearfix"></div>

        <h3 className="text-blk ft-600">{t("text-forgotPassword")}</h3>
        <div className="text-blk mt-t-20 mt-b-20 text-gry res-show-text">
          {t("text-forgotText")}
        </div>

        <form
          action=""
          method="post"
          id="forgotPasswordForm"
          onSubmit={handleSubmit}
        >
          {errors.forgotPasswordError && (
            <div className="alert alert-danger" role="alert">
              {errors.forgotPasswordError}
            </div>
          )}
          {success.forgotPasswordSuccess && (
            <div className="alert alert-success success-alert" role="alert">
              {success.forgotPasswordSuccess}
            </div>
          )}
          <div className="input-grp first-input-box">
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
            <input
              type="submit"
              className="user-sign-in submit-button"
              value="Submit"
              name=""
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
