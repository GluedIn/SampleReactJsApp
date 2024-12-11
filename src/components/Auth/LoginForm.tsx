import LoaderDark from "../common/LoaderDark/LoaderDark";
import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    deviceId: "23424dsffsf",
    deviceType: "android",
    autoCreate: true,
    termConditionAccepted: true,
  });
  const [errors, setErrors]: any = useState({});
  const [passwordType, setPasswordType] = useState("password");
  const [isLoading, setIsLoading] = useState(false);

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

    if (!formData.password) {
      newErrors.password = t("password-required");
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
    event.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      var authLoginInput = new gluedin.GluedInAuthModule();
      var userSignInResponse = await authLoginInput.AuthRawData(formData);
      if (userSignInResponse.status === 200) {
        if (userSignInResponse.data.statusCode === 2001) {
          var userModuleObj = new gluedin.GluedInUserModule();
          var userConfigResponse = await userModuleObj.getUserMetaIds("");
          if (
            userConfigResponse.status === 200 ||
            userConfigResponse.status === 201
          ) {
            let following = userConfigResponse.data.result.following || [];
            localStorage.setItem("following", JSON.stringify(following));
          }
          navigate("/vertical-player");
        } else {
          setErrors({ loginRespError: userSignInResponse.data.statusMessage });
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setErrors({ loginRespError: userSignInResponse.data.statusMessage });
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
        {errors?.loginRespError && (
          <p className="error">{errors?.loginRespError}</p>
        )}
        <form
          action=""
          method="post"
          id="signInForm"
          onSubmit={handleSubmit}
          className="mt-t-40"
        >
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
            <button
              type="submit"
              className="user-sign-in submit-button flex items-center justify-center disabled:pointer-events-none disabled:opacity-80"
              disabled={isLoading}
            >
              {isLoading ? <LoaderDark /> : t("btn-signIn")}
            </button>
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

export default LoginForm;
