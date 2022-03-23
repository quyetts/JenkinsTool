import { Logo } from '@/components/index';
import {
  signIn,
  signOut,
  useSession,
} from 'next-auth/client';
import Link from 'next/link';

const Header = () => {
  const [ session ] = useSession();
  return (
    <header className="sticky top-0 bg-white z-10 shadow">
      <div className="container mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div className="container xl:max-w-screen-xl mx-auto flex justify-between">
          <Logo />
          <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
            {(session?.user?.email === "quyetts@gmail.com" || session?.user?.email === "hoangntvn@gmail.com") ?
              <Link href="/admin">
                <a className="mr-5 hover:text-red-900">
                  Admin
                </a>
              </Link> :
              null
            }
          </nav>
          <nav className="md:ml-auto flex flex-wrap px-4 items-center text-base justify-center">
            <p className="px-4">
              {session ? `Hi ${session?.user?.name}` : null}
            </p>
            <button
              onClick={session ? signOut : () => signIn('google')} type="submit"
              className="max-w-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {session ? `Sign out` : `Sign in`}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
