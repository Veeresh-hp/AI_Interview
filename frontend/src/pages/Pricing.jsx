import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const tiers = [
    {
      name: 'Starter',
      price: '0',
      description: 'Perfect for exploring our AI features.',
      features: [
        '1 Resume build per month',
        '2 Mock interviews',
        'Standard templates',
        'Email support'
      ],
      buttonText: 'Get Started',
      accent: false
    },
    {
      name: 'Pro',
      price: '19',
      description: 'The complete toolkit for serious job seekers.',
      features: [
        'Unlimited Resume builds',
        'Unlimited Mock interviews',
        'Premium AI feedback',
        'Custom template styling',
        'Priority support'
      ],
      buttonText: 'Upgrade to Pro',
      accent: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions for universities and teams.',
      features: [
        'Bulk user management',
        'Custom school branding',
        'Advanced analytics',
        'Dedicated success manager'
      ],
      buttonText: 'Contact Sales',
      accent: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 font-medium"
          >
            Choose the plan that's right for your career stage.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {tiers.map((tier, idx) => (
            <motion.div 
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
              className={`p-8 rounded-3xl border bg-white shadow-sm flex flex-col h-full hover:shadow-xl transition-all duration-300 ${tier.accent ? 'border-[#0ea5e9] ring-1 ring-[#0ea5e9]' : 'border-slate-200'}`}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">${tier.price}</span>
                  {tier.price !== 'Custom' && <span className="text-slate-500 font-medium">/mo</span>}
                </div>
                <p className="text-slate-500 text-sm mt-4 font-medium leading-relaxed">{tier.description}</p>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {tier.features.map(feature => (
                  <div key={feature} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <svg className={`w-5 h-5 flex-shrink-0 ${tier.accent ? 'text-[#0ea5e9]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>

              <Link 
                to="/auth" 
                className={`w-full py-4 rounded-xl text-center font-bold text-sm transition-all shadow-md hover:shadow-lg ${tier.accent ? 'bg-[#0ea5e9] text-white hover:bg-[#0284c7]' : 'bg-[#111] text-white hover:bg-black'}`}
              >
                {tier.buttonText}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link to="/" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center justify-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
