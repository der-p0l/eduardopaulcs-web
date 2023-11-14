import React, { useEffect } from "react";
import Content from "./Content";
import { Box } from "@mui/material";
import { Navigate, useParams } from "react-router-dom";
import { DEFAULT_LANG, LANGUAGES } from "../../constants";
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";
import useLocationPath from "../../hooks/useLocationPath";

/**
 * Site layout component.
 */
const Layout = () => {
  const locationPath = useLocationPath(true);
  const params = useParams();
  const [t, i18n] = useTranslation("common");

  useEffect(() => {
    // When the language code changes

    // Get new and current languages
    const currentLang = i18n.language;
    const newLang = (params.lang !== undefined && LANGUAGES.includes(params.lang))
      ? params.lang
      : DEFAULT_LANG;

    // If the language actually changed
    if (currentLang !== newLang) {
      // Notify translator of change
      i18n.changeLanguage(newLang);

      document.documentElement.lang = t("seo.lang");
      document.title = t("seo.title");
    }
  }, [params.lang, t, i18n]);

  /**
   * Determines whether we should redirect the user to the default language
   * home page.
   */
  const shouldRedirect = () => {
    // If the user entered a wrong language code or landed on the root path
    if (
      locationPath === "/" ||
      (params.lang !== undefined && !LANGUAGES.includes(params.lang))
    ) {
      // Redirect
      return true;
    }

    return false;
  };

  const renderContent = () => {
    // If we should redirect the user to the default language home page
    if (shouldRedirect()) {
      return (
        <Navigate to={`/${DEFAULT_LANG}`} replace />
      );
    }

    return (
      <Box
        sx={{
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Navbar />
        <Content />
      </Box>
    );
  };

  return (
    <>
      {renderContent()}
    </>
  );
};

export default Layout;
