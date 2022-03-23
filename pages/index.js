import {useEffect, useRef, useState} from 'react';
import Head from 'next/head';
import {useSession} from "next-auth/client";
import firebase from "firebase/app";
import "firebase/firestore";
import isIp from "is-ip";

const publicIp = require('public-ip');

const Index = () => {
  const [ session ] = useSession();

  const [data, setData] = useState(
    {
      ip : '',
    }
  );

  const autoIP = useRef();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData({
      ...data,
      [name]: value
    })
  }

  useEffect((async () => {
    autoIP.current = await publicIp.v4() || 'Please update your IP manually';
    setData({
      ...data,
      ip: autoIP.current,
    })
  }), []);

  const saveIP = () => {
    if(isIp(data.ip)) {
      try {
        firebase.firestore()
          .collection('ipCollection')
          .doc(session.user.email) // leave as .doc() for a random unique doc name to be assigned
          .set({
            email: session.user.email,
            ip: data.ip,
            last_updated : firebase.firestore.Timestamp.now()
          })
          .then(alert(`${data.ip} was successfully updated to database!`))
      } catch (error) {
        console.log(error)
        alert(error)
      }
    } else {
      alert(`${data.ip} is invalid!`);
    }
  };

  const handleDelete = async (email) => {
    try {
      firebase.firestore()
      .collection('ipDeletedCollection')
      .doc() // leave as .doc() for a random unique doc name to be assigned
      .set({
        email: session.user.email,
        old_ip: autoIP.current,
        last_updated : firebase.firestore.Timestamp.now()
      })
      .then(async () => {
        await firebase.firestore().collection('ipCollection').doc(email).delete();
        alert("Your IP has been removed from the automatic IP list");
      })
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }

  return (
    <>
      <Head>
        <title>Update IP | Jenkins Tools</title>
      </Head>
      {
        session?.user ?
          <div className="max-w-md mx-auto py-12 px-6">
            <div className="w-full max-w-xl">
              <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Put your IP here
                  </label>
                  <input name="ip" onChange={handleChange} value={data.ip} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="IP" />
                </div>
                <div className="flex items-center justify-between">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          onClick={saveIP}
                          type="button">
                    UPDATE
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          onClick={() => handleDelete(session.user.email)}
                          type="button">
                    DELETE MY IP
                  </button>
                </div>
              </form>
            </div>
          </div> :
          null
      }
    </>
  );
};

export default Index;
