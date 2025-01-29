const URL ="https://mini-link-management-platform-backend.onrender.com/api";

export const register = (data) => {
    return fetch(`${URL}/user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
}

export const login = (data) => {
    return fetch(`${URL}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
}


export const edituser = (data) => {
    return fetch(`${URL}/user/edituser`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
            },
        body: JSON.stringify(data),
    })
}

export const deleteuser = ()=>{
    return fetch(`${URL}/user/deleteuser`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
        },
        })
        }

export const getUserName=()=>{
    return fetch(`${URL}/user/getusername`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
        },
        })
}


export const  totalClicks=()=>{
    return fetch(`${URL}/link/click/userclicksoverall`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
        },
        })
}


export const  devicewiseClicks=()=>{
    return fetch(`${URL}/link/userclicks/devicewise`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
        },
        })
}


export const datewiseClickes=()=>{
    return fetch(`${URL}/link/userclicks/datewise`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
        },
    })
}


export const getallLinks=({page,limit})=>{
    return fetch(`${URL}/link/userlinks/data?page=${page}&limit=${limit}`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
        },
    })
}

export const getLinkByID = (id) => {
    return fetch(`${URL}/link/userlinks/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
        },
        })
}


export const createLink = (data) => {
    return fetch(`${URL}/link/createlink`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    })
}

export const deleteLink = (id) => {
    return fetch(`${URL}/link/deletelink/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
        },
    })
}

export const editLinkData =(id,data)=>{
    return fetch(`${URL}/link/editlink/${id}`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
            },
            body:JSON.stringify(data),
            })
            }




export const getDataByRemarks =({page,limit,comments})=>{
    console.log(page,limit,comments);
    return fetch(`${URL}/link/userlinks/remarks?&page=${page}&limit=${limit}&comments=${comments}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`,
                },
                })
                }


export const getResponces =({page,limit})=>{
    return fetch(`${URL}/link/click/responcces?&page=${page}&limit=${limit}`,
        {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `${localStorage.getItem('token')}`,
            }
        })
}