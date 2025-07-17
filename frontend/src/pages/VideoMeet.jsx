// import React, { useEffect, useRef, useState } from 'react'
// import "../styles/VideoMeet.css";
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import { io } from "socket.io-client";


// const server_url="http://localhost:3000/";

// var connections={}

// const peerConfigConnections = {
//     "iceServers": [
//         { "urls": "stun:stun.l.google.com:19302" }
//     ]
// }


// const VideoMeet = () => {

//     var socketRef=useRef();
//     let socketIdRef=useRef();

//     let localVideoRef=useRef();

//     let [videoAvailable,setVideoAvailable]=useState(true);

//     let [audioAvailable,setAudioAvailable]=useState(true);

//     let [video,setVideo]=useState([]);

//     let [audio,setAudio]=useState();

//     let [screen,setSceen]=useState();

//     let [showModal,setModal]=useState();

//     let [screenAvailable,setScreenAvailable] =useState();

//     let [messages,setMessages]=useState([]); //for all messages

//     let [message,setMessage]=useState(""); //for user's message

//     let [newMessages,setNewMessages]=useState(0);//for notification

//     let [askForUsername,setAskForUsername]=useState(true);

//     let [username,setUsername]=useState("");

//     const videoRef=useRef([]);

//     let [videos,setVideos]=useState([]);


//     // if(isChrome()===false){
        
//     // }

//     useEffect(()=>{

//         getPermissions();
//     },[])


//     const getPermissions=async ()=>{
//         try{
//             const videoPermision=await navigator.mediaDevices.getUserMedia({video:true});

//             if(videoPermision){
//                 setVideoAvailable(true);
//                 console.log('Video permission granted');
//             }else{
//                 setVideoAvailable(false);
//                 console.log('Video permission denied');
//             }

//             const audioPermision=await navigator.mediaDevices.getUserMedia({audio:true});

//             if(audioPermision){
//                 setAudioAvailable(true);
//                 console.log('Audio permission granted');
//             }else{
//                 setAudioAvailable(false);
//                 console.log('Audio permission denied');
//             }


//             if(navigator.mediaDevices.getDisplayMedia){
//                 setScreenAvailable(true);
//             }else{
//                 setScreenAvailable(false);
//             }


//             if(videoAvailable||audioAvailable){
//                 const userMeadiaStream=await navigator.mediaDevices.getUserMedia({video:videoAvailable,audio:audioAvailable});

//                 if(userMeadiaStream){
//                     window.localStream=userMeadiaStream;
//                     if(localVideoRef.current){
//                         localVideoRef.current.srcObject=userMeadiaStream;
//                     }
//                 }
//             }

//         }catch(e){
//             console.log(e)
//         }
//     };

//     useEffect(()=>{
//         if(video!==undefined && audio !==undefined ){
//             getUserMedia();
//             console.log("SET STATE HAS ", video, audio);
//         }

//     },[audio,video])

//     let getMedia=()=>{
//         setVideo(videoAvailable);
//         setAudio(audioAvailable);
//         connectToSocketServer()
//     }

//     let getUserMediaSuccess=(stream)=>{
//         try{
//             window.localStream.getTracks().forEach(track=>track.stop())
//         }catch(e){
//             console.log(e);
//         }

//         window.localStream=stream;
//         localVideoRef.current.srcObject=stream;

//         for(let id in connections){
//             if(id===socketIdRef.current){
//                 continue;
//             }

//             connections[id].addStream(window.localStream)

//             connections[id].createOffer().then((description)=>{
//                 console.log(description)
//                 connections[id].setLocalDescription(description)
//                 .then(()=>{
//                     socketRef.current.emit("signal",id,JSON.stringify({'sdp':connections[id].localDescription}))
//                 })
//                 .catch(e=>console.log(e))
//             })
//         }

//         stream.getTracks().forEach(track=>track.onended=()=>{
//             setVideo(false);
//             setAudio(false);

//             try{
//                 let tracks=localVideoRef.current.srcObject.getTracks()
//                 tracks.forEach(track=> track.stop())
//             }catch(e){console.log(e)}

//             //TODO blacksilence

