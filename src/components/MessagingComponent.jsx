import React, { useState, useEffect } from 'react';

const MessagingComponent = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messageType, setMessageType] = useState('text'); // text, receipt, announcement
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    // This would typically be a Firebase fetch
    setTimeout(() => {
      const mockContacts = [
        { id: 1, name: 'Shop ABC', email: 'shop.abc@example.com', unread: 2, lastActive: '10 min ago' },
        { id: 2, name: 'Restaurant XYZ', email: 'restaurant.xyz@example.com', unread: 0, lastActive: '3 hrs ago' },
        { id: 3, name: 'Grocery Store', email: 'grocery@example.com', unread: 5, lastActive: '1 day ago' },
        { id: 4, name: 'Electronics Hub', email: 'electronics@example.com', unread: 0, lastActive: '2 days ago' },
      ];
      setContacts(mockContacts);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    // This would typically fetch messages from Firebase
    const mockMessages = [
      { id: 1, sender: 'admin', text: 'Hello, how can we help you today?', timestamp: '2025-07-24T10:30:00' },
      { id: 2, sender: contact.id, text: 'I\'m having issues with a recent transaction.', timestamp: '2025-07-24T10:32:00' },
      { id: 3, sender: 'admin', text: 'Could you provide the transaction reference number?', timestamp: '2025-07-24T10:33:00' },
      { id: 4, sender: contact.id, text: 'Yes, it\'s MPESA12345678', timestamp: '2025-07-24T10:35:00' },
      { id: 5, sender: 'admin', text: 'Thank you. Let me check that for you right away.', timestamp: '2025-07-24T10:36:00' },
    ];
    setMessages(mockMessages);
    
    // Reset unread count
    setContacts(prevContacts => 
      prevContacts.map(c => 
        c.id === contact.id 
          ? { ...c, unread: 0 } 
          : c
      )
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;
    
    // Add new message to chat
    const newMessageObj = {
      id: messages.length + 1,
      sender: 'admin',
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, newMessageObj]);
    setNewMessage('');
    
    // In a real app, you would send this to Firebase
  };

  const handleBroadcast = () => {
    alert('Broadcast message would be sent to all merchants');
    // In a real app, this would create a broadcast message in Firebase
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[70vh] bg-white rounded-lg overflow-hidden border border-gray-200">
      {/* Contacts sidebar */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Contacts</h2>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  onClick={() => handleContactSelect(contact)}
                  className={`p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer ${
                    selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">{contact.name}</h3>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                    {contact.unread > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Last active: {contact.lastActive}</p>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500 text-center">No contacts found</p>
            )
          )}
        </div>
      </div>
      
      {/* Message area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-medium text-lg">{selectedContact.name}</h2>
                  <p className="text-sm text-gray-500">{selectedContact.email}</p>
                </div>
                <div>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'admin'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex mb-2">
                <button
                  onClick={() => setMessageType('text')}
                  className={`mr-2 px-3 py-1 text-sm rounded-md ${
                    messageType === 'text' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Text
                </button>
                <button
                  onClick={() => setMessageType('receipt')}
                  className={`mr-2 px-3 py-1 text-sm rounded-md ${
                    messageType === 'receipt' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Receipt
                </button>
                <button
                  onClick={() => setMessageType('announcement')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    messageType === 'announcement' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Announcement
                </button>
              </div>
              
              <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-700">No conversation selected</h3>
            <p className="mt-2 text-gray-500 text-center">Choose a contact from the list to start messaging</p>
            
            <div className="mt-8">
              <button 
                onClick={handleBroadcast}
                className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
                Send Broadcast Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingComponent;