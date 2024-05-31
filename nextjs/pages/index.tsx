import Image from "next/image";
import { Inter } from "next/font/google";
import { Roboto } from "next/font/google";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import mbp from "@/public/mbp.png";
import wave from "@/public/wave.png";
import planet from "@/public/planet.png";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export default function Home() {
  const theme = useTheme();
  return (
    <main
      className={`${roboto.className} h-[calc(100vh-80px)] flex items-center justify-center`}
    >
      <div className="px-8 md:px-10 xl:px-20 shrink max-w-screen overflow-hidden">
        <div className="flex gap-8 max-w-[1280px] items-center flex-col-reverse md:flex-row">
          <div className="flex flex-col gap-4 md:gap-8 xl:gap-20 items-center md:items-start">
            <div>
              <Typography variant="h1" className="text-[min(4vw,80px)] flex">
                Get started in 5 minutes
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button
                variant="contained"
                color="primary"
                className="whitespace-nowrap"
              >
                Tutorial
              </Button>
              <Button
                variant="outlined"
                color="primary"
                className="whitespace-nowrap"
              >
                API Docs
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-8 items-center">
            <Image
              src={mbp}
              alt="Macbook Pro with the Anocca Calendar"
              className="w-[min(50vw,1024px)]"
            />
            <div>
              <pre>
                <span className="angle-bracket">{`<`}</span>
                <span className="component">{`MonthCalendar`}</span>
                <span className="space-or-indent">{``}</span>
                <span className="param">{`events`}</span>
                <span className="equal">{`=`}</span>
                <span className="curly-bracket">{`{`}</span>
                <span className="prop">{`events`}</span>
                <span className="curly-bracket">{`}`}</span>
                <span className="space-or-indent">{``}</span>
                <span className="param">{`startOfMonth`}</span>
                <span className="equal">{`=`}</span>
                <span className="curly-bracket">{`{`}</span>
                <span className="constructor">{`new`}</span>
                <span className="">{` `}</span>
                <span className="class">{`Date`}</span>
                <span className="paranthesis">{`()`}</span>
                <span className="curly-bracket">{`}`}</span>
                <span className="space">{``}</span>
                <span className="angle-bracket">{`/>`}</span>
              </pre>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 pointer-events-none">
        <Image
          src={theme.palette.mode === "light" ? wave : planet}
          alt="Some art"
          className="w-[100vw]"
        />
      </div>
    </main>
  );
}
