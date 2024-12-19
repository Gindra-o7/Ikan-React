import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {Send, Bot, ChevronDown, Image as ImageIcon} from 'lucide-react';
import arwana from "./assets/Arowana.jpg";
import baung from "./assets/baung.jpg";
import betok from "./assets/betok.jpg";
import cupang from "./assets/cupang.jpg";
import gabus from "./assets/gabus.jpg";
import guppy from "./assets/guppy.jpeg";
import gurami from "./assets/gurami.jpg";
import hampala from "./assets/hampala.jpeg";
import jelawat from "./assets/jelawat.jpg";
import koi from "./assets/koi.jpg";
import lele from "./assets/lele.jpg";
import mas from "./assets/mas.jpeg";
import mujair from "./assets/mujair.jpg";
import nila from "./assets/nila.jpg";
import nilem from "./assets/nilem.jpeg";
import patin from "./assets/patin.jpg";
import seluang from "./assets/seluang.jpg";
import tawes from "./assets/tawes.jpeg";
import toman from "./assets/toman.jpg";
import wader from "./assets/wader.jpg";

// Mapping nama ikan ke gambar yang diimport
const fishImages = {
    'Arwana': arwana,
    'Baung': baung,
    'Betok': betok,
    'Cupang': cupang,
    'Gabus': gabus,
    'Guppy': guppy,
    'Gurame': gurami,
    'Hampala': hampala,
    'Jelawat': jelawat,
    'Koi': koi,
    'Lele': lele,
    'Mas': mas,
    'Mujair': mujair,
    'Nila': nila,
    'Nilem': nilem,
    'Patin': patin,
    'Seluang': seluang,
    'Tawes': tawes,
    'Toman': toman,
    'Wader': wader
};

