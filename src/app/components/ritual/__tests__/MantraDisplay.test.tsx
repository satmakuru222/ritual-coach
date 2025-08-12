import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MantraDisplay from '../MantraDisplay';
import { MantraText } from '@/types';

// Mock useTranslation
jest.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'mantra.pause': 'Pause',
        'mantra.play': 'Play',
        'mantra.copy': 'Copy',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

describe('MantraDisplay', () => {
  const mockMantraText: MantraText = {
    te: 'ॐ గం గణపతయే నమః',
    hi: 'ॐ गं गणपतये नमः',
    en: 'Om Gam Ganapataye Namaha - Salutations to Lord Ganesh',
    iast: 'Oṁ gaṁ gaṇapataye namaḥ',
  };

  const defaultProps = {
    mantraId: 'test-mantra',
    title: 'Test Mantra',
    text: mockMantraText,
    language: 'en' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<MantraDisplay {...defaultProps} />);
    
    expect(screen.getByText('Test Mantra')).toBeInTheDocument();
    expect(screen.getByText('Om Gam Ganapataye Namaha - Salutations to Lord Ganesh')).toBeInTheDocument();
  });

  it('displays all script selector buttons', () => {
    render(<MantraDisplay {...defaultProps} />);
    
    expect(screen.getByText('తెలుగు')).toBeInTheDocument();
    expect(screen.getByText('हिन्दी')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('IAST')).toBeInTheDocument();
  });

  it('switches script when button is clicked', () => {
    render(<MantraDisplay {...defaultProps} />);
    
    const teluguButton = screen.getByText('తెలుగు');
    fireEvent.click(teluguButton);
    
    expect(screen.getByText('ॐ గం గణపతయే నమః')).toBeInTheDocument();
  });

  it('shows pronunciation guide for Sanskrit scripts', () => {
    render(<MantraDisplay {...defaultProps} />);
    
    const teluguButton = screen.getByText('తెలుగు');
    fireEvent.click(teluguButton);
    
    expect(screen.getByText('Pronunciation:')).toBeInTheDocument();
    expect(screen.getByText('Oṁ gaṁ gaṇapataye namaḥ')).toBeInTheDocument();
  });

  it('shows English meaning for non-English scripts', () => {
    render(<MantraDisplay {...defaultProps} />);
    
    const hindiButton = screen.getByText('हिन्दी');
    fireEvent.click(hindiButton);
    
    expect(screen.getByText('Meaning:')).toBeInTheDocument();
    expect(screen.getByText('Om Gam Ganapataye Namaha - Salutations to Lord Ganesh')).toBeInTheDocument();
  });

  it('copies text to clipboard when copy button is clicked', async () => {
    render(<MantraDisplay {...defaultProps} />);
    
    const copyButton = screen.getByTitle('Copy');
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'Om Gam Ganapataye Namaha - Salutations to Lord Ganesh'
    );
  });

  it('handles play/pause button clicks', () => {
    render(<MantraDisplay {...defaultProps} />);
    
    const playButton = screen.getByTitle('Play');
    fireEvent.click(playButton);
    
    // After clicking, it should show pause button
    expect(screen.getByTitle('Pause')).toBeInTheDocument();
  });

  it('calls onScriptChange callback when script changes', () => {
    const onScriptChange = jest.fn();
    render(<MantraDisplay {...defaultProps} onScriptChange={onScriptChange} />);
    
    const iaστButton = screen.getByText('IAST');
    fireEvent.click(iaστButton);
    
    expect(onScriptChange).toHaveBeenCalledWith('iast');
  });

  it('applies custom className', () => {
    const { container } = render(
      <MantraDisplay {...defaultProps} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles missing text gracefully', () => {
    const incompleteText = {
      te: '',
      hi: '',
      en: 'Only English available',
      iast: '',
    };
    
    render(<MantraDisplay {...defaultProps} text={incompleteText} />);
    
    expect(screen.getByText('Only English available')).toBeInTheDocument();
  });

  it('shows appropriate font classes for different scripts', () => {
    render(<MantraDisplay {...defaultProps} />);
    
    // Switch to Telugu
    const teluguButton = screen.getByText('తెలుగు');
    fireEvent.click(teluguButton);
    
    const mantraText = screen.getByText('ॐ గం గణపతయే నమః');
    expect(mantraText).toHaveClass('font-telugu', 'text-2xl');
  });
});

export {};