import Holidays from 'date-holidays'

const TOLLABLE_VEHICLES = ["Car", "Van", "Truck"] as const

type TollableVehicle = typeof TOLLABLE_VEHICLES[number]
type TollFreeVehicle = "Motorbike" | "Tractor" | "Emergency" | "Diplomat" | "Foreign" | "Military"
type Vehicle = TollFreeVehicle | TollableVehicle

const TOLLABLE: ReadonlySet<Vehicle> = new Set(TOLLABLE_VEHICLES)
const hd = new Holidays('SE')
const MS_PER_HOUR = 60 * 60 * 1000

// In production i would fetch these from a data source and inject them
const TOLL_INTERVALS = [
    {from: 6 * 60, to: 6 * 60 + 29, price: 8},
    {from: 6 * 60 + 30, to: 6 * 60 + 59, price: 13},
    {from: 7 * 60, to: 7 * 60 + 59, price: 18},
    {from: 8 * 60, to: 8 * 60 + 29, price: 13},
    {from: 8 * 60 + 30, to: 14 * 60 + 59, price: 8},
    {from: 15 * 60, to: 15 * 60 + 29, price: 13},
    {from: 15 * 60 + 30, to: 16 * 60 + 59, price: 18},
    {from: 17 * 60, to: 17 * 60 + 59, price: 13},
    {from: 18 * 60, to: 18 * 60 + 29, price: 8},
]

function isWeekend(date: Date): boolean {
    return date.getDay() === 0 || date.getDay() === 6
}

function isTollFree(date: Date): boolean {
    return isWeekend(date) || hd.isHoliday(date) !== false
}

function getPrice(date: Date): number {
    const minutes = date.getHours() * 60 + date.getMinutes()
    const match = TOLL_INTERVALS.find(i => minutes >= i.from && minutes <= i.to)
    return match?.price ?? 0
}

export function calculateToll(vehicle: Vehicle, dates: Date[]): number {
    if (!TOLLABLE.has(vehicle)) return 0
    const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime())
    let total = 0
    // By using -Infinity I make sure the first passage always starts a new window
    let windowStart = -Infinity
    let windowMax = 0
    for (const d of sorted) {
        if (isTollFree(d)) continue
        const t = d.getTime()
        if (t - windowStart >= MS_PER_HOUR) {
            total += windowMax
            windowStart = t
            windowMax = getPrice(d)
        } else {
            windowMax = Math.max(windowMax, getPrice(d))
        }
    }
    return Math.min(total + windowMax, 60)
}
