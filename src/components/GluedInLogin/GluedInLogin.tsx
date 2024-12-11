import AuthHeader from "../Layouts/AuthHeader";
import LoaderDark from "../common/LoaderDark/LoaderDark";
import gluedin from "gluedin-shorts-js";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function GluedInLogin() {
  const [errors, setErrors]: any = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    accessToken: "",
    env: "dev",
  });
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    console.log(event.target);
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  const handleSubmit = async (event: any) => {
    //Prevent page reload
    setIsLoading(true);
    event.preventDefault();
    var userModuleObj = new gluedin.GluedInAuthModule();
    var response = await userModuleObj.clientSignIn(formData);
    if (response.status === 200) {
      if (response.data.statusCode === 2001) {
        var userModule = new gluedin.GluedInUserModule();
        var userConfigResponse = await userModule.getUserMetaIds("");
        if (
          userConfigResponse.status === 200 ||
          userConfigResponse.status === 201
        ) {
          let following = userConfigResponse.data.result.following || [];
          localStorage.setItem("following", JSON.stringify(following));
        }
        setIsLoading(false);
        navigate("/vertical-player");
      } else {
        setIsLoading(false);
        setErrors({ loginRespError: response.data.statusMessage });
      }
    } else {
      setIsLoading(false);
      setErrors({ loginRespError: response.data.statusMessage });
    }
  };
  return (
    <>
      <AuthHeader />
      <div className="sign-full">
        <div className="sign-body">
          <div className="res-logo desk-none text-center">
            <Link to="/">
              <img
                src="./gluedin/images/Brand.svg"
                width={200}
                height={80}
                alt="GluedIn Logo"
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
            id="signInForm1"
            className="mt-t-40"
            onSubmit={handleSubmit}
          >
            <div className="input-grp first-input-box">
              <label className="mb-2 block">STC Token</label>
              <input
                type="text"
                name="accessToken"
                id="token"
                placeholder="Enter Token"
                value={formData.accessToken}
                onChange={handleInputChange}
              />
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

            <div className="input-grp">
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
    </>
  );
}

export default GluedInLogin;
