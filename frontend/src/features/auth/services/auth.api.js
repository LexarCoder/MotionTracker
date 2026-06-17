import axios from "axios"

const api = axios.create({
    baseURL:"https://motiontracker.onrender.com/auth/api",
    withCredentials:true
})

//  *********** Register ***********
export  async function userRegister({username, email, password }) {
    const response = await api.post("/register",{
    username,
    email,password
  })  
return response.data
}

//  *********** login ***********

 export async function userLogin({ username, email, password }) {
     const response = await api.post("/login", {
        username,
        email, password
    })
    return response.data
}

//  *********** get-me ***********
 export async function userGetme() {
     const response = await api.get("/getme")
    return response.data
}

//  *********** logout ***********

 export async function userLogout() {
     const response = await api.get("/logout")
    return response.data
}



