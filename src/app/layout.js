import { getUser, getUserRole } from "@/lib/dal";
import "@/styles/fonts.module.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "@/components/layout/Navbar";
import { LuUser } from "react-icons/lu";

export default async function RootLayout({ children  }) {
  const user = await getUser();
  const userRole = await getUserRole();

  const navbarLinksMainAdmin = [{source: '/admin/users', text: 'Користувачі'}, {source: '/admin/institutions', text: 'Навчальні заклади'}];
  const navbarLinksInstitutionAdmin = [{source: '/admin/institution/schoolchildren', text: 'Учні'}, {source: '/admin/institution/teachers', text: 'Вчителі'}, {source: '/admin/institution/classes', text: 'Класи'}, {source: '/admin/institution/schedule', text: 'Розклад'}, {source: '/admin/institution/subjects', text: 'Предмети'}];
  const navbarLinksSchoolchild = [{source: '/cabinet/schoolchild/academic-records', text: 'Мої оцінки'}, {source: '/cabinet/schoolchild/schedule', text: 'Розклад'}, {source: '/cabinet/schoolchild/homework', text: 'Домашнє завдання'}, {source: '/chats', text: 'Чати'}, {source: '/cabinet/schoolchild', text: <LuUser />}];
  const navbarLinksTeacher = [{source: '/cabinet/teacher/academic-records', text: 'Оцінки'}, {source: '/cabinet/teacher/my-schedule', text: 'Мій розклад'}, {source: '/cabinet/teacher/homework', text: 'Домашні завдання'}, {source: '/chats', text: 'Чати'}, {source: '/cabinet/teacher', text: <LuUser />}];

  return (
    <html lang="en" style={{overflowX: 'hidden'}}>
      <body style={{backgroundColor: '#f8fbfb', margin: 0}}>
        {user && user.is_activated && userRole === 'MAIN_ADMIN' && <Navbar navbarLinks={navbarLinksMainAdmin}/>}
        {user && user.is_activated && userRole === 'INSTITUTION_ADMIN' && <Navbar navbarLinks={navbarLinksInstitutionAdmin}/>}
        {user && user.is_activated && userRole === 'TEACHER' && <Navbar navbarLinks={navbarLinksTeacher}/>}
        {user && user.is_activated && userRole === 'SCHOOLCHILD' && <Navbar navbarLinks={navbarLinksSchoolchild}/>}


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

