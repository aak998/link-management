import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLogo,bgImage } from '../data'
import './moduledCSS/LandingPage.css'
import { login } from '../Sevices'
function LandingPage() {
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

    useEffect(() => {
        const preventZoom = (event) => {
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
          }
        };
        document.addEventListener("wheel", preventZoom, { passive: false });
        document.addEventListener("keydown", preventZoom, { passive: false });
        return () => {
          document.removeEventListener("wheel", preventZoom);
          document.removeEventListener("keydown", preventZoom);
        };
      }, []);

    return (
        <div  className='LoginContainer'>
            <div className='leftLoginContainer'> <img src={MainLogo} className='loginPageLogo'/> 
            <img src={bgImage} className='LoginPageBI'/>
            </div>
            <div className='rightLoginContainer'>
            <div className='rightloginPageHeader'> 
            <p className='LoginSigupBtn' onClick={()=>navigate('/register')}>SignUp</p>
            <p className='LoginLoginBtn' onClick={handleLoginFormSubmit}>Login</p>
            </div>

            <div className='rightLoginContainerTitle'>
                <h3>Login</h3>
            </div>


            <div className='loginform'>
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
            <button type='submit' className='loginsubmitBtn'>Register</button>
            </form>
            <p className='loginMassage'>Don’t have an account? <span onClick={()=>navigate('/register')}>SignUp</span></p>
            </div>
            {popupMessage && (
                    <div className='popupMessage'>
                        {popupMessage}
                    </div>
                )}
            </div>
                  </div>
    )
}

export default LandingPage