"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import app from '../../app';  // Adjust the path to your `app` file if necessary
// const api = request(app);
const sampleFunction = (name) => {
    return name;
};
describe('Sample Operations', () => {
    let sampleName = "john doe";
    test('returns sample name', () => {
        const result = sampleFunction(sampleName);
        expect(result).toBe(sampleName); // Jest uses `expect` for assertions
    });
});
