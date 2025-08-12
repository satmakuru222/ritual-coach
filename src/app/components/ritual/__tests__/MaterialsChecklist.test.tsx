import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MaterialsChecklist from '../MaterialsChecklist';

// Mock useTranslation
jest.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'materials.title': 'Materials Needed',
        'materials.none_required': 'No materials required',
        'materials.check_all': 'Check All',
        'materials.uncheck_all': 'Uncheck All',
        'materials.progress': 'Progress',
        'materials.all_ready': 'All materials ready!',
        'materials.gather_remaining': 'Please gather remaining items',
        'materials.tips_title': 'Tips',
        'materials.tip_1': 'Gather all materials before starting',
        'materials.tip_2': 'Keep them organized and clean',
        'materials.tip_3': 'Check quality of perishable items',
      };
      return translations[key] || key;
    },
  }),
}));

describe('MaterialsChecklist', () => {
  const mockMaterials = [
    'flowers',
    'incense sticks',
    'oil lamp',
    'kumkum',
    'water',
  ];

  const defaultProps = {
    materials: mockMaterials,
    language: 'en' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with materials', () => {
    render(<MaterialsChecklist {...defaultProps} />);
    
    expect(screen.getByText('Materials Needed')).toBeInTheDocument();
    expect(screen.getByText('flowers')).toBeInTheDocument();
    expect(screen.getByText('incense sticks')).toBeInTheDocument();
    expect(screen.getByText('oil lamp')).toBeInTheDocument();
  });

  it('renders empty state when no materials', () => {
    render(<MaterialsChecklist {...defaultProps} materials={[]} />);
    
    expect(screen.getByText('No materials required')).toBeInTheDocument();
  });

  it('shows correct progress initially', () => {
    render(<MaterialsChecklist {...defaultProps} />);
    
    expect(screen.getByText('0/5 (0%)')).toBeInTheDocument();
  });

  it('updates progress when items are checked', () => {
    render(<MaterialsChecklist {...defaultProps} />);
    
    const flowersCheckbox = screen.getByText('flowers').closest('button');
    expect(flowersCheckbox).toBeInTheDocument();
    
    if (flowersCheckbox) {
      fireEvent.click(flowersCheckbox);
      expect(screen.getByText('1/5 (20%)')).toBeInTheDocument();
    }
  });

  it('calls onMaterialToggle when item is clicked', () => {
    const onMaterialToggle = jest.fn();
    render(<MaterialsChecklist {...defaultProps} onMaterialToggle={onMaterialToggle} />);
    
    const flowersCheckbox = screen.getByText('flowers').closest('button');
    if (flowersCheckbox) {
      fireEvent.click(flowersCheckbox);
      expect(onMaterialToggle).toHaveBeenCalledWith('flowers', true);
    }
  });

  it('calls onAllChecked when all items are checked', () => {
    const onAllChecked = jest.fn();
    render(<MaterialsChecklist {...defaultProps} onAllChecked={onAllChecked} />);
    
    // Check all materials one by one
    mockMaterials.forEach(material => {
      const checkbox = screen.getByText(material).closest('button');
      if (checkbox) {
        fireEvent.click(checkbox);
      }
    });
    
    expect(onAllChecked).toHaveBeenCalledTimes(1);
  });

  it('toggles all items when check all button is clicked', () => {
    const onMaterialToggle = jest.fn();
    render(<MaterialsChecklist {...defaultProps} onMaterialToggle={onMaterialToggle} />);
    
    const checkAllButton = screen.getByText('Check All');
    fireEvent.click(checkAllButton);
    
    // Should call onMaterialToggle for each material
    expect(onMaterialToggle).toHaveBeenCalledTimes(mockMaterials.length);
    mockMaterials.forEach(material => {
      expect(onMaterialToggle).toHaveBeenCalledWith(material, true);
    });
  });

  it('shows completion status correctly', () => {
    render(<MaterialsChecklist {...defaultProps} />);
    
    // Initially should show gather remaining message
    expect(screen.getByText('Please gather remaining items')).toBeInTheDocument();
    
    // Check all items
    mockMaterials.forEach(material => {
      const checkbox = screen.getByText(material).closest('button');
      if (checkbox) {
        fireEvent.click(checkbox);
      }
    });
    
    // Should show all ready message
    expect(screen.getByText('All materials ready!')).toBeInTheDocument();
  });

  it('shows tips when not all materials are checked', () => {
    render(<MaterialsChecklist {...defaultProps} />);
    
    expect(screen.getByText('Tips')).toBeInTheDocument();
    expect(screen.getByText('Gather all materials before starting')).toBeInTheDocument();
  });

  it('hides tips when all materials are checked', () => {
    render(<MaterialsChecklist {...defaultProps} />);
    
    // Check all materials
    mockMaterials.forEach(material => {
      const checkbox = screen.getByText(material).closest('button');
      if (checkbox) {
        fireEvent.click(checkbox);
      }
    });
    
    expect(screen.queryByText('Tips')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MaterialsChecklist {...defaultProps} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('changes button text from check all to uncheck all', () => {
    render(<MaterialsChecklist {...defaultProps} />);
    
    const toggleButton = screen.getByText('Check All');
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Uncheck All')).toBeInTheDocument();
  });

  it('shows correct progress bar styling when completed', () => {
    render(<MaterialsChecklist {...defaultProps} />);
    
    // Check all materials
    mockMaterials.forEach(material => {
      const checkbox = screen.getByText(material).closest('button');
      if (checkbox) {
        fireEvent.click(checkbox);
      }
    });
    
    const progressBar = document.querySelector('.bg-green-500');
    expect(progressBar).toBeInTheDocument();
  });
});

export {};