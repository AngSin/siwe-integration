import React, { useContext, useEffect, useState } from "react";
import { walletContext } from "../context/WalletContext";
import { getProfile, saveUser} from "../utils/api";

const Profile = () => {
  const { signInWithEthereum } = useContext(walletContext);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");

  const getUserProfile = async () => {
    const { name, bio, image } = await getProfile();
    setName(name);
    if (bio) {
      setBio(bio);
    }
    if (image) {
      setImage(image);
    }
  };

  const signAndFetchProfile = async () => {
    try {
      const isSignedIn = await signInWithEthereum();
      if (isSignedIn) {
        await getUserProfile();
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    signAndFetchProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createOrEditUser = async () => {
    try {
      await saveUser({
        name,
        bio,
        image
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={createOrEditUser}
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ben Shafii"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Bio:
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="hot kartoffel"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create/Edit Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
