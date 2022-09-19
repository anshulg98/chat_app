import axios from "axios";
import React, { Component, useState, useEffect } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { deleteRoute } from "../utils/APIRoutes";

export default function Contacts({ contacts, changeChat }) {
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [currentRole, setCurrentRole] = useState(false);

  
  
  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
    setCurrentRole(data.admin);
  }, []);

  useEffect(()=>{
    setFilteredContacts(contacts)
  },[contacts]
    )
  
  const handleDelete=async (id)=>{
    // console.log(id)
    const data=await axios.post(`${deleteRoute}`,{id});
    if(data.status===200){
      window.location.reload(false);
      toast("User deleted successfully")
    }

  };
  const searchItems = (searchValue) => {
    console.log(searchValue)
    if (searchValue === '') {
        setFilteredContacts(contacts)
    }
    else{
        const filteredData = contacts.filter((item) => {
            return Object.values(item.username).join('').toLowerCase().includes(searchValue.toLowerCase())
        })
        setFilteredContacts(filteredData)
    }
}

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Telstra Messaging App</h3>
          </div>
          <div className="input-container">
            <input type="text" placeholder="Search Here" onChange={(e) => searchItems(e.target.value)}  />
            </div>
          <div className="contacts">
            {filteredContacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                  
                >
                  <div className="Avatar">
                  <div className="avatar-img">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <span className={`isOnline ${contact.isOnline}`}></span>
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                  {currentRole? <button className="delete" onClick={()=>handleDelete(contact._id)}>delete</button>:<></>}
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar-img">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 11% 7% 67% 15%;
  overflow: hidden;
  background-color: blue;
  //background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      size:22rem;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: grey;
     // background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar-img {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .delete{  
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: white;
    border: none;
    cursor: pointer;
    svg {
      font-size: 1.3rem;
      color: #ebe7ff;
    }
  }


  .current-user {
    background-color: grey;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar-img {
      img {
        height: 3rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
  .isOnline {
    width: 15px ;
    height: 15px ; 
    position:absolute;
    bottom:0;
    right:0;
    background-color: #ddd;
    border-radius: 50%;
    border: 2px solid #fff;
  }
  .isOnline.true {
    background-color: tomato;
  }
  .Avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  
    margin-right: 20px;
    position: relative;
  }
  .Avatar img {
    max-width: 48px;
    object-fit: cover;
  }
  .input-container {
    width: 89%;
    height: 30px;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    margin-left:13px;
    gap: 2rem;
    background-color: white;
    //background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: black;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
`;
