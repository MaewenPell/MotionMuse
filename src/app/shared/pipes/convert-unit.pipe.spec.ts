import { ConvertUnitPipe } from './convert-unit.pipe';

describe('ConvertUnitPipe', () => {
  it('create an instance', () => {
    const pipe = new ConvertUnitPipe();
    expect(pipe).toBeTruthy();
  });

  it('should convert from m to km', () => {
    const pipe = new ConvertUnitPipe();
    expect(pipe.transform(1000, 'm', 'km')).toBe(1);
  });

  it('should convert from km to m', () => {
    const pipe = new ConvertUnitPipe();
    expect(pipe.transform(1, 'km', 'm')).toBe(1000);
  });
});
