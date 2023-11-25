import React, {useState, useRef} from 'react'
// import ffmpeg from "ffmpeg"
const mimeType = 'audio/mpeg';

const AudioRecorder = () => {
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [audioChunks, setAudioChunks] = useState([]); //chunks of encoded audio
    const [audio, setAudio] = useState(null); //blob url
    audio

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true, video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                alert(err.message);
            } 
        } else {
            alert("Media rec api not supported");
        }
    };

    const startRecording = async () => {
        setRecordingStatus("recording");
        // new media rec instance using the stream
        const media = new MediaRecorder(stream, {type: mimeType});
        // set the instance to mediarecorder red
        mediaRecorder.current = media;
        // invoke start method
        mediaRecorder.current.start();

        let localAudioChunks = [];

        mediaRecorder.current.ondataavailable = (e) => {
            if(typeof e.data === "undefined") return;
            if (e.data.size === 0) return;
            localAudioChunks.push(e.data);
        };
        setAudioChunks(localAudioChunks);
    }

    const stopRecording = () => {
        setRecordingStatus("inactive");
        // stop the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            // created blob file from the audiochunks data
            const audioBlob = new Blob(audioChunks, {type: mimeType});
            // create a playable url from the blob file
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudio(audioUrl);
            setAudioChunks([]);

            downloadAudio(audioUrl);

        }
    }

    const downloadAudio = (audioUrl) => {
        if(audioUrl) {
            const a = document.createElement('a')
            a.href = audioUrl;
            a.download = 'recorded_audio.mp3';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        }
    };

  return (
    <div>
        <h2>Transcribe from Live Recording</h2>
            <main>
                <div className="audio-controls">
                    {!permission ? (
                        <button onClick={getMicrophonePermission} type="button">
                            Give Microphone Permission
                        </button>
                    ): null}
                    {permission && recordingStatus === "inactive"? (
                        <button onClick={startRecording} type="button">
                            Start Recording
                        </button>
                    ): null}
                    {recordingStatus === "recording" ? (
                        <button onClick={stopRecording} type='button'>
                            Stop Recording
                        </button>
                    ): null}

                    {audio? (
                        <div className='audio-container'>
                            <audio src={audio} controls></audio>
                            <a download href={audio}>
                                Download Recording
                            </a>

                        </div>
                    ): null}
                </div>
            </main>
        </div>
  )
}

export default AudioRecorder