/**@type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        "@pro-manage/common-interfaces": "<rootDir>/../../libs/common-interfaces/src/index.ts"
    }
};