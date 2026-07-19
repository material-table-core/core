/**
 */
import React, { act } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { useDoubleClick } from '../src/utils/hooks/useDoubleClick';

vi.useFakeTimers();

describe('useDouble click', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  test('handles single-click', async () => {
    const clickMock = vi.fn();
    const { getByTestId } = render(<TestComponent onRowClick={clickMock} />);
    expect(clickMock).not.toHaveBeenCalled();
    act(() => {
      fireEvent.click(getByTestId('test-component'));
    });
    // Uncomment this to make the test pass
    // await timeout();
    expect(clickMock).toHaveBeenCalled();
  });
  test('handles double-click when user clicks twice instantly', async () => {
    const clickMock = vi.fn();
    const doubleClickMock = vi.fn();
    const { getByTestId } = render(
      <TestComponent
        onRowClick={clickMock}
        onRowDoubleClick={doubleClickMock}
      />
    );
    expect(clickMock).not.toHaveBeenCalled();
    expect(doubleClickMock).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(getByTestId('test-component'));
    });
    act(() => {
      fireEvent.click(getByTestId('test-component'));
    });
    expect(doubleClickMock).toHaveBeenCalled();
  });
  test('handles double-click when user clicks twice within the interval', async () => {
    const clickMock = vi.fn();
    const doubleClickMock = vi.fn();
    const { getByTestId } = render(
      <TestComponent
        onRowClick={clickMock}
        onRowDoubleClick={doubleClickMock}
      />
    );
    expect(clickMock).not.toHaveBeenCalled();
    expect(doubleClickMock).not.toHaveBeenCalled();
    act(() => {
      fireEvent.click(getByTestId('test-component'));
    });
    vi.advanceTimersByTime(50);
    act(() => {
      fireEvent.click(getByTestId('test-component'));
    });
    expect(doubleClickMock).toHaveBeenCalled();
  });

  test('calls single-click twice if user clicks twice outside of the interval', async () => {
    const clickMock = vi.fn();
    const doubleClickMock = vi.fn();
    const { getByTestId } = render(
      <TestComponent
        onRowClick={clickMock}
        onRowDoubleClick={doubleClickMock}
      />
    );
    expect(clickMock).not.toHaveBeenCalled();
    expect(doubleClickMock).not.toHaveBeenCalled();
    act(() => {
      fireEvent.click(getByTestId('test-component'));
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    act(() => {
      fireEvent.click(getByTestId('test-component'));
    });
    expect(doubleClickMock).not.toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(clickMock).toHaveBeenCalledTimes(2);
  });
});

function TestComponent({ onRowClick, onRowDoubleClick }) {
  const handleOnRowClick = useDoubleClick(onRowClick, onRowDoubleClick);
  return (
    <button data-testid="test-component" onClick={handleOnRowClick}>
      click
    </button>
  );
}