//             let blackSilence=(...args)=>new MediaStream([black(...args),silence()]);
//             window.localStream=blackSilence();
//             localVideoRef.current.srcObject=window.localStream;

//             for(let id in connections){
//                 connections[id].addStream(window.localStream)

//                 connections[id].createOffer().then((description)=>{
//                     connections[id].setLocalDescription(description)
//                     .then(()=>{
//                         socketRef.current.emit("signal",id,JSON.stringify({"sdp":connections[id].localDescription }))
//                     })
//                     .catch(e=>console.log(e))
//                 })
//             }
//         })
//     }

//     let getUserMedia=()=>{
//         if((video&&videoAvailable)||(audio&&audioAvailable)){
//             navigator.mediaDevices.getUserMedia({video:video,audio:audio})
//             .then(getUserMediaSuccess)
//             .then((stream)=>{})
//             .catch((e)=>console.log(e))
//         }else{
//             try{
//                 let tracks=localVideoRef.current.srcObject.getTracks();
//                 tracks.forEach(track=>track.stop())
//             }catch(e){

//             }
//         }
//     }

//     //todo
//     let gotMessageFromServer=(fromId,message)=>{
//         var signal=JSON.parse(message)

//         if(fromId!==socketIdRef.current){
//             if(signal.sdp){
//                 connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(()=>{
//                     if(signal.sdp.type==='offer'){
//                         connections[fromId].createAnswer().then((description)=>{
//                             connections[fromId].setLocalDescription(description).then(()=>{
//                                 socketRef.current.emit("signal",fromId,JSON.stringify({"sdp":connections[fromId].localDescription}))
//                             }).catch(e=>console.log(e)) 
//                         }).catch(e=>console.log(e))
//                     }
//                 }).catch(e=>console.log(e))
//             }

//             if(signal.ice){
//                 connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e=>console.log(e));
//             }
//         }

//     }
//     //todo AddMessage
//     let addMessage=()=>{

//     }

//     let connectToSocketServer=()=>{
//         socketRef.current=io.connect(server_url,{secure:false})

//         socketRef.current.on('signal',gotMessageFromServer)

//         socketRef.current.on("connect",()=>{
//             socketRef.current.emit("join-call",window.location.href);

//             socketIdRef.current=socketRef.current.id;
//             console.log("My Socket ID:", socketRef.current.id);

//             socketRef.current.on("chat-message",addMessage);

//             socketRef.current.on("user-left",(id)=>{
//                 //Todo
//                 setVideos((videos)=>videos.filter((video)=>video.socketId!==id))
//             })
            
//             socketRef.current.on("user-joined",(id,clients)=>{
//                 clients.forEach((socketListId)=>{
//                     connections[socketListId]=new RTCPeerConnection(peerConfigConnections)
                    
//                     // Wait for their ice candidate   
//                     connections[socketListId].onicecandidate=function (event){
//                         if(event.candidate!=null){
//                             socketRef.current.emit("signal",socketListId,JSON.stringify({'ice':event.candidate}))
//                         }
//                     }
                    

//                     // Wait for their video stream
//                     connections[socketListId].onaddStream=(event)=>{
//                         console.log("BEFORE:", videoRef.current);
//                         console.log("FINDING ID: ", socketListId);

//                         let videoExists=videoRef.current.find(video.socketId===socketListId);

//                         if(videoExists){
//                             console.log("FOUND EXISTING");
//                             // Update the stream of the existing video
//                             setVideos(videos=>{
//                                 const updatedVideos=videos.map(video=>
//                                     video.socketId ===socketListId?{...video,stream:event.stream}:video
//                                 );
//                                 videoRef.current=updatedVideos;
//                                 return updatedVideos;
//                             });
//                         }else{
//                             // Create a new video
//                             console.log("CREATING NEW");
//                             let newVideo={
//                                 socketId:socketListId,
//                                 stream:event.stream,
//                                 autoPlay:true,
//                                 playsinline:true
//                             };

//                             setVideos(videos=>{
//                                 const updatedVideos={...videos,newVideo};
//                                 videoRef.current=updatedVideos;
//                                 return updatedVideos;
//                             });
//                         }
//                     };
//                     // Add the local video stream
//                     if(window.localStream!==undefined && window.localStream !==null){
//                         connections[socketListId].addStream(window.localStream);
//                     }else{
//                         //todo
//                         //black silence

