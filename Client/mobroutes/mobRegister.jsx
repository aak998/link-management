import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLogo } from '../data';
import './modulesCSS/mobLandingPage.css';
import './modulesCSS/mobRegister.css';
import { register } from '../Sevices';
import { useEffect } from 'react';


function MobLandingPage() {
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
            localStorage.setItem("name",data.name);

           localStorage.setItem('token',data.token);
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

    return (
        <div className='mobLandingPageContainer'>
            <div className='mobloginPageHeader'> 
                <img src={MainLogo} alt='MainLogo' className='mobLogo' />
                <p className='MobregisterSigupBtn' onClick={handleRegisterFormSubmit}>SignUp</p>
                <p className='MobregisterLoginBtn' onClick={() => navigate('/login')}>Login</p>
            </div>

            <div className='MobrightregisterContainerTitle'>
                <h3>Join us Today!</h3>
            </div>

            <div className='Mobregisterform'>
                <form onSubmit={handleRegisterFormSubmit}>
                    <input
                        type='text'
                        value={registerForm.name}
                        onChange={(e) => {
                            setRegisterForm({ ...registerForm, name: e.target.value });
                        }}
                        placeholder='Name'
                        required={true}
                    />
                    <input
                        type='text'
                        value={registerForm.email}
                        onChange={(e) => {
                            setRegisterForm({ ...registerForm, email: e.target.value });
                        }}
                        placeholder='Email id'
                        required={true}

                    />
                    <input
                        type='tel'
                        value={registerForm.mobile}
                        onChange={(e) => {
                            setRegisterForm({ ...registerForm, mobile: e.target.value });
                        }}
                        placeholder='Mobile no'
                        required={true}

                    />
                    <input
                        type='password'
                        value={registerForm.password}
                        onChange={(e) => {
                            setRegisterForm({ ...registerForm, password: e.target.value });
                        }}
                        placeholder='Password'
                        required={true}
                    />
                    <input
                        type='password'
                        value={registerForm.conformPassword}
                        onChange={(e) => {
                            setRegisterForm({ ...registerForm, conformPassword: e.target.value });
                        }}
                        placeholder='Confirm Password'
                        required={true}
                    />
                    <button type='submit' className='MobloginsubmitBtn' disabled={!!popupMessage}>Register</button>
                </form>
                <p className='MobloginMassage'>Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
            </div>

            {popupMessage && (
                <div className='MobpopupMessage'>
                    {popupMessage}
                </div>
            )}
        </div>
    );
}

export default MobLandingPage;