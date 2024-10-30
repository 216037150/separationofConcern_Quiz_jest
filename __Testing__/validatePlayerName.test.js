import {validatePlayerName} from "../UtilFiles/validatePlayerName.js";
import jest from 'jest-mock';

describe('playerName validation', () => {
    beforeEach(() => {
        global.alert = jest.fn();
    });

    test('should alert "Please enter your name" if input is empty', () => {
        const playerName = '';
        expect(() => {
            validatePlayerName(playerName);
        }).toThrow('Please enter your name');
        expect(alert).toHaveBeenCalledWith('Please enter your name');
    });

    test('should alert "Please enter your name" if input is whitespace', () => {
        const playerName = '   ';
        expect(() => {
            validatePlayerName(playerName);
        }).toThrow('Please enter your name');
        expect(alert).toHaveBeenCalledWith('Please enter your name');
    });

    test('should alert "Invalid input: Please enter a valid name, not a number." if input is a number', () => {
        const playerName = '135';
        expect(() => {
            validatePlayerName(playerName);
        }).toThrow('Invalid input: Please enter a valid name, not a number.');
        expect(alert).toHaveBeenCalledWith('Invalid input: Please enter a valid name, not a number.');
    });

    test('should alert "Invalid input: Please do not use special characters." ', () => {
        const playerName = '@!';
        expect(() => {
            validatePlayerName(playerName);
        }).toThrow('Invalid input: Please do not use special characters.');
        expect(alert).toHaveBeenCalledWith('Invalid input: Please do not use special characters.');
    });

    test('should not throw an error if input is a valid name', () => {
        const playerName = 'Siya';
        expect(() => {
            validatePlayerName(playerName);
        }).not.toThrow();
        expect(alert).not.toHaveBeenCalled();
    });
});