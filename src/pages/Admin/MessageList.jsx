const MessageList = ({ messages }) => {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div key={index} className="p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-800">{message.author}</h3>
            <span className="text-sm text-gray-500">{message.date}</span>
          </div>
          <p className="text-gray-600">{message.content}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;