import localFont from "next/font/local";
import Provider from "./components/context/provider";
import "./globals.css";
import Navbar from "./components/general/Navbar";
import { logSession } from "./actions/session";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export default async function RootLayout({ children }) {

    const userSession = await logSession();

  return (
    <html lang="en">
        <title>Course Project</title>
        <meta name="description" content="This page was created for itransition intern program." />
        <meta name="keywords" content="itransition, courseproject, javascript, nextjs, David Joao Sandoval" />
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
            <Provider>
                <Navbar session={userSession}/>
                {children}  
            </Provider>
        </body>
    </html>
  );
}
