import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import clsx from "clsx";
import styles from "./index.module.css";
import hero from "@site/static/img/hero.png";
import CalendarSvg from "@site/static/img/anocca_calendar.svg";
import { Box, Typography } from "@mui/material";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={""}>
      <Box position="relative">
        <Box
          component={"img"}
          src={hero}
          alt="Anocca Calendar Logo"
          position={"absolute"}
          sx={{ inset: 0 }}
        />
        <Box
          sx={{
            position: "relative",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h2" color="white" sx={{ pt: 4 }}>
            {siteConfig.title}
          </Typography>
        </Box>
      </Box>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <Box sx={{ height: "100%" }}></Box>
    </Layout>
  );
}
