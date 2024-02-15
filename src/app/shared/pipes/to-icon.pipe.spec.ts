import { PrimeIcons } from 'primeng/api';
import { ToIconPipe } from './to-icon.pipe';

describe('ToIconPipe', () => {
  let pipe: ToIconPipe;

  beforeEach(() => {
    pipe = new ToIconPipe();
  });

  it('create an instance', () => {
    const pipe = new ToIconPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return CHECK for "resume"', () => {
    expect(pipe.transform('resume')).toEqual(PrimeIcons.CHECK);
  });

  it('should return CHART_LINE for "evolution"', () => {
    expect(pipe.transform('evolution')).toEqual(PrimeIcons.CHART_LINE);
  });

  it('should return ARROW_UP for "up"', () => {
    expect(pipe.transform('up')).toEqual(PrimeIcons.ARROW_UP);
  });

  it('should return ARROW_DOWN for "down"', () => {
    expect(pipe.transform('down')).toEqual(PrimeIcons.ARROW_DOWN);
  });

  it('should return ARROW_RIGHT for "equal"', () => {
    expect(pipe.transform('equal')).toEqual(PrimeIcons.ARROW_RIGHT);
  });
});
