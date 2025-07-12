import { Button } from "@mui/material";
import { useLogoutMutation } from "../slices/userApiSlice";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const[logout] =  useLogoutMutation();

    function handleLogout(){
        logout();
        navigate("/signin");
    }
  return (
    <div>
      <h1>Welcome to Codeial</h1>
      <p>Your social network for developers.</p>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}

export default Home;