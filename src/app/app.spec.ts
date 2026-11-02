import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('should define App root component', () => {
    expect(App).toBeDefined();
  });
});
