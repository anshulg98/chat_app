import React,{useRef,useState} from 'react'
import {Link,useHistory} from 'react-router-dom';
import {ToastContainer,toast} from 'react-toastify';
import axios from 'axios'
import styled from "styled-components";
import PasswordForm from './PasswordForm';

function OtpForm() {
    //const emailRef=useRef();
    const [otpForm,showForm]=useState(true)
    const [values, setValues] = useState({ email: "" });

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
      };

    const sendOtp=async () =>{
        try{
            let url="http://localhost:5000/api/auth/email-send"
            console.log(123)
            // let options={
            //     method:'POST',
            //     url:url,
            //     data:{email:emailRef.current.value}
            // }
            // console.log(options)
            // let response=await axios(options)
            // let record=response.data;
            // if(record.statusText=='Success'){
            //     toast.success(record.message);

            // }
            // else{
            //     toast.error(record.message);
            // }
            const { email } = values;
            const { data } = await axios.post(url, {
                email,
              });
              console.log(data)
              if(data.statustext=='Success')
              {
                toast.success("Email sent");
                showForm(false);
              }
              else{
                toast.error("Email not found")
              }
        }
        catch(e){
            toast.error("Somethig went wrong")
        }
    }
    return (
        <FormContainer>
        <div className="container">
            <div className="row login">
                <div className="col-md-2">
                </div>
                <div className="col-md-6">
                    <ToastContainer />
                    {/* <h3 className="" style={{marginTop:'20px'}}>Reset password</h3><br/> */}
                    {/* <h1>Reset password</h1> */}
                {otpForm?   <form id="otpForm" method="post">
                <h1>Reset password</h1>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" name="email" onChange={(e) => handleChange(e)}></input>
                        </div>
                        <div>
                            <button type="button" className="btn btn-primary" onClick={sendOtp}>Send otp</button>&nbsp;
                            <Link to="/login"><button type="button" className="btn btn-danger">Back</button></Link>
                        </div>
                    </form>
                   :<PasswordForm/>
    }
                </div>
            </div>
        </div>
        </FormContainer>
    )
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

export default OtpForm