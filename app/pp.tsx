// 'use client'

// import React, { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import Confetti from 'react-confetti'
// import Image from 'next/image'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { StarIcon } from '@heroicons/react/20/solid'
// import { Facebook, Twitter, Linkedin, Instagram, MessageCircle } from 'lucide-react'

// // Types
// interface Product {
//   name: string
//   description: string
//   image: string
//   details: {
//     releaseYear: number
//     screenSize: string
//     chip: string
//     camera: string
//     batteryLife: string
//     price: string
//     colors: string[]
//   }
// }

// interface Comment {
//   id: number
//   name: string
//   content: string
//   rating: number
// }

// interface User {
//   name: string
//   email: string
// }

// // Constants
// const products: Product[] = [
//   {
//     name: 'iPhone 15 Pro',
//     description: 'The latest and greatest iPhone',
//     image: 'https://img.freepik.com/premium-photo/phone-that-has-back-it-showing-back-phone_1127397-6185.jpg?ga=GA1.1.1309443915.1724494669&semt=ais_hybrid',
//     details: {
//       releaseYear: 2023,
//       screenSize: '6.1-inch Super Retina XDR display',
//       chip: 'A17 Pro chip with 6-core GPU',
//       camera: '48MP Main camera with 3x optical zoom, Night mode, and Deep Fusion',
//       batteryLife: 'Up to 23 hours of video playback',
//       price: '$999',
//       colors: ['Silver', 'Graphite', 'Gold', 'Sierra Blue']
//     }
//   },
//   {
//     name: 'iPhone 15',
//     description: 'Powerful and sleek',
//     image: 'https://img.freepik.com/premium-photo/experience-innovation-allnew-iphone-mockup_1073664-3879.jpg?ga=GA1.1.1309443915.1724494669&semt=ais_hybrid',
//     details: {
//       releaseYear: 2023,
//       screenSize: '6.1-inch Liquid Retina display',
//       chip: 'A16 Bionic chip with 5-core GPU',
//       camera: '12MP Main camera with Smart HDR 4 and Portrait mode',
//       batteryLife: 'Up to 20 hours of video playback',
//       price: '$799',
//       colors: ['Blue', 'Red', 'Green', 'White', 'Black']
//     }
//   },
//   {
//     name: 'iPhone 14',
//     description: 'Still amazing',
//     image: 'https://img.freepik.com/premium-photo/silver-iphone-with-camera-back-it_1022212-18768.jpg?ga=GA1.1.1309443915.1724494669&semt=ais_hybrid',
//     details: {
//       releaseYear: 2022,
//       screenSize: '6.1-inch Super Retina XDR display',
//       chip: 'A15 Bionic chip with 4-core GPU',
//       camera: 'Dual 12MP cameras with Night mode and 4K video recording',
//       batteryLife: 'Up to 19 hours of video playback',
//       price: '$699',
//       colors: ['Midnight', 'Starlight', 'Product(RED)', 'Blue', 'Purple']
//     }
//   },
//   {
//     name: 'MacBook Pro',
//     description: 'For the professionals',
//     image: 'https://img.freepik.com/premium-photo/beautiful-macbook-wallpapers-every-style_1199394-48726.jpg?ga=GA1.1.1309443915.1724494669&semt=ais_hybrid',
//     details: {
//       releaseYear: 2023,
//       screenSize: '14-inch or 16-inch Liquid Retina XDR display',
//       chip: 'M2 Pro or M2 Max chip with up to 12-core CPU and 38-core GPU',
//       camera: '1080p FaceTime HD camera',
//       batteryLife: 'Up to 18 hours of battery life',
//       price: 'Starting at $1999',
//       colors: ['Space Gray', 'Silver']
//     }
//   }
// ]

// const spinItems = ['iPhone 15 Pro', 'iPhone 15', 'iPhone 14', 'Bad Luck', 'Bad Luck', 'MacBook Pro']
// const segColors = ['#FFA500', '#FF6347', '#FFD700', '#FF4500', '#FF8C00', '#FF7F50']

// const diwaliQuotes = [
//   "May the festival of lights brighten your life and bring you joy, prosperity, and happiness. Happy Diwali!",
//   "Let the light of the diyas guide you towards joy and prosperity. Happy Diwali!",
//   "Wishing you a Diwali that brings happiness, prosperity, and joy to you and your family.",
//   "May the divine light of Diwali spread into your life peace, prosperity, happiness, and good health.",
//   "On this auspicious occasion, may joy, prosperity, and happiness illuminate your life and your home. Wishing you a Happy Diwali!"
// ]

