import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanel from "./AdminPanel";

function Home() {
    const [isPending, setPending] = useState(true);
    const [users, setUsers] = useState(null);
    const navigate = useNavigate();

    function logout(event){
        fetch('/logout', {
            method: 'GET',
        })
            .then(function(response) {
                if(response.ok) {
                    window.location.href = "/";
                    return;
                }
                throw new Error('Request failed.');
            })
            .catch(function(error) {
            console.log("fetching failed with error message: ", error);
        });
    }

    useEffect(()=>{
        fetch('/data', {
            method: 'GET'
        })
            .then(function(response) {
                if(response.ok) {
                    response.json().then(data=>{
                        setUsers(data);
                        setPending(false);
                    })
                } else { 
                    navigate('/login');
                }
            })
            .catch(function(error) {
            console.log("fetching failed with error message: ", error);
        });
    }, []);

  return (
    <div>
        {isPending && <h1>Loading data</h1>}
        {users && <AdminPanel users={users} setUsers={setUsers}/>}
        <button onClick={logout} type="button" class="btn btn-dark mt-4">Log out</button>
    </div>
  );
}

export default Home;