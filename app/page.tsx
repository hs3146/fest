'use client'

import React, { useState, useEffect } from 'react'
import {  Facebook, Instagram, Send, Twitter, Linkedin, Mail, Copy } from 'lucide-react'
import confetti from 'canvas-confetti'

const diwaliQuotes = [
  "May the festival of lights brighten your life and bring joy, prosperity, and happiness.",
  "Wishing you a Diwali that brings happiness, prosperity, and joy to you and your family.",
  "Let the light of the diyas guide you towards joy and prosperity. Happy Diwali!",
  "May the divine light of Diwali spread into your life peace, prosperity, happiness, and good health.",
  "On this auspicious occasion, may joy, prosperity, and happiness illuminate your life and your home.",
]

const sharingPlatforms = [
  { name: 'WhatsApp', icon: Send, color: 'bg-green-500 hover:bg-green-600' },
  { name: 'Facebook', icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700' },
  { name: 'Instagram', icon: Instagram, color: 'bg-pink-600 hover:bg-pink-700' },
  { name: 'Twitter', icon: Twitter, color: 'bg-sky-500 hover:bg-sky-600' },
  { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700 hover:bg-blue-800' },
  { name: 'Email', icon: Mail, color: 'bg-gray-600 hover:bg-gray-700' },
  { name: 'Copy Link', icon: Copy, color: 'bg-purple-600 hover:bg-purple-700' },
]

const encodeData = (data: string) => {
  return Buffer.from(data).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const decodeData = (encodedData: string) => {
  encodedData = encodedData.replace(/-/g, '+').replace(/_/g, '/')
  while (encodedData.length % 4) {
    encodedData += '='
  }
  return Buffer.from(encodedData, 'base64').toString('utf-8')
}

export default function EnhancedDiwaliWishSender() {
  const [sender, setSender] = useState('')
  const [receiver, setReceiver] = useState('')
  const [isSent, setIsSent] = useState(false)
  const [shareableLink, setShareableLink] = useState('')
  const [movingLights, setMovingLights] = useState([])
  const [currentQuote, setCurrentQuote] = useState('')
  const [activeTab, setActiveTab] = useState('WhatsApp')

  useEffect(() => {
    const interval = setInterval(() => {
      setMovingLights(prevLights => {
        const newLight = {
          id: Date.now(),
          left: Math.random() * 100,
          top: Math.random() * 100,
        }
        return [...prevLights.slice(-20), newLight]
      })
    }, 500)

    setCurrentQuote(diwaliQuotes[Math.floor(Math.random() * diwaliQuotes.length)])

    // Check if there's an encoded wish in the URL
    const urlParams = new URLSearchParams(window.location.search)
    const encodedWish = urlParams.get('w')
    if (encodedWish) {
      try {
        const decodedData = JSON.parse(decodeData(encodedWish))
        setSender(decodedData.sender)
        setReceiver(decodedData.receiver)
        setIsSent(true)
      } catch (error) {
        console.error('Failed to decode wish data:', error)
      }
    }

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSent(true)
    const wishData = { sender, receiver }
    const encodedWishData = encodeData(JSON.stringify(wishData))
    const link = `${window.location.origin}/Wish?w=${encodedWishData}`
    setShareableLink(link)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const shareVia = (platform: string) => {
    let url
    const message = `${sender} sent you a Diwali wish! Check it out: ${shareableLink}`
    switch (platform) {
      case 'WhatsApp':
        url = `https://wa.me/?text=${encodeURIComponent(message)}`
        break
      case 'Facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}`
        break
      case 'Instagram':
        navigator.clipboard.writeText(message)
        alert('Link copied to clipboard. You can paste it in your Instagram story or post.')
        return
      case 'Twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
        break
      case 'LinkedIn':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareableLink)}&title=${encodeURIComponent('Diwali Wishes')}&summary=${encodeURIComponent(message)}`
        break
      case 'Email':
        url = `mailto:?subject=${encodeURIComponent('Diwali Wishes')}&body=${encodeURIComponent(message)}`
        break
      case 'Copy Link':
        navigator.clipboard.writeText(shareableLink)
        alert('Link copied to clipboard!')
        return
      default:
        url = shareableLink
    }
    window.open(url, '_blank')
  }

  const AdPlaceholder = () => (
    <div className="bg-gray-200 p-4 rounded-lg text-center text-gray-500 my-4">
      Ad Placement
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-orange-600">Diwali Wish Sender</h1>
        
        <AdPlaceholder />
        
        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="sender" className="block text-sm font-medium text-gray-700">Your Name</label>
              <input
                id="sender"
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label htmlFor="receiver" className="block text-sm font-medium text-gray-700">{"Receiver's Name"}</label>
              <input
                id="receiver"
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
              Send Diwali Wishes
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-orange-600">
              Happy Diwali, {receiver}!
            </h2>
            <p className="text-lg">
              {sender} {"wishes you a prosperous and joyous Diwali filled with light and happiness!"}
            </p>
            <p className="italic text-orange-700">&quot;{currentQuote}&quot;</p>
            <input
              type="text"
              value={shareableLink}
              readOnly
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
            <div className="w-full">
              <div className="flex flex-wrap border-b border-gray-200">
                {sharingPlatforms.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => setActiveTab(platform.name)}
                    className={`flex-1 py-2 px-2 text-center text-sm ${activeTab === platform.name ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {platform.name}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                {sharingPlatforms.map((platform) => (
                  activeTab === platform.name && (
                    <button 
                      key={platform.name}
                      onClick={() => shareVia(platform.name)} 
                      className={`w-full ${platform.color} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center transition duration-150 ease-in-out`}
                    >
                      <platform.icon className="mr-2 h-4 w-4" /> Share via {platform.name}
                    </button>
                  )
                ))}
              </div>
            </div>
            <button 
              onClick={() => setIsSent(false)} 
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
              Send Another Wish
            </button>
          </div>
        )}
        
        <AdPlaceholder />
        
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold text-orange-600 mb-2">Diwali Quote of the Day</h3>
          <p className="italic">&quot;{currentQuote}&quot;</p>
        </div>
        
        <AdPlaceholder />
      </div>
      
      <div className="fixed top-4 left-4 right-4 flex justify-between">
        <AdPlaceholder />
        <AdPlaceholder />
      </div>
      
      <div className="fixed bottom-4 left-4 right-4 flex justify-between">
        <AdPlaceholder />
        <AdPlaceholder />
      </div>
      
      {movingLights.map((light) => (
        <div
          key={light.id}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-pulse"
          style={{
            left: `${light.left}%`,
            top: `${light.top}%`,
            boxShadow: '0 0 10px 2px rgba(255, 255, 0, 0.8)',
          }}
        />
      ))}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-1/4 w-16 h-16 animate-float">
          🪔
        </div>
        <div className="absolute right-1/4 bottom-1/4 w-16 h-16 animate-float animation-delay-2000">
          🪔
        </div>
        <div className="absolute left-1/2 top-1/2 w-16 h-16 animate-float animation-delay-1000">
          🪔
        </div>
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}