// // WheelComponent (unchanged)
// const WheelComponent = ({
//     segments,
//     segColors,
//     winningSegment,
//     onFinished,
//     primaryColor = "black",
//     contrastColor = "white",
//     buttonText = "Spin",
//     isOnlyOnce = true,
//     size = 290,
//     upDuration = 100,
//     downDuration = 1000,
//     fontFamily = "proxima-nova"
//   }) => {
//     let currentSegment = "";
//     let isStarted = false;
//     const [isFinished, setFinished] = useState(false);
//     let timerHandle = 0;
//     const timerDelay = segments.length;
//     let angleCurrent = 0;
//     let angleDelta = 0;
//     let canvasContext = null;
//     let maxSpeed = Math.PI / segments.length;
//     const upTime = segments.length * upDuration;
//     const downTime = segments.length * downDuration;
//     let spinStart = 0;
//     let frames = 0;
//     const centerX = 300;
//     const centerY = 300;
  
//     useEffect(() => {
//       wheelInit();
//       setTimeout(() => {
//         window.scrollTo(0, 1);
//       }, 0);
//     }, []);
  
//     const wheelInit = () => {
//       initCanvas();
//       wheelDraw();
//     };
  
//     const initCanvas = () => {
//       let canvas = document.getElementById("canvas");
//       if (navigator.userAgent.indexOf("MSIE") !== -1) {
//         canvas = document.createElement("canvas");
//         canvas.setAttribute("width", "1000");
//         canvas.setAttribute("height", "600");
//         canvas.setAttribute("id", "canvas");
//         document.getElementById("wheel").appendChild(canvas);
//       }
//       canvas.addEventListener("click", spin, false);
//       canvasContext = canvas.getContext("2d");
//     };
  
//     const spin = () => {
//       isStarted = true;
//       if (timerHandle === 0) {
//         spinStart = new Date().getTime();
//         maxSpeed = Math.PI / segments.length;
//         frames = 0;
//         timerHandle = setInterval(onTimerTick, timerDelay);
//       }
//     };
  
//     const onTimerTick = () => {
//       frames++;
//       draw();
//       const duration = new Date().getTime() - spinStart;
//       let progress = 0;
//       let finished = false;
//       if (duration < upTime) {
//         progress = duration / upTime;
//         angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
//       } else {
//         if (winningSegment) {
//           if (currentSegment === winningSegment && frames > segments.length) {
//             progress = duration / upTime;
//             angleDelta =
//               maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
//             progress = 1;
//           } else {
//             progress = duration / downTime;
//             angleDelta =
//               maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
//           }
//         } else {
//           progress = duration / downTime;
//           angleDelta =
//             maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
//         }
        
//         if (progress >= 1) finished = true;
//       }
  
//       angleCurrent += angleDelta;
//       while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
//       if (finished) {
//         setFinished(true);
//         onFinished(currentSegment);
//         clearInterval(timerHandle);
//         timerHandle = 0;
//         angleDelta = 0;
//       }
//     };
  

//   const wheelDraw = () => {
//       clear();
//       drawWheel();
//       drawNeedle();
//     };
  
//     const draw = () => {
//       clear();
//       drawWheel();
//       drawNeedle();
//     };
  
//     const drawSegment = (key, lastAngle, angle) => {
//       const ctx = canvasContext;
//       const value = segments[key];
//       ctx.save();
//       ctx.beginPath();
//       ctx.moveTo(centerX, centerY);
//       ctx.arc(centerX, centerY, size, lastAngle, angle, false);
//       ctx.lineTo(centerX, centerY);
//       ctx.closePath();
//       ctx.fillStyle = segColors[key];
//       ctx.fill();
//       ctx.stroke();
//       ctx.save();
//       ctx.translate(centerX, centerY);
//       ctx.rotate((lastAngle + angle) / 2);
//       ctx.fillStyle = contrastColor;
//       ctx.font = "bold 1em " + fontFamily;
//       ctx.fillText(value.substr(0, 21), size / 2 + 20, 0);
//       ctx.restore();
//     };
  
