import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DashboardGrid } from '@/components/dashboard/dashboard-grid';

const mockLayouts = [
  {
    id: 'widget1',
    title: 'Widget 1',
    width: 'half',
    height: 'medium',
    visible: true,
    component: <div>Widget 1 Content</div>
  },
  {
    id: 'widget2',
    title: 'Widget 2',
    width: 'half',
    height: 'medium',
    visible: true,
    component: <div>Widget 2 Content</div>
  }
];

const renderWithDnd = (component: React.ReactElement) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      {component}
    </DndProvider>
  );
};

describe('DashboardGrid', () => {
  it('renders all visible widgets', () => {
    renderWithDnd(<DashboardGrid layouts={mockLayouts} />);
    
    expect(screen.getByText('Widget 1')).toBeInTheDocument();
    expect(screen.getByText('Widget 2')).toBeInTheDocument();
    expect(screen.getByText('Widget 1 Content')).toBeInTheDocument();
    expect(screen.getByText('Widget 2 Content')).toBeInTheDocument();
  });

  it('applies correct width classes', () => {
    renderWithDnd(<DashboardGrid layouts={mockLayouts} />);
    
    const widgets = screen.getAllByTestId('draggable-widget');
    expect(widgets[0]).toHaveClass('col-span-12 md:col-span-6');
    expect(widgets[1]).toHaveClass('col-span-12 md:col-span-6');
  });

  it('handles layout changes correctly', () => {
    const onLayoutChange = jest.fn();
    renderWithDnd(
      <DashboardGrid 
        layouts={mockLayouts} 
        onLayoutChange={onLayoutChange} 
      />
    );

    const widget = screen.getByText('Widget 1').closest('[draggable="true"]');
    if (widget) {
      fireEvent.dragStart(widget);
      fireEvent.dragOver(screen.getByText('Widget 2'));
      fireEvent.drop(screen.getByText('Widget 2'));
    }

    expect(onLayoutChange).toHaveBeenCalled();
  });

  it('handles loading state correctly', () => {
    renderWithDnd(<DashboardGrid layouts={mockLayouts} loading />);
    expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument();
  });

  it('filters out invisible widgets', () => {
    const layoutsWithHidden = [
      ...mockLayouts,
      {
        id: 'widget3',
        title: 'Hidden Widget',
        width: 'half',
        height: 'medium',
        visible: false,
        component: <div>Hidden Content</div>
      }
    ];

    renderWithDnd(<DashboardGrid layouts={layoutsWithHidden} />);
    
    expect(screen.queryByText('Hidden Widget')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });
});