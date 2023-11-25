import React, {useState, useRef, useEffect} from 'react'
import axios from "axios"
import OpenAIApi from "openai";
import './Example.css';

const OPEN_AI_KEY = "YOUR OPEN AI KEY";
const model = 'whisper-1';

const openai = new OpenAIApi({apiKey: OPEN_AI_KEY, dangerouslyAllowBrowser: true});
import apiResponse from './hello';

const Example = () => {
    console.log(OPEN_AI_KEY);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();
    const [file, setFile] = useState();
    const [response, setResponse] = useState("hello world");
    const [ques, setQues] = useState("Please submit a selected video transcript");
    const [transStatus, setTransStatus] = useState("Please Load The File")


    const onChangeFile = () => {
        setFile(inputRef.current.files[0]);
        console.log(file);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const questions = await apiResponse(JSON.stringify(response));
        setQues(questions);
        console.log(ques);
        setLoading(false);
    };

    useEffect(() => {
        console.log('use efff');

        const fetchAudioFile = async () => {
            if (!file) {
                console.log("no file detected");
                return;
            } else {
                console.log('file found');
            }

            setTransStatus("Transcribing, please wait")

            const formData = new FormData();
            formData.append("model", model);
            formData.append("file", file);
            console.log(formData);

            axios
                .post("https://api.openai.com/v1/audio/transcriptions", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${OPEN_AI_KEY}`,
                    }
                })
                .then((res) => {
                    setTransStatus("Succesfully Transcribed")
                    console.log("response sent");
                    console.log(res.data);
                    setResponse(res.data);
                })
                .catch((err) => {
                    console.log(err)
                });
                console.log("posted");
               
        }
        fetchAudioFile();

    }, [file]);

  return (
    <div className="container">
      <div className="input-section">
        <h1>Input Your Video Here 👇</h1>
        <div className='input'>
          <input
            type='file'
            ref={inputRef}
            onChange={onChangeFile}
            className="file-input" // Added CSS class for styling
          />
          <button onClick={handleSubmit} className="submit-button">Submit</button>
        </div>
      </div>
      <div className='transStatus'>{transStatus}</div>
      {response && (
        <div className="result-section">
          <pre>{ques}</pre>
        </div>
      )}
    </div>
  )
}

export default Example