//                         let blackSilence=(...args)=>new MediaStream([black(...args),silence()]);
//                         window.localStream=blackSilence();
//                         connections[socketListId].addStream(window.localStream);
//                     }

//                 })

//                 if(id===socketIdRef.current){
//                     for(let id2 in connections){
//                         if(id2===socketIdRef.current) continue

//                         try{
//                             connections[id2].addStream(window.localStream)
//                         }catch(e){

//                         }

//                         connections[id2].createOffer().then((description)=>{
//                             connections[id2].setLocalDescription(description)
//                             .then(()=>{
//                                 socketRef.current.emit("signal",id2,JSON.stringify({"sdp":connections[id2].localDescription})) //sdp=session description
//                             })
//                             .catch(e=>console.log(e))
//                         })
//                     }
//                 }

//             })

//         })
//     }

//     let silence=()=>{
//         let ctx=new AudioContext()
//         let oscillator=ctx.createOscillator();

//         let dst=oscillator.connect(ctx.createMediaStreamDestination());

//         oscillator.start();
//         ctx.resume()
//         return Object.assign(dst.stream.getAudioTracks()[0],{enabled:false})
//     }

//     let black=({width=640,height=480}={})=>{
//         let canvas=Object.assign(document.createElement("canvas"),{width,height});

//         canvas.getContext('2d').fillRect(0,0,width,height);
//         let stream=canvas.captureStream();

//         return Object.assign(stream.getVideoTracks()[0],{enabled:false})

//     }

    
//     let connect=()=>{
//         setAskForUsername(false);
//         getMedia();
//     }
//   return (
//     <div>
//       {askForUsername===true?
//         <div>
//             <h2>Enter into Lobby</h2>
//             <TextField id="outlined-basic" label="Username" value={username} onChange={e=>setUsername(e.target.value)} variant="outlined" />

//             <Button onClick={connect} variant="contained">Connect</Button>

//             <div>
//                 <video ref={localVideoRef} autoPlay muted></video>
//             </div>

//         </div>:<>
//             <video ref={localVideoRef } autoPlay muted></video>

//             {videos.map((video)=>(
//                 <div key={video.socketId}>
//                     <h2>{video.socketId}</h2>

//                 </div>
//             ))}
//         </>
//       }
//     </div>
//   )
// }

// export default VideoMeet




// import React, { useEffect, useRef, useState } from 'react'
// import "../styles/VideoMeet.css";
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import { io } from "socket.io-client";

// const server_url = "http://localhost:3000/";
// const peerConfigConnections = {
//     "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }]
// };
// var connections = {};

// const VideoMeet = () => {
//     const socketRef = useRef();
//     const socketIdRef = useRef();
//     const localVideoRef = useRef();
//     const videoRef = useRef([]);
//     const [videos, setVideos] = useState([]);
//     const [videoAvailable, setVideoAvailable] = useState(true);
//     const [audioAvailable, setAudioAvailable] = useState(true);
//     const [video, setVideo] = useState([]);
//     const [audio, setAudio] = useState();
//     const [screen, setSceen] = useState();
//     const [showModal, setModal] = useState();
//     const [screenAvailable, setScreenAvailable] = useState();
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState("");
//     const [newMessages, setNewMessages] = useState(0);
//     const [askForUsername, setAskForUsername] = useState(true);
//     const [username, setUsername] = useState("");

//     useEffect(() => {
//         getPermissions();
//     }, []);

//     const getPermissions = async () => {
//         try {
//             const videoPerm = await navigator.mediaDevices.getUserMedia({ video: true });
//             setVideoAvailable(!!videoPerm);
//             const audioPerm = await navigator.mediaDevices.getUserMedia({ audio: true });
//             setAudioAvailable(!!audioPerm);

//             setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

