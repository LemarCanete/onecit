import { Inter, Poppins, Satisfy } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/GloabalRedux/provider";
// const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["300"] })

export const metadata = {
  title: "OneCIT",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link href="https://fonts.googleapis.com/css2?family=Satisfy&display=swap" rel="stylesheet"/>
      </head>
      <body className={poppins.className}>
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
