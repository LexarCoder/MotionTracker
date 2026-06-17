import {userGetme, userLogin, userRegister, userLogout} from "../services/auth.api"
import { AuthContext } from "../auth.context"
import { useContext, useEffect } from "react"

export const useAuth=()=>{
const context =  useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

async function handleRegister({username, email, password }) {
    try {
        setLoading(true)
        const data= await userRegister({username, email, password})
        setUser(data.user)
    return data
    } catch (error) {
        console.log("Register error:", error.response?.data || error.message);
    }
    finally{
        setLoading(false)
    }
}
async function handleLogin({username, email, password }) {
    try {
        setLoading(true)
const data = await userLogin({username, email, password})
setUser(data.user)
return data
    } catch (error) {
        console.log("Login error:", error.response?.data || error.message);
        setUser(null);
        alert(
            "User not found. Please register first."
        );
    }
    finally{
        setLoading(false)
    }
}

async function handleGetme() {
    setLoading(true)
    try {
    const data = await userGetme()
    setUser(data.user)
    return data
    
} catch (error) {
    console.log("Get-me error:", error.response?.data || error.message);
    setUser(null)
}
finally{
    setLoading(false)
}
}

async function handlelogout() {
   try {
    setLoading(true)
    const data = await userLogout()
    setUser(null)
   
   } catch (error) {
    
       console.log("Logout error:", error.response?.data || error.message);
       setUser(null)

   } 
   finally{
    setLoading(false)
   }
}



    return (
{
    loading, user, handleGetme, handleRegister, handleLogin, handlelogout
}
    )
}