//     const drawWheel = () => {
//       const ctx = canvasContext;
//       let lastAngle = angleCurrent;
//       const len = segments.length;
//       const PI2 = Math.PI * 2;
//       ctx.lineWidth = 1;
//       ctx.textBaseline = "middle";
//       ctx.textAlign = "center";
//       ctx.font = "1em " + fontFamily;
//       for (let i = 1; i <= len; i++) {
//         const angle = PI2 * (i / len) + angleCurrent;
//         drawSegment(i - 1, lastAngle, angle);
//         lastAngle = angle;
//       }
  
//       // Draw a center circle
//       ctx.beginPath();
//       ctx.arc(centerX, centerY, 50, 0, PI2, false);
//       ctx.closePath();
//       ctx.fillStyle = primaryColor;
//       ctx.lineWidth = 10;
//       ctx.strokeStyle = contrastColor;
//       ctx.fill();
//       ctx.font = "bold 1em " + fontFamily;
//       ctx.fillStyle = contrastColor;
//       ctx.textAlign = "center";
//       ctx.fillText(buttonText, centerX, centerY + 3);
//       ctx.stroke();
  
//       // Draw outer circle
//       ctx.beginPath();
//       ctx.arc(centerX, centerY, size, 0, PI2, false);
//       ctx.closePath();
  
//       ctx.lineWidth = 10;
//       ctx.strokeStyle = primaryColor;
//       ctx.stroke();
//     };
  
//     const drawNeedle = () => {
//       const ctx = canvasContext;
//       ctx.lineWidth = 1;
//       ctx.strokeStyle = contrastColor;
//       ctx.fileStyle = contrastColor;
//       ctx.beginPath();
//       ctx.moveTo(centerX + 20, centerY - 50);
//       ctx.lineTo(centerX - 20, centerY - 50);
//       ctx.lineTo(centerX, centerY - 70);
//       ctx.closePath();
//       ctx.fill();
//       const change = angleCurrent + Math.PI / 2;
//       let i =
//         segments.length -
//         Math.floor((change / (Math.PI * 2)) * segments.length) -
//         1;
//       if (i < 0) i = i + segments.length;
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.fillStyle = primaryColor;
//       ctx.font = "bold 1.5em " + fontFamily;
//       currentSegment = segments[i];
//       isStarted &&
//         ctx.fillText(currentSegment, centerX + 10, centerY + size + 50);
//     };
  
//     const clear = () => {
//       const ctx = canvasContext;
//       ctx.clearRect(0, 0, 1000, 800);
//     };
  
//     return (
//       <div id="wheel" style={{ width: "100%" }} className=' flex justify-center items-center p-2 bg-[#FEF9C4]'>
//         <canvas
//           id="canvas"
//           width="600"
//           height="600"
//           style={{
//             pointerEvents: isFinished && isOnlyOnce ? "none" : "auto"
//           }}
//         />
//       </div>
//     );
//   };


// // Header Component
// function Header() {
//   return (
//     <header className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-md">
//       <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
//         <a href="#" className="text-3xl font-bold mb-4 sm:mb-0">Diwali Giveaway Spinner</a>
//         <nav>
//           <ul className="flex space-x-4">
//             <li><a href="#" className="hover:text-yellow-200 transition duration-300">Home</a></li>
//             <li><a href="#products" className="hover:text-yellow-200 transition duration-300">Products</a></li>
//             <li><a href="#comments" className="hover:text-yellow-200 transition duration-300">Comments</a></li>
//           </ul>
//         </nav>
//       </div>
//     </header>
//   )
// }

// // Footer Component
// function Footer() {
//   return (
//     <footer className="bg-gradient-to-r from-orange-800 to-red-800 text-white py-8">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div>
//             <h3 className="text-xl font-bold mb-2">Diwali Giveaway Spinner</h3>
//             <p>Experience the thrill of winning amazing products this Diwali!</p>
//           </div>
//           <div>
//             <h3 className="text-xl font-bold mb-2">Quick Links</h3>
//             <ul className="space-y-2">
//               <li><a href="#" className="hover:text-yellow-200 transition duration-300">Terms & Conditions</a></li>
//               <li><a href="#" className="hover:text-yellow-200 transition duration-300">Privacy Policy</a></li>
//               <li><a href="#" className="hover:text-yellow-200 transition duration-300">Contact Us</a></li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-xl font-bold mb-2">Follow Us</h3>
//             <div className="flex space-x-4">
//               <a href="#" className="hover:text-yellow-200 transition duration-300"><Facebook /></a>
//               <a href="#" className="hover:text-yellow-200 transition duration-300"><Twitter /></a>
//               <a href="#" className="hover:text-yellow-200 transition duration-300"><Instagram /></a>
//             </div>
//           </div>
//         </div>
//         <div className="mt-8 text-center">
//           <p>&copy; 2023 Diwali Giveaway Spinner. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   )
// }

// // Ad Component
// function Ad({ position }: { position: string }) {
//   return (
//     <div className={`bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-lg shadow-md text-center ${position === 'sidebar' ? 'h-auto' : 'h-auto'}`}>
//       <h3 className="text-2xl font-bold mb-2 text-orange-800">Diwali Special Offer!</h3>
//       <p className="text-lg text-orange-700 mb-4">Celebrate the festival of lights with amazing deals!</p>
//       <Button className="bg-orange-500 hover:bg-orange-600 text-white">Shop Now</Button>
//     </div>
//   )
// }

// // Product List Component
// function ProductList({ products }: { products: Product[] }) {
//     return (
//       <section id="products" className="my-12 px-4 md:px-8 lg:px-12  border">
//         <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-orange-800">
//           Diwali Giveaway Products
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//           {products.map((product, index) => (
//             <motion.div
//               key={index}
//               className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl"
//               whileHover={{ scale: 1.05 }}
//             >
//               <Image
//                 src={product.image}
//                 alt={product.name}
//                 width={400}
//                 height={300}
//                 className="w-full h-56 md:h-64 object-cover"
//               />
//               <div className="p-4 md:p-6 space-y-2">
//                 <h3 className="text-lg md:text-xl font-semibold text-orange-700">
//                   {product.name}
//                 </h3>
//                 <p className="text-sm md:text-base text-orange-600">
//                   {product.description}
//                 </p>
//                 <div className="text-xs md:text-sm text-gray-600 space-y-1">
//                   <p><strong>Release Year:</strong> {product.details.releaseYear}</p>
//                   <p><strong>Screen:</strong> {product.details.screenSize}</p>
//                   <p><strong>Chip:</strong> {product.details.chip}</p>
//                   <p><strong>Camera:</strong> {product.details.camera}</p>
//                   <p><strong>Battery:</strong> {product.details.batteryLife}</p>
//                   <p><strong>Price:</strong> {product.details.price}</p>
//                   <p><strong>Colors:</strong> {product.details.colors.join(', ')}</p>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </section>
//     );
//   }

// // Comment Section Component
// function CommentSection() {
//   const [comments, setComments] = useState<Comment[]>([])
//   const [newComment, setNewComment] = useState('')
//   const [newRating, setNewRating] = useState(0)

//   useEffect(() => {
//     const storedComments = localStorage.getItem('comments')
//     if (storedComments) {
//       setComments(JSON.parse(storedComments))
//     }
//   }, [])

//   const addComment = () => {
//     if (newComment && newRating > 0) {
//       const comment: Comment = {
//         id: Date.now(),
//         name: 'Anonymous',
//         content: newComment,
//         rating: newRating,
//       }
//       const updatedComments = [...comments, comment]
//       setComments(updatedComments)
//       localStorage.setItem('comments', JSON.stringify(updatedComments))
//       setNewComment('')
//       setNewRating(0)
//     }
//   }

//   return (
//     <section id="comments" className="my-12">
//       <h2 className="text-4xl font-bold mb-8 text-center text-orange-800">Giveaway Feedback</h2>
//       <div className="max-w-2xl mx-auto">
//         <div className="mb-6">
//           <textarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             placeholder="Share your Diwali giveaway experience..."
//             className="w-full px-4 py-3 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-orange-800"
//             rows={4}
//           ></textarea>
//           <div className="flex items-center mt-2">
//             <div className="flex">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <StarIcon
//                   key={star}
//                   className={`h-8 w-8 cursor-pointer ${
//                     star <= newRating ? 'text-yellow-400' : 'text-gray-300'
//                   }`}
//                   onClick={() => setNewRating(star)}
//                 />
//               ))}
//             </div>
//             <Button
//               onClick={addComment}
//               className="ml-4 bg-orange-600 hover:bg-orange-700 text-white"
//             >
//               Submit
//             </Button>
//           </div>
//         </div>
//         <AnimatePresence>
//           {comments.map((comment) => (
//             <motion.div
//               key={comment.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="bg-white p-6 rounded-lg shadow border border-orange-200 mb-4"
//             >
//               <div className="flex items-center mb-2">
//                 <span className="font-semibold mr-2 text-orange-700">{comment.name}</span>
//                 <div className="flex">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <StarIcon
//                       key={star}
//                       className={`h-5 w-5 ${
//                         star <= comment.rating ? 'text-yellow-400' : 'text-gray-300'
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>
//               <p className="text-orange-600">{comment.content}</p>
//             </motion.div>
//           ))}
//         </AnimatePresence>
      
