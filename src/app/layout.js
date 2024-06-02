import NavbarUnauthed from "@/components/layout/NavbarUnauthed";
import NavbarAuthed from "@/components/layout/NavbarAuthed";
import { getUser, checkIfMainAdmin } from "@/lib/dal";
import NavbarAdmin from "@/components/layout/NavbarAdmin";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default async function RootLayout({ children }) {
  const user = await getUser();
  const isMainAdmin = await checkIfMainAdmin();

  return (
    <html lang="en" style={{overflowX: 'hidden'}}>
      <body style={{backgroundColor: '#f8fbfb', margin: 0}}>
        {!user && !isMainAdmin && <NavbarUnauthed />}
        {user && !isMainAdmin && <NavbarAuthed /> }
        {user && isMainAdmin && <NavbarAdmin/>}
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
