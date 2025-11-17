/**
 * UnitConverter Utility
 *
 * Universal unit conversion library
 * Supports length, weight, temperature, area, volume, speed, pressure, energy
 *
 * @example
 * UnitConverter.length.convert(100, 'cm', 'm'); // 1
 * UnitConverter.weight.convert(10, 'kg', 'lb'); // 22.046
 * UnitConverter.temperature.convert(100, 'C', 'F'); // 212
 */

const UnitConverter = {
    /**
     * Length conversion
     * Base unit: meter (m)
     */
    length: {
        units: {
            // Metric
            mm: { name: 'Millimeter', toBase: 0.001 },
            cm: { name: 'Centimeter', toBase: 0.01 },
            m: { name: 'Meter', toBase: 1 },
            km: { name: 'Kilometer', toBase: 1000 },

            // Imperial
            inch: { name: 'Inch', toBase: 0.0254 },
            ft: { name: 'Foot', toBase: 0.3048 },
            yard: { name: 'Yard', toBase: 0.9144 },
            mile: { name: 'Mile', toBase: 1609.34 },

            // Nautical
            nm: { name: 'Nautical Mile', toBase: 1852 }
        },

        convert(value, fromUnit, toUnit) {
            if (!this.units[fromUnit] || !this.units[toUnit]) {
                throw new Error('Invalid unit');
            }

            // Convert to base unit (meters), then to target unit
            const inMeters = value * this.units[fromUnit].toBase;
            return inMeters / this.units[toUnit].toBase;
        },

        getUnitName(unit) {
            return this.units[unit]?.name || unit;
        },

        getAllUnits() {
            return Object.keys(this.units);
        }
    },

    /**
     * Weight conversion
     * Base unit: kilogram (kg)
     */
    weight: {
        units: {
            // Metric
            mg: { name: 'Milligram', toBase: 0.000001 },
            g: { name: 'Gram', toBase: 0.001 },
            kg: { name: 'Kilogram', toBase: 1 },
            ton: { name: 'Metric Ton', toBase: 1000 },

            // Imperial
            oz: { name: 'Ounce', toBase: 0.0283495 },
            lb: { name: 'Pound', toBase: 0.453592 },
            stone: { name: 'Stone', toBase: 6.35029 },
            'ton-us': { name: 'US Ton', toBase: 907.185 },
            'ton-uk': { name: 'UK Ton', toBase: 1016.05 }
        },

        convert(value, fromUnit, toUnit) {
            if (!this.units[fromUnit] || !this.units[toUnit]) {
                throw new Error('Invalid unit');
            }

            const inKg = value * this.units[fromUnit].toBase;
            return inKg / this.units[toUnit].toBase;
        },

        getUnitName(unit) {
            return this.units[unit]?.name || unit;
        },

        getAllUnits() {
            return Object.keys(this.units);
        }
    },

    /**
     * Temperature conversion
     * Special case - not linear conversion
     */
    temperature: {
        units: {
            C: { name: 'Celsius' },
            F: { name: 'Fahrenheit' },
            K: { name: 'Kelvin' }
        },

        convert(value, fromUnit, toUnit) {
            if (!this.units[fromUnit] || !this.units[toUnit]) {
                throw new Error('Invalid unit');
            }

            // Convert to Celsius first
            let celsius;
            switch (fromUnit) {
                case 'C':
                    celsius = value;
                    break;
                case 'F':
                    celsius = (value - 32) * 5 / 9;
                    break;
                case 'K':
                    celsius = value - 273.15;
                    break;
            }

            // Convert from Celsius to target unit
            switch (toUnit) {
                case 'C':
                    return celsius;
                case 'F':
                    return (celsius * 9 / 5) + 32;
                case 'K':
                    return celsius + 273.15;
            }
        },

        getUnitName(unit) {
            return this.units[unit]?.name || unit;
        },

        getAllUnits() {
            return Object.keys(this.units);
        }
    },

    /**
     * Area conversion
     * Base unit: square meter (m²)
     */
    area: {
        units: {
            // Metric
            'mm²': { name: 'Square Millimeter', toBase: 0.000001 },
            'cm²': { name: 'Square Centimeter', toBase: 0.0001 },
            'm²': { name: 'Square Meter', toBase: 1 },
            'km²': { name: 'Square Kilometer', toBase: 1000000 },
            hectare: { name: 'Hectare', toBase: 10000 },

            // Imperial
            'in²': { name: 'Square Inch', toBase: 0.00064516 },
            'ft²': { name: 'Square Foot', toBase: 0.092903 },
            'yard²': { name: 'Square Yard', toBase: 0.836127 },
            acre: { name: 'Acre', toBase: 4046.86 },
            'mile²': { name: 'Square Mile', toBase: 2589988 }
        },

        convert(value, fromUnit, toUnit) {
            if (!this.units[fromUnit] || !this.units[toUnit]) {
                throw new Error('Invalid unit');
            }

            const inM2 = value * this.units[fromUnit].toBase;
            return inM2 / this.units[toUnit].toBase;
        },

        getUnitName(unit) {
            return this.units[unit]?.name || unit;
        },

        getAllUnits() {
            return Object.keys(this.units);
        }
    },

    /**
     * Volume conversion
     * Base unit: liter (L)
     */
    volume: {
        units: {
            // Metric
            mL: { name: 'Milliliter', toBase: 0.001 },
            L: { name: 'Liter', toBase: 1 },
            'm³': { name: 'Cubic Meter', toBase: 1000 },

            // Imperial
            tsp: { name: 'Teaspoon', toBase: 0.00492892 },
            tbsp: { name: 'Tablespoon', toBase: 0.0147868 },
            'fl-oz': { name: 'Fluid Ounce', toBase: 0.0295735 },
            cup: { name: 'Cup', toBase: 0.24 },
            pint: { name: 'Pint', toBase: 0.473176 },
            quart: { name: 'Quart', toBase: 0.946353 },
            gallon: { name: 'Gallon', toBase: 3.78541 },

            // Other
            'in³': { name: 'Cubic Inch', toBase: 0.0163871 },
            'ft³': { name: 'Cubic Foot', toBase: 28.3168 }
        },

        convert(value, fromUnit, toUnit) {
            if (!this.units[fromUnit] || !this.units[toUnit]) {
                throw new Error('Invalid unit');
            }

            const inLiters = value * this.units[fromUnit].toBase;
            return inLiters / this.units[toUnit].toBase;
        },

        getUnitName(unit) {
            return this.units[unit]?.name || unit;
        },

        getAllUnits() {
            return Object.keys(this.units);
        }
    },

    /**
     * Speed conversion
     * Base unit: meter per second (m/s)
     */
    speed: {
        units: {
            'm/s': { name: 'Meter per Second', toBase: 1 },
            'km/h': { name: 'Kilometer per Hour', toBase: 0.277778 },
            'mph': { name: 'Miles per Hour', toBase: 0.44704 },
            'ft/s': { name: 'Feet per Second', toBase: 0.3048 },
            'knot': { name: 'Knot', toBase: 0.514444 }
        },

        convert(value, fromUnit, toUnit) {
            if (!this.units[fromUnit] || !this.units[toUnit]) {
                throw new Error('Invalid unit');
            }

            const inMS = value * this.units[fromUnit].toBase;
            return inMS / this.units[toUnit].toBase;
        },

        getUnitName(unit) {
            return this.units[unit]?.name || unit;
        },

        getAllUnits() {
            return Object.keys(this.units);
        }
    },

    /**
     * Pressure conversion
     * Base unit: Pascal (Pa)
     */
    pressure: {
        units: {
            Pa: { name: 'Pascal', toBase: 1 },
            kPa: { name: 'Kilopascal', toBase: 1000 },
            bar: { name: 'Bar', toBase: 100000 },
            psi: { name: 'PSI', toBase: 6894.76 },
            atm: { name: 'Atmosphere', toBase: 101325 },
            mmHg: { name: 'Millimeter of Mercury', toBase: 133.322 }
        },

        convert(value, fromUnit, toUnit) {
            if (!this.units[fromUnit] || !this.units[toUnit]) {
                throw new Error('Invalid unit');
            }

            const inPa = value * this.units[fromUnit].toBase;
            return inPa / this.units[toUnit].toBase;
        },

        getUnitName(unit) {
            return this.units[unit]?.name || unit;
        },

        getAllUnits() {
            return Object.keys(this.units);
        }
    },

    /**
     * Energy conversion
     * Base unit: Joule (J)
     */
    energy: {
        units: {
            J: { name: 'Joule', toBase: 1 },
            kJ: { name: 'Kilojoule', toBase: 1000 },
            cal: { name: 'Calorie', toBase: 4.184 },
            kcal: { name: 'Kilocalorie', toBase: 4184 },
            Wh: { name: 'Watt-hour', toBase: 3600 },
            kWh: { name: 'Kilowatt-hour', toBase: 3600000 },
            eV: { name: 'Electronvolt', toBase: 1.60218e-19 },
            BTU: { name: 'British Thermal Unit', toBase: 1055.06 }
        },

        convert(value, fromUnit, toUnit) {
            if (!this.units[fromUnit] || !this.units[toUnit]) {
                throw new Error('Invalid unit');
            }

            const inJoules = value * this.units[fromUnit].toBase;
            return inJoules / this.units[toUnit].toBase;
        },

        getUnitName(unit) {
            return this.units[unit]?.name || unit;
        },

        getAllUnits() {
            return Object.keys(this.units);
        }
    },

    /**
     * Helper method to get all available converters
     */
    getAllConverters() {
        return ['length', 'weight', 'temperature', 'area', 'volume', 'speed', 'pressure', 'energy'];
    },

    /**
     * Helper method to get converter by name
     */
    getConverter(name) {
        return this[name] || null;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnitConverter;
}
