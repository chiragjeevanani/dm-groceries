import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Landmark, CreditCard, AlertTriangle, CheckCircle2 } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import Card from "@/shared/components/ui/Card";
import Input from "@/shared/components/ui/Input";

const BankAccount = () => {
  const navigate = useNavigate();

  const bankDetails = {
    accountHolder: "RAHUL KUMAR",
    accountNumber: "XXXXXXXX8921",
    ifsc: "HDFC0001234",
    bankName: "HDFC Bank",
    branch: "MG Road, Bangalore",
    status: "Verified",
  };

  return (
    <div className="bg-white min-h-screen pb-28 relative overflow-hidden font-sans">
      
      {/* Sticky Deep Green Header Banner */}
      <div className="bg-[#1A4516] text-white py-3 px-5 sticky top-0 z-40 shadow-sm flex items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors mr-2 cursor-pointer"
          aria-label="Go Back"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="text-sm font-black leading-tight tracking-tight">Bank Account</h1>
      </div>

      {/* Main Content Area */}
      <div className="p-4 max-w-lg mx-auto space-y-4 relative z-10">
        
        {/* Bank Card Visual */}
        <div className="bg-gradient-to-br from-[#1A4516] to-[#123610] text-white p-4.5 rounded-2xl shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex justify-between items-center mb-5 relative z-10">
            <Landmark size={24} className="text-white/80" />
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border border-emerald-500/30 flex items-center">
              <CheckCircle2 size={10} className="mr-0.5" /> Active
            </span>
          </div>

          <div className="space-y-0.5 relative z-10">
            <p className="text-white/60 text-[9px] uppercase tracking-wider font-bold">Account Number</p>
            <p className="font-mono text-xl tracking-widest font-bold">{bankDetails.accountNumber}</p>
          </div>

          <div className="flex justify-between items-end mt-5 relative z-10">
            <div>
              <p className="text-white/60 text-[9px] uppercase tracking-wider mb-0.5 font-bold">Account Holder</p>
              <p className="font-extrabold text-sm">{bankDetails.accountHolder}</p>
            </div>
            <div className="text-right">
              <p className="text-white text-xs font-black">{bankDetails.bankName}</p>
              <p className="text-white/60 text-[10px] font-mono mt-0.5">{bankDetails.ifsc}</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 border border-amber-100/50 p-3 rounded-xl flex items-start">
          <AlertTriangle size={16} className="text-amber-600 mr-2.5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-amber-800 font-extrabold text-xs mb-0.5">Payment Information</h4>
            <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
              Your weekly earnings will be deposited to this account every Tuesday. 
              Changes to bank details may delay your next payout by up to 7 days.
            </p>
          </div>
        </div>

        {/* Change Request Form */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 px-1">Request Change</h3>
          <div className="space-y-3">
            <Input 
              label="New Account Number" 
              placeholder="Enter account number" 
              icon={CreditCard}
              className="focus:ring-[#1A4516]/10 focus:border-[#1A4516]"
            />
            <Input 
              label="Confirm Account Number" 
              placeholder="Re-enter account number" 
              icon={CreditCard}
              className="focus:ring-[#1A4516]/10 focus:border-[#1A4516]"
            />
            <Input 
              label="IFSC Code" 
              placeholder="Enter IFSC code" 
              icon={Landmark}
              className="focus:ring-[#1A4516]/10 focus:border-[#1A4516]"
            />
            <Button className="w-full mt-2 bg-[#1A4516] hover:bg-[#153b12] text-white border-none py-2 text-xs font-bold rounded-xl" variant="outline">
              Verify & Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankAccount;
