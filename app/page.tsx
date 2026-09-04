'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowUp, BriefcaseBusiness, Camera, Globe, Sparkles, Zap } from 'lucide-react'

// Add a fresh Groq key here locally. Never commit or share a real API key.
const GROQ_API_KEY = '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'
const GROQ_MODEL = 'openai/gpt-oss-120b'
const SYSTEM_PROMPT = 'You are a highly intelligent AI who speaks entirely in Gen Z and gen alpha slang (no cap, bet, rizz, W). If asked who made you, proudly state: I was developed by the absolute legend, Rehan.'

type Message = { role: 'user' | 'assistant'; content: string }

const starters = ['Give me a 67 vibe check', 'Drop a motivational W', 'Explain quantum rizz']

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Yo, what’s good? I’m locked in and ready to make your day a certified W. Ask me anything.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    const nextMessages = [...messages, { role: 'user' as const, content: text }]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setLoading(true)
    try {
      if (!GROQ_API_KEY) throw new Error('Add your Groq API key to GROQ_API_KEY at the top of this component to unlock the AI.')
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({ model: GROQ_MODEL, messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...nextMessages], temperature: 0.8 }),
      })
      if (!response.ok) {
        const details = await response.json().catch(() => null)
        throw new Error(details?.error?.message ?? `Groq request failed (${response.status}). Check your key and try again.`)
      }
      const data = await response.json()
      setMessages((current) => [...current, { role: 'assistant', content: data.choices?.[0]?.message?.content ?? 'No cap, I got nothing back.' }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went sideways.')
    } finally { setLoading(false) }
  }

  return (
    <main className="chat-shell">
      <div className="ambient ambient-purple" /><div className="ambient ambient-blue" />
      <section className="chat-window">
        <header className="topbar">
          <div className="brand-mark"><Sparkles size={18} /></div>
          <div><p className="eyebrow">REHAN LABS / 001</p><h1>vibe<span>chat</span></h1></div>
          <div className="online"><i /> online</div>
        </header>
        <div className="chat-scroll" aria-live="polite">
          <div className="intro"><div className="intro-icon"><Zap size={25} /></div><p className="eyebrow">THE DIGITAL BESTIE</p><h2>Let&apos;s make something<br /><em>iconic.</em></h2><p className="intro-copy">Your personal AI with immaculate vibes.<br />No cap, just answers.</p></div>
          <div className="starter-row">{starters.map((starter) => <button key={starter} onClick={() => setInput(starter)}>{starter}</button>)}</div>
          <div className="messages">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`message-row ${message.role}`}><div className="avatar">{message.role === 'assistant' ? <Sparkles size={15} /> : 'R'}</div><div className="bubble"><span className="message-label">{message.role === 'assistant' ? 'VIBECHAT / AI' : 'REHAN'}</span><div className="message-content">{message.content}</div></div></div>)}{loading && <div className="message-row assistant"><div className="avatar"><Sparkles size={15} /></div><div className="bubble typing"><span className="message-label">VIBECHAT / AI</span><div><b /><b /><b /></div></div></div>}<div ref={bottomRef} /></div>
        </div>
        <div className="composer-wrap"><form className="composer" onSubmit={sendMessage}><input aria-label="Message vibe chat" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask me anything..." /><button className="send" aria-label="Send message" disabled={!input.trim() || loading}><ArrowUp size={20} /></button></form>{error && <p className="error">{error}</p>}<p className="hint">Vibe chat can make mistakes. Check the facts, bestie.</p></div>
        <footer><strong>Crafted by <span>Rehan</span></strong><div className="socials"><a href="#twitter" aria-label="Twitter"><Globe size={15} /></a><a href="#instagram" aria-label="Instagram"><Camera size={15} /></a><a href="#linkedin" aria-label="LinkedIn"><BriefcaseBusiness size={15} /></a></div></footer>
      </section>
    </main>
  )
}
