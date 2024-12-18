import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot } from 'lucide-react';

const GPTFish = () => {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            type: 'bot',
            text: 'Selamat datang di GPTFish! Deskripsikan karakteristik ikan yang ingin Anda temukan.'
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        // Tambahkan pesan pengguna
        const userMessage = {
            id: Date.now().toString(),
            type: 'user',
            text: inputText
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Kirim request ke backend
            const response = await axios.post('http://localhost:5000/identify_fish', { description: inputText });

            // Proses respons
            if (response.data.status === 'success' && response.data.results.length > 0) {
                // Loop semua ikan yang ditemukan
                const botMessages = response.data.results.map((result, index) => ({
                    id: Date.now().toString() + `_response_${index}`,
                    type: 'bot',
                    text: `Ikan yang cocok: ${result.ikan} (${result.persentase_kecocokan}% Kecocokan)
                    
Detail:
- Habitat: ${result.detail.Habitat}
- Ukuran: ${result.detail.Ukuran}
- Bentuk Tubuh: ${result.detail['Bentuk Tubuh']}
- Warna: ${result.detail.Warna}
- Tingkah Laku: ${result.detail['Tingkah Laku']}`
                }));

                // Tambahkan semua botMessages ke state
                setMessages(prev => [...prev, ...botMessages]);
            } else {
                const botMessage = {
                    id: Date.now().toString() + '_error',
                    type: 'bot',
                    text: 'Maaf, tidak dapat menemukan ikan yang cocok dengan deskripsi tersebut.'
                };
                setMessages(prev => [...prev, botMessage]);
            }
        } catch (error) {
            const botMessage = {
                id: Date.now().toString() + '_error',
                type: 'bot',
                text: "Terjadi kesalahan dalam mengambil data ikan."
            };
            setMessages(prev => [...prev, botMessage]);
        } finally {
            setIsLoading(false);
            setInputText('');
        }
    };

    return (
        <div className="flex flex-col h-screen p-10">
            <div className="bg-white border-b p-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                    <h1 className="text-xl font-bold text-gray-800">🐟 GPTFish</h1>
                    <p className="text-gray-600 text-xs">Ikan Air Tawar</p>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.type === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                                message.type === "user"
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-gray-800 border"
                            }`}
                        >
                            {message.type === "bot" && !isLoading && (
                                <Bot className="inline-block mr-2 w-5 h-5 text-gray-500" />
                            )}
                            {message.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-lg bg-white text-gray-800 border">
                            <Bot className="inline-block mr-2 w-5 h-5 text-gray-500" />
                            Mencari ikan...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t p-3">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Deskripsikan karakteristik ikan..."
                        className="flex-grow p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputText.trim()}
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GPTFish;
