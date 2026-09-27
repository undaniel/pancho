import { describe, it, expect } from '@jest/globals';
import { runPipelineSteps, PipelineStep, PIPELINE_STEPS, pipelineStep } from '../../src/pipelines/catalog';
import { parsePipelines } from '../../src/pipelines/store';
import { Commands } from '../../src/commands/registry';

const upper: PipelineStep = { command: 'x.upper', label: 'Upper', transform: text => text.toUpperCase() };
const exclaim: PipelineStep = { command: 'x.exclaim', label: 'Exclaim', transform: text => `${text}!` };
const boom: PipelineStep = { command: 'x.boom', label: 'Boom', transform: () => ({ result: '', error: 'boom' }) };

describe('runPipelineSteps', () => {
  it('applies steps in order', () => {
    expect(runPipelineSteps('hi', [upper, exclaim]).result).toBe('HI!');
  });

  it('stops and reports the failing step', () => {
    const run = runPipelineSteps('hi', [upper, boom, exclaim]);
    expect(run.failedAt).toBe('x.boom');
    expect(run.error).toBe('boom');
    expect(run.result).toBe('HI');
  });

  it('exposes a coherent catalog', () => {
    const ids = PIPELINE_STEPS.map(step => step.command);
    expect(new Set(ids).size).toBe(ids.length);
    expect(PIPELINE_STEPS.every(step => pipelineStep(step.command) === step)).toBe(true);
  });

  it('only references registered commands', () => {
    const registered = new Set<string>(Object.values(Commands));
    const unknown = PIPELINE_STEPS.filter(step => !registered.has(step.command)).map(step => step.command);
    expect(unknown).toEqual([]);
  });
});

describe('parsePipelines', () => {
  it('parses a valid payload', () => {
    expect(parsePipelines('[{"name":"a","steps":["pancho.trimLines"]}]')).toEqual([
      { name: 'a', steps: ['pancho.trimLines'] },
    ]);
  });

  it('rejects invalid payloads', () => {
    expect(parsePipelines('not json')).toBeUndefined();
    expect(parsePipelines('{"name":"a"}')).toBeUndefined();
    expect(parsePipelines('[{"name":"a","steps":[1]}]')).toEqual([]);
  });
});