//       </div>
//     </section>
//   )
// }

// // Winning Dialog Component
// function WinningDialog({ product, onShare }: { product: string; onShare: (platform: string) => void }) {
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')

//   const shareText = `🪔 Happy Diwali! 🎉 I just won a ${product} in the Diwali Giveaway! Join the celebration and try your luck: `
//   const shareUrl = 'https://diwali-giveaway.com'
//   const fullShareText = `${shareText}${shareUrl}`

//   const handleShareAndClaim = (platform: string) => {
//     if (name && email) {
//       localStorage.setItem('user', JSON.stringify({ name, email }))
//       localStorage.setItem('winningProduct', product)
//       onShare(platform)
//     }
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.9 }}
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//     >
//       <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-8 rounded-lg shadow-xl max-w-md w-full border-4 border-yellow-400">
//         <h2 className="text-3xl font-bold mb-4 text-center text-orange-600">🎊 Congratulations! 🎊</h2>
//         <p className="text-xl mb-6 text-center text-orange-800">
//           You've won a <span className="font-bold text-orange-600">{product}</span>!
//         </p>
//         <div className="mb-6 space-y-4">
//           <div>
//             <Label htmlFor="name" className="text-orange-800">Name</Label>
//             <Input
//               type="text"
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="email" className="text-orange-800">Email</Label>
//             <Input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
//               required
//             />
//           </div>
//         </div>
//         <p className="text-center mb-4 text-orange-800 font-semibold">Share with at least 15 friends to claim your prize!</p>
//         <Tabs defaultValue="whatsapp" className="w-full">
//           <TabsList className="grid w-full grid-cols-5 bg-orange-200">
//             <TabsTrigger value="whatsapp" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
//               <MessageCircle className="w-5 h-5" />
//             </TabsTrigger>
//             <TabsTrigger value="facebook" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
//               <Facebook className="w-5 h-5" />
//             </TabsTrigger>
//             <TabsTrigger value="twitter" className="data-[state=active]:bg-blue-400 data-[state=active]:text-white">
//               <Twitter className="w-5 h-5" />
//             </TabsTrigger>
//             <TabsTrigger value="linkedin" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
//               <Linkedin className="w-5 h-5" />
//             </TabsTrigger>
//             <TabsTrigger value="instagram" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
//               <Instagram className="w-5 h-5" />
//             </TabsTrigger>
//           </TabsList>
//           <TabsContent value="whatsapp">
//             <Button
//               onClick={() => handleShareAndClaim('whatsapp')}
//               className="w-full bg-green-500 hover:bg-green-600 text-white"
//             >
//               Share and Claim on WhatsApp
//             </Button>
//           </TabsContent>
//           <TabsContent value="facebook">
//             <Button
//               onClick={() => handleShareAndClaim('facebook')}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               Share and Claim on Facebook
//             </Button>
//           </TabsContent>
//           <TabsContent value="twitter">
//             <Button
//               onClick={() => handleShareAndClaim('twitter')}
//               className="w-full bg-blue-400 hover:bg-blue-500 text-white"
//             >
//               Share and Claim on Twitter
//             </Button>
//           </TabsContent>
//           <TabsContent value="linkedin">
//             <Button
//               onClick={() => handleShareAndClaim('linkedin')}
//               className="w-full bg-blue-700 hover:bg-blue-800 text-white"
//             >
//               Share and Claim on LinkedIn
//             </Button>
//           </TabsContent>
//           <TabsContent value="instagram">
//             <div className="space-y-2">
//               <p className="text-center text-orange-800">Open Instagram and paste this message:</p>
//               <textarea
//                 readOnly
//                 value={fullShareText}
//                 className="w-full p-2 border rounded-md mt-2 bg-white text-orange-800 border-orange-300"
//                 rows={3}
//               />
//               <Button
//                 onClick={() => handleShareAndClaim('instagram')}
//                 className="w-full bg-pink-600 hover:bg-pink-700 text-white"
//               >
//                 Share and Claim on Instagram
//               </Button>
//             </div>
//           </TabsContent>
//         </Tabs>
//         <div className="mt-4 p-3 bg-orange-100 rounded-md border border-orange-300">
//           <p className="text-sm text-orange-800 font-medium">Share this link:</p>
//           <p className="text-xs text-orange-600 break-all">{shareUrl}</p>
//         </div>
//         <div className="mt-4 text-center">
//           <p className="text-orange-800 font-medium">Diwali Wishes</p>
//           <p className="text-sm text-orange-700">{diwaliQuotes[Math.floor(Math.random() * diwaliQuotes.length)]}</p>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// // Engagement Component
// function EngagementPrompt({ message }: { message: string }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -50 }}
//       className="fixed bottom-4 right-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 rounded-lg shadow-lg max-w-sm"
//     >
//       {message}
//     </motion.div>
//   )
// }



