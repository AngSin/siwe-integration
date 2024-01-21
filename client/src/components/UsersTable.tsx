import { useState, useEffect, useContext } from "react";
import { User } from "../utils/types";
import { getAllUsers } from "../utils/api";
import { LoadingSpinner } from "./LoadingSpinner";
import { walletContext } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";

const UsersTable = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const { signInWithEthereum } = useContext(walletContext);
  const navigate = useNavigate();
  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const navigateToProfile = async () => {
    const isVerified = await signInWithEthereum();
    if (isVerified) {
      navigate("/profile");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="w-full text-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Bio</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>
                {user.image ? (
                  <img src={user.image} alt={`${user.name}'s avatar`} />
                ) : (
                  "No image uploaded"
                )}
              </td>
              <td>{user.name}</td>
              <td>{user.bio || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        className="text-center w-full cursor-pointer bg-cyan-100"
        onClick={navigateToProfile}
      >
        Create/Edit your profile
      </div>
    </div>
  );
};

export default UsersTable;
