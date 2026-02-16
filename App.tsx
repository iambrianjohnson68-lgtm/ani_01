import React, { useState, useEffect } from 'react';
import { Menu, MapPin, Clock, Phone, Facebook, Instagram, Twitter, ChevronDown, Star, ChefHat, Leaf, Flame, ShoppingBag, Calendar, X, Mail, AlignJustify, ArrowRight } from 'lucide-react';
import { AppState, MenuItem, Reservation, Category } from './types';
import { INITIAL_MENU, INITIAL_REVIEWS } from './constants';
import AIChatBot from './components/AIChatBot';
import MenuManager from './components/MenuManager';

// --- Sub-components defined here to ensure single-file flow for clarity in this large response ---
// ideally these would be split, but per instructions, I will keep the logical flow tight.

const NavItem = ({ children, active, onClick }: { children?: React.ReactNode, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`text-sm font-medium transition-colors ${active ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
  >
    {children}
  </button>
);

const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-sans tracking-tight">{title}</h2>
    {subtitle && <div className="h-1 w-20 bg-red-600 mx-auto rounded-full"></div>}
    {subtitle && <p className="mt-4 text-gray-500 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

function App() {
  const [view, setView] = useState<'home' | 'admin'>('home');
  const [data, setData] = useState<AppState>({
    menu: INITIAL_MENU,
    reservations: [],
    reviews: INITIAL_REVIEWS
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  // Reservation Form State
  const [resForm, setResForm] = useState({
    name: '', email: '', phone: '', date: '', time: '', guests: 2
  });

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRes: Reservation = {
      id: Date.now().toString(),
      ...resForm,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setData(prev => ({ ...prev, reservations: [...prev.reservations, newRes] }));
    setIsReservationModalOpen(false);
    setResForm({ name: '', email: '', phone: '', date: '', time: '', guests: 2 });
    alert("Reservation Request Sent! We'll confirm shortly.");
  };

  const filteredMenu = activeCategory === 'All' 
    ? data.menu 
    : data.menu.filter(item => item.category === activeCategory);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
              <div className="bg-red-600 p-2 rounded-lg text-white">
                <Flame size={24} fill="currentColor" />
              </div>
              <span className="font-extrabold text-2xl tracking-tighter text-gray-900">Pizza<span className="text-red-600">Hut</span></span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <NavItem onClick={() => { setView('home'); setTimeout(() => scrollToSection('about'), 100); }}>About</NavItem>
              <NavItem onClick={() => { setView('home'); setTimeout(() => scrollToSection('menu'), 100); }}>Menu</NavItem>
              <NavItem onClick={() => { setView('home'); setTimeout(() => scrollToSection('reviews'), 100); }}>Reviews</NavItem>
              <NavItem onClick={() => { setView('home'); setTimeout(() => scrollToSection('contact'), 100); }}>Contact</NavItem>
              <button 
                onClick={() => setView(view === 'home' ? 'admin' : 'home')}
                className="text-xs font-semibold text-gray-400 hover:text-gray-600 uppercase tracking-widest"
              >
                {view === 'home' ? 'Admin' : 'Exit Admin'}
              </button>
            </div>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsReservationModalOpen(true)}
                className="hidden md:flex bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-red-200"
              >
                Book a Table
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600"
              >
                {isMobileMenuOpen ? <X /> : <AlignJustify />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-xl absolute w-full">
             <NavItem onClick={() => scrollToSection('about')}>About</NavItem>
             <NavItem onClick={() => scrollToSection('menu')}>Menu</NavItem>
             <NavItem onClick={() => scrollToSection('reviews')}>Reviews</NavItem>
             <button onClick={() => setIsReservationModalOpen(true)} className="bg-red-600 text-white py-3 rounded-lg font-bold w-full">Book a Table</button>
             <button onClick={() => { setView(view === 'home' ? 'admin' : 'home'); setIsMobileMenuOpen(false); }} className="text-sm text-gray-400 mt-2">
                {view === 'home' ? 'Admin Access' : 'Back to Home'}
             </button>
          </div>
        )}
      </nav>

      {/* --- Main Content --- */}
      <main className="pt-20">
        {view === 'admin' ? (
          <div className="max-w-7xl mx-auto px-4 py-12">
             <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-500">Manage your restaurant operations</p>
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  System Operational
                </div>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Menu Manager */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <MenuManager menu={data.menu} onUpdateMenu={(newMenu) => setData({ ...data, menu: newMenu })} />
                  </div>
                </div>

                {/* Right Col: Reservations List (Simple) */}
                <div className="space-y-8">
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <h2 className="text-xl font-bold mb-4">Recent Reservations</h2>
                      {data.reservations.length === 0 ? (
                        <p className="text-gray-400 text-sm">No active reservations.</p>
                      ) : (
                        <div className="space-y-3">
                          {data.reservations.map(res => (
                            <div key={res.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                               <div className="flex justify-between font-medium">
                                 <span>{res.name}</span>
                                 <span className="text-blue-600">{res.time}</span>
                               </div>
                               <div className="text-gray-500 text-xs mt-1 flex justify-between">
                                  <span>{res.date} · {res.guests} Guests</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase ${res.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{res.status}</span>
                               </div>
                            </div>
                          ))}
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <>
            {/* 1. Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2670" 
                  alt="Pizza Background" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30"></div>
              </div>
              
              <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
                <div className="inline-block bg-orange-500/90 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider animate-bounce">
                  Best Pizza in Town
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                  Freshly Baked Happiness, <br/><span className="text-orange-500">Served Hot.</span>
                </h1>
                <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
                  Hand-crafted pizzas, premium ingredients, and unforgettable taste experiences.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setIsReservationModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-red-900/20"
                  >
                    🍽 Book a Table
                  </button>
                  <button 
                    onClick={() => scrollToSection('menu')}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all"
                  >
                    📋 View Menu
                  </button>
                </div>
              </div>
            </section>

            {/* 2. About Section */}
            <section id="about" className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                 <div className="space-y-6">
                    <h3 className="text-red-600 font-bold tracking-widest uppercase text-sm">Our Story</h3>
                    <h2 className="text-4xl font-bold text-gray-900">Not Just Pizza, <br/>It's a Family Tradition.</h2>
                    <p className="text-gray-600 leading-relaxed">
                      Founded in 1995, PizzaHut Remastered started with a simple mission: to serve the community with authentic Italian flavors using locally sourced ingredients. Our dough is kneaded fresh daily, and our secret sauce recipe has been passed down for generations.
                    </p>
                    <div className="grid grid-cols-2 gap-6 pt-4">
                      <div className="flex items-start gap-3">
                         <div className="bg-yellow-100 p-3 rounded-full text-yellow-700"><ChefHat size={20} /></div>
                         <div>
                           <h4 className="font-bold text-gray-900">Master Chefs</h4>
                           <p className="text-sm text-gray-500">Expertly crafted recipes</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3">
                         <div className="bg-green-100 p-3 rounded-full text-green-700"><Leaf size={20} /></div>
                         <div>
                           <h4 className="font-bold text-gray-900">Fresh Ingredients</h4>
                           <p className="text-sm text-gray-500">Farm-to-table daily</p>
                         </div>
                      </div>
                    </div>
                 </div>
                 <div className="relative">
                    <img src="https://images.unsplash.com/photo-1542528180-a8b08d61c285?auto=format&fit=crop&q=80&w=1000" alt="Chef" className="rounded-2xl shadow-2xl z-10 relative" />
                    <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl z-20 max-w-xs hidden md:block">
                       <p className="italic text-gray-600 font-serif">"We don't just bake pizza, we bake memories."</p>
                       <p className="mt-2 font-bold text-gray-900">- Head Chef Antonio</p>
                    </div>
                    <div className="absolute top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
                 </div>
              </div>
            </section>

            {/* 3. Menu Section */}
            <section id="menu" className="py-20 bg-gray-50">
               <div className="max-w-7xl mx-auto px-4">
                  <SectionTitle title="Our Menu" subtitle="Explore our wide range of delicious offerings" />
                  
                  {/* Categories */}
                  <div className="flex flex-wrap justify-center gap-2 mb-12">
                     {['All', 'Pizza', 'Starters', 'Sides', 'Beverages', 'Desserts'].map((cat) => (
                       <button
                         key={cat}
                         onClick={() => setActiveCategory(cat as Category | 'All')}
                         className={`px-6 py-2 rounded-full font-medium transition-all ${
                           activeCategory === cat 
                             ? 'bg-red-600 text-white shadow-lg shadow-red-200' 
                             : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                         }`}
                       >
                         {cat}
                       </button>
                     ))}
                  </div>

                  {/* Menu Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                     {filteredMenu.map(item => (
                       <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                          <div className="relative h-48 overflow-hidden">
                             <img 
                               src={item.image} 
                               alt={item.name} 
                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                             />
                             <div className="absolute top-3 right-3 flex gap-1">
                               {item.isVegetarian && <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">VEG</span>}
                               {item.isPopular && <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1"><Flame size={10} /> HOT</span>}
                             </div>
                          </div>
                          <div className="p-5">
                             <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-900 leading-tight">{item.name}</h3>
                                <span className="font-bold text-red-600">₹{item.price}</span>
                             </div>
                             <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{item.description}</p>
                             <button className="w-full py-2 border-2 border-red-600 text-red-600 font-bold rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm flex items-center justify-center gap-2 group-hover:gap-3">
                               Add to Order <ShoppingBag size={16} />
                             </button>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* 4. Popular Dishes (Chef's Picks) */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                 <div className="flex justify-between items-end mb-10">
                    <div>
                      <h3 className="text-red-600 font-bold tracking-widest uppercase text-sm mb-2">Chef's Selection</h3>
                      <h2 className="text-3xl font-bold text-gray-900">Most Loved Dishes</h2>
                    </div>
                    <button onClick={() => { setActiveCategory('Pizza'); scrollToSection('menu'); }} className="hidden md:flex items-center gap-2 text-red-600 font-medium hover:gap-3 transition-all">
                       See Full Menu <ArrowRight size={18} />
                    </button>
                 </div>
                 
                 <div className="grid md:grid-cols-3 gap-8">
                    {data.menu.filter(i => i.isPopular).slice(0, 3).map(item => (
                       <div key={item.id} className="relative rounded-2xl overflow-hidden aspect-[4/5] group cursor-pointer">
                          <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                             <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-white text-2xl font-bold mb-2">{item.name}</h3>
                                <p className="text-gray-300 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">{item.description}</p>
                                <button onClick={() => setIsReservationModalOpen(true)} className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                                   Book & Taste
                                </button>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            </section>

            {/* 5. Reservation CTA Block */}
            <section className="relative py-24 flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0">
                  <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover filter blur-[2px] brightness-50" />
               </div>
               <div className="relative z-10 text-center px-4 max-w-3xl">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Your Table is Waiting.</h2>
                  <p className="text-xl text-gray-200 mb-8">Skip the waiting line. Reserve your spot in seconds and let us take care of the rest.</p>
                  <button 
                    onClick={() => setIsReservationModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-full font-bold text-xl shadow-2xl transition-all transform hover:scale-105"
                  >
                    Book a Table Now
                  </button>
               </div>
            </section>

            {/* 6. Testimonials */}
            <section id="reviews" className="py-20 bg-gray-50">
               <div className="max-w-7xl mx-auto px-4">
                  <SectionTitle title="What Our Guests Say" subtitle="Loved by 10,000+ Guests" />
                  <div className="grid md:grid-cols-3 gap-8">
                     {data.reviews.map(review => (
                        <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                           <div className="text-yellow-400 flex gap-1 mb-4">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                              ))}
                           </div>
                           <p className="text-gray-700 italic mb-6">"{review.text}"</p>
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                 {review.author[0]}
                              </div>
                              <div>
                                 <h4 className="font-bold text-gray-900 text-sm">{review.author}</h4>
                                 <span className="text-xs text-gray-400">Verified Guest</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* 7. Location & Opening Hours */}
            <section id="contact" className="py-20 bg-white">
               <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
                  <div>
                     <h3 className="text-2xl font-bold mb-6">Visit Us</h3>
                     <div className="space-y-6">
                        <div className="flex gap-4">
                           <div className="bg-red-100 p-3 rounded-full text-red-600 h-fit"><MapPin size={24} /></div>
                           <div>
                              <h4 className="font-bold text-gray-900">Location</h4>
                              <p className="text-gray-600">123 Pizza Street, Flavor Town, kolhapur</p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="bg-blue-100 p-3 rounded-full text-blue-600 h-fit"><Phone size={24} /></div>
                           <div>
                              <h4 className="font-bold text-gray-900">Call Us</h4>
                              <p className="text-gray-600">+1 (555) 123-4567</p>
                              <a href="tel:+15551234567" className="text-red-600 text-sm font-semibold hover:underline">Call Now</a>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="bg-orange-100 p-3 rounded-full text-orange-600 h-fit"><Clock size={24} /></div>
                           <div>
                              <h4 className="font-bold text-gray-900">Opening Hours</h4>
                              <p className="text-gray-600">Mon-Sun: 11:00 AM - 11:00 PM</p>
                              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">We are Open</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="h-80 md:h-auto bg-gray-200 rounded-2xl overflow-hidden relative">
                     {/* Embedded Map Placeholder */}
                     <iframe 
                       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1633618155986!5m2!1sen!2sus" 
                       width="100%" 
                       height="100%" 
                       style={{border:0}} 
                       allowFullScreen 
                       loading="lazy"
                       className="grayscale hover:grayscale-0 transition-all duration-500"
                     ></iframe>
                  </div>
               </div>
            </section>

            {/* 8. Footer */}
            <footer className="bg-gray-900 text-white py-16 border-t border-gray-800">
               <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">
                  <div className="space-y-4">
                     <div className="flex items-center gap-2">
                        <Flame size={24} className="text-red-600" />
                        <span className="font-extrabold text-2xl tracking-tighter">Pizza<span className="text-red-600">Hut</span></span>
                     </div>
                     <p className="text-gray-400 text-sm">Serving the best slices since 1995. Quality ingredients, unforgettable taste.</p>
                     <div className="flex gap-4">
                        <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition-colors"><Facebook size={18} /></a>
                        <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition-colors"><Instagram size={18} /></a>
                        <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition-colors"><Twitter size={18} /></a>
                     </div>
                  </div>
                  
                  <div>
                     <h4 className="font-bold text-lg mb-4">Quick Links</h4>
                     <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-red-500 transition-colors">Home</a></li>
                        <li><a href="#menu" className="hover:text-red-500 transition-colors">Menu</a></li>
                        <li><a href="#about" className="hover:text-red-500 transition-colors">About Us</a></li>
                        <li><a href="#contact" className="hover:text-red-500 transition-colors">Contact</a></li>
                        <li><a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a></li>
                     </ul>
                  </div>

                  <div>
                     <h4 className="font-bold text-lg mb-4">Newsletter</h4>
                     <p className="text-gray-400 text-sm mb-4">Subscribe for offers and updates.</p>
                     <div className="flex gap-2">
                        <input type="email" placeholder="Your email" className="bg-gray-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-red-600 outline-none" />
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"><ArrowRight size={18} /></button>
                     </div>
                  </div>

                  <div>
                     <h4 className="font-bold text-lg mb-4">Contact</h4>
                     <ul className="space-y-2 text-gray-400 text-sm">
                        <li className="flex items-center gap-2"><Phone size={14} /> +1 (555) 123-4567</li>
                        <li className="flex items-center gap-2"><Mail size={14} /> hello@pizzahutremastered.com</li>
                     </ul>
                  </div>
               </div>
               <div className="max-w-7xl mx-auto px-4 pt-8 mt-12 border-t border-gray-800 text-center text-gray-500 text-sm">
                  © 2024 PizzaHut Remastered. All rights reserved.
               </div>
            </footer>

            {/* Chatbot */}
            <AIChatBot menu={data.menu} />
          </>
        )}
      </main>

      {/* Reservation Modal */}
      {isReservationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in relative">
              <button 
                onClick={() => setIsReservationModalOpen(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              
              <div className="text-center mb-6">
                 <h2 className="text-2xl font-bold text-gray-900">Book a Table</h2>
                 <p className="text-gray-500 text-sm">Reserve your spot at PizzaHut Remastered</p>
              </div>

              <form onSubmit={handleReservationSubmit} className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Name</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      value={resForm.name}
                      onChange={e => setResForm({...resForm, name: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-600 uppercase">Date</label>
                       <input 
                          required 
                          type="date" 
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
                          value={resForm.date}
                          onChange={e => setResForm({...resForm, date: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-600 uppercase">Time</label>
                       <input 
                          required 
                          type="time" 
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
                          value={resForm.time}
                          onChange={e => setResForm({...resForm, time: e.target.value})}
                        />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Guests</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      value={resForm.guests}
                      onChange={e => setResForm({...resForm, guests: parseInt(e.target.value)})}
                    >
                      {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} People</option>)}
                      <option value={9}>9+ (Large Group)</option>
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Phone</label>
                    <input 
                      required 
                      type="tel" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      value={resForm.phone}
                      onChange={e => setResForm({...resForm, phone: e.target.value})}
                    />
                 </div>
                 <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg mt-4 transition-colors shadow-lg">
                    Confirm Reservation
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

export default App;