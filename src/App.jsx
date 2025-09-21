import React, { useState, useEffect, useRef } from 'react';
import { Book, Bot, Code, GalleryVertical, Home, Mic, Music, Play, Save, Settings, Share2, Trash2, Video, Wand2, CheckCircle, AlertTriangle, MessageSquare, BrainCircuit, FileUp, Sparkles, Copy } from 'lucide-react';

// --- Models Data ---
const PROVIDER_MODELS = {
    Google: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'],
    OpenAI: ['gpt-5', 'gpt-5-mini','o4-mini','o3-deep-research','gpt-4.1','gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    Anthropic: ['claude-opus-4-1-20250805', 'claude-opus-4-20250514', 'claude-sonnet-4-20250514', 'claude-3-7-sonnet-20250219', 'claude-3-5-haiku-20241022'],
    xAI: ['grok-4-fast-reasoning' , 'grok-4-0709', 'grok-3', 'grok-3-mini', 'grok-2']
};

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState('Workbench');
  const [prompts, setPrompts] = useState([
    { id: 1, title: "Creative Story Generator", category: "Text", framework: "CRISPE", content: "**Context:** You are a master storyteller with a flair for whimsical and slightly melancholic tales.\n**Role:** Creative Writer\n**Instruction:** Generate a short story (300-500 words).\n**Specificity:** The story must be about a lost clockwork robot searching for its creator in a dense, magical forest. The tone should be hopeful yet tinged with sadness.\n**Purpose:** To evoke a sense of wonder and empathy in young adult readers.\n**Example:** 'The little robot, designated Unit 734, whirred softly as a dewdrop fell from a glowing mushroom onto its brass chassis. Its single optical sensor scanned the mossy trunks, searching for the familiar sigil of its master...'" },
    { id: 2, title: "Python Code Assistant", category: "Coding", framework: "Chain-of-Thought", content: "Let's think step by step. First, I need to define a Python function that accepts two dictionaries as arguments. Second, I'll create a new dictionary by copying the first one to avoid modifying the original. Third, I will iterate through the second dictionary and update the new dictionary with its key-value pairs, overwriting existing keys if necessary. Finally, I will return the merged dictionary." },
  ]);
  const [playgroundSystemPrompt, setPlaygroundSystemPrompt] = useState('');
  const [apiKeys, setApiKeys] = useState({ 
    google: '', 
    openAI: '', 
    anthropic: '', 
    xai: '' 
  });

  const addPrompt = (newPrompt) => {
    setPrompts(prev => [...prev, { ...newPrompt, id: Date.now() }]);
  };

  const deletePrompt = (id) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  };
  
  const loadPromptInPlayground = (prompt) => {
    setPlaygroundSystemPrompt(prompt.content);
    setActiveTab('Playground');
  };

  const tabs = {
    'Home': <Home />,
    'Workbench': <Wand2 />,
    'Playground': <BrainCircuit />,
    'Prompt Gallery': <GalleryVertical />,
    'Documentation': <Book />,
    'Settings': <Settings />
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'Workbench':
        return <Workbench 
                  addPrompt={addPrompt} 
                  loadPromptInPlayground={loadPromptInPlayground}
                  apiKeys={apiKeys}
                />;
      case 'Playground':
        return <Playground 
                    initialSystemPrompt={playgroundSystemPrompt} 
                    prompts={prompts} 
                    apiKeys={apiKeys}
                />;
      case 'Prompt Gallery':
        return <PromptGallery 
                  prompts={prompts} 
                  deletePrompt={deletePrompt}
                  loadPromptInPlayground={loadPromptInPlayground} 
                />;
      case 'Documentation':
        return <Documentation />;
      case 'Settings':
        return <SettingsPage apiKeys={apiKeys} setApiKeys={setApiKeys} />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <div className="flex h-screen">
        <aside className="w-64 bg-gray-950 p-6 border-r border-gray-800 flex flex-col justify-between flex-shrink-0">
          <div>
            <div className="flex items-center space-x-2 mb-10">
              <Bot className="w-8 h-8 text-indigo-400" />
              <h1 className="text-2xl font-bold">PromptGenie</h1>
            </div>
            <nav className="space-y-2">
              {Object.keys(tabs).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {React.cloneElement(tabs[tab], { className: "w-5 h-5" })}
                  <span className="font-medium">{tab}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// --- Sub-components (All defined now) ---

const HomePage = ({ setActiveTab }) => (
  <div className="animate-fade-in">
    <div className="text-center py-20">
      <Bot className="w-24 h-24 mx-auto text-indigo-400 mb-6" />
      <h1 className="text-5xl font-extrabold text-white mb-4">Welcome to PromptGenie</h1>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
        Your ultimate toolkit for designing, managing, and deploying powerful AI prompts.
      </p>
      <button
        onClick={() => setActiveTab('Workbench')}
        className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg"
      >
        Go to Workbench
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <FeatureCard 
            icon={<Wand2/>} 
            title="AI-Powered Workbench" 
            description="Craft the perfect prompt with structured frameworks and real-time AI generation."
        />
        <FeatureCard 
            icon={<BrainCircuit/>} 
            title="Interactive Playground" 
            description="Test your prompts instantly in a chat interface with configurable models and parameters."
        />
        <FeatureCard 
            icon={<GalleryVertical/>} 
            title="Prompt Gallery" 
            description="Save, categorize, and manage your entire collection of prompts in one place."
        />
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-gray-950 p-8 rounded-xl border border-gray-800 hover:border-indigo-500 transition-all duration-300">
        <div className="bg-indigo-600/10 text-indigo-400 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            {React.cloneElement(icon, { className: "w-6 h-6" })}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

const Workbench = ({ addPrompt, loadPromptInPlayground, apiKeys }) => {
    const [description, setDescription] = useState('');
    const [framework, setFramework] = useState('CRISPE');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [showSaveModal, setShowSaveModal] = useState(false);

    const frameworks = ['CRISPE', 'RACE', 'Chain-of-Thought', 'ReAct', 'APE', 'TAG'];

    const generatePrompt = async () => {
        if (!description) {
            setError("Please enter a description for your prompt.");
            setTimeout(() => setError(null), 3000);
            return;
        }
        if (!apiKeys.google) {
            setError("Google API Key not set in Settings. Workbench uses the Google API.");
            setTimeout(() => setError(null), 5000);
            return;
        }
        setIsGenerating(true);
        setError(null);
        setGeneratedPrompt('');

        const metaPrompt = `You are an expert in prompt engineering. Your task is to generate a detailed and effective prompt based on a user's request and a specified framework. Framework: "${framework}", User's Goal: "${description}". Instructions: Analyze the user's goal. Adhere strictly to the structure and principles of the selected framework. Flesh out each component with detailed, high-quality content derived from the user's goal. Replace all placeholders like "[Specify Role]" with concrete information. The final output should be ONLY the generated prompt text, correctly formatted in Markdown. Generate the prompt now.`;
        
        try {
            const payload = { contents: [{ role: "user", parts: [{ text: metaPrompt }] }] };
            const apiKey = apiKeys.google;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            
            if (!response.ok) {
                let errorMsg = `API Error (${response.status})`;
                try {
                    const errorData = await response.json();
                    errorMsg += `: ${errorData.error?.message || JSON.stringify(errorData)}`;
                } catch {
                     errorMsg += `: ${response.statusText || 'Could not parse error response.'}`;
                }
                throw new Error(errorMsg);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
                setGeneratedPrompt(result.candidates[0].content.parts[0].text);
            } else {
                throw new Error("Invalid or empty response structure from API.");
            }
        } catch (e) {
            console.error(e);
            setError(e.message);
            setTimeout(() => setError(null), 5000);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {showSaveModal && <SavePromptModal promptContent={generatedPrompt} framework={framework} addPrompt={addPrompt} onClose={() => setShowSaveModal(false)} />}
            <div className="bg-gray-950 p-8 rounded-xl border border-gray-800 flex flex-col">
                <h2 className="text-3xl font-bold mb-6 text-white">Prompt Workbench</h2>
                <div className="mb-6 flex-grow flex flex-col">
                    <label className="block text-lg font-medium text-gray-300 mb-2">1. Describe what you want to achieve</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full flex-grow p-4 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g., A marketing email for a new tech product launch..." />
                </div>
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-300 mb-2">2. Choose a Prompt Framework</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{frameworks.map((f) => (<button key={f} onClick={() => setFramework(f)} className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${framework === f ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>{f}</button>))}</div>
                </div>
                {error && <div className="bg-red-900/50 text-red-300 p-3 rounded-lg mb-4 flex items-start space-x-2"><AlertTriangle className="w-5 h-5 shrink-0 mt-1" /><span>{error}</span></div>}
                <button onClick={generatePrompt} disabled={isGenerating} className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-green-700 transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center space-x-2">{isGenerating ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>Generating...</span></> : <><Sparkles className="w-6 h-6"/><span>Generate Prompt</span></>}</button>
            </div>
            <div className="bg-gray-950 p-8 rounded-xl border border-gray-800 flex flex-col">
                <h2 className="text-3xl font-bold mb-6 text-white">Generated Prompt</h2>
                <div className="flex-grow bg-gray-800 rounded-lg p-6 border border-gray-700 relative">
                    <pre className="whitespace-pre-wrap text-gray-200 text-base leading-relaxed font-mono h-full overflow-y-auto">{generatedPrompt || "Your generated prompt will appear here..."}</pre>
                </div>
                <div className="mt-6 flex space-x-4">
                    <button onClick={() => setShowSaveModal(true)} disabled={!generatedPrompt} className="flex-1 bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 flex items-center justify-center space-x-2 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"><Save className="w-5 h-5"/><span>Save</span></button>
                    <button onClick={() => loadPromptInPlayground({content: generatedPrompt})} disabled={!generatedPrompt} className="flex-1 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 flex items-center justify-center space-x-2 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed"><BrainCircuit className="w-5 h-5"/><span>Use in Playground</span></button>
                </div>
            </div>
        </div>
    );
};

const Playground = ({ initialSystemPrompt, prompts, apiKeys }) => {
    const [provider, setProvider] = useState('Google');
    const [model, setModel] = useState(PROVIDER_MODELS['Google'][0]);
    const [systemPrompt, setSystemPrompt] = useState(initialSystemPrompt || 'You are a helpful assistant.');
    const [temperature, setTemperature] = useState(0.7);
    const [maxTokens, setMaxTokens] = useState(1024);
    const [chatHistory, setChatHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showLoadPrompt, setShowLoadPrompt] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);
    useEffect(() => { if(initialSystemPrompt) { setSystemPrompt(initialSystemPrompt); } }, [initialSystemPrompt]);
    useEffect(() => { setModel(PROVIDER_MODELS[provider][0]); }, [provider]);

    // Utility function to safely extract message from API response
    const extractMessage = (result) => {
        const pathsToTry = [
            'choices.0.message.content',
            'candidates.0.content.parts.0.text',
            'content.0.text',
            'choices.0.delta.content'
        ];

        for (const path of pathsToTry) {
            const message = path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, result);
            if (message !== undefined) {
                return message;
            }
        }
        return undefined;
    };

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;
        setError(null);
        
        const keyMap = { Google: 'google', OpenAI: 'openAI', Anthropic: 'anthropic', xAI: 'xai' };
        const currentApiKey = apiKeys[keyMap[provider]];
        
        if (!currentApiKey) {
            setError(`API key for ${provider} not set in Settings.`);
            return;
        }

        const newUserMessage = { role: 'user', content: userInput };
        const updatedHistory = [...chatHistory, newUserMessage];
        setChatHistory(updatedHistory);
        setUserInput('');
        setIsLoading(true);

        let apiUrl = '';
        let apiPayload = {};
        let apiHeaders = { 'Content-Type': 'application/json' };

        try {
            switch(provider) {
                case 'Google':
                    apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${currentApiKey}`;
                    const googleHistory = updatedHistory.map(msg => ({ 
                        role: msg.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: msg.content }] 
                    }));
                    apiPayload = { 
                        contents: googleHistory,
                        generationConfig: { temperature, maxOutputTokens: maxTokens } 
                    };
                    if (systemPrompt && systemPrompt.trim()) {
                        apiPayload.systemInstruction = { parts: [{ text: systemPrompt }] };
                    }
                    break;
                case 'OpenAI':
                    apiUrl = '/api/openai/v1/chat/completions';
                    apiHeaders['Authorization'] = `Bearer ${currentApiKey}`;
                    
                    // Conditional payload based on model
                    const newModels = ['gpt-5', 'gpt-5-mini', 'o4-mini', 'o3-deep-research', 'gpt-4.1'];
                    if (newModels.some(m => model.startsWith(m))) {
                        apiPayload = { 
                            model, 
                            messages: [{ role: 'system', content: systemPrompt }, ...updatedHistory], 
                            temperature: 1.0, 
                            max_completion_tokens: maxTokens 
                        };
                    } else {
                        apiPayload = { 
                            model, 
                            messages: [{ role: 'system', content: systemPrompt }, ...updatedHistory], 
                            temperature, 
                            max_tokens: maxTokens 
                        };
                    }
                    break;
                case 'Anthropic':
                    apiUrl = '/api/anthropic/v1/messages';
                    apiHeaders['x-api-key'] = currentApiKey;
                    apiHeaders['anthropic-version'] = '2023-06-01';
                    apiHeaders['anthropic-dangerous-direct-browser-access'] = 'true';
                    apiPayload = { 
                        model, 
                        system: systemPrompt, 
                        messages: updatedHistory, 
                        temperature, 
                        max_tokens: maxTokens 
                    };
                    break;
                case 'xAI':
                    apiUrl = '/api/xai/v1/chat/completions';
                    apiHeaders['Authorization'] = `Bearer ${currentApiKey}`;
                    apiPayload = {
                        model,
                        messages: [{ role: 'system', content: systemPrompt }, ...updatedHistory].filter(m => m.content), // xAI might not support empty system prompts
                        temperature,
                        max_tokens: maxTokens
                    };
                    break;
                default:
                    throw new Error('Unsupported provider');
            }

            const response = await fetch(apiUrl, { method: 'POST', headers: apiHeaders, body: JSON.stringify(apiPayload) });
            
            if (!response.ok) {
                let errorMsg = `API Error (${response.status})`;
                try {
                    const errorData = await response.json();
                    errorMsg += `: ${errorData.error?.message || JSON.stringify(errorData)}`;
                } catch {
                     errorMsg += `: ${response.statusText || 'Could not parse error response.'}`;
                }
                throw new Error(errorMsg);
            }

            const result = await response.json();

            // Handle Google's safety feedback before trying to extract a message
            if (provider === 'Google' && !result.candidates && result.promptFeedback) {
                const blockReason = result.promptFeedback.blockReason;
                const safetyRatings = result.promptFeedback.safetyRatings?.map(r => `${r.category}: ${r.probability}`).join(', ');
                throw new Error(`Response blocked by Google. Reason: ${blockReason || 'Not specified'}. Details: ${safetyRatings || 'None'}`);
            }
            
            const message = extractMessage(result);

            if (message !== undefined) {
                setChatHistory(prev => [...prev, { role: 'assistant', content: message }]);
            } else {
                console.error("Could not find message in API response:", result);
                throw new Error("Could not parse message from API response. Check console for details.");
            }

        } catch (e) {
            console.error(e);
            setError(e.message);
            setChatHistory(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in flex flex-col lg:flex-row gap-6 h-[calc(100vh-4rem)]">
            <div className="w-full lg:w-1/3 bg-gray-950 p-6 rounded-xl border border-gray-800 flex flex-col">
                <h3 className="text-xl font-bold mb-4">Configuration</h3>
                <div className="mb-4"><label className="block text-sm font-medium text-gray-400 mb-1">Provider</label><select value={provider} onChange={e => setProvider(e.target.value)} className="w-full p-2 bg-gray-800 rounded-lg border border-gray-700">{Object.keys(PROVIDER_MODELS).map(p => <option key={p}>{p}</option>)}</select></div>
                <div className="mb-4"><label className="block text-sm font-medium text-gray-400 mb-1">Model</label><select value={model} onChange={e => setModel(e.target.value)} className="w-full p-2 bg-gray-800 rounded-lg border border-gray-700">{PROVIDER_MODELS[provider].map(m => <option key={m}>{m}</option>)}</select></div>
                <div className="flex-grow flex flex-col mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">System Instruction</label>
                    <div className="relative flex-grow"><textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} className="w-full h-full p-2 bg-gray-800 rounded-lg border border-gray-700 resize-none" placeholder="e.g., You are a master poet..."/><button onClick={() => setShowLoadPrompt(true)} className="absolute bottom-2 right-2 bg-indigo-600 p-1.5 rounded-md hover:bg-indigo-700" title="Load from Gallery"><FileUp className="w-4 h-4" /></button></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-400 mb-1 mt-2">Temperature: {temperature}</label><input type="range" min="0" max="1" step="0.1" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" /></div>
                <div><label className="block text-sm font-medium text-gray-400 mb-1 mt-2">Max Tokens: {maxTokens}</label><input type="range" min="64" max="8192" step="64" value={maxTokens} onChange={e => setMaxTokens(parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" /></div>
            </div>
            <div className="w-full lg:w-2/3 bg-gray-950 rounded-xl border border-gray-800 flex flex-col">
                <div className="flex-grow p-6 overflow-y-auto">
                    {error && <div className="bg-red-900/50 text-red-300 p-3 rounded-lg mb-4 flex items-start space-x-2"><AlertTriangle className="w-5 h-5 mt-1 shrink-0"/><span className="break-all">{error}</span></div>}
                    {chatHistory.length === 0 && !error && <div className="flex flex-col items-center justify-center h-full text-center text-gray-500"><MessageSquare className="w-16 h-16 mb-4" /><h3 className="text-xl font-semibold">AI Playground</h3><p>Start a conversation below.</p></div>}
                    <div className="space-y-6">{chatHistory.map((msg, i) => (<div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>{msg.role !== 'user' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0"><Bot className="w-5 h-5"/></div>}<div className={`p-4 rounded-xl max-w-xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800'}`}><pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">{msg.content}</pre></div></div>))}{isLoading && <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0"><Bot className="w-5 h-5"/></div><div className="p-4 rounded-xl max-w-xl bg-gray-800 flex items-center"><div className="animate-pulse flex space-x-1"><div className="w-2 h-2 bg-gray-500 rounded-full"></div><div className="w-2 h-2 bg-gray-500 rounded-full"></div><div className="w-2 h-2 bg-gray-500 rounded-full"></div></div></div></div>}<div ref={chatEndRef} /></div>
                </div>
                <div className="p-4 border-t border-gray-800"><div className="relative"><input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !isLoading && handleSendMessage()} placeholder="Type your message here..." disabled={isLoading} className="w-full bg-gray-800 text-white p-4 pr-12 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" /><button onClick={handleSendMessage} disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></button></div></div>
            </div>
            {showLoadPrompt && <LoadPromptModal prompts={prompts} setSystemPrompt={setSystemPrompt} onClose={() => setShowLoadPrompt(false)} />}
        </div>
    );
};

const Documentation = () => {
    const frameworks = [
        { name: "CRISPE", desc: "A comprehensive framework for detailed and structured prompts.", components: ["Context", "Role", "Instruction", "Specificity", "Purpose", "Example"], example: "Context: A high-end Italian restaurant is launching a new winter menu.\nRole: You are a professional food critic writing for a luxury lifestyle magazine.\nInstruction: Write a 200-word review of the new menu.\nSpecificity: Focus on the truffle pasta and the duck confit. Mention the ambiance and service.\nPpurpose: To entice affluent readers to visit the restaurant.\nExample: 'The aroma of white truffle heralded the arrival of the tagliatelle, each strand a silken ribbon coated in a parmesan sauce so decadent it should be illicit...'" },
        { name: "RACE", desc: "Simple and efficient for defining a clear task and expectation.", components: ["Role", "Action", "Context", "Expectation"], example: "Role: Act as a senior marketing strategist.\nAction: Create five catchy Instagram captions.\nContext: The campaign is for a new brand of eco-friendly, reusable coffee cups.\nExpectation: The captions should be short, engaging, and include relevant hashtags like #SustainableSips and #EcoFriendly." },
        { name: "Chain-of-Thought (CoT)", desc: "Encourages the model to break down complex problems and show its reasoning step-by-step.", components: ["Instruction", "Step-by-step cue"], example: "Question: If a car travels at 60 mph and a train travels at 80 mph, how much longer does it take the car to travel 240 miles than the train?\nLet's think step by step." },
        { name: "Tree of Thoughts (ToT)", desc: "Explores multiple reasoning paths simultaneously, useful for problems with several possible solutions.", components: ["Instruction", "Exploration cue"], example: "Task: Propose three different business ideas to reduce plastic waste in a city. For each idea, evaluate its potential impact, feasibility, and key challenges. Consider solutions from different angles: technology, community engagement, and policy." },
        { name: "ReAct", desc: "Combines Reasoning and Acting, enabling the model to use tools to find answers.", components: ["Thought", "Action", "Observation"], example: "Question: What is the current stock price of Apple Inc.?\nThought: I need to find the current stock price of Apple (AAPL). I will use a stock market tool.\nAction: search_stock_price('AAPL')\nObservation: [Tool returns '$195.89']\nThought: The current stock price of Apple Inc. is $195.89. I can now answer the user's question.\nFinal Answer: The current stock price of Apple Inc. is $195.89." },
        { name: "APE", desc: "Defines the core components of a request for clear, actionable results.", components: ["Action", "Purpose", "Expectation"], example: "Action: Write three variations of a Facebook ad copy.\nPurpose: To drive clicks to a product page for a new brand of organic dog food.\nExpectation: The copy must be under 40 words, highlight the organic ingredients, and have a clear call-to-action." },
        { name: "TAG", desc: "A goal-oriented framework for direct and efficient prompt construction.", components: ["Task", "Action", "Goal"], example: "Task: Generate a user story for a new feature in a project management app.\nAction: Write the story from the perspective of a Project Manager.\nGoal: The story should clearly define the need to assign sub-tasks to team members." },
        { name: "RTF", desc: "A simple structure focusing on the persona, task, and desired output style.", components: ["Role", "Task", "Format"], example: "Role: You are a travel blogger specializing in budget travel in Southeast Asia.\nTask: Write a list of the top 5 must-visit street food stalls in Bangkok.\nFormat: A numbered list with the stall name, a signature dish, and a short description for each." },
        { name: "SPAR", desc: "A framework for problem-solving and generating structured, solution-oriented responses.", components: ["Situation", "Problem", "Action", "Result"], example: "Situation: A small e-commerce business is experiencing a high cart abandonment rate.\nProblem: Customers add items to their cart but do not complete the purchase, leading to lost revenue.\nAction: Analyze the checkout process and propose three actionable strategies to reduce cart abandonment.\nResult: Provide a list of strategies, each with a brief explanation of how it would improve the checkout experience." },
        { name: "TRACE", desc: "A detailed framework for structured tasks, leaving little room for ambiguity.", components: ["Task", "Request", "Action", "Context", "Example"], example: "Task: Generate a Python function.\nRequest: I need a function that sorts a list of dictionaries.\nAction: The function should take a list of dictionaries and a key as input, and sort the list based on the value of that key.\nContext: The dictionaries represent user data, and I need to sort them by age.\nExample: input = [{'name': 'John', 'age': 25}, {'name': 'Jane', 'age': 22}], key = 'age' -> output = [{'name': 'Jane', 'age': 22}, {'name': 'John', 'age': 25}]" },
        { name: "Zero-Shot Prompting", desc: "The model is given a task without any prior examples. It relies solely on its pre-trained knowledge.", components: ["Direct Instruction"], example: "Translate the following sentence into French: 'Hello, how are you?'" },
        { name: "Few-Shot Prompting", desc: "Provides the model with a few examples (shots) of the task to guide its response pattern and format.", components: ["Examples", "Instruction"], example: "A 'whatpu' is a small, furry animal native to Tanzania. An example of a sentence that uses the word 'whatpu' is: We were traveling in Africa and we saw these very cute whatpus.\n\nTo 'farduddle' means to jump up and down really fast. An example of a sentence that uses the word 'farduddle' is: When he won the lottery, he began to farduddle with joy.\n\nWhat is a 'yalub'?\n" },
        { name: "Self-Consistency", desc: "Improves on CoT by generating multiple reasoning paths and choosing the most consistent answer.", components: ["Instruction", "Request for multiple paths"], example: "Question: There are 15 trees in the grove. Grove workers will plant trees in the grove today. After they are done, there will be 21 trees. How many trees did the grove workers plant today?\nGenerate 3 different ways to solve this problem and give the final answer." },
    ];
    const apiDocs = [
        { name: "Google Gemini", code: "const apiKey = 'YOUR_GOOGLE_API_KEY';\nconst model = 'gemini-1.5-flash';\nconst url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;\n\nconst payload = {\n  contents: [\n    { role: 'user', parts: [{ text: 'Hello, what is the capital of France?' }] }\n  ]\n};\n\nfetch(url, {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify(payload)\n});" },
        { name: "OpenAI", code: "const apiKey = 'YOUR_OPENAI_API_KEY';\nconst model = 'gpt-4o';\nconst url = 'https://api.openai.com/v1/chat/completions';\n\nconst payload = {\n  model,\n  messages: [\n    { role: 'system', content: 'You are a helpful assistant.' },\n    { role: 'user', content: 'Hello, what is the capital of France?' }\n  ]\n};\n\nfetch(url, {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'Authorization': `Bearer ${apiKey}`\n  },\n  body: JSON.stringify(payload)\n});" },
        { name: "Anthropic Claude", code: "const apiKey = 'YOUR_ANTHROPIC_API_KEY';\nconst model = 'claude-3-haiku-20240307';\nconst url = 'https://api.anthropic.com/v1/messages';\n\nconst payload = {\n  model,\n  max_tokens: 1024,\n  messages: [\n    { role: 'user', content: 'Hello, what is the capital of France?' }\n  ]\n};\n\nfetch(url, {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'x-api-key': apiKey,\n    'anthropic-version': '2023-06-01'\n  },\n  body: JSON.stringify(payload)\n});" },
        { name: "xAI Grok", code: "const apiKey = 'YOUR_XAI_API_KEY';\nconst model = 'grok-3-mini'; // Or another valid xAI model\nconst url = 'https://api.x.ai/v1/chat/completions';\n\nconst payload = {\n  model,\n  messages: [\n    { role: 'user', content: 'Explain the importance of low-latency in AI models.' }\n  ]\n};\n\nfetch(url, {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'Authorization': `Bearer ${apiKey}`\n  },\n  body: JSON.stringify(payload)\n});" },
    ];

    const CodeBlock = ({ code }) => {
        const [copied, setCopied] = useState(false);
        const handleCopy = () => {
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = code;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };
        return (
            <div className="bg-gray-950 p-4 rounded-lg relative border border-gray-700 mt-2">
                <pre className="text-sm text-gray-300 overflow-x-auto"><code>{code}</code></pre>
                <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                    {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
            </div>
        );
    };

    return (
        <div className="animate-fade-in text-gray-300">
            <h1 className="text-4xl font-bold text-white mb-4">Documentation & Cookbook</h1>
            <p className="text-lg mb-10">Your guide to mastering prompt engineering and API integration.</p>

            <h2 className="text-3xl font-semibold text-white mb-6 border-b border-gray-700 pb-2">Prompting Frameworks</h2>
            <div className="space-y-8">
                {frameworks.map(fw => (
                    <div key={fw.name} className="bg-gray-950/50 p-6 rounded-xl border border-gray-800">
                        <h3 className="text-2xl font-bold text-indigo-400 mb-2">{fw.name}</h3>
                        <p className="mb-3">{fw.desc}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {fw.components.map(c => <span key={c} className="bg-gray-700 text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">{c}</span>)}
                        </div>
                        <h4 className="font-semibold text-white mb-1">Example:</h4>
                        <p className="text-sm bg-gray-800 p-4 rounded-md border border-gray-700 whitespace-pre-wrap font-mono">{fw.example}</p>
                    </div>
                ))}
            </div>

            <h2 className="text-3xl font-semibold text-white mb-6 mt-12 border-b border-gray-700 pb-2">API Cookbook</h2>
            <p className="mb-6">Basic `fetch` examples for interacting with different AI providers in JavaScript. Replace `'YOUR_..._KEY'` with your actual API key. Note: Direct client-side calls may be blocked by CORS; these are best run in a server environment or via a proxy.</p>
            <div className="space-y-8">
                 {apiDocs.map(doc => (
                    <div key={doc.name}>
                        <h3 className="text-2xl font-bold text-indigo-400 mb-2">{doc.name}</h3>
                        <CodeBlock code={doc.code} />
                    </div>
                ))}
            </div>
        </div>
    );
};
const PromptGallery = ({ prompts, deletePrompt, loadPromptInPlayground }) => {
    const promptTypes = [ { name: 'Text', icon: <Bot /> }, { name: 'Coding', icon: <Code /> }, { name: 'Image', icon: <Play /> }, { name: 'Audio', icon: <Mic /> }, { name: 'Music', icon: <Music /> }, { name: 'Video', icon: <Video /> } ];
    const [activeType, setActiveType] = useState('Text');
    const filteredPrompts = prompts.filter(p => p.category === activeType);
    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-6 text-white">Prompt Gallery</h2>
            <div className="mb-8"><div className="flex space-x-2 border-b border-gray-800 overflow-x-auto pb-1">{promptTypes.map((type) => (<button key={type.name} onClick={() => setActiveType(type.name)} className={`flex items-center shrink-0 space-x-2 px-6 py-3 font-medium transition-colors ${activeType === type.name ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400 hover:text-white'}`}>{React.cloneElement(type.icon, {className: "w-5 h-5"})}<span>{type.name}</span></button>))}</div></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredPrompts.length > 0 ? filteredPrompts.map(prompt => (<PromptCard key={prompt.id} prompt={prompt} deletePrompt={deletePrompt} loadPromptInPlayground={loadPromptInPlayground} />)) : (<div className="col-span-full text-center py-16 bg-gray-950 rounded-lg border border-dashed border-gray-700"><p className="text-gray-500">No prompts for this category. Create one in the Workbench!</p></div>)}</div>
        </div>
    );
};
const PromptCard = ({ prompt, deletePrompt, loadPromptInPlayground }) => (
    <div className="bg-gray-950 p-6 rounded-xl border border-gray-800 hover:border-indigo-500 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1">
        <div><h3 className="text-xl font-bold text-white mb-2">{prompt.title}</h3><span className="inline-block bg-indigo-600/20 text-indigo-300 text-xs font-semibold px-2 py-1 rounded-full mb-4">{prompt.framework}</span><p className="text-gray-400 text-sm line-clamp-4 h-20">{prompt.content}</p></div>
        <div className="mt-6 flex space-x-2"><button onClick={() => loadPromptInPlayground(prompt)} className="flex-1 bg-indigo-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center space-x-2 text-sm"><BrainCircuit className="w-4 h-4"/><span>Use</span></button><button className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600"><Share2 className="w-4 h-4"/></button><button onClick={() => deletePrompt(prompt.id)} className="bg-red-900/50 text-red-400 p-2 rounded-lg hover:bg-red-900/80"><Trash2 className="w-4 h-4"/></button></div>
    </div>
);
const SettingsPage = ({ apiKeys, setApiKeys }) => {
  const [localKeys, setLocalKeys] = useState(apiKeys);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleKeyChange = (provider, value) => {
    setLocalKeys(prev => ({ ...prev, [provider]: value }));
  };
  
  const handleSaveChanges = () => { 
    setApiKeys(localKeys);
    setSaveStatus('success'); 
    setTimeout(() => setSaveStatus(null), 3000); 
  };

  return (<div className="animate-fade-in max-w-4xl mx-auto"><h2 className="text-3xl font-bold mb-8 text-white">Settings</h2><div className="bg-gray-950 p-8 rounded-xl border border-gray-800"><h3 className="text-2xl font-semibold mb-6 text-white">API Keys</h3><p className="text-gray-400 mb-8">Enter your API keys below. Your keys are stored in the app's state for this session.</p><div className="space-y-6">
      <ApiInput label="Google (Gemini)" provider="google" value={localKeys.google} onChange={handleKeyChange} />
      <ApiInput label="OpenAI" provider="openAI" value={localKeys.openAI} onChange={handleKeyChange} />
      <ApiInput label="Anthropic (Claude)" provider="anthropic" value={localKeys.anthropic} onChange={handleKeyChange} />
      <ApiInput label="xAI (Grok)" provider="xai" value={localKeys.xai} onChange={handleKeyChange} />
  </div><div className="mt-10 flex justify-end items-center space-x-4">{saveStatus === 'success' && <span className="text-green-400 flex items-center space-x-2"><CheckCircle className="w-5 h-5" /><span>Saved!</span></span>}<button onClick={handleSaveChanges} className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 flex items-center space-x-2"><Save className="w-5 h-5"/><span>Save Changes</span></button></div></div></div>);
};
const ApiInput = ({ label, provider, value, onChange }) => {
    const [showKey, setShowKey] = useState(false);
    return (<div><label className="block text-lg font-medium text-gray-300 mb-2">{label}</label><div className="flex items-center space-x-2"><input type={showKey ? 'text' : 'password'} value={value || ''} onChange={(e) => onChange(provider, e.target.value)} className="flex-grow p-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white font-mono" placeholder={`Enter your ${label} API key`}/><button onClick={() => setShowKey(!showKey)} className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600">{showKey ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>}</button></div></div>);
};
const SavePromptModal = ({ promptContent, framework, addPrompt, onClose }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Text');
    const handleSave = () => { if (!title) { alert('Please enter a title.'); return; } addPrompt({ title, category, framework, content: promptContent }); onClose(); };
    return (<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"><div className="bg-gray-950 p-8 rounded-xl border border-gray-800 w-full max-w-lg"><h2 className="text-2xl font-bold mb-4">Save Prompt</h2><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-400 mb-1">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"/></div><div><label className="block text-sm font-medium text-gray-400 mb-1">Category</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 bg-gray-800 rounded-lg border border-gray-700"><option>Text</option><option>Coding</option><option>Image</option><option>Audio</option><option>Music</option><option>Video</option></select></div></div><div className="mt-6 flex justify-end space-x-3"><button onClick={onClose} className="py-2 px-4 bg-gray-700 rounded-lg hover:bg-gray-600">Cancel</button><button onClick={handleSave} className="py-2 px-4 bg-indigo-600 rounded-lg hover:bg-indigo-700">Save</button></div></div></div>);
}
const LoadPromptModal = ({ prompts, setSystemPrompt, onClose }) => {
    const [category, setCategory] = useState('Text');
    const filteredPrompts = prompts.filter(p => p.category === category);
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-gray-950 p-6 rounded-xl border border-gray-800 w-full max-w-xl flex flex-col h-[70vh]">
                <h2 className="text-2xl font-bold mb-4">Load Prompt from Gallery</h2>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 mb-4 bg-gray-800 rounded-lg border border-gray-700">
                    <option>Text</option><option>Coding</option><option>Image</option><option>Audio</option><option>Music</option><option>Video</option>
                </select>
                <div className="flex-grow overflow-y-auto space-y-2 pr-2">
                    {filteredPrompts.length > 0 ? filteredPrompts.map(p => (
                        <button key={p.id} onClick={() => { setSystemPrompt(p.content); onClose(); }} className="w-full text-left p-3 bg-gray-800 hover:bg-indigo-600 rounded-lg">
                            <h4 className="font-bold">{p.title}</h4>
                            <p className="text-xs text-gray-400 truncate">{p.content}</p>
                        </button>
                    )) : <p className="text-gray-500 text-center mt-8">No prompts in this category.</p>}
                </div>
                <button onClick={onClose} className="mt-4 py-2 px-4 bg-gray-700 self-end rounded-lg hover:bg-gray-600">Close</button>
            </div>
        </div>
    );
};

// CSS Styles
const style = document.createElement('style');
style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); body { font-family: 'Inter', sans-serif; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; } .line-clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }`;
document.head.appendChild(style);
