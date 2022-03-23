import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from "next/router";
import firebase from "firebase/app"
import "firebase/firestore"
import {getSession} from "next-auth/client";
import initFirebase from "../../firebase/initFirebase";


const Admin = (props) => {
  const router = useRouter();
  const [results , setResults] = useState(props.users);
  const getData = async () => {
    try {
     const snapshot = await firebase.firestore().collection('ipCollection').get();
     let users = [];
     snapshot.forEach(doc => {
       users.push({
         email: doc.data().email,
         ip: doc.data().ip,
         last_updated: doc.data().last_updated.seconds
       });
     });
     setResults(users);
    } catch (error) {
     console.log(error)
     alert(error)
    }
  }

  const readData = () => {
    router.push(`/api/ip`);
  }

  const handleDelete = async (email) => {
    await firebase.firestore().collection('ipCollection').doc(email).delete();
    await getData();
    alert("Deleted");
  }

  return (
    <>
      <Head>
        <title>Admin | Jenkins Tools</title>
      </Head>
      {
        (props.session?.user?.email === "smthanh@gmail.com" || props.session?.user?.email === "hoangntvn@gmail.com") ?
          <div className="max-w-7xl mx-auto py-12 flex flex-col items-center">
            <button
              onClick={readData} type="submit"
              className="max-w-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:cursor-not-allowed disabled:hover:bg-blue-300 disabled:bg-blue-300"
            >
              Export data
            </button>
            {
              results.length !== 0 ?
                <div className="max-w-4xl mx-auto py-12">
                  <table className="table-fixed border-separate border border-green-900">
                    <thead>
                    <tr>
                      <th className="w-1/12 border px-4 font-medium">No</th>
                      <th className="w-1/3 border px-4 font-medium">Email</th>
                      <th className="w-1/3 border px-4 font-medium">IP</th>
                      <th className="w-1/3 border px-4 font-medium">Last updated</th>
                      <th className="w-1/3 border px-4 font-medium">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      results.map((item, idx) => {
                        return (
                          <tr key={idx}>
                            <td className="border px-4 py-2 font-medium">{idx + 1}</td>
                            <td className="border px-4 py-2 font-medium">{item.email}</td>
                            <td className="border px-4 py-2 font-medium">{item.ip}</td>
                            <td className="border px-4 py-2 font-medium">{item.last_updated}</td>
                            <td className="border px-4 py-2 font-medium">
                              <button onClick={() => handleDelete(item.email)}>Delete</button>
                            </td>
                          </tr>
                        )
                      })
                    }
                    </tbody>
                  </table>
                </div>
                : null
            }
          </div> :
          null
      }
    </>
  );
};

export default Admin;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session?.user?.email === "smthanh@gmail.com" || session?.user?.email === "hoangntvn@gmail.com") {
    try {
      initFirebase();
      const snapshot = await firebase.firestore().collection('ipCollection').get();
      let users = [];
      snapshot.forEach(doc => {
        users.push({
          email: doc.data().email,
          ip: doc.data().ip,
          last_updated: doc.data().last_updated.seconds
        });
      });
      return {
        props: {
          session: session,
          users
        }
      }

    } catch (error) {
      return {
        props: {
          users: []
        }
      }
    }
  } else {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }
}
