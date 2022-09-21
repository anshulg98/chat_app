import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function PasswordForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ otpcode: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
//   useEffect(() => {
//     if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
//       navigate("/");
//     }
//   }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { otpcode, password } = values;
    if (otpcode === "") {
      toast.error("otp and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("otp and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  // const ChangePassword=async ()=>{
  //   history.pushState('/reset-password')
  // }

  const handleSubmit = async (event) => {
    event.preventDefault();
    // if (validateForm()) {
    //   const { otpcode, password } = values;
    //   const { data } = await axios.post(loginRoute, {
    //     otpcode,
    //     password,
    //   });
    //   if (data.status === false) {
    //     toast.error(data.msg, toastOptions);
    //   }
    //   if (data.status === true) {
    //     localStorage.setItem(
    //       process.env.REACT_APP_LOCALHOST_KEY,
    //       JSON.stringify(data.user))
    //       localStorage.setItem("accessToken", data.accessToken);
    //       localStorage.setItem("refreshToken", data.refreshToken);

    //     ;

    //     navigate("/");
    //   }
    // }
     if (validateForm()) {
     let url="http://localhost:5000/api/auth/change-password"
         console.log(123)
        const { email, otpcode, password} = values;
        const { data } = await axios.post(url, {
            email,
            otpcode,
            password,
          });
          console.log(data)
    try{
        
          console.log(data)
          if(data.statusText=='Success')
          {
            toast.success("Password changed successfully");
            navigate('/login')
            
          }
          else{
            toast.error(data.message)
          }
    }
    catch(e){
        toast.error("Somethig went wrong")
    }
 }
   };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          
            <h1>Reset Password</h1>
            <input
            type="email"
            placeholder="email"
            name="email"
            onChange={(e) => handleChange(e)}
            
            
          />
         
          <input
            type="text"
            placeholder="otp"
            name="otpcode"
            onChange={(e) => handleChange(e)}
            min="4"
            
          />
          <input
            type="Password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Confirm Password</button>
          
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: blue;
  // background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: blue;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: white;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: white;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: black;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
