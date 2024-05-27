import NavbarUnauthed from "../components/layout/NavbarUnauthed";
import NavbarAuthed from "../components/layout/NavbarAuthed";
import { getUser } from "@/app/lib/dal";
import "@/styles/styles_basic.css";

export default async function RootLayout({ children }) {
  const user = await getUser();

  return (
    <html lang="en">
      <body>
        {user ? <NavbarAuthed /> : <NavbarUnauthed />}
        {children}
      </body>
    </html>
  );
  
}
