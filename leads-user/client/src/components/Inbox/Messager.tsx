
import React, { useState } from 'react';
import MessageTop from './MessageTop';

interface MessagerProps { }

const Messager: React.FC<MessagerProps> = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<{ text: string; time: string }[]>([]);

  const [file, setFile] = useState(null);

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newMessage = event.target.value;

    if (newMessage.length > 0 && newMessage.length % 16 === 0) {
      newMessage += ' ';
    }
    setMessage(newMessage);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const currentTime = getCurrentTime();
      const newMessage = { text: message, time: currentTime };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return formattedHours + ':' + formattedMinutes + ' ' + ampm;
  };

  return (
    <>
      <div className='h-full w-[75%]  primary-light-bg'>
        <MessageTop />
        <div className='w-full h-[80%] main-bg '>
          {messages.map((msg, index) => (
            <div className='relative left-[350px] w-[60%] h-auto text-end bg-[#2A83EC] rounded-2xl text-white font-semibold ' style={{ margin: '11px 18px', padding: '6px 24px' }} key={index}>
              {msg.text} <span style={{ marginLeft: '5px', fontSize: '0.8rem' }}>({msg.time})</span>
            </div>
          ))}
        </div>
        <div className='w-full h-[4.1rem]  primary-light-bg' style={{ borderTop: '4px solid #2A83EC', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
          <div className='flex justify-center items-center h-full gap-3 '>


            <div className="flex items-center justify-center w-12 h-12 bg-[#2A83EC] text-white  rounded-full cursor-pointer">
              <label htmlFor="file-input" className="flex items-center justify-center w-full h-full cursor-pointer text-[white]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white font-bold" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.354 2.646a.5.5 0 01.5 0l7 7a.5.5 0 11-.708.708L11.5 4.207V13a.5.5 0 11-1 0V4.207l-6.146 6.147a.5.5 0 11-.708-.708l7-7zM5.5 8A1.5 1.5 0 017 9.5v5a1.5 1.5 0 11-3 0v-5A1.5 1.5 0 015.5 8zm9 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clip-rule="evenodd" />
                </svg>
              </label>
              <input id="file-input" type="file" className="hidden" onChange={handleFileChange} />
            </div>

            <input type="text" value={message} onChange={handleMessageChange} placeholder='Type a message' className='w-[70%] bg-white h-10 rounded-xl focus:border-2 focus:border-[#2A83EC] text-black font-semibold' />
            <button onClick={handleSendMessage}><img src="/sent.webp" alt="" className='h-10 w-10' /></button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messager;



