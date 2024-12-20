import { getUserCookie } from '../libs/action';
import HeaderWrap from './headerComp';

export default async function Header() {
  const user = await getUserCookie();

  const userNotNull = {
    username: user?.username?.value || '', // Ensure it is a string
    email: user?.email?.value || '', // Ensure it is a string
  };

  return <HeaderWrap user={userNotNull} />;
}
