import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hi there! I'm TradeSphere's AI assistant. How can I help you today?", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
    
    // Process response
    setTimeout(() => {
      const botResponse = generateResponse(input);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 600);
  };

  // Simple response generator
  const generateResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello! How can I assist you with TradeSphere today?";
    }
    else if (lowerInput.includes('buy') || lowerInput.includes('purchase')) {
      return "To buy an item on TradeSphere, browse listings and click on the one you're interested in. Then you can contact the seller to arrange a purchase.";
    }
    else if (lowerInput.includes('sell') || lowerInput.includes('listing')) {
      return "To create a listing, click on 'Post Your Ad' and fill out the details about your item. It's quick and easy!";
    }
    else if (lowerInput.includes('account') || lowerInput.includes('profile')) {
      return "You can manage your account settings by clicking on your profile icon in the top right corner.";
    }
    else if (lowerInput.includes('contact') || lowerInput.includes('support')) {
      return "For support, please email support@tradesphere.com or use the Contact Us form in the footer.";
    }
    else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
      return "Prices on TradeSphere are set by sellers. You can filter listings by price range to find options that fit your budget.";
    }
    else if (lowerInput.includes('thank')) {
      return "You're welcome! Let me know if you need anything else.";
    }
    else if (lowerInput.includes('category') || lowerInput.includes('categories')) {
      return "We have various categories including Vehicles, Electronics, Furniture, Properties, Jobs, Services, Fashion, and Hobbies. Click on any category to explore listings.";
    }
    else {
      return "I'm not sure I understand that question. Can you try asking something about buying, selling, or using TradeSphere?";
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Button */}
      <motion.button
        className="bg-primary-600 hover:bg-primary-700 rounded-full p-4 text-white shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
      >
        {isOpen ? <FaTimes size={20} /> : <FaRobot size={20} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Chat Header */}
            <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <FaRobot className="mr-2" />
                <h3 className="font-semibold">TradeSphere Assistant</h3>
              </div>
              <button onClick={toggleChat} className="text-white hover:text-gray-200">
                <FaTimes />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto p-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === 'user' 
                        ? 'bg-primary-600 text-white rounded-br-none' 
                        : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index % 3) }}
                  >
                    {msg.text}
                  </motion.div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button 
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-r-lg"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