const GPTFish = () => {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            type: 'bot',
            text: 'Selamat datang di GPTFish! Deskripsikan karakteristik ikan air tawar yang ingin Anda temukan atau gunakan filter di bawah.'
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        habitat: '',
        ukuran: '',
        bentukTubuh: '',
        warna: '',
        nilaiEkonomis: '',
        tingkahLaku: ''
    });

    const filterOptions = {
        habitat: ['Air tawar dangkal', 'Air tawar tenang', 'Air tawar berlumpur', 'Air tawar mengalir', 'Air tawar dalam', 'Air tawar rawa', 'Kolam buatan', 'Kolam kecil'],
        ukuran: ['5-10 cm', '8-15 cm', '10-20 cm', '15-25 cm', '15-30 cm', '15-40 cm', '15-50 cm', '20-50 cm', '20-60 cm', '20-90 cm', '25-45 cm', '25-65 cm', '25-70 cm', '30-60 cm', '30-100 cm', '40-80 cm', '60-90 cm'],
        bentukTubuh: ['Lonjong, pipih', 'Lonjong besar, pipih', 'Memanjang, bersungut', 'Oval, agak pipih', 'Memanjang, licin', 'Silindris memanjang', 'Kecil, pipih', 'Memanjang, bersisik', 'Oval, kecil', 'Kecil, bersisik', 'Memanjang, besar'],
        warna: ['Abu-abu gelap, keperakan', 'Cokelat muda, keperakan', 'Cokelat kehitaman', 'Keemasan, keperakan', 'Perak, putih, keabu-abuan', 'Abu-abu kehitaman', 'Cokelat loreng kehitaman', 'Warna-warni (putih, merah, oranye)', 'Warna-warni cerah', 'Keemasan, perak, kehijauan', 'Perak kehijauan', 'Cokelat keabu-abuan', 'Hitam kehijauan', 'Kuning keperakan', 'Merah terang', 'Cokelat tua', 'Putih keabu-abuan', 'Keemasan, abu-abu'],
        nilaiEkonomis: ['Tinggi', 'Sangat tinggi', 'Sedang'],
        tingkahLaku: ['Bergerombol, omnivora', 'Lamban, omnivora', 'Nokturnal, karnivora', 'Aktif, omnivora', 'Nokturnal, omnivora', 'Soliter, predator', 'Bergerombol, jinak', 'Agresif, soliter', 'Lamban, predator', 'Aktif, omnivora', 'Nokturnal, soliter', 'Aktif, karnivora', 'Jinak, bergerombol', 'Soliter, agresif', 'Nokturnal, pemangsa']
    };

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const FishImage = ({name}) => (
        <div className="relative w-full h-48 overflow-hidden rounded-lg bg-gray-100">
            {fishImages[name] ? (
                <img
                    src={fishImages[name]}
                    alt={`Ikan ${name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = "/api/placeholder/400/320";
                        e.target.alt = "Image not available";
                    }}
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                    <ImageIcon className="w-12 h-12 text-gray-400"/>
                </div>
            )}
        </div>
    );

    const FishCard = ({fish}) => (
        <div className="p-4 mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                    <FishImage name={fish.ikan}/>
                </div>
                <div className="w-full md:w-2/3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {fish.ikan} ({fish.persentase_kecocokan}% Kecocokan)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <p className="text-sm">
                                <span className="font-medium">Habitat:</span>{' '}
                                {fish.detail.Habitat}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Ukuran:</span>{' '}
                                {fish.detail.Ukuran}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Bentuk Tubuh:</span>{' '}
                                {fish.detail['Bentuk Tubuh']}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm">
                                <span className="font-medium">Warna:</span>{' '}
                                {fish.detail.Warna}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Tingkah Laku:</span>{' '}
                                {fish.detail['Tingkah Laku']}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Nilai Ekonomis:</span>{' '}
                                {fish.detail['Nilai Ekonomis']}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const handleFilterChange = (category, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [category]: value
        }));

        if (value) {
            setInputText(prev => {
                const newText = `${prev ? prev + ', ' : ''}${value}`;
                return newText;
            });
        }
    };

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            type: 'user',
            text: inputText
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/identify_fish', { description: inputText });

            if (response.data.status === 'success' && response.data.results.length > 0) {
                // Filter hasil hanya yang memiliki akurasi di atas 70%
                const filteredResults = response.data.results.filter(fish => fish.persentase_kecocokan > 70);

                if (filteredResults.length > 0) {
                    const botMessage = {
                        id: Date.now().toString() + '_response',
                        type: 'bot',
                        text: 'Berikut hasil pencarian ikan:',
                        results: filteredResults
                    };

                    setMessages(prev => [...prev, botMessage]);
                } else {
                    const botMessage = {
                        id: Date.now().toString() + '_no_match',
                        type: 'bot',
                        text: 'Maaf, tidak ada ikan yang cocok. Coba deskripsikan lebih jelas lagi.'
                    };
                    setMessages(prev => [...prev, botMessage]);
                }
            } else {
                const botMessage = {
                    id: Date.now().toString() + '_error',
                    type: 'bot',
                    text: 'Maaf, tidak dapat menemukan ikan yang cocok dengan deskripsi tersebut. Mohon berikan deksripsi ikan yang lebih lengkap.'
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
            setSelectedFilters({
                habitat: '',
                ukuran: '',
                bentukTubuh: '',
                warna: '',
                nilaiEkonomis: '',
                tingkahLaku: ''
            });
        }
    };

    return (
        <div className="flex flex-col h-screen p-4 md:p-10">
            <div className="bg-white border-b p-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                    <h1 className="text-xl font-bold text-gray-800">🐟 GPTFish</h1>
                    <p className="text-gray-600 text-xs">Air Tawar</p>
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
                            className={`max-w-[90%] p-3 rounded-lg ${
                                message.type === "user"
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-gray-800 border"
                            }`}
                        >
                            {message.type === "bot" && !isLoading && (
                                <Bot className="inline-block mr-2 w-5 h-5 text-gray-500"/>
                            )}
                            <div className="space-y-4">
                                {message.text}
                                {message.results && (
                                    <div className="mt-4 space-y-4">
                                        {message.results.map((fish) => (
                                            <FishCard key={fish.ikan} fish={fish}/>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-lg bg-white text-gray-800 border">
                            <Bot className="inline-block mr-2 w-5 h-5 text-gray-500"/>
                            Mencari ikan...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef}/>
            </div>

            <div className="bg-white border-t p-3 space-y-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
                >
                    <ChevronDown className={`w-4 h-4 transform ${showFilters ? 'rotate-180' : ''}`}/>
                    <span>Filter Karakteristik Ikan</span>
                </button>

                {showFilters && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        {Object.entries(filterOptions).map(([category, options]) => (
                            <div key={category} className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </label>
                                <select
                                    value={selectedFilters[category]}
                                    onChange={(e) => handleFilterChange(category, e.target.value)}
                                    className="w-full p-2 text-sm border rounded-md"
                                >
                                    <option value="">Pilih {category}</option>
                                    {options.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange
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
                        <Send className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GPTFish;