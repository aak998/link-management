import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLogo, bgImage } from '../data';
import './moduledCSS/LandingPage.css';
import './moduledCSS/register.css';
import { register } from '../Services/index';

function Register() {
    const [registerForm, setRegisterForm] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        conformPassword: '',
    });
    const [popupMessage, setPopupMessage] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
            }
            }, []);
    const handleRegisterFormSubmit = async(e) => {
        e.preventDefault();
        if (registerForm.password !== registerForm.conformPassword) {
            setPopupMessage("Passwords don't match");
            setTimeout(() => {
                setPopupMessage('');
            }, 3000);
            return;
        }
        const res=await register(registerForm);
        const data = await res.json();
        try{
        if(res.status===200){
            setPopupMessage('Registration Successfully')
            setTimeout(() => {
                setPopupMessage('');
                }, 200);
           localStorage.setItem('token',data.token);
           localStorage.setItem("name",data.name);
           navigate('/dashboard');

        }
        else if(res.status===400){
            setPopupMessage("User already exits");
            setTimeout(() => {
                setPopupMessage('');
                }, 3000);   
                
        }
        else{
            setPopupMessage("Registration Failed");
            setTimeout(() => {
                setPopupMessage('');
                }, 3000);
                
        }
    }
    catch{
        setPopupMessage("An error occurred. Please try again");
        setTimeout(() => {
            setPopupMessage('');
            }, 3000);
            
    }

    setRegisterForm({
        name:'',
        email:'',
        mobile:'',
        password:'',
        conformPassword:'',

    })
        
    };

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
        <div className='LoginContainer'>
            <div className='leftLoginContainer'>
                <img src={MainLogo} className='loginPageLogo' />
                <img src={bgImage} className='LoginPageBI' />
            </div>
            <div className='rightLoginContainer'>
                <div className='rightloginPageHeader'>
                    <p className='registerSigupBtn' onClick={handleRegisterFormSubmit}>SignUp</p>
                    <p className='registerLoginBtn' onClick={() => navigate('/login')}>Login</p>
                </div>

                <div className='rightLoginContainerTitle'>
                    <h3>Join us Today!</h3>
                </div>

                <div className='registerform'>
                    <form onSubmit={handleRegisterFormSubmit}>
                        <input
                            type='text'
                            value={registerForm.name}
                            onChange={(e) => {
                                setRegisterForm({ ...registerForm, name: e.target.value })
                            }}
                            placeholder='Name'
                            required={true}
                        />
                        <input
                            type='text'
                            value={registerForm.email}
                            onChange={(e) => {
                                setRegisterForm({ ...registerForm, email: e.target.value })
                            }}
                            placeholder='Email id'
                            required={true}
                        />
                        <input
                            type='tel'
                            value={registerForm.mobile}
                            onChange={(e) => {
                                setRegisterForm({ ...registerForm, mobile: e.target.value })
                            }}
                            placeholder='Mobile no'
                            required={true}
                        />
                        <input
                            type='password'
                            value={registerForm.password}
                            onChange={(e) => {
                                setRegisterForm({ ...registerForm, password: e.target.value })
                            }}
                            placeholder='Password'
                            required={true}
                        />
                        <input
                            type='password'
                            value={registerForm.conformPassword}
                            onChange={(e) => {
                                setRegisterForm({ ...registerForm, conformPassword: e.target.value })
                            }}
                            placeholder='Conform Password'
                            required={true}
                        />
                        <button type='submit' className='loginsubmitBtn' disabled={!!popupMessage}>Register</button>
                    </form>
                    <p className='loginMassage'  onClick={() => navigate('/login')}>Already have an account? <span >Login</span></p>
                </div>

                {popupMessage && (
                    <div className='popupMessage'>
                        {popupMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Register;