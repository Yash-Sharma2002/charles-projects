import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Dropdown, Modal } from 'react-bootstrap';
import { IoSend } from "react-icons/io5";
import { BsChatSquareQuote, BsX } from "react-icons/bs";
import ChatMsg from './ChatMsg';
import { AiOutlineDelete } from 'react-icons/ai';
// import TagButtons from '../Inputs/TagButtons';



export default function ChatContent({
  activeChat,
  setActiveChat,
  // roomsRefetch,
  messages,
  setMessages,
  // messagesRefetch,
  setActiveLead,
  setActiveAppointment,
  setActiveDeal,
  addLabel,
  handleLabelActive,
  statusColor,
  labels,
  // labelsRefetch,
}: any) {
  const chatMsgs = [
    {
      id: '1',
      image: '/images/account/account.jpg',
      msg: "Hi",
      type: '',
      date: '15/09/22',
      time: '5m',
      sentStatus: false
    },
    {
      id: '2',
      image: '/images/account/account.jpg',
      msg: "Hi Chris Evans! Hope you're doing well",
      type: '',
      date: '15/09/22',
      time: '5m',
      sentStatus: true
    },
    {
      id: '3',
      image: '/images/account/account.jpg',
      msg: "I was hoping to hear back from you",
      type: '',
      date: '15/09/22',
      time: '5m',
      sentStatus: true
    },
    {
      id: '4',
      image: '/images/account/account.jpg',
      msg: "Hello!",
      type: 'other',
      date: '15/09/22',
      time: '40m'
    },
    {
      id: '5',
      image: '/images/account/account.jpg',
      msg: 'That sounds great! Thanks for communicating.',
      type: '',
      date: '15/09/22',
      time: '5m',
      sentStatus: true
    },
    {
      id: '6',
      image: '/images/account/account.jpg',
      msg: "Hello! Yes I looked into the problem you were concerned about. I'll fix it today.",
      type: 'other',
      date: '15/09/22',
      time: '40m'
    },
    {
      id: '7',
      image: '/images/account/account.jpg',
      msg: 'Please send me the file.',
      type: '',
      date: '15/09/22',
      time: '5m',
      sentStatus: true
    },
    {
      id: '8',
      image: '/images/account/account.jpg',
      msg: 'Sent! Check your email.',
      type: 'other',
      date: '15/09/22',
      time: '5m'
    }
  ];

  const [isLoading, setIsLoading] = useState(true);

  const msgsBottom = useRef<any>(null);
  const [chat, setChat] = useState(chatMsgs);
  const [msgInput, setMsgInput] = useState('');

  const [savedReplies, setSavedReplies] = useState<any>([]);
  const [replyTitle, setReplyTitle] = useState('');
  const [replyMsg, setReplyMsg] = useState('');
  const replyInput = useRef<any>(null);

  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);

  const [validatedReply, setValidatedReply] = useState(false);
  const [showReply, setShowReply] = useState(false);

  const [labelName, setLabelName] = useState("");
  const [labelColor, setLabelColor] = useState("");
  const [creatingLabel, setCreatingLabel] = useState(false);


  const handleSubmitReply = (event:any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedReply(true);
    }
    else {
      event.preventDefault();
      event.stopPropagation();
      setValidatedReply(false);
      setShowReply(false);

      //Add new Reply
      let newReplies = savedReplies.push({ title: replyTitle, msg: replyMsg });
      setSavedReplies(newReplies);
    }
  };

  const handleShow = () => {
    setShow(!show);
    setLabelColor("#607d8b");
  };
  const handleShowReply = () => setShowReply(!showReply);

  const deleteReply = (index:number) => {
    let newReplies = [...savedReplies];
    newReplies.splice(index, 1);
    setSavedReplies(newReplies);
  };

  const selectReply = (index:number) => {
    setMsgInput('');
    setMsgInput(savedReplies[index].msg);
  };

  const handleReplyTags = (tagName: string) => () => {
    let selectionStart = replyInput.current.selectionStart;
    let selectionEnd = replyInput.current.selectionEnd;
    let textBefore = replyMsg.substring(0, selectionStart);
    let textAfter = replyMsg.substring(selectionEnd, replyMsg.length);
    setReplyMsg(textBefore + tagName + textAfter);
  };

  const selectLabelColor = (color:string) => {
    switch (color) {
      case "#f44336":
        return 'red-color';
      case "#e91e63":
        return 'pink-color';
      case "#9c27b0":
        return 'light-purple-color';
      case "#673ab7":
        return 'purple-color';
      case "#3f51b5":
        return 'dark-blue-color';
      case "#009688":
        return 'sea-green-color';
      case "#795548":
        return 'brown-color';
      case "#607d8b":
        return 'grey-color';
      default:
        break;
    }
  };

  const handleSendMsg = () => {
    if (msgInput === '') return

    const values = {
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      message: msgInput,
      platform: activeChat.platform,
      room: activeChat.id,
    };

    setMessages([
      ...messages,
      values
    ])
    
    setMsgInput('')

    const sendMsg = async () => {
    }

    sendMsg()
  };

  useEffect(() => {
    if (msgsBottom.current != null) {
      msgsBottom.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [isLoading]);

  const assignLabel = async (label:any, action:any) => {
    let newProspectLabels = [...activeChat.prospect_labels]

    if (action === 'mark') {
      newProspectLabels.push({
        id: null,
        label_id: label.id,
        label__name: label.name,
      })
    } else {
      newProspectLabels = activeChat.prospect_labels.filter((pLabel:any) => pLabel.label_id !== label.id)
    }

    setActiveChat({
      ...activeChat,
      prospect_labels: newProspectLabels
    })

    // await createRecord({
    //   user,
    //   values: {},
    //   url: `${assignLabelRoute}${action}/${activeChat.prospect_details.id}/${label.name}/`,
    // });

    // roomsRefetch();
  }

  const createLabel = async (payload:any) => {

    // await createRecord({
    //   user,
    //   values: payload,
    //   url: labelsRoute,
    // });

    // labelsRefetch();
  }

  const deleteLabel = async (labelId:any) => {

    // await deleteRecord({
    //   user,
    //   url: `${labelsRoute}${labelId}/`,
    // });

    // labelsRefetch();
  }

  const handleSubmit = async (event:any) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    }

    else {
      event.preventDefault();
      event.stopPropagation();
      setValidated(false);
      setShow(false);

      setCreatingLabel(true)
      //Add new label
      await createLabel({
        "name": labelName,
        "color": labelColor,
      });

      setCreatingLabel(false)
    }
  };


  return (
    <div className='chat-content p-3'>
      <div className='chat-content-head mb-3 d-flex justify-content-between align-items-center'>
        <div className='chat-head-left d-flex'>
          {/* <img src={buildAvatarRoute(activeChat.prospect_details.linkedin_avatar)} alt='' /> */}
          <div className='chat-user ms-2'>
            <p className='name mb-0'>{activeChat.prospect_details.name}</p>
            <p className={'msg-status mb-0 ' + (statusColor())}>Replied</p>
          </div>
        </div>
        <div className='chat-head-right d-flex'>
          <Dropdown className='labels-dropdown me-3' drop='start'>
            <Dropdown.Toggle variant='action' className='px-2 py-1'>
              Add
            </Dropdown.Toggle>
            <Dropdown.Menu className='shadow-sm p-2'>
              <p className='small-heading'>Labels</p>
              <div className='labels-wrap pe-1 custom-scrollbar'>
                {
                  !labels.filter((label:any) => !label.default_label).length ?
                    <p className='text-center mb-0'>No Label</p> :
                    labels.filter((label:any) => !label.default_label).map((label:any, index:number) => {

                      const active = activeChat.prospect_labels.map((pLabel:any) => pLabel.label_id).includes(label.id)

                      return (
                        <div key={index} className='label-item mb-2 d-flex align-items-center justify-content-between'>
                          <div className='d-flex align-items-center'>
                            <Form.Check
                              type='checkbox'
                              id={`label-${index}`}
                              name={`label-${index}`}
                              label={label.name}
                              style={{ color: label.color }}
                              checked={active}
                              onChange={() => assignLabel(label, active ? "unmark" : "mark")}
                            />
                          </div>
                          <Button variant='red' onClick={() => deleteLabel(label.id)}>
                            <BsX size={14} />
                          </Button>
                        </div>
                      )
                    })
                }
              </div>
              <Button variant='primary' className='w-100 p-1 mt-3' onClick={handleShow}>
                Create New
              </Button>
            </Dropdown.Menu>
          </Dropdown>
          {
            labels.filter((label:any) => label.default_label).map((label:any) => {
              const active = activeChat.prospect_labels.map((pLabel:any) => pLabel.label_id).includes(label.id)

              return (
                <Button
                  variant='action'
                  className={'me-1 ' + (active ? 'active' : '')}
                  onClick={() => assignLabel(label, active ? "unmark" : "mark")}
                  style={active ? { backgroundColor: label.color, borderColor: label.color } : {}}
                >
                  {label.name}
                </Button>
              )
            })
          }
        </div>
      </div>
      <div className='chat-content-main p-2'>
        <div className='chat-content-body custom-scrollbar'>
          {
            messages.map((message:any,index:number) => {
              return <ChatMsg key={index} message={message} room={activeChat} />
            })
          }
          <div ref={msgsBottom}></div>
        </div>
        <div className='chat-content-foot d-flex pt-3 pb-2'>
          <Form.Control
            as='textarea'
            rows={1}
            name='msg-input'
            placeholder='Type your message...'
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            className='custom-scrollbar me-2'
          />
          <div className='d-flex align-items-center'>
            <Dropdown className='replies-dropdown' drop='start'>
              <Dropdown.Toggle variant='action' className='px-2 py-1'>
                <BsChatSquareQuote size={20} />
              </Dropdown.Toggle>
              <Dropdown.Menu className='shadow-sm p-2'>
                <p className='small-heading'>Saved Replies</p>
                <div className='replies-wrap pe-1 custom-scrollbar'>
                  {
                    savedReplies.length === 0 ?
                      <p className='text-center mb-0'>No Replies</p> :
                      savedReplies.map((item:any, index:number) => {
                        return <div
                          key={index}
                          className='reply-item mb-2 d-flex align-items-center justify-content-between'
                          onClick={() => selectReply(index)}
                        >
                          <div className='reply-content me-1 p-2'>
                            <p className='title mb-0'>
                              {item.title}
                            </p>
                            <p className='msg mb-0'>
                              {item.msg}
                            </p>
                          </div>
                          <Button variant='red' onClick={() => deleteReply(index)}>
                            <AiOutlineDelete size={14} />
                          </Button>
                        </div>
                      })
                  }
                </div>
                <Button variant='primary' className='w-100 p-1 mt-3' onClick={handleShowReply}>
                  Create New
                </Button>
              </Dropdown.Menu>
            </Dropdown>
            <Button variant='primary' className='ms-2' onClick={handleSendMsg} disabled={msgInput === '' ? true : false}>
              <IoSend size={18} />
            </Button>
          </div>
        </div>
      </div>

      { /***** Create Label Popup *****/}

      <Modal
        show={show}
        onHide={handleShow}
        size='lg'
        centered
        className='max-heighted-modal add-search-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Label</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <div className='mb-3'>
              <Form.Control
                type='text'
                id='create-label-input'
                placeholder='Enter Label Name'
                onChange={(e) => setLabelName(e.target.value)}
                required
              />
            </div>
            <p>Select a Color</p>
            {/* <CirclePicker
              width='600px'
              colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7",
                "#3f51b5", "#009688", "#795548", "#607d8b"]}
              onChangeComplete={(color) => setLabelColor(color.hex)}
            /> */}
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' variant="primary" disabled={creatingLabel}>
              {creatingLabel ? 'Creating...' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      { /***** Create Reply Popup *****/}

      <Modal
        show={showReply}
        onHide={handleShowReply}
        size='lg'
        centered
        className='max-heighted-modal add-search-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Reply</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validatedReply} onSubmit={handleSubmitReply}>
          <Modal.Body>
            <div className='mb-3'>
              <Form.Control
                type='text'
                id='reply-title-input'
                placeholder='Enter Title'
                onChange={(e) => setReplyTitle(e.target.value)}
                required
              />
            </div>
            <div className='mb-3'>
              <Form.Control
                ref={replyInput}
                as='textarea'
                rows={5}
                id='reply-msg-input'
                placeholder='Enter Message'
                value={replyMsg}
                onChange={(e) => setReplyMsg(e.target.value)}
                required
              />
            </div>
            {/* <TagButtons tagAction={handleReplyTags} /> */}
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' variant="primary">
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}
