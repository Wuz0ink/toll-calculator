import {describe, it, expect} from 'vitest'
import {calculateToll} from './toll-calculator.js'


describe('calculateToll', () => {
    it('single passage at 07:00 -> 18 SEK', () => {
        const result = calculateToll('Truck', [new Date('2026-06-12 07:00')])
        expect(result).toBe(18)
    })

    it('passage saturday -> 0 SEK', () => {
        const result = calculateToll('Car', [new Date('2026-06-13 07:00')])
        expect(result).toBe(0)
    })

    it('passage sunday -> 0 SEK', () => {
        const result = calculateToll('Car', [new Date('2026-06-14 07:00')])
        expect(result).toBe(0)
    })

    it('passage on public holiday -> 0 SEK', () => {
        const result = calculateToll('Car', [new Date('2026-04-06 07:00')])
        expect(result).toBe(0)
    })

    it('passage with toll free vehicle -> 0 SEK', () => {
        const result = calculateToll('Motorbike', [new Date('2026-06-12 07:00')])
        expect(result).toBe(0)
    })

    it('two passages at 07:00 and 07:59 -> 18 SEK', () => {
        const result = calculateToll('Truck', [new Date('2026-06-12 07:00'), new Date('2026-06-12 07:59')])
        expect(result).toBe(18)
    })

    it('two passages at 07:00 and 08:00 -> 31 SEK', () => {
        const result = calculateToll('Van', [new Date('2026-06-12 07:00'), new Date('2026-06-12 08:00')])
        expect(result).toBe(31)
    })

    it('two passages at 07:00 and 08:01 -> 31 SEK', () => {
        const result = calculateToll('Car', [new Date('2026-06-12 07:00'), new Date('2026-06-12 08:01')])
        expect(result).toBe(31)
    })

    it('two passages at 07:00 and 08:59 -> 26 SEK', () => {
        const result = calculateToll('Car', [new Date('2026-06-12 07:00'), new Date('2026-06-12 08:59')])
        expect(result).toBe(26)
    })

    it('daily max -> 60 SEK', () => {
        const result = calculateToll('Car', [new Date('2026-06-12 07:00'),
        new Date('2026-06-12 08:59'),
        new Date('2026-06-12 10:00'),
        new Date('2026-06-12 12:00'),
        new Date('2026-06-12 14:00'),
        new Date('2026-06-12 17:00'),
        new Date('2026-06-12 19:00'),
        new Date('2026-06-12 21:00'),
        ])
        expect(result).toBe(60)
    })

    it('empty array -> 0 SEK', () => {
        const result = calculateToll('Car', [])
        expect(result).toBe(0)
    })
})
