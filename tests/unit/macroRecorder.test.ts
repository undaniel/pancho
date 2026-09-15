import { describe, it, expect } from '@jest/globals';
import { MacroRecorder } from '../../src/macro/recorder';

describe('MacroRecorder', () => {
  it('records steps while recording and returns them on stop', () => {
    const recorder = new MacroRecorder();
    expect(recorder.isRecording()).toBe(false);

    recorder.start();
    expect(recorder.isRecording()).toBe(true);
    recorder.record({ type: 'command', command: 'pancho.toUpperCase' });
    recorder.record({ type: 'insert', text: 'x' });
    expect(recorder.stepCount).toBe(2);

    const steps = recorder.stop();
    expect(steps).toHaveLength(2);
    expect(recorder.isRecording()).toBe(false);
  });

  it('does not record after stop', () => {
    const recorder = new MacroRecorder();
    recorder.start();
    recorder.stop();
    recorder.record({ type: 'command', command: 'pancho.toLowerCase' });
    expect(recorder.stepCount).toBe(0);
  });

  it('suppresses recording during playback to avoid feedback loops', () => {
    const recorder = new MacroRecorder();
    recorder.start();
    recorder.setPlaying(true);
    recorder.record({ type: 'command', command: 'pancho.toUpperCase' });
    expect(recorder.stepCount).toBe(0);
    recorder.setPlaying(false);
    recorder.record({ type: 'command', command: 'pancho.toLowerCase' });
    expect(recorder.stepCount).toBe(1);
  });
});
