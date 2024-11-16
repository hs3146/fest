/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import Script from 'next/script';

const newYearQuotes = [
  "May the New Year bring you happiness, peace, and prosperity. Wishing you a joyous 2025!",
  "Here's to new beginnings and a fantastic 2025! Happy New Year!",
  "Cheers to a new year and another chance for us to get it right. Happy 2025!",
  "May the year 2025 be an exciting adventure filled with discoveries and growth.",
  "Wishing you 12 months of success, 52 weeks of laughter, 365 days of fun, 8760 hours of joy, 525600 minutes of good luck, and 31536000 seconds of happiness. Happy New Year 2025!",
]

const encodeData = (data: any) => {
  return Buffer.from(JSON.stringify(data)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const decodeData = (encodedData: string) => {
  encodedData = encodedData.replace(/-/g, '+').replace(/_/g, '/')
  while (encodedData.length % 4) {
    encodedData += '='
  }
  return JSON.parse(Buffer.from(encodedData, 'base64').toString('utf-8'))
}

const AdPlaceholder = ({ position }: { position: string }) => (
  <div className={`bg-gray-200 p-4 rounded-lg text-center text-gray-500 ${position}`}>
    Ad Placement - {position}
  </div>
)

type Firework = {
  id: number;
  left: number;
  top: number;
};
 function CountdownTimer({ targetDate = new Date(Date.now() + 86400000) }: { targetDate: Date }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate))
  
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(targetDate))
      }, 1000)
  
      return () => clearInterval(timer)
    }, [targetDate])
  
    function calculateTimeLeft(target: Date) {
      const difference = +target - +new Date()
      let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      }
  
      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        }
      }
  
      return timeLeft
    }
  
    const formatNumber = (num: number) => num.toString().padStart(2, '0')
  
    return (
      <div className="flex justify-center items-center">
        <div className="relative w-[32rem] h-64 bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <svg className="absolute inset-0" width="100%" height="100%">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'rgb(29, 78, 216)', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: 'rgb(30, 64, 175)', stopOpacity: 0.2 }} />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)" />
          </svg>
          <div className="relative z-10 flex flex-col justify-center items-center h-full p-4">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Time Remaining</h2>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                  <div className="bg-gray-700 rounded-lg p-2 shadow-inner w-24">
                    <span className="font-mono text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 flex justify-center">
                      {formatNumber(value)}
                    </span>
                  </div>
                  <span className="mt-1 text-xs text-blue-300 uppercase">{unit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
        </div>
      </div>
    )
  }
function WishPageContent() {
  const [sender, setSender] = useState('')
  const [receiver, setReceiver] = useState('')
  const [currentQuote, setCurrentQuote] = useState('')
  const [fireworks, setFireworks] = useState<Firework[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isValid, setIsValid] = useState(true)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const loadWish = async () => {
      setIsLoading(true)
      const encodedWish = searchParams.get('w')
      if (encodedWish) {
        try {
          const decodedData = decodeData(encodedWish)
          setSender(decodedData.sender)
          setReceiver(decodedData.receiver)
          setTargetDate(new Date(decodedData.targetDate))
          setIsValid(true)
        } catch (error) {
          console.error('Failed to decode wish data:', error)
          setIsValid(false)
        }
      } else {
        setIsValid(false)
      }

      setCurrentQuote(newYearQuotes[Math.floor(Math.random() * newYearQuotes.length)])

      if (isValid) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }

      setIsLoading(false)
    }

    loadWish()

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

    return () => clearInterval(interval)
  }, [searchParams, isValid])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl text-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">Loading New Year Wish...</h1>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className=" my-16 lg:mt-0 min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl text-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">Invalid Wish Link</h1>
          <p className="mb-4">Sorry, this New Year wish link appears to be invalid or has expired.</p>
          <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
            Create Your Own Wish
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className=" my-16 lg:mt-0 min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Happy New Year 2025!</h1>
        
        {/* <AdPlaceholder position="top mb-6" /> */}
        
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-blue-600">
            Dear {receiver},
          </h2>
          <p className="text-lg">
            {sender} wishes you a fantastic year ahead filled with joy, success, and new adventures!
          </p>
          <p className="italic text-blue-700">&quot;{currentQuote}&quot;</p>
        </div>
        
        {targetDate && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-center text-blue-600 mb-2">Countdown to 2025</h3>
            <CountdownTimer targetDate={new Date("2025-01-01T00:00:00")} />
          </div>
        )}
        
        {/* <AdPlaceholder position="my-6" /> */}
        
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">New Year Quote of the Day</h3>
          <p className="italic">&quot;{currentQuote}&quot;</p>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
            Create Your Own Wish
          </Link>
        </div>
        
        {/* <AdPlaceholder position="mt-6" /> */}
      </div>
      
      {/* <div className="fixed top-4 left-4 right-4 flex justify-between pointer-events-none">
        <AdPlaceholder position="left" />
        <AdPlaceholder position="right" />
      </div>
      
      <div className="fixed bottom-4 left-4 right-4 flex justify-between pointer-events-none">
        <AdPlaceholder position="left" />
        <AdPlaceholder position="right" />
      </div> */}
      
      {fireworks.map((firework) => (
        <div
          key={firework.id}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-pulse pointer-events-none"
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
  )
}

export default function WishPage() {
  return (


    <Suspense fallback={<div className='flex items-center
     justify-center h-full w-full'>Loading...</div>}>
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
      <WishPageContent />
    </Suspense>
  );
}