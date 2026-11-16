'use client';

import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const BookingSteps = () => {
  const { currentStep, goToStep } = useBooking();
  const { t, tr } = useLanguage();

  const steps = [
    { id: 1, title: t('booking.stepService') },
    { id: 2, title: t('booking.stepDetails') },
    { id: 3, title: t('booking.stepPassengers') },
    { id: 4, title: t('booking.stepContact') },
    { id: 5, title: t('booking.stepConfirm') },
  ];

  const canGo = (id) => id <= currentStep;
  const current = steps.find((s) => s.id === currentStep);

  return (
    <nav aria-label={tr('Langkah booking', 'Booking steps')} className="w-full">
      {/* Mobile: one label and a segmented bar */}
      <div className="md:hidden">
        <p className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
          {tr('Langkah', 'Step')} {currentStep} {tr('dari', 'of')} {steps.length}
          <span className="text-gray-900 dark:text-white font-medium"> · {current?.title}</span>
        </p>
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => canGo(step.id) && goToStep(step.id)}
              disabled={!canGo(step.id)}
              aria-label={step.title}
              aria-current={step.id === currentStep ? 'step' : undefined}
              className={`h-1.5 rounded-full transition-colors ${
                step.id < currentStep
                  ? 'bg-[#1a4d3e] dark:bg-[#4ade80]'
                  : step.id === currentStep
                    ? 'bg-[#c4935f]'
                    : 'bg-gray-200 dark:bg-dark-green-800'
              } ${canGo(step.id) ? 'cursor-pointer' : 'cursor-default'}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: numbered markers joined by a line */}
      <ol className="hidden md:grid grid-cols-5">
        {steps.map((step, index) => {
          const done = step.id < currentStep;
          const active = step.id === currentStep;
          return (
            <li key={step.id} className="min-w-0">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => canGo(step.id) && goToStep(step.id)}
                  disabled={!canGo(step.id)}
                  aria-current={active ? 'step' : undefined}
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm tabular-nums transition-colors ${
                    done
                      ? 'bg-[#1a4d3e] dark:bg-[#4ade80] text-white dark:text-gray-900 cursor-pointer'
                      : active
                        ? 'border border-[#1a4d3e] dark:border-[#4ade80] text-[#1a4d3e] dark:text-[#4ade80] font-semibold'
                        : 'border border-gray-300 dark:border-dark-green-700 text-gray-400 dark:text-gray-500 cursor-default'
                  }`}
                >
                  {done ? <CheckIcon /> : step.id}
                </button>
                {index < steps.length - 1 && (
                  <span className={`flex-1 h-px mx-3 transition-colors ${done ? 'bg-[#1a4d3e] dark:bg-[#4ade80]' : 'bg-gray-200 dark:bg-dark-green-800'}`} />
                )}
              </div>
              <span className={`mt-3 block text-sm truncate ${
                active ? 'text-gray-900 dark:text-white font-medium' : done ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BookingSteps;
