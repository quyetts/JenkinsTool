import 'tailwindcss/tailwind.css';
import Head from 'next/head';
import { Header, Footer } from '@/components/index';
import { Provider } from 'next-auth/client'
import initFirebase from "../firebase/initFirebase";

function MyApp({ Component, pageProps }) {
  initFirebase();
  return (
    <>
      <Head>
        <title>Jenkins Tools</title>
      </Head>
      <Provider session={pageProps.session}>
        <Head>
          <title>
            Jenkins Tools
          </title>
          <meta
            name="description"
            content="Jenkins IP update"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </Provider>
    </>
  );
}

export default MyApp;
