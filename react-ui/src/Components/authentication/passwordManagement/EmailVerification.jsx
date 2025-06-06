import HomeHeader from "../../utils/headers/HomeHeader"
import React, { useState } from "react";
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/AuthService';


function EmailVerification() {
    const [email, setEmail]=useState('');
    const [message, setMessage] = useState('');
    let verifCode = Math.floor(Math.random() * 900000);
    const navigate = useNavigate();
    let userData;
    //Verify first if the email exist in the database 
    async function doEmailExist (){
      try{
        console.log("here is the email:", email);
        const response = await AuthService.emailExist(email);
        // role of the user, recruiter - true or false
        userData = response.data;
        if (response.status === 200 && response.data.emailExists === true) {
            // calling a function inside another function will it cause any problem
            try {
              console.log("email sent");
              setMessage("email sent")
              sendEmail();
            } catch(error){
              console.log("error", error)
            }
        } else if ( response.status === 200 && response.data.emailExists === false) {
              setMessage("this email does not exist");
              //we have a litte bit of time her in the current before we navigate to another page
              navigate('/login');
        } else {
            console.error("the request is bad");
            console.error("response status:",response.status);
        }
      } catch(error){
        console.log("It's hard to get the email from back-end")
        console.log("error",error);
        setMessage(error);
      }
    }

    //Time now adding 15 minutes and then use dayJs for Formatting
    function sendEmail(){
      console.log("I entered")
      emailjs.send('JobSeeker_PassForgotten','template_roz1rfa', { email: email, passcode:verifCode}, {
        publicKey: 'T-NEdp-sD9WESqoEI',
      }).then(
        () => {
          console.log('SUCCESS!');
          navigate("/VerificationCodeService", {state :{code:verifCode, email:email, data:userData}});
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
    };


    return (
        <>
            <HomeHeader/>
            <form className="flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200  h-screen pb-12">
                <h1 className="text-2xl font-bold text-black mb-4">Forgot Password</h1>
                <p className="text-gray-600 italic mb-4">Please enter your email address to reset your password.</p>
                <input type="email" 
                 className="block w-80 rounded-md border border-gray-400 bg-white pl-3 pr-4 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:border-none focus:outline-none focus:ring-indigo-400 sm:text-sm shadow-md"
                 placeholder="Enter your Email" 
                 onChange={(e)=>setEmail(e.target.value)}/>
                <button className="px-5 py-2 mt-5 text-white bg-blue-500 rounded" type="button" onClick={doEmailExist}>Submit</button>

            </form>
            <p className="text-white text-2xl">{message}</p>

        </>
    );
}
export default EmailVerification