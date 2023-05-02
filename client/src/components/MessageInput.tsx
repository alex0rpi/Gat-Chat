// This input component will be visible:
// at welcome chat once the user is identified AND at a room chat
import { useRef, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import UIButton from './UIButton';
import { Form } from 'react-bootstrap';

const MessageInput = () => {
  const { appDispatch } = useContext(SocketContext);

  const msgInputRef = useRef<HTMLInputElement>(null);

  const handleSendMsg = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (msgInputRef.current?.value) {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msgInputRef.current.value }),
      });
      const data = await response.json();
      console.log(data);
      appDispatch({ type: 'update_messages', payload: data });
      msgInputRef.current.value = '';
    }
  };
  return (
    <div className="msg-field">
      <Form.Group className="my-0 p-2 d-flex" controlId="">
        <Form.Control ref={msgInputRef} type="text" />
        <UIButton btnText="SEND" clickHandler={handleSendMsg} />
      </Form.Group>
    </div>
  );
};

export default MessageInput;
