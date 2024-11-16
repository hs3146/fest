/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { Facebook, Instagram, Send, Twitter, Linkedin, Mail, Copy } from 'lucide-react'
import confetti from 'canvas-confetti'
import Script from 'next/script'

const newYearQuotes = [
  "May the new year bring you happiness, peace, and prosperity. Wishing you a joyous 2025!",
  "Here's to new beginnings and a fantastic 2025! Happy New Year!",
  "Cheers to a new year and another chance for us to get it right. Happy 2025!",
  "May the year 2025 be an exciting adventure filled with discoveries and growth.",
  "Wishing you 12 months of success, 52 weeks of laughter, 365 days of fun, 8760 hours of joy, 525600 minutes of good luck, and 31536000 seconds of happiness. Happy New Year 2025!",
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

type Firework = {
  id: number;
  left: number;
  top: number;
}

declare global {
  interface Window {
    propellerads?: {
      addBlock: (config: any) => void;
      addButton: (config: any) => void;
      removeButton: () => void;
    };
  }
}

export default function NewYearWishSender() {
  const [sender, setSender] = useState('')
  const [receiver, setReceiver] = useState('')
  const [isSent, setIsSent] = useState(false)
  const [shareableLink, setShareableLink] = useState('')
  const [fireworks, setFireworks] = useState<Firework[]>([])
  const [currentQuote, setCurrentQuote] = useState('')
  const [activeTab, setActiveTab] = useState('WhatsApp')

  useEffect(() => {
    const interval = setInterval(() => {
      setFireworks(prevFireworks => {
        const newFirework = {
          id: Date.now(),
          left: Math.random() * 100,
          top: Math.random() * 100,
        }
        return [...prevFireworks.slice(-20), newFirework]
      })
    }, 500)

    setCurrentQuote(newYearQuotes[Math.floor(Math.random() * newYearQuotes.length)])

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

    // Initialize Propeller Ads
    if (window.propellerads) {
      // Direct Link ad
      window.propellerads.addBlock({
        id: "1234567890",
        zoneId: "1234567"
      });

      // On-click Popunder ad
      window.propellerads.addButton({
        id: "0987654321",
        zoneId: "7654321"
      });
    }

    return () => {
      clearInterval(interval)
      // Remove Propeller Ads button on component unmount
      if (window.propellerads) {
        window.propellerads.removeButton()
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSent(true)
    const wishData = { sender, receiver , targetDate: new Date("2025-01-01T00:00:00").toISOString() }
    const encodedWishData = encodeData(JSON.stringify(wishData))
    const link = `${window.location.origin}/Wish?w=${encodedWishData}`
    setShareableLink(link)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Trigger interstitial ad after wish is sent
    if (window.propellerads) {
      window.propellerads.addBlock({
        id: "1357924680",
        zoneId: "2468013",
        type: "interstitial"
      });
    }
  }

  const shareVia = (platform: string) => {
    let url
    const message = `${sender} sent you a New Year 2025 wish! Check it out: ${shareableLink}`
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
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareableLink)}&title=${encodeURIComponent('New Year 2025 Wishes')}&summary=${encodeURIComponent(message)}`
        break
      case 'Email':
        url = `mailto:?subject=${encodeURIComponent('New Year 2025 Wishes')}&body=${encodeURIComponent(message)}`
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

  return (
    <>
    
    <Script data-cfasync="false"
    type="text/javascript"  id="propeller-script" onError={()=>{
        console.log("error")
    }} onLoad={()=>{"loaded successfully"}}

    src="https://alwingulla.com/88/tag.min.js"
       data-zone="114175"
        async 
    strategy="afterInteractive" dangerouslySetInnerHTML={{
      __html: `
      <script src="https://alwingulla.com/88/tag.min.js" data-zone="114175" async data-cfasync="false"></script>
  
      `}}/>
      {/* <Script
        src="//ads.propellerads.com/adScript.php?zoneId=1234567&publisherId=123456"
        strategy="lazyOnload"
      /> */}
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">New Year 2025 Wish Sender</h1>
          
          {/* Direct Link ad placeholder */}
          {/* <div id="1234567890" className="w-full h-20 bg-gray-200 flex items-center justify-center text-gray-500 mb-4">
            Direct Link Ad
          </div> */}

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
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Send New Year Wishes
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-blue-600">
                Happy New Year 2025, {receiver}!
              </h2>
              <p className="text-lg">
                {sender} {"wishes you a fantastic year ahead filled with joy, success, and new adventures!"}
              </p>
              <p className="italic text-blue-700">&quot;{currentQuote}&quot;</p>
              <input
                type="text"
                value={shareableLink}
                readOnly
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="w-full">
                <div className="flex flex-wrap border-b border-gray-200">
                  {sharingPlatforms.map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => setActiveTab(platform.name)}
                      className={`flex-1 py-2 px-2 text-center text-sm ${activeTab === platform.name ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
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
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Send Another Wish
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">New Year Quote of the Day</h3>
            <p className="italic">&quot;{currentQuote}&quot;</p>
          </div>

          {/* On-click Popunder ad button */}
          <div id="0987654321" className="w-full mt-4">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
              Click for a surprise!
            </button>
          </div>
        </div>

        {fireworks.map((firework) => (
          <div
            key={firework.id}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-pulse"
            style={{
              left: `${firework.left}%`,
              top: `${firework.top}%`,
              boxShadow: '0 0 10px 2px rgba(255, 255, 0, 0.8)',
            }}
          />
        ))}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute left-1/4 top-1/4 w-16 h-16 animate-float">
            🎉
          </div>
          <div className="absolute right-1/4 bottom-1/4 w-16 h-16 animate-float animation-delay-2000">
            🎊
          </div>
          <div className="absolute left-1/2 top-1/2 w-16 h-16 animate-float animation-delay-1000">
            🥂
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
    </>
  )
}