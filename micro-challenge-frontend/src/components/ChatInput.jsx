import React, { useState } from 'react';
import { Paperclip, Image as ImageIcon, Send } from 'lucide-react';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  async function handleSend() {
    const content = text.trim();
    await onSend({ content, file });
    setText('');
    setFile(null);
  }

  return (
    <div className="p-2 border-t bg-white flex items-center gap-2">
      <label className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800 cursor-pointer">
        <ImageIcon size={18} />
        <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </label>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
        placeholder="Écrire un message"
        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
      <button onClick={handleSend} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-1">
        <Send size={16} />
        Envoyer
      </button>
    </div>
  );
}