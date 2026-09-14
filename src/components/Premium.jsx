import { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Sparkles, HelpCircle, ChevronDown, CheckCircle2 } from "lucide-react";
import PlanCards from "./PlanCards";

const FAQS = [
  {
    q: "How do the daily swipe limits work?",
    a: "Limits reset automatically every 24 hours from your first interaction. Basic members get 10 requests/day, Pro gets 50, and Premium has no limits.",
  },
  {
    q: "When can I start chatting with my connections?",
    a: "Chatting unlocks as soon as you have a mutual match and are on either the Pro or Premium plan.",
  },
  {
    q: "How does payment through Razorpay work?",
    a: "All transactions are processed securely via Razorpay with support for UPI, Credit/Debit cards, NetBanking, and Wallets. Upgrades apply instantly.",
  },
  {
    q: "Can I upgrade or cancel my plan at any time?",
    a: "Yes. You can upgrade from Basic to Pro or Premium whenever you need higher quotas. Changes take effect immediately.",
  },
];

export default function Premium() {
  const user = useSelector((store) => store.user);
  const currentPlan = user?.membershipType || "basic";
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-base-200/40 py-10 sm:py-14 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3" />
            <span>Membership Tiers</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-base-content mb-3">
            Supercharge Your Orbit Network
          </h1>
          <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
            Connect with founders, builders, and collaborators faster. Unlock direct chat,
            verified badges, and expanded daily discovery.
          </p>

          {/* Current Membership Indicator */}
          <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-base-100 border border-base-content/10 shadow-xs text-xs">
            <span className="text-base-content/60">Your current tier:</span>
            <span className="font-bold capitalize text-primary font-mono">{currentPlan}</span>
          </div>
        </div>

        {/* Selected Plan Action Banner */}
        <AnimatePresence>
          {selectedPlan && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mb-8 max-w-xl mx-auto p-4 rounded-2xl bg-base-100 border border-primary/40 shadow-lg flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-base-content">
                    Ready to activate {selectedPlan.name}?
                  </p>
                  <p className="text-[11px] text-base-content/60">
                    ₹{selectedPlan.price}/month • Instant activation via Razorpay
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  alert(
                    `Razorpay checkout ready for ${selectedPlan.name} (₹${selectedPlan.price}). Backend integration will be connected next!`
                  );
                }}
                className="btn btn-xs sm:btn-sm btn-primary rounded-lg font-semibold shrink-0 cursor-pointer shadow-xs"
              >
                Proceed to Pay
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing Cards Grid */}
        <PlanCards
          currentPlan={currentPlan}
          isLanding={false}
          onSelectPlan={handleSelectPlan}
        />

        {/* Trust Badges */}
        <div className="mt-14 pt-8 border-t border-base-content/10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-base-content/75 font-medium">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-primary stroke-[2.2]" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-primary stroke-[2.2]" />
            <span>Instant Membership Activation</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-primary stroke-[2.2]" />
            <span>Official Razorpay Gateway</span>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-primary stroke-[2]" />
            <h2 className="text-lg sm:text-xl font-bold text-base-content tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-base-content/15 bg-base-100 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 sm:p-4.5 text-left text-xs sm:text-sm font-semibold text-base-content hover:bg-base-200/50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-base-content/50 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <p className="px-4 sm:px-4.5 pb-4 pt-1 text-xs sm:text-sm text-base-content/75 leading-relaxed border-t border-base-content/10">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
