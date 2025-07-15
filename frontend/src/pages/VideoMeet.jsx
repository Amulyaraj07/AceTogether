import React, { useEffect, useRef, useState } from 'react'
import "../styles/VideoMeet.css";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const server_url="http://localhost:3000";

var connections={}

const peerConfigConnections={
    "iceServers":[
        {"urls":"stun:stun.l.google.com.19302"}
    ]
}


const VideoMeet = () => {

    var socketRef=useRef();
    let socketIdRef=useRef();
    let localVideoRef=useRef();

    let [videoAvailable,setVideoAvailable]=useState(true);

    let [audioAvailable,setAudioAvailable]=useState(true);

    let [video,setVideo]=useState();

    let [audio,setAudio]=useState();

    let [screen,setSceen]=useState();

    let [showModal,setModal]=useState();

    let [screenAvailable,setScreenAvailable] =useState();

    let [messages,setMessages]=useState([]); //for all messages

    let [message,setMessage]=useState(""); //for user's message

    let [newMessages,setNewMessages]=useState(0);//for notification

    let [askForUsername,setAskForUsername]=useState(true);

    let [username,setUsername]=useState();

    const videoRef=useRef([]);

    let [videos,setVideos]=useState([]);


    // if(isChrome()===false){
        
    // }

    const getPermissions=async ()=>{
        try{
            const videoPermision=await navigator.mediaDevices.getUserMedia({video:true});

            if(videoPermision){
                setVideoAvailable(true);
            }else{
                setVideoAvailable(false);
            }

            const audioPermision=await navigator.mediaDevices.getUserMedia({audio:true});

            if(audioPermision){
                setAudioAvailable(true);
            }else{
                setAudioAvailable(false);
            }


            if(navigator.mediaDevices.getDisplayMedia){
                setScreenAvailable(true);
            }else{
                setScreenAvailable(false);
            }


            if(videoAvailable||audioAvailable){
                const userMeadiaStream=await navigator.mediaDevices.getUserMedia({video:videoAvailable,audio:audioAvailable});

                if(userMeadiaStream){
                    window.localStream=userMeadiaStream;
                    if(localVideoRef.current){
                        localVideoRef.current.srcObject=userMeadiaStream;
                    }
                }
            }

        }catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
        getPermissions();
    },[])

    useEffect(()=>{
        getPermissions();

    },[])

    let getUserMediaSuccess=(stream)=>{

    }

    let getUserMedia=()=>{
        if((video&&videoAvailable)||(audio&&audioAvailable)){
            navigator.mediaDevices.getUserMedia({video:video,audio:audio})
            .then(getUserMediaSuccess)
            .then((stream)=>{})
            .catch((e)=>console.log(e))
        }else{
            try{
                let tracks=localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track=>track.stop())
            }catch(e){

            }
        }
    }

    useEffect(()=>{
        if(video!==undefined && audio !==undefined ){
            getUserMedia();
        }

    },[audio,video])

    let getMedia=()=>{
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        // connectToSocketServer()
    }

    let connect=()=>{
        setAskForUsername(false);
        getMedia();
    }
  return (
    <div>
      {askForUsername===true?
        <div>
            <h2>Enter into Lobby</h2>
            <TextField id="outlined-basic" label="Username" value={username} onChange={e=>setUsername(e.target.value)} variant="outlined" />

            <Button onClick={connect} variant="contained">Connect</Button>

            <div>
                <video ref={localVideoRef} autoPlay muted></video>
            </div>

        </div>:<></>
      }
    </div>
  )
}

export default VideoMeet
