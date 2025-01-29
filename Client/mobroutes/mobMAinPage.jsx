import './modulesCSS/mobLandingPage.css'
import { useState } from 'react'
import { MainLogo } from '../data'
import { useNavigate } from 'react-router-dom'
import { login } from '../Sevices'
import { useEffect } from 'react'
function MobLandingPage() {

  const [loginForm,setLoginForm]=useState({
    email:'',
    password:'',
})
const [popupMessage, setPopupMessage] = useState('');
const navigate=useNavigate();


useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        navigate('/dashboard');
        }
        }, []);

const handleLoginFormSubmit= async(e)=>{
    e.preventDefault();
    const res=await login(loginForm);
    const data=await res.json();
    

    if(res.status===200){  
        setPopupMessage('Logged In Successfully')
            setTimeout(() => {
                setPopupMessage('');
                }, 200);
      localStorage.setItem('token',data.token);
      localStorage.setItem('name',data.name);
      navigate('/dashboard');
    }
    else if(res.status === 400){
      setPopupMessage("Wrong username or password");
      setTimeout(() => {
        setPopupMessage('');
        }, 3000);
    }else{
      setPopupMessage("Login Failed");
      setTimeout(() => {
        setPopupMessage('');
        }, 3000);        }

    
    
    setLoginForm({
        email: "",
        password: "",
    });

  
}

  
    return (
        <div className='mobLandingPageContainer'>
        
            <div className='mobloginPageHeader'> 
            <img src={MainLogo} alt='MainLogo' className='mobLogo' />
            <p className='MobLoginSigupBtn' onClick={()=>navigate('/register')}>SignUp</p>
            <p className='MobLoginLoginBtn' onClick={handleLoginFormSubmit}>Login</p>
            </div>

            <div className='MobrightLoginContainerTitle'>
                <h3>Login</h3>
            </div>


            <div className='Mobloginform'>
            <form onSubmit={handleLoginFormSubmit} >
            <input type="text" value={loginForm.email} onChange={(e)=>{
                setLoginForm({...loginForm,email:e.target.value})
            }} placeholder='Email id'
            required={true}

            />
            <input type='password' 
            value={loginForm.password}
            onChange={(e)=>{
                setLoginForm({...loginForm,password:e.target.value})
                }}
            placeholder='Password'
                required={true}
            />
            <button type='submit' className='MobloginsubmitBtn'>Register</button>
            </form>
            <p className='MobloginMassage'>Don’t have an account? <span  onClick={()=>navigate('/register')}>SignUp</span></p>
            </div>
            {popupMessage && (
                    <div className='popupMessage'>
                        {popupMessage}
                    </div>
                )}
            </div>
        

       
    )
}

export default MobLandingPage