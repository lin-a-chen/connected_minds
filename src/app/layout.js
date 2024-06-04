import NavbarUnauthed from "@/components/layout/NavbarUnauthed";
import NavbarAuthed from "@/components/layout/NavbarAuthed";
import NavbarInstitutionAdmin from "@/components/layout/NavbarInstitutionAdmin";
import { getUser, checkIfMainAdmin, checkIfInstitutionAdmin, getUserRole } from "@/lib/dal";
import NavbarAdmin from "@/components/layout/NavbarAdmin";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default async function RootLayout({ children }) {
  const user = await getUser();
  const userRole = await getUserRole();

  return (
    <html lang="en" style={{overflowX: 'hidden'}}>
      <body style={{backgroundColor: '#f8fbfb', margin: 0}}>
        {!user && <NavbarUnauthed />}
        {user && user.is_activated && userRole === 'MAIN_ADMIN' && <NavbarAdmin/>}
        {user && user.is_activated && userRole === 'INSTITUTION_ADMIN' && <NavbarInstitutionAdmin/>}

        {children}
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
      </body>
    </html>
  );
  
}
