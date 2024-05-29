import 'server-only'
 
import { cookies } from 'next/headers'
import { decrypt } from './session'
import User from "@/models/User";
import Role from "@/models/Role";

import {cache} from 'react';
export const verifySession = cache(async () => {
  if (cookies().get('session')?.value){

    const cookie = cookies().get('session').value;
    const session = await decrypt(cookie);

    if (!session.userId) {
      redirect('/sign-in');
    }
  
    return { isAuth: true, userId: session.userId }
  }
  else return null;
  
});

export const getUser = cache(async () => {
    const session = await verifySession();

    if (!session) return null;
   
    try {
      const result = await User.findById(session.userId);

      const user = result.data;

      return user;
    } catch (error) {
      console.error('Failed to fetch user');
      return null;
    }
});

export const getUserRole = async () => {
  const user = await getUser();
  if (user){
    const userRoles = await User.getUserRolesByUserId(user.user_id);
    const role = await Role.findById(userRoles.data.role_id);
    return role.data[0];
  }
  else return null;
}