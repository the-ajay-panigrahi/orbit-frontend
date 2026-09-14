import { motion } from "motion/react";
import { Check, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Essential networking for community members",
    badge: "Free Forever",
    price: 0,
    period: "/month",
    icon: Sparkles,
    features: [
      "10 daily connection requests",
      "Standard feed discovery",
      "Mutual match connections",
      "Public profile & skill tags",
    ],
    disabledFeatures: ["Direct 1-on-1 chat messaging"],
    isPopular: false,
    ctaText: "Current Plan",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For active builders scaling their network",
    badge: "Most Popular",
    price: 199,
    period: "/month",
    icon: Zap,
    features: [
      "50 daily connection requests",
      "Full 1-on-1 chat with mutual matches",
      "Pro Member profile badge",
    ],
    disabledFeatures: ["Unlimited daily connection requests"],
    isPopular: true,
    ctaText: "Upgrade to Pro",
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Ultimate discovery for founders & power networkers",
    badge: "Ultimate Access",
    price: 499,
    period: "/month",
    icon: Crown,
    features: [
      "Unlimited daily connection requests",
      "Full 1-on-1 chat with mutual matches",
      "Gold Member profile badge",
      "Highlighted profile card in feed",
    ],
    disabledFeatures: [],
    isPopular: false,
    ctaText: "Upgrade to Premium",
  },
];

export default function PlanCards({
  currentPlan = "basic",
  isLanding = false,
  onSelectPlan,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch py-4">
      {PLANS.map((plan) => {
        const Icon = plan.icon;
        const isCurrent = !isLanding && currentPlan === plan.id;
        const isPopular = plan.isPopular;

        return (
          <motion.div
            key={plan.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all ${
              isPopular
                ? "bg-base-100 border-2 border-primary shadow-2xl lg:scale-105 z-10"
                : "bg-base-100/90 border border-base-content/15 shadow-md"
            }`}
          >
            {isPopular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="badge badge-primary text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 shadow-md">
                  Most Popular
                </span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      isPopular
                        ? "bg-primary text-primary-content shadow-xs"
                        : "bg-base-200 text-base-content/80"
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-base-content tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-[11px] text-base-content/60 font-medium">
                      {plan.badge}
                    </p>
                  </div>
                </div>

                {isCurrent && (
                  <span className="badge badge-neutral text-[10px] font-semibold tracking-wide">
                    Active
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-sm font-semibold text-base-content/60 self-start mt-1">
                  ₹
                </span>
                <span className="text-4xl font-black font-mono tracking-tight text-base-content">
                  {plan.price}
                </span>
                <span className="text-xs text-base-content/60 font-medium">
                  {plan.period}
                </span>
              </div>

              <p className="text-xs text-base-content/75 leading-relaxed min-h-8 mb-6">
                {plan.tagline}
              </p>

              <div className="border-t border-base-content/10 pt-5 mb-6">
                <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 mb-3">
                  Included Features
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-xs text-base-content/85 leading-tight"
                    >
                      <Check className="w-4 h-4 text-primary shrink-0 stroke-[2.5]" />
                      <span>{feature}</span>
                    </li>
                  ))}

                  {plan.disabledFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-xs text-base-content/40 line-through leading-tight"
                    >
                      <span className="w-4 h-4 shrink-0 text-center leading-none text-base-content/30 select-none">
                        ✕
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2">
              {isLanding ? (
                <Link
                  to={`/login?mode=signup&plan=${plan.id}`}
                  className={`btn btn-sm sm:btn-md w-full rounded-xl text-xs font-semibold transition-transform active:scale-[0.98] ${
                    isPopular
                      ? "btn-primary shadow-md"
                      : "btn-outline border-base-content/25 hover:bg-base-200 hover:border-base-content/30 text-base-content"
                  }`}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </Link>
              ) : isCurrent ? (
                <button
                  type="button"
                  disabled
                  className="btn btn-sm sm:btn-md w-full rounded-xl text-xs font-semibold btn-ghost bg-base-200/70 text-base-content/50 cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectPlan && onSelectPlan(plan)}
                  className={`btn btn-sm sm:btn-md w-full rounded-xl text-xs font-semibold transition-transform active:scale-[0.98] cursor-pointer ${
                    isPopular
                      ? "btn-primary shadow-md"
                      : "btn-outline border-base-content/25 hover:bg-base-200 text-base-content"
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
