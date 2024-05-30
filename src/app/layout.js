import NavbarUnauthed from "@/components/layout/NavbarUnauthed";
import NavbarAuthed from "@/components/layout/NavbarAuthed";
import { getUser, checkIfMainAdmin } from "@/lib/dal";
import NavbarAdmin from "@/components/layout/NavbarAdmin";

export default async function RootLayout({ children }) {
  const user = await getUser();
  const isMainAdmin = await checkIfMainAdmin();

  return (
    <html lang="en">
      <body style={{backgroundColor: '#f8fbfb', margin: 0}}>
        {!user && !isMainAdmin && <NavbarUnauthed />}
        {user && !isMainAdmin && <NavbarAuthed /> }
        {user && isMainAdmin && <NavbarAdmin/>}
        {children}
      </body>
    </html>
  );
  
}
