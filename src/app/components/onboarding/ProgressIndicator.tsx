'use client';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const stepLabels = [
    'Region',
    'Tradition', 
    'Language',
    'Schedule',
    'Complete'
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              {/* Step Circle */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                ${index <= currentStep 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Step Label */}
              <div className="ml-2 hidden sm:block">
                <div className={`text-sm font-medium ${
                  index <= currentStep ? 'text-orange-600' : 'text-gray-400'
                }`}>
                  {stepLabels[index]}
                </div>
              </div>

              {/* Connector Line */}
              {index < totalSteps - 1 && (
                <div className={`
                  mx-4 h-0.5 w-16 sm:w-24 transition-colors
                  ${index < currentStep ? 'bg-orange-500' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Mobile step label */}
        <div className="sm:hidden mt-3 text-center">
          <div className="text-sm font-medium text-orange-600">
            {stepLabels[currentStep]}
          </div>
        </div>
      </div>
    </div>
  );
}