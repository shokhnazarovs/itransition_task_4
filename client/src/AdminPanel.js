import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function AdminPanel(props){
    const [isPending, setPending] = useState(false);
    const navigate = useNavigate();
    function checkState(event){
        let mainCheckBox = document.querySelector('#maincheckbox');
        let checkBoxes = document.querySelectorAll('.selectuser');
        let checkCounter = 0;
        if(event.target.id === 'maincheckbox' && mainCheckBox.checked){
            checkBoxes.forEach((box)=> box.checked = true);
        } else if(event.target.id === 'maincheckbox' && !mainCheckBox.checkBoxes){
            checkBoxes.forEach((box)=> box.checked = false);
        }
        checkBoxes.forEach((box)=>{
            if(box.checked) checkCounter = checkCounter + 1;
        });

        if(checkCounter > 0){
            document.querySelector('#toolbar').classList.remove('disabled');
            if(checkBoxes.length === checkCounter){
                mainCheckBox.checked = true;
            } else {
                mainCheckBox.checked = false;
            }
        } else {
            document.querySelector('#toolbar').classList.add('disabled');
        }
    }

    function handleClick(event){
        setPending(true);
        let selectedItems = [];
        let checkBoxes = document.querySelectorAll('.selectuser');

        checkBoxes.forEach(item => {
            if(item.checked) selectedItems.push(item.id);
        });

        fetch('/update', {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({
                data: selectedItems,
                action: event.currentTarget.name
            })
          })
            .then(function(response) {
              setPending(false);
              if(response.ok) {
                response.json().then(data=>{
                    props.setUsers(data);
                });
              } else {
                window.location.reload(true);
              }
            })
            .catch(function(error) {
              console.log("fetching failed with error message: ", error);
              setPending(false);
            });
    }
    const users = props.users;
    const tableRows = users.map((user) => 
        <tr key={user._id}>
            <th onChange={checkState} scope="row"><input id={user._id} className="selectuser" type="checkbox" /></th>
            <td>{user._id}</td>
            <td>{user.fname} {user.lname}</td>
            <td>{user.email}</td>
            <td>{(new Date(user.regtime)).toLocaleString()}</td>
            <td>{(new Date(user.logtime)).toLocaleString()}</td>
            <td>{user.status}</td>
        </tr>
    );

    return (
        <div className='container'>
            {isPending && <h1>Updating...</h1>}
            <div className='container my-3 disabled' id="toolbar">
                <button onClick={handleClick} name="block" type="button" className="btn btn-danger mx-1 px-4">Block</button>
                <button onClick={handleClick} name="unblock" className='btn btn-secondary mx-1 px-4'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-unlock-fill" viewBox="0 0 16 16"><path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2z"/></svg></button>
                <button onClick={handleClick} name="delete" className='btn btn-secondary mx-1 px-4'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></button>
            </div>
            <div>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">
                                <div>Select all</div>
                                <div><input onChange={checkState} type="checkbox" id='maincheckbox' /></div>
                            </th>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Registration time</th>
                            <th scope="col">Last login time</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPanel;