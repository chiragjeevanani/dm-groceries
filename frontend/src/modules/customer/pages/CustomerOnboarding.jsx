import React from 'react';

const CustomerOnboarding = ({ onGetStarted }) => {
    return (
        <div className="flex flex-col items-center min-h-screen bg-[#FBFBFB] font-outfit relative overflow-hidden">
            
            {/* Top right curved background with generated image */}
            <div className="absolute top-0 right-0 w-[75%] h-[32%] z-0 overflow-hidden shadow-2xl bg-[#1A4516]" 
                 style={{ borderBottomLeftRadius: '100% 80%' }}>
                <img 
                    src="/vegetables-bg.png" 
                    alt="Fresh Vegetables" 
                    className="w-full h-full object-cover object-bottom"
                />
            </div>
            
            {/* Main Content Area */}
            <div className="relative z-10 flex flex-col items-center justify-end w-full min-h-screen pb-8 px-6 pt-[25vh]">
                
                {/* Logo and Welcome Text */}
                <div className="flex flex-col items-center animate-fade-in-up mb-auto">
                    <img src="/Logo.png" alt="DM Groceries Logo" className="w-40 sm:w-48 h-auto object-contain mb-4 drop-shadow-md" />
                    
                    <h2 className="text-[18px] sm:text-[20px] font-bold text-[#1a2332] text-center mb-1">
                        Welcome to
                    </h2>
                    <h1 className="text-[22px] sm:text-[24px] font-extrabold text-[#113826] text-center mb-3">
                        DM Groceries & Vegetables
                    </h1>
                    
                    <p className="text-[14px] sm:text-[15px] font-medium text-[#5c6a7e] text-center max-w-[280px] leading-relaxed">
                        Fresh & Quality groceries delivered to your doorstep
                    </p>
                </div>

                {/* Bottom Actions */}
                <div className="w-full max-w-sm flex flex-col items-center space-y-6 animate-fade-in-up delay-100 mt-6">
                    <button 
                        onClick={onGetStarted}
                        className="w-full bg-[#1A4516] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-green-900/30 hover:bg-[#123110] transition-colors focus:ring-4 focus:ring-green-900/20 active:scale-95 text-[15px]"
                    >
                        Get Started
                    </button>
                    
                    {/* Pagination Dots */}
                    <div className="flex space-x-2.5">
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <div className="w-2 h-2 rounded-full bg-[#1A4516] ring-2 ring-[#1A4516]/20"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CustomerOnboarding;
