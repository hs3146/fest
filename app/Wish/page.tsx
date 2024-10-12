"use client";

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import confetti from 'canvas-confetti'

const diwaliQuotes = [
  "May the festival of lights brighten your life and bring joy, prosperity, and happiness.",
  "Wishing you a Diwali that brings happiness, prosperity, and joy to you and your family.",
  "Let the light of the diyas guide you towards joy and prosperity. Happy Diwali!",
  "May the divine light of Diwali spread into your life peace, prosperity, happiness, and good health.",
  "On this auspicious occasion, may joy, prosperity, and happiness illuminate your life and your home.",
]

const decodeData = (encodedData: string) => {
  encodedData = encodedData.replace(/-/g, '+').replace(/_/g, '/')
  while (encodedData.length % 4) {
    encodedData += '='
  }
  return Buffer.from(encodedData, 'base64').toString('utf-8')
}

const AdPlaceholder = ({ position }: { position: string }) => (
  <div className={`bg-gray-200 p-4 rounded-lg text-center text-gray-500 ${position}`}>
    Ad Placement - {position}
  </div>
)

type Light = {
  id: number;
  left: number;
  top: number;
};

function WishPageContent() {
  const [sender, setSender] = useState('')
  const [receiver, setReceiver] = useState('')
  const [currentQuote, setCurrentQuote] = useState('')
  const [movingLights, setMovingLights] = useState<Light[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isValid, setIsValid] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const loadWish = async () => {
      setIsLoading(true)
      const encodedWish = searchParams.get('w')
      if (encodedWish) {
        try {
          const decodedData = JSON.parse(decodeData(encodedWish))
          setSender(decodedData.sender)
          setReceiver(decodedData.receiver)
          setIsValid(true)
        } catch (error) {
          console.error('Failed to decode wish data:', error)
          setIsValid(false)
        }
      } else {
        setIsValid(false)
      }

      setCurrentQuote(diwaliQuotes[Math.floor(Math.random() * diwaliQuotes.length)])

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
      setMovingLights(prevLights => {
        const newLight = {
          id: Date.now(),
          left: Math.random() * 100,
          top: Math.random() * 100,
        }
        return [...prevLights.slice(-20), newLight]
      })
    }, 500)

    return () => clearInterval(interval)
  }, [searchParams, isValid])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl text-center">
          <h1 className="text-2xl font-bold text-orange-600 mb-4">Loading Diwali Wish...</h1>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl text-center">
          <h1 className="text-2xl font-bold text-orange-600 mb-4">Invalid Wish Link</h1>
          <p className="mb-4">Sorry, this Diwali wish link appears to be invalid or has expired.</p>
          <Link href="/" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
            Create Your Own Wish
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-orange-600">Happy Diwali!</h1>
        
        <AdPlaceholder position="top mb-6" />
        
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-orange-600">
            Dear {receiver},
          </h2>
          <p className="text-lg">
            {sender} wishes you a prosperous and joyous Diwali filled with light and happiness!
          </p>
          <p className="italic text-orange-700">&quot;{currentQuote}&quot;</p>
        </div>
        
        <AdPlaceholder position="my-6" />
        
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold text-orange-600 mb-2">Diwali Quote of the Day</h3>
          <p className="italic">&quot;{currentQuote}&quot;</p>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
            Create Your Own Wish
          </Link>
        </div>
        
        <AdPlaceholder position="mt-6" />
      </div>
      
      <div className="fixed top-4 left-4 right-4 flex justify-between pointer-events-none">
        <AdPlaceholder position="left" />
        <AdPlaceholder position="right" />
      </div>
      
      <div className="fixed bottom-4 left-4 right-4 flex justify-between pointer-events-none">
        <AdPlaceholder position="left" />
        <AdPlaceholder position="right" />
      </div>
      
      {movingLights.map((light) => (
        <div
          key={light.id}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-pulse pointer-events-none"
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
    </div>
  )
}

export default function WishPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WishPageContent />
    </Suspense>
  );
}