// function CountdownTimer() {
//   const targetDate = new Date("October 31, 2024 00:00:00").getTime();
//   const [timeLeft, setTimeLeft] = useState({ weeks: 0, days: 0, hours: 0, minutes: 0 });

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = new Date().getTime();
//       const distance = targetDate - now;

//       // Calculate time left
//       const weeks = Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
//       const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

//       // Update state with calculated values
//       setTimeLeft({ weeks, days, hours, minutes });

//       // Stop the timer when the countdown is over
//       if (distance < 0) {
//         clearInterval(interval);
//         setTimeLeft({ weeks: 0, days: 0, hours: 0, minutes: 0 }); // Reset when time is up
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [targetDate]);

//   return (
//     <div className="p-6 bg-orange-50 text-center rounded-lg shadow-md border border-orange-300 space-y-4">
//       <h3 className="text-2xl font-bold text-orange-800">Countdown to Diwali</h3>
//       <div className="flex justify-center space-x-8 text-orange-700">
//         <div className="flex flex-col items-center">
//           <span className="text-4xl font-bold">{timeLeft.weeks}</span>
//           <span className="text-sm">Weeks</span>
//         </div>
//         <div className="flex flex-col items-center">
//           <span className="text-4xl font-bold">{timeLeft.days}</span>
//           <span className="text-sm">Days</span>
//         </div>
//         <div className="flex flex-col items-center">
//           <span className="text-4xl font-bold">{timeLeft.hours}</span>
//           <span className="text-sm">Hours</span>
//         </div>
//         <div className="flex flex-col items-center">
//           <span className="text-4xl font-bold">{timeLeft.minutes}</span>
//           <span className="text-sm">Minutes</span>
//         </div>
//       </div>
//     </div>
//   );
// }







// // Main App Component
// export default function GiveawayPage() {
//   const [user, setUser] = useState<User | null>(null)
//   const [winner, setWinner] = useState<string | null>(null)
//   const [showConfetti, setShowConfetti] = useState(false)
//   const [showWinningDialog, setShowWinningDialog] = useState(false)
//   const [engagementPrompt, setEngagementPrompt] = useState<string | null>(null)
//   const [spinsLeft, setSpinsLeft] = useState(3)

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user')
//     const storedWinner = localStorage.getItem('winningProduct')
//     if (storedUser) {
//       setUser(JSON.parse(storedUser))
//     }
//     if (storedWinner) {
//       setWinner(storedWinner)
//     }

//     const engagementMessages = [
//       "Happy Diwali! Spin the wheel for a chance to win amazing prizes!",
//       "Don't forget to check out our product showcase below!",
//       "Share your experience in the comments section!",
//       "Feeling lucky? Give the wheel another spin!",
//       "Explore all our Diwali special offers!"
//     ]

//     let messageIndex = 0
//     const engagementInterval = setInterval(() => {
//       setEngagementPrompt(engagementMessages[messageIndex])
//       messageIndex = (messageIndex + 1) % engagementMessages.length
//     }, 5000)

//     return () => clearInterval(engagementInterval)
//   }, [])

