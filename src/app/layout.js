import NavbarAdmin from "@/components/layout/NavbarAdmin";
import NavbarUnauthed from "@/components/layout/NavbarUnauthed";
import NavbarInstitutionAdmin from "@/components/layout/NavbarInstitutionAdmin";
import { getInstitutionUseedCode, getUser, getUserRole } from "@/lib/dal";
import "@/styles/fonts.module.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarTeacher from "@/components/layout/NavbarTeacher";
import NavbarSchoolchild from "@/components/layout/NavbarSchoolchild";

export default async function RootLayout({ children  }) {
  const user = await getUser();
  const userRole = await getUserRole();

  return (
    <html lang="en" style={{overflowX: 'hidden'}}>
      <body style={{backgroundColor: '#f8fbfb', margin: 0}}>
        {!user && <NavbarUnauthed />}
        {user && user.is_activated && userRole === 'MAIN_ADMIN' && <NavbarAdmin/>}
        {user && user.is_activated && userRole === 'INSTITUTION_ADMIN' && <NavbarInstitutionAdmin/>}
        {user && user.is_activated && userRole === 'TEACHER' && <NavbarTeacher/>}
        {user && user.is_activated && userRole === 'SCHOOLCHILD' && <NavbarSchoolchild/>}


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

