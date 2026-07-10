import React from 'react';
import { BadgeCheck, Truck, CreditCard, Tag, Headset } from 'lucide-react';

const CustomerSplash = () => {
    const features = [
        { icon: BadgeCheck, title: "Fresh & Quality", subtitle: "Handpicked products" },
        { icon: Truck, title: "Fast Delivery", subtitle: "To your doorstep" },
        { icon: CreditCard, title: "Easy Payments", subtitle: "Secure checkout" },
        { icon: Tag, title: "Best Offers", subtitle: "Daily discounts" },
        { icon: Headset, title: "24x7 Support", subtitle: "Always here for you" },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f4f9f4] to-[#e0ede0] font-outfit px-4 sm:px-6 overflow-hidden relative">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#c4e1c5] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#e6f2e6] rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-sm py-4 sm:py-6">
                
                {/* Logo Section */}
                <div className="flex flex-col items-center animate-fade-in-up">
                    <div className="relative flex justify-center items-center w-full">
                        <img src="/Logo.png" alt="App Logo" className="w-32 sm:w-40 h-auto object-contain mb-1 drop-shadow-md" />
                    </div>
                    
                    <h1 className="text-xl sm:text-[1.6rem] font-extrabold text-[#0d2d1e] text-center mt-2 tracking-tight leading-tight">
                        Fresh Groceries <br/> 
                        <span className="text-[#206644] bg-clip-text text-transparent bg-gradient-to-r from-[#1A4516] to-[#3a9665]">Delivered To You</span>
                    </h1>
                </div>

                {/* Customer App Badge */}
                <div className="mt-4 mb-5 animate-fade-in-up delay-100">
                    <div className="bg-gradient-to-r from-[#1A4516] to-[#2C6E25] text-white px-6 py-2 rounded-full font-bold tracking-[0.15em] text-xs shadow-lg shadow-green-900/20 ring-2 ring-white/60 uppercase relative overflow-hidden group">
                        <span className="relative z-10">Customer App</span>
                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    </div>
                </div>

                {/* Features List */}
                <div className="w-full space-y-2.5 animate-fade-in-up delay-200">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-4 p-3 sm:p-3.5 rounded-2xl bg-white/80 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md border border-white/60 group cursor-default">
                            <div className="bg-gradient-to-br from-[#eaf4ea] to-[#d6ebd6] p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                <feature.icon size={20} className="text-[#1A4516]" strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[14px] sm:text-[15px] font-bold text-[#1a2332] leading-tight">{feature.title}</span>
                                <span className="text-[11px] sm:text-[12px] font-medium text-[#5c6a7e] mt-0.5">{feature.subtitle}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    );
};

export default CustomerSplash;
