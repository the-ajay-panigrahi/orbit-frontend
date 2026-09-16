import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { MessageSquare, Sparkles, Check, ArrowRight, ArrowLeft } from "lucide-react";

const perks = [
  "Unlimited 1-on-1 direct messaging with verified connections",
  "Real-time typing feedback & read receipts",
  "Direct tech stack & project collaboration channels",
  "Priority response visibility and founder networking",
];

export default function ChatUpgradeGate() {
  return (
    <div className="flex-1 w-full max-w-xl mx-auto p-4 sm:p-6 my-auto flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="w-full bg-base-100/90 backdrop-blur-md border border-base-content/12 rounded-3xl p-6 sm:p-8 shadow-xl text-center flex flex-col items-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 shadow-xs">
          <MessageSquare className="w-7 h-7 stroke-[2.2]" />
        </div>

        <span className="badge badge-sm badge-primary font-mono text-[11px] font-bold uppercase tracking-wider mb-2">
          Pro & Premium Exclusive
        </span>

        <h2 className="text-2xl font-bold text-base-content tracking-tight mb-2">
          Unlock Orbit 1-on-1 Chat
        </h2>

        <p className="text-sm text-base-content/65 max-w-md leading-relaxed mb-6">
          Direct messaging is reserved for Pro and Premium members to protect high-intent discussions between serious builders, CTOs, and founders.
        </p>

        <div className="w-full bg-base-200/60 rounded-2xl p-4 sm:p-5 border border-base-content/8 mb-6 text-left space-y-3">
          {perks.map((perk) => (
            <div key={perk} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm text-base-content/80 font-medium">
                {perk}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            to="/premium"
            className="btn btn-primary w-full sm:flex-1 rounded-xl gap-2 font-semibold shadow-md"
          >
            <Sparkles className="w-4 h-4 stroke-[2.2]" />
            <span>Upgrade to Pro</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/connections"
            className="btn btn-ghost w-full sm:w-auto rounded-xl gap-2 text-xs font-medium text-base-content/60 hover:text-base-content"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Network</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
