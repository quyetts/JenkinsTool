import {useState} from 'react';
import Head from 'next/head';
import axios from 'axios';

const Index = () => {
  const [data, setData] = useState(
    {
      json : '{}',
    }
  );

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData({
      ...data,
      [name]: value
    })
  }

  const hashJson = async () => {
    await axios.post(
      `/api/hash/stg`,
      {
        json: JSON.parse(data.json)
      }
    ).then(async result => {
      setData({
        ...data,
        result: result?.data?.hashed
      })

      await navigator.clipboard.writeText(result?.data?.hashed);

      alert("Copied to your clipboard");

      console.log(result?.data?.hashed);
    }).catch(e => {
      setData({
        ...data,
        result: e
      });
    })
  };

  return (
    <>
      <Head>
        <title>Hash content body | Jenkins Tools</title>
      </Head>
      {
        <div className="max-w-md mx-auto py-12 px-6">
          <div className="w-full max-w-xl">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Paste you content body
                </label>
                <input name="json" onChange={handleChange} value={data.json} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="{}" />
              </div>
              <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={hashJson}
                        type="button">
                  HASH
                </button>
              </div>
            </form>
            <input name="result"  value={data.result} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text"/>

          </div>
        </div>
      }
    </>
  );
};

export default Index;
