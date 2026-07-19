import { describe, expect, it } from 'vitest';
import { getRenderValue } from '../src/components/MTableCell/cellUtils';

describe('groupRender with falsy values', () => {
  const groupRender = (value) => (value ? 'yes' : 'no');

  it('calls groupRender for false', () => {
    expect(getRenderValue({ columnDef: { groupRender }, value: false })).toBe(
      'no'
    );
  });

  it('calls groupRender for 0', () => {
    expect(getRenderValue({ columnDef: { groupRender }, value: 0 })).toBe('no');
  });

  it('still skips groupRender for null/undefined', () => {
    expect(getRenderValue({ columnDef: { groupRender }, value: null })).toBe(
      null
    );
    expect(
      getRenderValue({ columnDef: { groupRender }, value: undefined })
    ).toBe(undefined);
  });
});
