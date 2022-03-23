import Link from 'next/link';
import Image from 'next/image';

const Logo = () => (
  <Link href="/">
    <a className="flex items-center space-x-2">
      <Image src="/images/jenkins_logo.png" alt="Logo" width={90} height={90} />
      <span className="hidden sm:inline-block font-extrabold text-3xl text-gray-700">
        Tools
      </span>
    </a>
  </Link>
);

export default Logo;
