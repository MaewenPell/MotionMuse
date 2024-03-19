import { ToDashboardTimePipe } from './to-dashboard-time.pipe';

describe('ToDashboardTimePipe', () => {
  let pipe: ToDashboardTimePipe;

  beforeEach(() => {
    pipe = new ToDashboardTimePipe();
  });

  it('create an instance', () => {
    const pipe = new ToDashboardTimePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return "< 1H" when value is less than 3600', () => {
    expect(pipe.transform(3599)).toBe('< 1');
  });

  it('should return the number of hours when value is 3600 or more', () => {
    expect(pipe.transform(3600)).toBe('1');
    expect(pipe.transform(7200)).toBe('2');
  });

  it('should return the absolute value with a negative sign when value is negative', () => {
    expect(pipe.transform(-3599)).toBe('< 1');
    expect(pipe.transform(-3600)).toBe('-1');
    expect(pipe.transform(-7200)).toBe('-2');
  });
});
