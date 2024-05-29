import NavbarUnauthed from "../components/layout/NavbarUnauthed";
import NavbarAuthed from "../components/layout/NavbarAuthed";
import { getUser, getUserRole } from "@/lib/dal";
import NavbarAdmin from "@/components/layout/NavbarAdmin";

export default async function RootLayout({ children }) {
  const user = await getUser();
  const role = await getUserRole();
  console.log('userRole', getUserRole())

  return (
    <html lang="en">
      <body>
        {!user && !role && <NavbarUnauthed />}
        {user && !role && <NavbarAuthed /> }
        {user && role.role_name === 'MAIN_ADMIN' && <NavbarAdmin/>}
        {children}
      </body>
    </html>
  );
  
}
