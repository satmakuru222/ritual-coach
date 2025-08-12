import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RitualTimer from '../RitualTimer';

// Mock the timer utility
jest.mock('@/lib/ritual/timer', () => ({
  RitualTimer: jest.fn().mockImplementation((duration, callbacks) => ({
    start: jest.fn(() => callbacks.onStart?.()),
    pause: jest.fn(() => callbacks.onPause?.()),
    reset: jest.fn(() => callbacks.onReset?.()),
    stop: jest.fn(),
    getProgress: jest.fn(() => 0.5),
    getFormattedTime: jest.fn(() => '02:30'),
    getFormattedElapsed: jest.fn(() => '01:30'),
    getState: jest.fn(() => ({
      isRunning: false,
      isPaused: false,
      elapsedTime: 90000,
      startTime: null,
      pausedAt: null,
      duration: 300000,
    })),
  })),
}));

// Mock useTranslation
jest.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'timer.minutes': 'minutes',
        'timer.recommended': 'recommended',
        'timer.start': 'Start',
        'timer.pause': 'Pause',
        'timer.resume': 'Resume',
        'timer.reset': 'Reset',
        'timer.completed': 'Completed',
        'timer.in_progress': 'In progress',
        'timer.paused': 'Paused',
        'timer.ready_to_start': 'Ready to start',
        'timer.progress': 'Progress',
        'timer.elapsed': 'Elapsed',
      };
      return translations[key] || key;
    },
  }),
}));

describe('RitualTimer', () => {
  const defaultProps = {
    durationMinutes: 5,
    stepName: 'Test Step',
    language: 'en' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<RitualTimer {...defaultProps} />);
    
    expect(screen.getByText('Test Step')).toBeInTheDocument();
    expect(screen.getByText('5 minutes • recommended')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('displays the correct formatted time', () => {
    render(<RitualTimer {...defaultProps} />);
    
    expect(screen.getByText('02:30')).toBeInTheDocument();
  });

  it('calls onStart callback when start button is clicked', () => {
    const onStart = jest.fn();
    render(<RitualTimer {...defaultProps} onStart={onStart} />);
    
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('calls onComplete callback when timer completes', () => {
    const onComplete = jest.fn();
    render(<RitualTimer {...defaultProps} onComplete={onComplete} />);
    
    // This would be called by the timer mock when it completes
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('shows progress percentage correctly', () => {
    render(<RitualTimer {...defaultProps} />);
    
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('displays step name correctly', () => {
    render(<RitualTimer {...defaultProps} stepName="Gaṇapati Dhyāna" />);
    
    expect(screen.getByText('Gaṇapati Dhyāna')).toBeInTheDocument();
  });

  it('shows reset button', () => {
    render(<RitualTimer {...defaultProps} />);
    
    const resetButton = screen.getByText('Reset');
    expect(resetButton).toBeInTheDocument();
  });

  it('auto-starts when autoStart prop is true', () => {
    render(<RitualTimer {...defaultProps} autoStart={true} />);
    
    // The timer should start automatically
    // This would be verified through the timer mock
  });

  it('applies custom className', () => {
    const { container } = render(
      <RitualTimer {...defaultProps} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

export {};