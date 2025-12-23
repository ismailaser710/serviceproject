import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl text-center font-bold text-white mb-4">Welcome to SNAPRENT</h1>

      <div className="w-full max-w-md p-4 rounded shadow-lg bg-white mb-4 flex flex-col space-y-4">
        <button
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-700"
          onClick={() => navigate('/adminlogin')}
        >
          Login As Admin
        </button>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={() => navigate('/usersignin')}
        >
          Login As User
        </button>
        <button
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          onClick={() => navigate('/usersignup')}
        >
          Sign Up As User
        </button>
      </div>
    </div>
  );
};

export default Dashboard;