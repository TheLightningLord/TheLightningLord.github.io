import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    question: "What is your current fitness level?",
    options: ["Beginner", "Intermediate", "Advanced"]
  },
  {
    question: "What are your primary goals?",
    options: ["Weight Loss", "Muscle Gain", "Improved Mobility", "General Wellness"]
  },
  {
    question: "How many days a week can you commit?",
    options: ["1-2 days", "3-4 days", "5+ days"]
  }
];

export default function ProgramWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(Array(steps.length).fill(null));
  const [recommendation, setRecommendation] = useState(null);

  const selectOption = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = option;
    setAnswers(newAnswers);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate a sample recommendation based on answers
      setRecommendation("Based on your responses, we recommend our 'Balanced Wellness Program' which focuses on gentle exercises, mobility training, and nutritional guidance tailored for your lifestyle.");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setAnswers(Array(steps.length).fill(null));
    setRecommendation(null);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      {!recommendation && (
        <>
          <h2>Find Your Ideal Program</h2>
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <p>{steps[currentStep].question}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {steps[currentStep].options.map((option) => (
                  <button 
                    key={option} 
                    onClick={() => selectOption(option)}
                    style={{
                      backgroundColor: answers[currentStep] === option ? '#0070f3' : '#eee',
                      color: answers[currentStep] === option ? '#fff' : '#333',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={prevStep} disabled={currentStep === 0}>Previous</button>
            <button onClick={nextStep} disabled={!answers[currentStep]}>Next</button>
          </div>
        </>
      )}
      {recommendation && (
        <div>
          <h2>Your Recommended Program</h2>
          <p>{recommendation}</p>
          <button onClick={resetWizard}>Start Over</button>
        </div>
      )}
    </div>
  );
}