//             if (videoAvailable || audioAvailable) {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
//                 window.localStream = stream;
//                 if (localVideoRef.current) {
//                     localVideoRef.current.srcObject = stream;
//                 }
//             }
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     useEffect(() => {
//         if (video !== undefined && audio !== undefined) {
//             getUserMedia();
//         }
//     }, [audio, video]);

//     const getMedia = () => {
//         setVideo(videoAvailable);
//         setAudio(audioAvailable);
//         connectToSocketServer();
//     };

//     const getUserMedia = () => {
//         if ((video && videoAvailable) || (audio && audioAvailable)) {
//             navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
//                 .then(getUserMediaSuccess)
//                 .catch(console.log);
//         } else {
//             try {
//                 const tracks = localVideoRef.current.srcObject.getTracks();
//                 tracks.forEach(track => track.stop());
//             } catch (e) { }
//         }
//     };

//     const getUserMediaSuccess = (stream) => {
//         try {
//             window.localStream?.getTracks().forEach(track => track.stop());
//         } catch (e) { }

//         window.localStream = stream;
//         localVideoRef.current.srcObject = stream;

//         for (let id in connections) {
//             if (id === socketIdRef.current) continue;

//             stream.getTracks().forEach(track => {
//                 connections[id].addTrack(track, stream);
//             });

//             connections[id].createOffer().then(description => {
//                 connections[id].setLocalDescription(description)
//                     .then(() => {
//                         socketRef.current.emit("signal", id, JSON.stringify({ 'sdp': description }));
//                     });
//             });
//         }
//     };

//     const gotMessageFromServer = (fromId, message) => {
//         const signal = JSON.parse(message);
//         if (fromId === socketIdRef.current) return;

//         const connection = connections[fromId];

//         if (signal.sdp) {
//             connection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
//                 if (signal.sdp.type === 'offer') {
//                     connection.createAnswer()
//                         .then(description => {
//                             return connection.setLocalDescription(description).then(() => {
//                                 socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": description }));
//                             });
//                         }).catch(console.log);
//                 }
//             }).catch(console.log);
//         }

//         if (signal.ice) {
//             const tryAddCandidate = () => {
//                 if (connection.remoteDescription) {
//                     connection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(console.log);
//                 } else {
//                     setTimeout(tryAddCandidate, 100);
//                 }
//             };
//             tryAddCandidate();
//         }
//     };

//     const silence = () => {
//         const ctx = new AudioContext();
//         const oscillator = ctx.createOscillator();
//         const dst = oscillator.connect(ctx.createMediaStreamDestination());
//         oscillator.start();
//         ctx.resume();
//         return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
//     };

//     const black = ({ width = 640, height = 480 } = {}) => {
//         const canvas = Object.assign(document.createElement("canvas"), { width, height });
//         canvas.getContext('2d').fillRect(0, 0, width, height);
//         const stream = canvas.captureStream();
//         return Object.assign(stream.getVideoTracks()[0], { enabled: false });
//     };

//     const connectToSocketServer = () => {
//         socketRef.current = io.connect(server_url, { secure: false });
//         socketRef.current.on('signal', gotMessageFromServer);

//         socketRef.current.on("connect", () => {
//             socketRef.current.emit("join-call", window.location.href);
//             socketIdRef.current = socketRef.current.id;

//             socketRef.current.on("chat-message", () => { });
//             socketRef.current.on("user-left", (id) => {
//                 setVideos(videos => videos.filter(video => video.socketId !== id));
//             });

//             socketRef.current.on("user-joined", (id, clients) => {
//                 clients.forEach((socketListId) => {
//                     if (connections[socketListId]) return;

//                     const peerConnection = new RTCPeerConnection(peerConfigConnections);
//                     connections[socketListId] = peerConnection;

//                     peerConnection.onicecandidate = (event) => {
//                         if (event.candidate) {
//                             socketRef.current.emit("signal", socketListId, JSON.stringify({ 'ice': event.candidate }));
//                         }
//                     };

//                     peerConnection.ontrack = (event) => {
//                         const stream = event.streams[0];
//                         setVideos(prev => {
//                             const exists = prev.find(v => v.socketId === socketListId);
//                             if (exists) {
//                                 const updated = prev.map(v => v.socketId === socketListId ? { ...v, stream } : v);
//                                 videoRef.current = updated;
//                                 return updated;
//                             }
//                             const updated = [...prev, { socketId: socketListId, stream }];
//                             videoRef.current = updated;
//                             return updated;
//                         });
//                     };

//                     if (window.localStream) {
//                         window.localStream.getTracks().forEach(track => {
//                             peerConnection.addTrack(track, window.localStream);
//                         });
//                     } else {
//                         const stream = new MediaStream([black(), silence()]);
//                         stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
//                         window.localStream = stream;
//                     }
//                 });

//                 if (id === socketIdRef.current) {
//                     for (let id2 in connections) {
//                         if (id2 === socketIdRef.current) continue;
//                         const conn = connections[id2];
//                         conn.createOffer().then(description => {
//                             conn.setLocalDescription(description).then(() => {
//                                 socketRef.current.emit("signal", id2, JSON.stringify({ "sdp": description }));
//                             });
//                         });
//                     }
//                 }
//             });
//         });
//     };

//     const connect = () => {
//         setAskForUsername(false);
//         getMedia();
//     };

//     return (
//         <div>
//             {askForUsername ? (
//                 <div>
//                     <h2>Enter into Lobby</h2>
//                     <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} variant="outlined" />
//                     <Button onClick={connect} variant="contained">Connect</Button>
//                     <div><video ref={localVideoRef} autoPlay muted></video></div>
//                 </div>
//             ) : (
//                 <>
//                     <video ref={localVideoRef} autoPlay muted></video>
//                     {videos.map((video) => (
//                         <div key={video.socketId}>
//                             <h2>{video.socketId}</h2>
//                             <video 
                            
//                             data-socket={video.socketId}
//                             ref={ref=>{
//                                 if(ref&&video.stream){
//                                     ref.srcObject=video.stream;
//                                 }
//                             }}
//                             autoPlay
//                             ></video>
//                         </div>
//                     ))}
//                 </>
//             )}
//         </div>
//     );
// };

// export default VideoMeet;






import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoMeet.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
// import server from '../environment';

const server_url = "http://localhost:3000/";

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeet() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    // TODO
    // if(isChrome() === false) {


    // }

    useEffect(() => {
        console.log("HELLO")
        getPermissions();

    })

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
        // getUserMedia();
    }
    let handleAudio = () => {
        setAudio(!audio)
        // getUserMedia();
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }

    
    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }


    return (
        <div>

            {askForUsername === true ?

                <div>


                    <h2>Enter into Lobby </h2>
                    <TextField id="outlined-basic" label="Username" value={username} onChange={e => setUsername(e.target.value)} variant="outlined" />
                    <Button variant="contained" onClick={connect}>Connect</Button>


                    <div>
                        <video ref={localVideoref} autoPlay muted></video>
                    </div>

                </div> :


                <div className={styles.meetVideoContainer}>

                    {showModal ? <div className={styles.chatRoom}>

                        <div className={styles.chatContainer}>
                            <h1>Chat</h1>

                            <div className={styles.chattingDisplay}>

                                {messages.length !== 0 ? messages.map((item, index) => {

                                    console.log(messages)
                                    return (
                                        <div style={{ marginBottom: "20px" }} key={index}>
                                            <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                                            <p>{item.data}</p>
                                        </div>
                                    )
                                }) : <p>No Messages Yet</p>}


                            </div>

                            <div className={styles.chattingArea}>
                                <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Enter Your chat" variant="outlined" />
                                <Button variant='contained' onClick={sendMessage}>Send</Button>
                            </div>


                        </div>
                    </div> : <></>}


                    <div className={styles.buttonContainers}>
                        <IconButton onClick={handleVideo} style={{ color: "white" }}>
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleEndCall} style={{ color: "red" }}>
                            <CallEndIcon  />
                        </IconButton>
                        <IconButton onClick={handleAudio} style={{ color: "white" }}>
                            {audio === true ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable === true ?
                            <IconButton onClick={handleScreen} style={{ color: "white" }}>
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton> : <></>}

                        <Badge badgeContent={newMessages} max={999} color='orange'>
                            <IconButton onClick={() => setModal(!showModal)} style={{ color: "white" }}>
                                <ChatIcon />                        </IconButton>
                        </Badge>

                    </div>


                    <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted></video>

                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div key={video.socketId}>
                                <video

                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                >
                                </video>
                            </div>

                        ))}

                    </div>

                </div>

            }

        </div>
    )
}