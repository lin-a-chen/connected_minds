
import { redirect } from 'next/navigation'
import { getUser, getUserRole } from "@/lib/dal";

export default async function Page(){

  const userRole = await getUserRole();
  const user = await getUser();

  return(
    <>
    {userRole === 'SCHOOLCHILD' && user && redirect('/cabinet/schoolchild')}
    {userRole === 'TEACHER' && user && redirect('/cabinet/teacher')}
    {!user && redirect('/auth/sign-in')}
    {userRole === 'MAIN_ADMIN' && user && redirect('/admin/users')}
    {userRole === 'INSTITUTION_ADMIN' && user && redirect('/admin/institution/classes')}

    </>
    
  );
}