//   const handleSpin = (result: string) => {
//     setSpinsLeft(prevSpins => prevSpins - 1)
//     if (result !== 'Bad Luck') {
//       setWinner(result)
//       setShowConfetti(true)
//       setShowWinningDialog(true)
//     } else {
//       setEngagementPrompt(`Better luck next time! You have ${spinsLeft - 1} spin${spinsLeft - 1 !== 1 ? 's' : ''} left.`)
//     }
//   }

//   const handleShare = (platform: string) => {
//     console.log(`Shared on ${platform}`)
//     setShowWinningDialog(false)
//     setEngagementPrompt("Thanks for sharing! Your prize will be on its way soon!")
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-100 to-yellow-100">
//       <Header />
//       <main className="flex-grow container mx-auto px-4 py-8">
//         {showConfetti && <Confetti recycle={false} numberOfPieces={500} colors={['#FFA500', '#FF6347', '#FFD700', '#FF4500', '#FF8C00', '#FF7F50']} />}
        
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold mb-4 text-orange-800">Diwali Giveaway Extravaganza!</h1>
//           <p className="text-2xl mb-6 text-orange-700">Spin the wheel for a chance to win amazing prizes this Diwali!</p>
//           {user && <p className="text-xl font-semibold text-orange-600">Welcome back, {user.name}!</p>}
//           {winner && <p className="text-xl font-semibold mt-2 text-orange-600">You've won a {winner}! Check your email for details.</p>}
//           <p className="text-xl font-semibold mt-2 text-orange-600">Spins remaining: {spinsLeft}</p>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="lg:w-2/3">
//             <div className="mb-12">
//               <WheelComponent
//                 segments={spinItems}
//                 segColors={segColors}
//                 winningSegment=""
//                 onFinished={(winner) => handleSpin(winner)}
//                 primaryColor="black"
//                 contrastColor="white"
//                 buttonText="Spin"
//                 isOnlyOnce={false}
//                 size={290}
//                 upDuration={100}
//                 downDuration={1000}
//               />
//             </div>
//             <ProductList products={products} />
//             <CommentSection />
//           </div>
//           <div className="lg:w-1/3 space-y-8">
//             <Ad position="sidebar" />
//             <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
//               <h3 className="text-2xl font-bold mb-4 text-orange-800">Diwali Quote of the Day</h3>
//               <p className="text-orange-700 italic">{diwaliQuotes[Math.floor(Math.random() * diwaliQuotes.length)]}</p>
//             </div>

//                 {/* Testimonial Section */}
//     <div className="p-4 text-orange-700 space-y-4">
//         <h3 className="text-xl font-semibold">What People Are Saying</h3>
//         <p>"This is the best Diwali celebration I've ever experienced. The spirit and energy are unmatched!"</p>
//         <span className="text-sm italic">- Happy Visitor</span>
//     </div>

//     {/* Info Section */}
//     <div className="p-4">
//         <h3 className="text-lg font-semibold text-orange-800">Did You Know?</h3>
//         <p className="text-orange-600 mt-2">Diwali is celebrated by millions of people across the world, marking the victory of light over darkness.</p>
//     </div>

//     {/* Countdown Section */}
//    <CountdownTimer/>

//    <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
//     <h3 className="text-lg font-semibold text-orange-800">Diwali Recipe of the Day</h3>
//     <p className="text-orange-600 mt-2">Try making some delicious **Gulab Jamun** this Diwali! These sweet, syrupy balls are a festive favorite.</p>
//   </div>

//   {/* Fun Facts Section */}
//   <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
//     <h3 className="text-lg font-semibold text-orange-800">Facts about Diwali</h3>
//     <ul className="list-disc list-inside text-orange-600 mt-2 space-y-1">
//       <li>Diwali is also known as the Festival of Lights.</li>
  
    
//     </ul>
//   </div>

//   {/* Community Engagement Section */}
//   <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
//     <h3 className="text-lg font-semibold text-orange-800">Join Our Community</h3>
//     <p className="text-orange-600 mt-2">Connect with others and share your Diwali experiences. Join us for our upcoming events!</p>
//     <button className="mt-4 bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-500">Get Involved</button>
//   </div>
//           </div>
//         </div>
        
//         {showWinningDialog && winner && (
//           <WinningDialog product={winner} onShare={handleShare} />
//         )}
        
//         {engagementPrompt && (
//           <EngagementPrompt message={engagementPrompt} />
//         )}
//       </main>
//       <Ad position="footer" />
//       <Footer />
//     </div>
//   )
// }