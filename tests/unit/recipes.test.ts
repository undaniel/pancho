import { describe, it, expect } from '@jest/globals';
import { PIPELINE_RECIPES, PIPELINE_STEPS, pipelineStep } from '../../src/pipelines/catalog';

describe('pipeline recipes', () => {
  it('is not empty', () => {
    expect(PIPELINE_RECIPES.length).toBeGreaterThan(0);
  });

  it('only references known pipeline steps', () => {
    const unknown: string[] = [];
    for (const recipe of PIPELINE_RECIPES) {
      expect(recipe.steps.length).toBeGreaterThan(1);
      for (const step of recipe.steps) {
        if (!pipelineStep(step)) unknown.push(`${recipe.name}: ${step}`);
      }
    }
    expect(unknown).toEqual([]);
  });

  it('has unique recipe names', () => {
    const names = PIPELINE_RECIPES.map(recipe => recipe.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('does not repeat a step inside a recipe', () => {
    const offenders: string[] = [];
    for (const recipe of PIPELINE_RECIPES) {
      if (new Set(recipe.steps).size !== recipe.steps.length) offenders.push(recipe.name);
    }
    expect(offenders).toEqual([]);
  });

  it('has a known command for every step', () => {
    const commands = new Set(PIPELINE_STEPS.map(step => step.command));
    expect(commands.size).toBe(PIPELINE_STEPS.length);
  });
});
