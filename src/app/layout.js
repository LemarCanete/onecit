import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/GloabalRedux/provider";
import NextBreadCrumb from "@/components/NextBreadCrumb";
import { ChatContextProvider } from "@/context/ChatContext";
import { AuthContextProvider } from "@/context/AuthContext";
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
            <AuthContextProvider>
                <ChatContextProvider>
                    {/* <NextBreadCrumb
                        homeElement={''}
                        separator={<span> / </span>}
                        activeClasses='text-amber-500'
                        containerClasses='flex py-5 absolute bottom-0 right-0' 
                        listClasses='hover:underline mx-2 font-bold'
                        capitalizeLinks
                    /> */}
                    {children}
                </ChatContextProvider>
            </AuthContextProvider>
        </Providers>
      </body>
    </html>
  );
}
