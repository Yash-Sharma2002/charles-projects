import React, { useState} from 'react';
import ChatContent from './ChatContent';
import ChatInfo from './ChatInfo';
import ChatList from './ChatList';




export default function InboxContent() {
  const chatListItems = [
    {
      id: '1',
      image: '/images/account/account.jpg',
      name: 'Chris Evans',
      lastMsg: 'Hello Eric, hope you are doing great! I just wanted ask if you were available for call?',
      msgStatus: 'Replied',
      time: '32m',
      unread: false,
      lead: true,
      appointment: true,
      deal: true,
      labels: []
    },
    {
      id: '2',
      image: '/images/account/account.jpg',
      name: 'Chris Evans',
      lastMsg: 'Hello Eric, hope you are doing great! I just wanted ask if you were available for call?',
      msgStatus: 'Contacted',
      time: '4h',
      unread: false,
      lead: true,
      appointment: false,
      deal: false,
      labels: []
    },
    {
      id: '3',
      image: '/images/account/account.jpg',
      name: 'Chris Evans',
      lastMsg: 'Hello Eric, hope you are doing great! I just wanted ask if you were available for call?',
      msgStatus: 'Connected',
      time: '32m',
      unread: true,
      lead: false,
      appointment: false,
      deal: false,
      labels: []
    },
    {
      id: '4',
      image: '/images/account/account.jpg',
      name: 'Chris Evans',
      lastMsg: 'Hello Eric, hope you are doing great! I just wanted ask if you were available for call?',
      msgStatus: 'Connected',
      time: '32m',
      unread: false,
      lead: false,
      appointment: false,
      deal: true,
      labels: []
    },
    {
      id: '5',
      image: '/images/account/account.jpg',
      name: 'Chris Evans',
      lastMsg: 'Hello Eric, hope you are doing great! I just wanted ask if you were available for call?',
      msgStatus: 'Connected',
      time: '32m',
      unread: false,
      lead: false,
      appointment: false,
      deal: false,
      labels: []
    },
    {
      id: '6',
      image: '/images/account/account.jpg',
      name: 'Chris Evans',
      lastMsg: 'Hello Eric, hope you are doing great! I just wanted ask if you were available for call?',
      msgStatus: 'Connected',
      time: '32m',
      unread: false,
      lead: false,
      appointment: false,
      deal: false,
      labels: []
    },
    {
      id: '7',
      image: '/images/account/account.jpg',
      name: 'Chris Evans',
      lastMsg: 'Hello Eric, hope you are doing great! I just wanted ask if you were available for call?',
      msgStatus: 'Connected',
      time: '32m',
      unread: false,
      lead: false,
      appointment: false,
      deal: false,
      labels: []
    },
    {
      id: '8',
      image: '/images/account/account.jpg',
      name: 'Chris Evans',
      lastMsg: 'Hello Eric, hope you are doing great! I just wanted ask if you were available for call?',
      msgStatus: 'Connected',
      time: '32m',
      unread: false,
      lead: false,
      appointment: false,
      deal: false,
      labels: []
    }
  ];

  
  const [labelName, setLabelName] = useState('');
  const [labelColor, setLabelColor] = useState("#607d8b");

  const [labels, setLabels] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  const [includeCampaigns, setIncludeCampaigns] = useState([]);
  const [includeLabels, setIncludeLabels] = useState([]);
  const [unReadMessagesOnly, setUnReadMessagesOnly] = useState(false);
  const [includePlatforms, setIncludePlatforms] = useState([]);

  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState<any>(chatListItems);
  const [activeChat, setActiveChat] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");

  

  const statusColor = () => {
    switch ((activeChat as { msgStatus?: string }).msgStatus || 'Contacted') {
      case 'Contacted':
        return 'blue-color';
      case 'Connected':
        return 'orange-color';
      case 'Replied':
        return 'purple-color';
      default:
        break;
    }
  };

  const handleActiveLead = () => {
    setActiveChat({ ...activeChat, lead: !activeChat.lead });
    let newList = [...chatList];
    newList[activeChat.id - 1].lead = !activeChat.lead;
    setChatList(newList);
  };

  const handleActiveAppointment = () => {
    setActiveChat({ ...activeChat, appointment: !activeChat.appointment });
    let newList = [...chatList];
    newList[activeChat.id - 1].appointment = !activeChat.appointment;
    setChatList(newList);
  };

  const handleActiveDeal = () => {
    setActiveChat({ ...activeChat, deal: !activeChat.deal });
    let newList = [...chatList];
    newList[activeChat.id - 1].deal = !activeChat.deal;
    setChatList(newList);
  };

  const handleLead = (index:number) => {
    let newList = [...chatList];
    let newLead = newList[index - 1].lead;
    newList[index - 1].lead = !newLead;
    setChatList(newList);
  };

  const handleAppointment = (index:number) => {
    let newList = [...chatList];
    let newAppointment = newList[index - 1].appointment;
    newList[index - 1].appointment = !newAppointment;
    setChatList(newList);
  };

  const handleDeal = (index:number) => {
    let newList = [...chatList];
    let newDeal = newList[index - 1].deal;
    newList[index - 1].deal = !newDeal;
    setChatList(newList);
  };

  const handleUnread = (index:number) => {
    let newList = [...chatList];
    let newUnread = newList[index - 1].unread;
    newList[index - 1].unread = !newUnread;
    setChatList(newList);
  };

  const addLabel = (name:string) => {
    let newList = [...chatList];
    newList.forEach((item) => {
      item.labels.push({ name, active: false, color: labelColor });
    });
    setChatList(newList);
  };

  const deleteLabel = (index:number) => {
    const newList = [...chatList];
    newList.forEach((item) => {
      item.labels.splice(index, 1);
    })
    setChatList(newList);
  };

  const handleLabelActive = (index:number) => {
    let newLabels = activeChat.labels;
    let labelActive = !newLabels[index].active;
    newLabels[index].active = labelActive;
    setActiveChat({ ...activeChat, labels: newLabels });
  };

  return (
    <div className='row g-0 inbox-content'>
      <div className='col-md-3'>
        <ChatList
          rooms={rooms}
          chatList={chatList}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          setLead={handleLead}
          setAppointment={handleAppointment}
          setDeal={handleDeal}
          setUnread={handleUnread}
          setSearchTerm={setSearchTerm}
          campaigns={campaigns}
          includeCampaigns={includeCampaigns}
          setIncludeCampaigns={setIncludeCampaigns}
          labels={labels}
          includeLabels={includeLabels}
          setIncludeLabels={setIncludeLabels}
          unReadMessagesOnly={unReadMessagesOnly}
          setUnReadMessagesOnly={setUnReadMessagesOnly}
          includePlatforms={includePlatforms}
          setIncludePlatforms={setIncludePlatforms}
        />
      </div>
      {activeChat && Object.keys(activeChat).length ? (
        <>
          <div className='col-md-6 main-bg'>
            <ChatContent
              activeChat={activeChat}
              setActiveChat={setActiveChat}
              // roomsRefetch={roomsRefetch}
              messages={messages}
              setMessages={setMessages}
              // messagesRefetch={messagesRefetch}
              setActiveLead={handleActiveLead}
              setActiveAppointment={handleActiveAppointment}
              setActiveDeal={handleActiveDeal}
              labelName={labelName}
              setLabelName={setLabelName}
              labelColor={labelColor}
              setLabelColor={setLabelColor}
              addLabel={addLabel}
              deleteLabel={deleteLabel}
              handleLabelActive={handleLabelActive}
              statusColor={statusColor}
              labels={labels}
              // labelsRefetch={labelsRefetch}
            />
          </div>
          <div className='col-md-3'>
            <ChatInfo
              activeChat={activeChat}
              statusColor={statusColor}
            />
          </div>
        </>
      ) : null}

    </div>
  )
}
