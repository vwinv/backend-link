import {
  PUSH_PROGRAM_BODIES,
  WEDNESDAY_ROTATION,
  familyForMessage,
  getPushProgramBody,
  priorityForFamily,
} from './push-program.catalog';

describe('push-program.catalog', () => {
  it('contient les 20 messages du PDF', () => {
    for (let n = 1; n <= 20; n += 1) {
      expect(getPushProgramBody(n)?.length).toBeGreaterThan(10);
      expect(PUSH_PROGRAM_BODIES[n]).toBeDefined();
    }
  });

  it('respecte les priorités par famille', () => {
    expect(priorityForFamily('view')).toBe(1);
    expect(priorityForFamily('inactivity')).toBe(2);
    expect(priorityForFamily('onboarding')).toBe(3);
    expect(priorityForFamily('calendar')).toBe(4);
  });

  it('mappe les familles correctement', () => {
    expect(familyForMessage(20)).toBe('view');
    expect(familyForMessage(6)).toBe('inactivity');
    expect(familyForMessage(11)).toBe('onboarding');
    expect(familyForMessage(16)).toBe('calendar');
  });

  it('définit la rotation mercredi', () => {
    expect([...WEDNESDAY_ROTATION]).toEqual([7, 8, 9, 10, 19]);
  });

  it('garde le texte exact du N°20', () => {
    expect(getPushProgramBody(20)).toBe(
      'Quelqu’un a regardé ta carte… Le suspense est insoutenable. Viens voir 👀',
    );
  });
});
