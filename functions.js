var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Panel_Pmp, _Panel_Voc, _Panel_Vmp, _Panel_Isc, _Panel_Imp, _Panel_price, _PVString_panels, _PVString_Pmp, _PVString_Voc, _PVString_Vmp, _PVString_Isc, _PVString_Imp, _PVString_price, _Subarray_pvStrings, _Subarray_arrayLosses, _Subarray_Voc, _Subarray_Vmp, _Subarray_Pmp, _Subarray_Isc, _Subarray_Imp, _Subarray_price, _PVInput_Voc_min, _PVInput_Voc_max, _PVInput_Vmp_min, _PVInput_Vmp_max, _PVInput_Isc_max, _PVInput_Imp_max, _PVInput_PVPowerMax, _PVInput_price, _PVInput_subarray, _PVInverterCC_pvInputs, _PVInverterCC_price, _PVInverterCC_subarrayPrice, _ChargeController_batteryChargeCurrent, _PVInverter_ratedPower, _ACDCCoupledEquipmentGroup_equipmentGroup, _DCCoupledPVGenerationEquipment_equipmentGroup, _ACCoupledPVGenerationEquipment_equipmentGroup, _Battery_capacity, _Battery_minSOC, _Battery_cRate, _Battery_dRate, _Battery_price, _BatteryBank_batteries, _BatteryBank_outputVoltage, _BatteryBank_minSOC, _BatteryBank_cRate, _BatteryBank_dRate, _BatteryBank_price, _BatteryBank_capacity, _BatteryBank_energy, _BatteryBank_cumE, _BatteryInverter_ratedPower, _BatteryInverter_inverterEfficiency, _BatteryInverter_chargerEfficiency, _BatteryInverter_price, _BatteryInverter_batteryBank, _DieselGenerator_ratedPower, _DieselGenerator_price, _DieselGenerator_runHours, _DieselGenerator_dieselConsumed, _DieselGenerator_turnedOn, _DieselGenerator_currentOutput, _DieselGenerator_generatorRow, _Customer_name, _Customer_loadProfile, _Customer_qty, _GenerationSite_batteryInverter, _GenerationSite_batteryBank, _GenerationSite_pvInverters, _GenerationSite_chargeControllers, _GenerationSite_generator, _GenerationSite_shouldTurnGeneratorOn, _GenerationSite_shouldTurnGeneratorOff, _GenerationSite_acBus, _MiniGrid_customers, _MiniGrid_tariff, _MiniGrid_dxLosses, _MiniGrid_dcArrayOutputkWhPerkWpFn, _MiniGrid_generationSite;
const L_PER_GAL = 4.54609;
const HR_PER_DAY = 24;
const DAYS_PER_YR = 365;
const LV_VOLTAGE = 240;
class Panel {
    constructor(Pmp, Voc, Vmp, Isc, Imp, price) {
        _Panel_Pmp.set(this, void 0);
        _Panel_Voc.set(this, void 0);
        _Panel_Vmp.set(this, void 0);
        _Panel_Isc.set(this, void 0);
        _Panel_Imp.set(this, void 0);
        _Panel_price.set(this, void 0);
        __classPrivateFieldSet(this, _Panel_Pmp, Pmp, "f");
        __classPrivateFieldSet(this, _Panel_Voc, Voc, "f");
        __classPrivateFieldSet(this, _Panel_Vmp, Vmp, "f");
        __classPrivateFieldSet(this, _Panel_Isc, Isc, "f");
        __classPrivateFieldSet(this, _Panel_Imp, Imp, "f");
        __classPrivateFieldSet(this, _Panel_price, price, "f");
    }
    copy() {
        return new Panel(__classPrivateFieldGet(this, _Panel_Pmp, "f"), __classPrivateFieldGet(this, _Panel_Voc, "f"), __classPrivateFieldGet(this, _Panel_Vmp, "f"), __classPrivateFieldGet(this, _Panel_Isc, "f"), __classPrivateFieldGet(this, _Panel_Imp, "f"), __classPrivateFieldGet(this, _Panel_price, "f"));
    }
    get Pmp() { return __classPrivateFieldGet(this, _Panel_Pmp, "f"); }
    get Voc() { return __classPrivateFieldGet(this, _Panel_Voc, "f"); }
    get Vmp() { return __classPrivateFieldGet(this, _Panel_Vmp, "f"); }
    get Isc() { return __classPrivateFieldGet(this, _Panel_Isc, "f"); }
    get Imp() { return __classPrivateFieldGet(this, _Panel_Imp, "f"); }
    get price() { return __classPrivateFieldGet(this, _Panel_price, "f"); }
    getEnergy(dcArrayOutputkWhPerkWp) {
        return dcArrayOutputkWhPerkWp * __classPrivateFieldGet(this, _Panel_Pmp, "f");
    }
}
_Panel_Pmp = new WeakMap(), _Panel_Voc = new WeakMap(), _Panel_Vmp = new WeakMap(), _Panel_Isc = new WeakMap(), _Panel_Imp = new WeakMap(), _Panel_price = new WeakMap();
class PVString {
    constructor(panels) {
        _PVString_panels.set(this, void 0);
        _PVString_Pmp.set(this, void 0);
        _PVString_Voc.set(this, void 0);
        _PVString_Vmp.set(this, void 0);
        _PVString_Isc.set(this, void 0);
        _PVString_Imp.set(this, void 0);
        _PVString_price.set(this, void 0);
        __classPrivateFieldSet(this, _PVString_panels, panels, "f");
        // TODO: check all panels equal
        __classPrivateFieldSet(this, _PVString_Pmp, 0, "f");
        __classPrivateFieldSet(this, _PVString_Voc, 0, "f");
        __classPrivateFieldSet(this, _PVString_Vmp, 0, "f");
        __classPrivateFieldSet(this, _PVString_price, 0, "f");
        __classPrivateFieldGet(this, _PVString_panels, "f").forEach(panel => {
            __classPrivateFieldSet(this, _PVString_Pmp, __classPrivateFieldGet(this, _PVString_Pmp, "f") + panel.Pmp, "f");
            __classPrivateFieldSet(this, _PVString_Voc, __classPrivateFieldGet(this, _PVString_Voc, "f") + panel.Voc, "f");
            __classPrivateFieldSet(this, _PVString_Vmp, __classPrivateFieldGet(this, _PVString_Vmp, "f") + panel.Vmp, "f");
            __classPrivateFieldSet(this, _PVString_price, __classPrivateFieldGet(this, _PVString_price, "f") + panel.price, "f");
        });
        // NOTE: if you allow different panels in one string, this breaks.
        __classPrivateFieldSet(this, _PVString_Isc, __classPrivateFieldGet(this, _PVString_panels, "f")[0].Isc, "f");
        __classPrivateFieldSet(this, _PVString_Imp, __classPrivateFieldGet(this, _PVString_panels, "f")[0].Imp, "f");
    }
    copy() {
        var copiedPanels = __classPrivateFieldGet(this, _PVString_panels, "f").map(panel => panel.copy());
        return new PVString(copiedPanels);
    }
    get panels() { return __classPrivateFieldGet(this, _PVString_panels, "f"); }
    get Pmp() { return __classPrivateFieldGet(this, _PVString_Pmp, "f"); }
    get Voc() { return __classPrivateFieldGet(this, _PVString_Voc, "f"); }
    get Vmp() { return __classPrivateFieldGet(this, _PVString_Vmp, "f"); }
    get Isc() { return __classPrivateFieldGet(this, _PVString_Isc, "f"); }
    get Imp() { return __classPrivateFieldGet(this, _PVString_Imp, "f"); }
    get price() { return __classPrivateFieldGet(this, _PVString_price, "f"); }
    getEnergy(dcArrayOutputkWhPerkWp) {
        var energy = 0;
        this.panels.forEach(panel => {
            energy += panel.getEnergy(dcArrayOutputkWhPerkWp);
        });
        return energy;
    }
}
_PVString_panels = new WeakMap(), _PVString_Pmp = new WeakMap(), _PVString_Voc = new WeakMap(), _PVString_Vmp = new WeakMap(), _PVString_Isc = new WeakMap(), _PVString_Imp = new WeakMap(), _PVString_price = new WeakMap();
class Subarray {
    constructor(pvStrings, arrayLosses) {
        _Subarray_pvStrings.set(this, void 0);
        _Subarray_arrayLosses.set(this, void 0);
        _Subarray_Voc.set(this, void 0);
        _Subarray_Vmp.set(this, void 0);
        _Subarray_Pmp.set(this, void 0);
        _Subarray_Isc.set(this, void 0);
        _Subarray_Imp.set(this, void 0);
        _Subarray_price.set(this, void 0);
        __classPrivateFieldSet(this, _Subarray_pvStrings, pvStrings, "f");
        // TODO: confirm all strings same
        __classPrivateFieldSet(this, _Subarray_arrayLosses, arrayLosses, "f");
        // NOTE: this breaks if strings have different voltages
        __classPrivateFieldSet(this, _Subarray_Voc, __classPrivateFieldGet(this, _Subarray_pvStrings, "f")[0].Voc, "f");
        __classPrivateFieldSet(this, _Subarray_Vmp, __classPrivateFieldGet(this, _Subarray_pvStrings, "f")[0].Vmp, "f");
        __classPrivateFieldSet(this, _Subarray_Pmp, 0, "f");
        __classPrivateFieldSet(this, _Subarray_Isc, 0, "f");
        __classPrivateFieldSet(this, _Subarray_Imp, 0, "f");
        __classPrivateFieldSet(this, _Subarray_price, 0, "f");
        __classPrivateFieldGet(this, _Subarray_pvStrings, "f").forEach(pvString => {
            __classPrivateFieldSet(this, _Subarray_Pmp, __classPrivateFieldGet(this, _Subarray_Pmp, "f") + pvString.Pmp, "f");
            __classPrivateFieldSet(this, _Subarray_Isc, __classPrivateFieldGet(this, _Subarray_Isc, "f") + pvString.Isc, "f");
            __classPrivateFieldSet(this, _Subarray_Imp, __classPrivateFieldGet(this, _Subarray_Imp, "f") + pvString.Imp, "f");
            __classPrivateFieldSet(this, _Subarray_price, __classPrivateFieldGet(this, _Subarray_price, "f") + pvString.price, "f");
        });
    }
    copy() {
        var copiedPVStrings = __classPrivateFieldGet(this, _Subarray_pvStrings, "f").map(pvString => pvString.copy());
        return new Subarray(copiedPVStrings, __classPrivateFieldGet(this, _Subarray_arrayLosses, "f"));
    }
    get PVStrings() { return __classPrivateFieldGet(this, _Subarray_pvStrings, "f"); }
    get Voc() { return __classPrivateFieldGet(this, _Subarray_Voc, "f"); }
    get Vmp() { return __classPrivateFieldGet(this, _Subarray_Vmp, "f"); }
    get Pmp() { return __classPrivateFieldGet(this, _Subarray_Pmp, "f"); }
    get Isc() { return __classPrivateFieldGet(this, _Subarray_Isc, "f"); }
    get Imp() { return __classPrivateFieldGet(this, _Subarray_Imp, "f"); }
    get price() { return __classPrivateFieldGet(this, _Subarray_price, "f"); }
    getEnergy(dcArrayOutputkWhPerkWp) {
        var energy = 0;
        __classPrivateFieldGet(this, _Subarray_pvStrings, "f").forEach(pvString => {
            energy += pvString.getEnergy(dcArrayOutputkWhPerkWp);
        });
        return energy * (1 - __classPrivateFieldGet(this, _Subarray_arrayLosses, "f"));
    }
}
_Subarray_pvStrings = new WeakMap(), _Subarray_arrayLosses = new WeakMap(), _Subarray_Voc = new WeakMap(), _Subarray_Vmp = new WeakMap(), _Subarray_Pmp = new WeakMap(), _Subarray_Isc = new WeakMap(), _Subarray_Imp = new WeakMap(), _Subarray_price = new WeakMap();
class PVInput {
    constructor(Voc_min, Voc_max, Vmp_min, Vmp_max, Isc_max, Imp_max, PVPowerMax) {
        _PVInput_Voc_min.set(this, void 0);
        _PVInput_Voc_max.set(this, void 0);
        _PVInput_Vmp_min.set(this, void 0);
        _PVInput_Vmp_max.set(this, void 0);
        _PVInput_Isc_max.set(this, void 0);
        _PVInput_Imp_max.set(this, void 0);
        _PVInput_PVPowerMax.set(this, void 0);
        _PVInput_price.set(this, void 0);
        _PVInput_subarray.set(this, void 0);
        __classPrivateFieldSet(this, _PVInput_Voc_min, Voc_min, "f");
        __classPrivateFieldSet(this, _PVInput_Voc_max, Voc_max, "f");
        __classPrivateFieldSet(this, _PVInput_Vmp_min, Vmp_min, "f");
        __classPrivateFieldSet(this, _PVInput_Vmp_max, Vmp_max, "f");
        __classPrivateFieldSet(this, _PVInput_Isc_max, Isc_max, "f");
        __classPrivateFieldSet(this, _PVInput_Imp_max, Imp_max, "f");
        __classPrivateFieldSet(this, _PVInput_PVPowerMax, PVPowerMax, "f");
        __classPrivateFieldSet(this, _PVInput_price, 0, "f");
    }
    connectSubarray(subarray) {
        __classPrivateFieldSet(this, _PVInput_subarray, subarray, "f");
        if (__classPrivateFieldGet(this, _PVInput_subarray, "f").Voc < __classPrivateFieldGet(this, _PVInput_Voc_min, "f") || __classPrivateFieldGet(this, _PVInput_subarray, "f").Voc > __classPrivateFieldGet(this, _PVInput_Voc_max, "f")) {
            throw new Error(`Subarray Voc ${__classPrivateFieldGet(this, _PVInput_subarray, "f").Voc} is outside the bounds [${__classPrivateFieldGet(this, _PVInput_Voc_min, "f")},${__classPrivateFieldGet(this, _PVInput_Voc_max, "f")}]`);
        }
        if (__classPrivateFieldGet(this, _PVInput_subarray, "f").Vmp < __classPrivateFieldGet(this, _PVInput_Vmp_min, "f") || __classPrivateFieldGet(this, _PVInput_subarray, "f").Vmp > __classPrivateFieldGet(this, _PVInput_Vmp_max, "f")) {
            throw new Error(`Subarray Vmp ${__classPrivateFieldGet(this, _PVInput_subarray, "f").Vmp} is outside the bounds [${__classPrivateFieldGet(this, _PVInput_Vmp_min, "f")},${__classPrivateFieldGet(this, _PVInput_Vmp_max, "f")}]`);
        }
        if (__classPrivateFieldGet(this, _PVInput_subarray, "f").Isc > __classPrivateFieldGet(this, _PVInput_Isc_max, "f")) {
            throw new Error(`Subarray Isc ${__classPrivateFieldGet(this, _PVInput_subarray, "f").Isc} is greater than the charge controller Isc_max ${__classPrivateFieldGet(this, _PVInput_Isc_max, "f")}`);
        }
        if (__classPrivateFieldGet(this, _PVInput_subarray, "f").Imp > __classPrivateFieldGet(this, _PVInput_Imp_max, "f")) {
            throw new Error(`Subarray Imp ${__classPrivateFieldGet(this, _PVInput_subarray, "f").Imp} is greater than the charge controller Imp_max ${__classPrivateFieldGet(this, _PVInput_Imp_max, "f")}`);
        }
        if (__classPrivateFieldGet(this, _PVInput_subarray, "f").Pmp > __classPrivateFieldGet(this, _PVInput_PVPowerMax, "f")) {
            throw new Error(`Subarray Pmp ${__classPrivateFieldGet(this, _PVInput_subarray, "f").Pmp} is greater than the charge controller PVPowerMax ${__classPrivateFieldGet(this, _PVInput_PVPowerMax, "f")}`);
        }
        __classPrivateFieldSet(this, _PVInput_price, __classPrivateFieldGet(this, _PVInput_subarray, "f").price, "f");
    }
    copy() {
        var copiedSubarray = __classPrivateFieldGet(this, _PVInput_subarray, "f").copy();
        var copiedPVInput = new PVInput(__classPrivateFieldGet(this, _PVInput_Voc_min, "f"), __classPrivateFieldGet(this, _PVInput_Voc_max, "f"), __classPrivateFieldGet(this, _PVInput_Vmp_min, "f"), __classPrivateFieldGet(this, _PVInput_Vmp_max, "f"), __classPrivateFieldGet(this, _PVInput_Isc_max, "f"), __classPrivateFieldGet(this, _PVInput_Imp_max, "f"), __classPrivateFieldGet(this, _PVInput_PVPowerMax, "f"));
        copiedPVInput.connectSubarray(copiedSubarray);
        return copiedPVInput;
    }
    get price() { return __classPrivateFieldGet(this, _PVInput_price, "f"); }
    getEnergy(dcArrayOutputkWhPerkWp) {
        return __classPrivateFieldGet(this, _PVInput_subarray, "f").getEnergy(dcArrayOutputkWhPerkWp);
    }
}
_PVInput_Voc_min = new WeakMap(), _PVInput_Voc_max = new WeakMap(), _PVInput_Vmp_min = new WeakMap(), _PVInput_Vmp_max = new WeakMap(), _PVInput_Isc_max = new WeakMap(), _PVInput_Imp_max = new WeakMap(), _PVInput_PVPowerMax = new WeakMap(), _PVInput_price = new WeakMap(), _PVInput_subarray = new WeakMap();
class PVInverterCC {
    /**
     * A customer archetype and quantity.
     *
     * @param {Array<PVInput>} pvInputs - Array of PVInputs of device.
     * @param {number} price - Price of device.
     * @constructor
     */
    constructor(pvInputs, price) {
        _PVInverterCC_pvInputs.set(this, void 0);
        _PVInverterCC_price.set(this, void 0);
        _PVInverterCC_subarrayPrice.set(this, void 0);
        __classPrivateFieldSet(this, _PVInverterCC_pvInputs, pvInputs, "f");
        __classPrivateFieldSet(this, _PVInverterCC_price, price, "f");
        __classPrivateFieldSet(this, _PVInverterCC_subarrayPrice, 0, "f");
        __classPrivateFieldGet(this, _PVInverterCC_pvInputs, "f").forEach(pvinput => {
            __classPrivateFieldSet(this, _PVInverterCC_subarrayPrice, __classPrivateFieldGet(this, _PVInverterCC_subarrayPrice, "f") + pvinput.price, "f");
        });
    }
    copy() {
        throw new Error('Must implement');
    }
    get PVInputs() { return __classPrivateFieldGet(this, _PVInverterCC_pvInputs, "f"); }
    get price() { return __classPrivateFieldGet(this, _PVInverterCC_price, "f"); }
    get totalPrice() { return __classPrivateFieldGet(this, _PVInverterCC_subarrayPrice, "f") + __classPrivateFieldGet(this, _PVInverterCC_price, "f"); }
    getUnlimitedEnergy(dcArrayOutputkWhPerkWp) {
        var energy = 0;
        __classPrivateFieldGet(this, _PVInverterCC_pvInputs, "f").forEach(pvinput => {
            energy += pvinput.getEnergy(dcArrayOutputkWhPerkWp);
        });
        return energy;
    }
    getEnergy(dcArrayOutputkWhPerkWp, outputVoltage, dt) {
        throw new Error('Need to implement.');
    }
}
_PVInverterCC_pvInputs = new WeakMap(), _PVInverterCC_price = new WeakMap(), _PVInverterCC_subarrayPrice = new WeakMap();
class ChargeController extends PVInverterCC {
    constructor(batteryChargeCurrent, pvInputs, price) {
        super(pvInputs, price);
        _ChargeController_batteryChargeCurrent.set(this, void 0);
        __classPrivateFieldSet(this, _ChargeController_batteryChargeCurrent, batteryChargeCurrent, "f");
    }
    copy() {
        var copiedPVInputs = this.PVInputs.map(pvInput => pvInput.copy());
        return new ChargeController(__classPrivateFieldGet(this, _ChargeController_batteryChargeCurrent, "f"), copiedPVInputs, this.price);
    }
    get batteryChargeCurrent() { return __classPrivateFieldGet(this, _ChargeController_batteryChargeCurrent, "f"); }
    getEnergy(dcArrayOutputkWhPerkWp, outputVoltage, dt) {
        return Math.min(super.getUnlimitedEnergy(dcArrayOutputkWhPerkWp), outputVoltage * __classPrivateFieldGet(this, _ChargeController_batteryChargeCurrent, "f") * dt);
    }
}
_ChargeController_batteryChargeCurrent = new WeakMap();
class PVInverter extends PVInverterCC {
    constructor(ratedPower, pvInputs, price) {
        super(pvInputs, price);
        _PVInverter_ratedPower.set(this, void 0);
        __classPrivateFieldSet(this, _PVInverter_ratedPower, ratedPower, "f");
    }
    copy() {
        var copiedPVInputs = this.PVInputs.map(pvInput => pvInput.copy());
        return new PVInverter(__classPrivateFieldGet(this, _PVInverter_ratedPower, "f"), copiedPVInputs, this.price);
    }
    get ratedPower() { return __classPrivateFieldGet(this, _PVInverter_ratedPower, "f"); }
    getEnergy(dcArrayOutputkWhPerkWp, outputVoltage, dt) {
        return Math.min(super.getUnlimitedEnergy(dcArrayOutputkWhPerkWp), __classPrivateFieldGet(this, _PVInverter_ratedPower, "f") * dt);
    }
}
_PVInverter_ratedPower = new WeakMap();
class ACDCCoupledEquipmentGroup {
    constructor(equipmentGroup) {
        _ACDCCoupledEquipmentGroup_equipmentGroup.set(this, void 0);
        __classPrivateFieldSet(this, _ACDCCoupledEquipmentGroup_equipmentGroup, equipmentGroup, "f");
    }
    copy() {
        throw new Error('Must implement');
    }
    get equipmentGroup() { return __classPrivateFieldGet(this, _ACDCCoupledEquipmentGroup_equipmentGroup, "f"); }
    get price() {
        var price = 0;
        __classPrivateFieldGet(this, _ACDCCoupledEquipmentGroup_equipmentGroup, "f").forEach(equipment => {
            price += equipment.totalPrice;
        });
        return price;
    }
}
_ACDCCoupledEquipmentGroup_equipmentGroup = new WeakMap();
class DCCoupledPVGenerationEquipment extends ACDCCoupledEquipmentGroup {
    constructor(chargeControllers) {
        super(chargeControllers);
        _DCCoupledPVGenerationEquipment_equipmentGroup.set(this, void 0);
    }
    copy() {
        var copiedEquipmentGroup = __classPrivateFieldGet(this, _DCCoupledPVGenerationEquipment_equipmentGroup, "f").map(equipment => equipment.copy());
        return new DCCoupledPVGenerationEquipment(copiedEquipmentGroup);
    }
    getEnergy(dcArrayOutputkWhPerkWp, outputVoltage, dt) {
        var energy = 0;
        this.equipmentGroup.forEach((cc) => {
            energy += cc.getEnergy(dcArrayOutputkWhPerkWp, outputVoltage, dt);
        });
        return energy;
    }
}
_DCCoupledPVGenerationEquipment_equipmentGroup = new WeakMap();
class ACCoupledPVGenerationEquipment extends ACDCCoupledEquipmentGroup {
    constructor(pvInverters) {
        super(pvInverters);
        _ACCoupledPVGenerationEquipment_equipmentGroup.set(this, void 0);
    }
    copy() {
        var copiedEquipmentGroup = __classPrivateFieldGet(this, _ACCoupledPVGenerationEquipment_equipmentGroup, "f").map(equipment => equipment.copy());
        return new ACCoupledPVGenerationEquipment(copiedEquipmentGroup);
    }
    getEnergy(dcArrayOutputkWhPerkWp, dt) {
        var energy = 0;
        this.equipmentGroup.forEach((inverter) => {
            energy += inverter.getEnergy(dcArrayOutputkWhPerkWp, LV_VOLTAGE, dt);
        });
        return energy;
    }
}
_ACCoupledPVGenerationEquipment_equipmentGroup = new WeakMap();
class Battery {
    constructor(capacity, minSOC, cRate, dRate, price) {
        _Battery_capacity.set(this, void 0);
        _Battery_minSOC.set(this, void 0);
        _Battery_cRate.set(this, void 0);
        _Battery_dRate.set(this, void 0);
        _Battery_price.set(this, void 0);
        __classPrivateFieldSet(this, _Battery_capacity, capacity, "f");
        __classPrivateFieldSet(this, _Battery_minSOC, minSOC, "f");
        __classPrivateFieldSet(this, _Battery_cRate, cRate, "f");
        __classPrivateFieldSet(this, _Battery_dRate, dRate, "f");
        __classPrivateFieldSet(this, _Battery_price, price, "f");
    }
    copy() {
        return new Battery(__classPrivateFieldGet(this, _Battery_capacity, "f"), __classPrivateFieldGet(this, _Battery_minSOC, "f"), __classPrivateFieldGet(this, _Battery_cRate, "f"), __classPrivateFieldGet(this, _Battery_dRate, "f"), __classPrivateFieldGet(this, _Battery_price, "f"));
    }
    get capacity() { return __classPrivateFieldGet(this, _Battery_capacity, "f"); }
    get minSOC() { return __classPrivateFieldGet(this, _Battery_minSOC, "f"); }
    get cRate() { return __classPrivateFieldGet(this, _Battery_cRate, "f"); }
    get dRate() { return __classPrivateFieldGet(this, _Battery_dRate, "f"); }
    get price() { return __classPrivateFieldGet(this, _Battery_price, "f"); }
}
_Battery_capacity = new WeakMap(), _Battery_minSOC = new WeakMap(), _Battery_cRate = new WeakMap(), _Battery_dRate = new WeakMap(), _Battery_price = new WeakMap();
class BatteryBank {
    constructor(batteries, outputVoltage) {
        _BatteryBank_batteries.set(this, void 0);
        _BatteryBank_outputVoltage.set(this, void 0);
        _BatteryBank_minSOC.set(this, void 0);
        _BatteryBank_cRate.set(this, void 0);
        _BatteryBank_dRate.set(this, void 0);
        _BatteryBank_price.set(this, void 0);
        _BatteryBank_capacity.set(this, void 0);
        _BatteryBank_energy.set(this, void 0);
        _BatteryBank_cumE.set(this, void 0);
        __classPrivateFieldSet(this, _BatteryBank_batteries, batteries, "f");
        __classPrivateFieldSet(this, _BatteryBank_outputVoltage, outputVoltage, "f");
        // TODO: confirm batteries are equivalent
        // NOTE: if batteries not equivalent, this breaks
        __classPrivateFieldSet(this, _BatteryBank_minSOC, batteries[0].minSOC, "f");
        __classPrivateFieldSet(this, _BatteryBank_cRate, batteries[0].cRate, "f");
        __classPrivateFieldSet(this, _BatteryBank_dRate, batteries[0].dRate, "f");
        __classPrivateFieldSet(this, _BatteryBank_price, 0, "f");
        __classPrivateFieldSet(this, _BatteryBank_capacity, 0, "f");
        __classPrivateFieldGet(this, _BatteryBank_batteries, "f").forEach(battery => {
            __classPrivateFieldSet(this, _BatteryBank_capacity, __classPrivateFieldGet(this, _BatteryBank_capacity, "f") + battery.capacity, "f");
            __classPrivateFieldSet(this, _BatteryBank_price, __classPrivateFieldGet(this, _BatteryBank_price, "f") + battery.price, "f");
        });
        __classPrivateFieldSet(this, _BatteryBank_energy, __classPrivateFieldGet(this, _BatteryBank_capacity, "f"), "f");
        __classPrivateFieldSet(this, _BatteryBank_cumE, 0, "f");
    }
    get batteries() { return __classPrivateFieldGet(this, _BatteryBank_batteries, "f"); }
    get outputVoltage() { return __classPrivateFieldGet(this, _BatteryBank_outputVoltage, "f"); }
    get minSOC() { return __classPrivateFieldGet(this, _BatteryBank_minSOC, "f"); }
    get price() { return __classPrivateFieldGet(this, _BatteryBank_price, "f"); }
    get capacity() { return __classPrivateFieldGet(this, _BatteryBank_capacity, "f"); }
    get energy() { return __classPrivateFieldGet(this, _BatteryBank_energy, "f"); }
    get effectiveEnergy() { return __classPrivateFieldGet(this, _BatteryBank_energy, "f") - __classPrivateFieldGet(this, _BatteryBank_minSOC, "f") * __classPrivateFieldGet(this, _BatteryBank_capacity, "f"); }
    // TODO: add limits for charging and discharging rates
    getEnergyAvailable(dt) {
        return this.effectiveEnergy;
    }
    get soc() { return __classPrivateFieldGet(this, _BatteryBank_energy, "f") / __classPrivateFieldGet(this, _BatteryBank_capacity, "f"); }
    canDischarge(energy) {
        return (__classPrivateFieldGet(this, _BatteryBank_energy, "f") - energy) / __classPrivateFieldGet(this, _BatteryBank_capacity, "f") > __classPrivateFieldGet(this, _BatteryBank_minSOC, "f");
    }
    canCharge(energy) {
        return (__classPrivateFieldGet(this, _BatteryBank_energy, "f") + energy) <= __classPrivateFieldGet(this, _BatteryBank_capacity, "f");
    }
    /**
     * Requests energy from the batteries. Updates SOC and cycles.
     *
     * @param {number} energy - The amount of energy requested from the batteries [kWh].
     * @returns {number} - The amount of energy actually supplied by the batteries, limited by the min SOC
     */
    requestDischarge(energy) {
        var energySupplied = Math.min(this.effectiveEnergy, energy);
        __classPrivateFieldSet(this, _BatteryBank_energy, __classPrivateFieldGet(this, _BatteryBank_energy, "f") - energySupplied, "f");
        __classPrivateFieldSet(this, _BatteryBank_cumE, __classPrivateFieldGet(this, _BatteryBank_cumE, "f") + energySupplied, "f");
        return energySupplied;
    }
    /**
     * Requests the batteries charge using incoming energy. Updates SOC and cycles.
     *
     * @param {number} energy - The amount of energy requested to the batteries [kWh].
     * @returns {number} - The amount of energy actually used to charge the batteries, limited by the capacity
     */
    requestCharge(energy) {
        var energySupplied = Math.min(__classPrivateFieldGet(this, _BatteryBank_capacity, "f") - __classPrivateFieldGet(this, _BatteryBank_energy, "f"), energy);
        __classPrivateFieldSet(this, _BatteryBank_energy, __classPrivateFieldGet(this, _BatteryBank_energy, "f") + energySupplied, "f");
        __classPrivateFieldSet(this, _BatteryBank_cumE, __classPrivateFieldGet(this, _BatteryBank_cumE, "f") + energySupplied, "f");
        return energySupplied;
    }
}
_BatteryBank_batteries = new WeakMap(), _BatteryBank_outputVoltage = new WeakMap(), _BatteryBank_minSOC = new WeakMap(), _BatteryBank_cRate = new WeakMap(), _BatteryBank_dRate = new WeakMap(), _BatteryBank_price = new WeakMap(), _BatteryBank_capacity = new WeakMap(), _BatteryBank_energy = new WeakMap(), _BatteryBank_cumE = new WeakMap();
class BatteryInverter {
    constructor(ratedPower, inverterEfficiency, chargerEfficiency, price) {
        _BatteryInverter_ratedPower.set(this, void 0);
        _BatteryInverter_inverterEfficiency.set(this, void 0);
        _BatteryInverter_chargerEfficiency.set(this, void 0);
        _BatteryInverter_price.set(this, void 0);
        _BatteryInverter_batteryBank.set(this, void 0);
        __classPrivateFieldSet(this, _BatteryInverter_ratedPower, ratedPower, "f");
        __classPrivateFieldSet(this, _BatteryInverter_inverterEfficiency, inverterEfficiency, "f");
        __classPrivateFieldSet(this, _BatteryInverter_chargerEfficiency, chargerEfficiency, "f");
        __classPrivateFieldSet(this, _BatteryInverter_price, price, "f");
    }
    get ratedPower() { return __classPrivateFieldGet(this, _BatteryInverter_ratedPower, "f"); }
    get inverterEfficiency() { return __classPrivateFieldGet(this, _BatteryInverter_inverterEfficiency, "f"); }
    get chargerEfficiency() { return __classPrivateFieldGet(this, _BatteryInverter_chargerEfficiency, "f"); }
    get price() { return __classPrivateFieldGet(this, _BatteryInverter_price, "f"); }
    /**
     * Requests energy from the batteries inverted into AC. Updates SOC and cycles.
     *
     * @param {number} ac - The amount of energy requested to the AC bus [kWh].
     * @param {number} dt - The amount of time to provide the energy [hr]
     * @returns {number} - The amount of AC actually produced, limited by the power rating and the batteries [kWh]
     */
    requestAC(ac, dt) {
        if (!__classPrivateFieldGet(this, _BatteryInverter_batteryBank, "f")) {
            throw new Error('Battery inverter needs battery bank to invert.');
        }
        // Limit AC ouptut by rated power
        ac = Math.min(ac, this.ratedPower * dt);
        // Amount of DC needed to fulfill the load [kWh]
        var dcNeeded = ac / this.inverterEfficiency;
        // Amount of DC drawn from the batteries [kWh]
        var dcProduced = __classPrivateFieldGet(this, _BatteryInverter_batteryBank, "f").requestDischarge(dcNeeded);
        // Amount of AC actually provided
        return dcProduced * this.inverterEfficiency;
    }
    /**
     * Requests excess energy to be used to charge the batteries. Updates SOC and cycles.
     *
     * @param {number} ac - The amount of AC energy to send to the batteries [kWh].
     * @param {number} dt - The amount of time to send the energy [hr]
     * @returns {number} - The amount of DC energy actually stored in the batteries, limited by the power rating and the batteries [kWh]
     */
    requestChargeBatteries(ac, dt) {
        if (!__classPrivateFieldGet(this, _BatteryInverter_batteryBank, "f")) {
            throw new Error('Battery inverter needs a battery bank to charge.');
        }
        // Limit DC output by rated power
        ac = Math.min(ac, this.ratedPower * dt);
        // Rectify AC into DC
        var dcProduced = ac * this.chargerEfficiency;
        // Charge batteries with DC
        return __classPrivateFieldGet(this, _BatteryInverter_batteryBank, "f").requestCharge(dcProduced);
    }
    connectBatteryBank(batteryBank) {
        __classPrivateFieldSet(this, _BatteryInverter_batteryBank, batteryBank, "f");
    }
    canSupply(energy, time) {
        return energy / time <= this.ratedPower;
    }
}
_BatteryInverter_ratedPower = new WeakMap(), _BatteryInverter_inverterEfficiency = new WeakMap(), _BatteryInverter_chargerEfficiency = new WeakMap(), _BatteryInverter_price = new WeakMap(), _BatteryInverter_batteryBank = new WeakMap();
class DieselGenerator {
    constructor(ratedPower, price) {
        _DieselGenerator_ratedPower.set(this, void 0);
        _DieselGenerator_price.set(this, void 0);
        _DieselGenerator_runHours.set(this, void 0);
        _DieselGenerator_dieselConsumed.set(this, void 0);
        _DieselGenerator_turnedOn.set(this, void 0);
        _DieselGenerator_currentOutput.set(this, void 0);
        _DieselGenerator_generatorRow.set(this, void 0);
        __classPrivateFieldSet(this, _DieselGenerator_ratedPower, ratedPower, "f");
        __classPrivateFieldSet(this, _DieselGenerator_price, price, "f");
        __classPrivateFieldSet(this, _DieselGenerator_runHours, 0, "f");
        __classPrivateFieldSet(this, _DieselGenerator_dieselConsumed, 0, "f");
        __classPrivateFieldSet(this, _DieselGenerator_turnedOn, false, "f");
        __classPrivateFieldSet(this, _DieselGenerator_currentOutput, 0, "f");
        if (__classPrivateFieldGet(this, _DieselGenerator_ratedPower, "f") < Math.min(...DieselGenerator.genSizeHeaders) || __classPrivateFieldGet(this, _DieselGenerator_ratedPower, "f") > Math.max(...DieselGenerator.genSizeHeaders)) {
            throw new Error(`Diesel genset power ${__classPrivateFieldGet(this, _DieselGenerator_ratedPower, "f")} is outside the range [${Math.min(...DieselGenerator.genSizeHeaders), Math.max(...DieselGenerator.genSizeHeaders)}].`);
        }
        __classPrivateFieldSet(this, _DieselGenerator_generatorRow, [], "f");
        for (let p = 0; p < DieselGenerator.genSizeHeaders.length; p++) {
            if (__classPrivateFieldGet(this, _DieselGenerator_ratedPower, "f") === DieselGenerator.genSizeHeaders[p]) {
                __classPrivateFieldSet(this, _DieselGenerator_generatorRow, DieselGenerator.generatorTable[p], "f");
                break;
            }
            else if (__classPrivateFieldGet(this, _DieselGenerator_ratedPower, "f") < DieselGenerator.genSizeHeaders[p + 1]) {
                var p_frac = (__classPrivateFieldGet(this, _DieselGenerator_ratedPower, "f") - DieselGenerator.genSizeHeaders[p]) / (DieselGenerator.genSizeHeaders[p + 1] - DieselGenerator.genSizeHeaders[p]);
                for (let l = 0; l < DieselGenerator.loadingFracHeaders.length; l++) {
                    __classPrivateFieldGet(this, _DieselGenerator_generatorRow, "f").push(DieselGenerator.generatorTable[p][l] + p_frac * (DieselGenerator.generatorTable[p + 1][l] - DieselGenerator.generatorTable[p][l]));
                }
                break;
            }
        }
    }
    get ratedPower() { return __classPrivateFieldGet(this, _DieselGenerator_ratedPower, "f"); }
    get price() { return __classPrivateFieldGet(this, _DieselGenerator_price, "f"); }
    get runHours() { return __classPrivateFieldGet(this, _DieselGenerator_runHours, "f"); }
    get dieselConsumed() { return __classPrivateFieldGet(this, _DieselGenerator_dieselConsumed, "f"); }
    get currentOutput() { return __classPrivateFieldGet(this, _DieselGenerator_currentOutput, "f"); }
    static get generatorTable() {
        return [
            [0.0, 0.3, 0.5, 0.7, 0.8],
            [0.0, 0.6, 0.9, 1.3, 1.6],
            [0.0, 1.3, 1.8, 2.4, 2.9],
            [0.0, 1.6, 2.3, 3.2, 4.0],
            [0.0, 1.8, 2.9, 3.8, 4.8],
            [0.0, 2.4, 3.4, 4.6, 6.1],
            [0.0, 2.6, 4.1, 5.8, 7.4],
            [0.0, 3.1, 5.0, 7.1, 9.1],
            [0.0, 3.3, 5.4, 7.6, 9.8],
            [0.0, 3.6, 5.9, 8.4, 10.9],
            [0.0, 4.1, 6.8, 9.7, 12.7],
            [0.0, 4.7, 7.7, 11.0, 14.4],
            [0.0, 5.3, 8.8, 12.5, 16.6],
            [0.0, 5.7, 9.5, 13.6, 18.0],
            [0.0, 6.8, 11.3, 16.1, 21.5],
            [0.0, 7.9, 13.1, 18.7, 25.1],
            [0.0, 8.9, 14.9, 21.3, 28.6],
            [0.0, 11.0, 18.5, 26.4, 35.7],
            [0.0, 13.2, 22.0, 31.5, 42.8],
            [0.0, 16.3, 27.4, 39.3, 53.4],
            [0.0, 21.6, 36.4, 52.1, 71.1],
            [0.0, 26.9, 45.3, 65.0, 88.8],
            [0.0, 32.2, 54.3, 77.8, 106.5],
            [0.0, 37.5, 63.2, 90.7, 124.2],
            [0.0, 42.8, 72.2, 103.5, 141.9],
            [0.0, 48.1, 81.1, 116.4, 159.6]
        ];
    }
    static get loadingFracHeaders() {
        return [0, 0.25, 0.5, 0.75, 1.0];
    }
    static get genSizeHeaders() {
        return [10, 20, 30, 40, 60, 75, 100, 125, 135, 150, 175, 200, 230, 250, 300, 350, 400, 500, 600, 750, 1000, 125, 1500, 1750, 2000, 2250];
    }
    canSupply(energy, time) {
        return energy / time <= this.ratedPower;
    }
    get isOn() {
        return __classPrivateFieldGet(this, _DieselGenerator_turnedOn, "f");
    }
    turnOn() {
        __classPrivateFieldSet(this, _DieselGenerator_turnedOn, true, "f");
    }
    turnOff() {
        __classPrivateFieldSet(this, _DieselGenerator_turnedOn, false, "f");
    }
    /**
     * Request generator supply power. Updates diesel consumption, run hours, and current output.
     *
     * @param {number} power - Amount of power requested from the generator.
     * @param {number} dt - Amount of time to run.
     * @returns {Object} - An object with two keys:
     * - energy {number} Amount of energy supplied during dt.
     * - diesel {number} Amount of diesel consumed during dt.
     */
    supply(power, dt) {
        var loadingFrac = power / this.ratedPower;
        if (loadingFrac > Math.max(...DieselGenerator.loadingFracHeaders)) {
            console.warn(`Generator asked to supply ${power}, but can only supply ${this.ratedPower}`);
            power = this.ratedPower;
            loadingFrac = 1.0;
        }
        var galPerHr = -1;
        for (let l = 0; l < DieselGenerator.loadingFracHeaders.length; l++) {
            if (loadingFrac === DieselGenerator.loadingFracHeaders[l]) {
                galPerHr = __classPrivateFieldGet(this, _DieselGenerator_generatorRow, "f")[l];
            }
            else if (loadingFrac < DieselGenerator.loadingFracHeaders[l + 1]) {
                var l_frac = (loadingFrac - DieselGenerator.loadingFracHeaders[l]) / (DieselGenerator.loadingFracHeaders[l + 1] - DieselGenerator.loadingFracHeaders[l]);
                galPerHr = __classPrivateFieldGet(this, _DieselGenerator_generatorRow, "f")[l] + l_frac * (__classPrivateFieldGet(this, _DieselGenerator_generatorRow, "f")[l + 1] - __classPrivateFieldGet(this, _DieselGenerator_generatorRow, "f")[l]);
            }
        }
        if (galPerHr === -1) {
            throw new Error(`I wasn't able to compute the amount of diesel consumed per hour.`);
        }
        var lPerHr = galPerHr * L_PER_GAL;
        __classPrivateFieldSet(this, _DieselGenerator_dieselConsumed, __classPrivateFieldGet(this, _DieselGenerator_dieselConsumed, "f") + lPerHr * dt, "f");
        __classPrivateFieldSet(this, _DieselGenerator_runHours, __classPrivateFieldGet(this, _DieselGenerator_runHours, "f") + dt, "f");
        __classPrivateFieldSet(this, _DieselGenerator_currentOutput, power, "f");
        return {
            energy: power * dt,
            diesel: lPerHr * dt
        };
    }
}
_DieselGenerator_ratedPower = new WeakMap(), _DieselGenerator_price = new WeakMap(), _DieselGenerator_runHours = new WeakMap(), _DieselGenerator_dieselConsumed = new WeakMap(), _DieselGenerator_turnedOn = new WeakMap(), _DieselGenerator_currentOutput = new WeakMap(), _DieselGenerator_generatorRow = new WeakMap();
class Customer {
    /**
     * A customer archetype and quantity.
     *
     * @param {string} name - Unique name for the class of customer, e.g. "residential" or "commercial"
     * @param {(tariff: number, t: number) => number} loadProfile - Energy needs of a single customer [kWh/hr] given the tariff and time since commissioning [hr].
     * @param {number} qty - Quantity of customers of that archetype.
     * @constructor
     */
    constructor(name, loadProfile, qty) {
        _Customer_name.set(this, void 0);
        _Customer_loadProfile.set(this, void 0);
        _Customer_qty.set(this, void 0);
        __classPrivateFieldSet(this, _Customer_name, name, "f");
        __classPrivateFieldSet(this, _Customer_loadProfile, loadProfile, "f");
        __classPrivateFieldSet(this, _Customer_qty, qty, "f");
    }
    get name() { return __classPrivateFieldGet(this, _Customer_name, "f"); }
    get loadProfile() { return __classPrivateFieldGet(this, _Customer_loadProfile, "f"); }
    get totalLoadProfile() {
        return (tariff, t) => this.loadProfile(tariff, t) * __classPrivateFieldGet(this, _Customer_qty, "f");
    }
    get qty() { return __classPrivateFieldGet(this, _Customer_qty, "f"); }
    getLoad(tariff, t) {
        return __classPrivateFieldGet(this, _Customer_loadProfile, "f").call(this, tariff, t);
    }
    getTotalLoad(tariff, t) {
        return this.totalLoadProfile(tariff, t);
    }
}
_Customer_name = new WeakMap(), _Customer_loadProfile = new WeakMap(), _Customer_qty = new WeakMap();
class GenerationSite {
    /**
     * All of the equipment at a generation site.
     *
     * @param {BatteryInverter} batteryInverter - The total battery inverter.
     * @param {BatteryBank} batteryBank - The battery bank.
     * @param {ACCoupledPVGenerationEquipment} pvInverters - All of the PV inverters and their connected solar panels.
     * @param {DCCoupledPVGenerationEquipment} chargeControllers - All of the charge controllers and their connected solar panels
     * @param {Generator} generator - The diesel generator
     * @param {function(soc: number, t: number) => boolean} shouldTurnOnGenerator - A function to decide when to turn the generator on given battery SOC and the current time since commissioning [hr]
     * @param {function(soc: number, t: number) => boolean} shouldTurnOffGenerator - A function to decide when to turn the generator off given battery SOC and the current time since commissioning [hr]
     * @constructor
     */
    constructor(batteryInverter, batteryBank, pvInverters, chargeControllers, generator, shouldTurnGeneratorOn = (soc, t) => false, shouldTurnGeneratorOff = (soc, t) => false) {
        _GenerationSite_batteryInverter.set(this, void 0);
        _GenerationSite_batteryBank.set(this, void 0);
        _GenerationSite_pvInverters.set(this, void 0);
        _GenerationSite_chargeControllers.set(this, void 0);
        _GenerationSite_generator.set(this, void 0);
        _GenerationSite_shouldTurnGeneratorOn.set(this, void 0);
        _GenerationSite_shouldTurnGeneratorOff.set(this, void 0);
        _GenerationSite_acBus.set(this, void 0);
        __classPrivateFieldSet(this, _GenerationSite_batteryInverter, batteryInverter, "f");
        __classPrivateFieldSet(this, _GenerationSite_batteryBank, batteryBank, "f");
        __classPrivateFieldSet(this, _GenerationSite_pvInverters, pvInverters, "f");
        __classPrivateFieldSet(this, _GenerationSite_chargeControllers, chargeControllers, "f");
        __classPrivateFieldSet(this, _GenerationSite_generator, generator, "f");
        __classPrivateFieldSet(this, _GenerationSite_shouldTurnGeneratorOn, shouldTurnGeneratorOn, "f");
        __classPrivateFieldSet(this, _GenerationSite_shouldTurnGeneratorOff, shouldTurnGeneratorOff, "f");
        __classPrivateFieldGet(this, _GenerationSite_batteryInverter, "f").connectBatteryBank(__classPrivateFieldGet(this, _GenerationSite_batteryBank, "f"));
        __classPrivateFieldSet(this, _GenerationSite_acBus, 0, "f");
    }
    get batteryInverter() { return __classPrivateFieldGet(this, _GenerationSite_batteryInverter, "f"); }
    get batteryBank() { return __classPrivateFieldGet(this, _GenerationSite_batteryBank, "f"); }
    get pvInverters() { return __classPrivateFieldGet(this, _GenerationSite_pvInverters, "f"); }
    get chargeControllers() { return __classPrivateFieldGet(this, _GenerationSite_chargeControllers, "f"); }
    get generator() { return __classPrivateFieldGet(this, _GenerationSite_generator, "f"); }
    /**
     * Runs the generation site for one unit of time
     *
     * @param {number} t - Time since commissioning [hr]
     * @param {number} dt - The amount of time that passes [hr].
     * @param {number} dcArrayOutputkWhPerkWp - From irradiance data [kWh].
     * @param {number} load - Total load, including distribution losses [kWh].
     * @returns {Object} - An object with 13 keys:
     * - availableACFromPVInverters {number} Energy generated by PV inverters [kWh].
     * - availableDCFromCCs {number} Energy generated by charge controllers [kWh].
     * - loadWithDxLosses {number} The load, given as an input parameter [kWh].
     * - batterySOCkWh {number} Amount of energy remaining in the battery bank [kWh].
     * - batterySOC {number} SOC of the battery bank at the end of dt.
     * - totalSolarToLoad {number} Energy sent from the PV inverters to the load [kWh].
     * - totalSolarToBattery {number} Energy sent from the PV to the batteries [kWh].
     * - totalBatteryToLoad {number} Energy sent from the batteries to the load [kWh].
     * - totalEnergyToLoad {number} Energy sent from the generation site to the load [kWh].
     * - generatorLoad {number} Energy supplied by the generator [kWh].
     * - generatorFuelConsumption {number} Fuel consumed by the generator [L].
     * - remainingLoad {number} Unmet load [kWh].
     * - wastedSolar {number} Solar energy not used due to inefficiencies [kWh].
     */
    operate(t, dt, dcArrayOutputkWhPerkWp, load) {
        var wastedSolar = 0;
        var energySentToLoad = 0;
        var generatorLoad = 0;
        var generatorFuelConsumption = 0;
        // Charge the batteries from the charge controllers
        var availableDCFromCCs = this.chargeControllers.getEnergy(dcArrayOutputkWhPerkWp, this.batteryBank.outputVoltage, dt);
        var ccSolarToBattery = this.batteryBank.requestCharge(availableDCFromCCs);
        wastedSolar += availableDCFromCCs - ccSolarToBattery;
        if (this.generator !== null) {
            // If the generator is on but should be off, turn it off.
            if (this.generator.isOn && __classPrivateFieldGet(this, _GenerationSite_shouldTurnGeneratorOff, "f").call(this, this.batteryBank.soc, t)) {
                this.generator.turnOff();
            }
            // If the generator is off but should be on, turn it on.
            if (!this.generator.isOn && __classPrivateFieldGet(this, _GenerationSite_shouldTurnGeneratorOn, "f").call(this, this.batteryBank.soc, t)) {
                this.generator.turnOn();
            }
            // If the generator is still on, use it to charge the batteries.
            // Note: this commands the generator to charge the batteries at 100% generator loading fraction.
            if (this.generator.isOn) {
                let generatorResponse = this.generator.supply(this.generator.ratedPower, dt);
                generatorLoad = generatorResponse.energy;
                generatorFuelConsumption = generatorResponse.diesel;
                __classPrivateFieldGet(this, _GenerationSite_batteryInverter, "f").requestChargeBatteries(generatorLoad, dt);
            }
        }
        var availableACFromPVInverters = this.pvInverters.getEnergy(dcArrayOutputkWhPerkWp, dt);
        var totalSolarToLoad = 0;
        var totalBatteryToLoad = 0;
        var totalSolarToBattery = ccSolarToBattery;
        // If the PV inverters can supply the load
        if (load <= availableACFromPVInverters) {
            // Fulfill entire load
            totalSolarToLoad += load;
            energySentToLoad += totalSolarToLoad;
            // Send the excess to the batteries
            var extraACFromPVInverters = load - availableACFromPVInverters;
            var energyStored = this.batteryInverter.requestChargeBatteries(extraACFromPVInverters, dt);
            totalSolarToBattery += energyStored;
            wastedSolar += extraACFromPVInverters - energyStored; // Note: this counts energy lost due to battery inverter inefficiency as wasted solar. As of now, I don't count losses due to inverting battery DC as wasted energy.
            // If the PV inverters can't supply the load, request the remainder from the batteries
        }
        else {
            totalSolarToLoad += availableACFromPVInverters;
            energySentToLoad += totalSolarToLoad;
            totalBatteryToLoad = this.batteryInverter.requestAC(load - energySentToLoad, dt);
            energySentToLoad += totalBatteryToLoad;
        }
        return {
            availableACFromPVInverters: availableACFromPVInverters,
            availableDCFromCCs: availableDCFromCCs,
            loadWithDxLosses: load,
            batterySOCkWh: this.batteryBank.energy,
            batterySOC: this.batteryBank.soc,
            totalSolarToLoad: totalSolarToLoad,
            totalSolarToBattery: totalSolarToBattery,
            totalBatteryToLoad: totalBatteryToLoad,
            totalEnergyToLoad: energySentToLoad,
            generatorLoad: generatorLoad,
            generatorFuelConsumption: generatorFuelConsumption,
            remainingLoad: load - energySentToLoad,
            wastedSolar: wastedSolar
        };
    }
}
_GenerationSite_batteryInverter = new WeakMap(), _GenerationSite_batteryBank = new WeakMap(), _GenerationSite_pvInverters = new WeakMap(), _GenerationSite_chargeControllers = new WeakMap(), _GenerationSite_generator = new WeakMap(), _GenerationSite_shouldTurnGeneratorOn = new WeakMap(), _GenerationSite_shouldTurnGeneratorOff = new WeakMap(), _GenerationSite_acBus = new WeakMap();
class MiniGrid {
    constructor(customers, tariff, dxLosses) {
        _MiniGrid_customers.set(this, void 0);
        _MiniGrid_tariff.set(this, void 0);
        _MiniGrid_dxLosses.set(this, void 0);
        _MiniGrid_dcArrayOutputkWhPerkWpFn.set(this, void 0);
        _MiniGrid_generationSite.set(this, void 0);
        __classPrivateFieldSet(this, _MiniGrid_customers, customers, "f");
        __classPrivateFieldSet(this, _MiniGrid_tariff, tariff, "f");
        __classPrivateFieldSet(this, _MiniGrid_dxLosses, dxLosses, "f");
    }
    place(latitude, longitude, roofMounted = false, PVWATTS_API_KEY) {
        const url = `https://developer.nrel.gov/api/pvwatts/v8.json?api_key=${PVWATTS_API_KEY}&lat=${latitude}&lon=${longitude}&system_capacity=1&module_type=0&losses=0&array_type=${roofMounted ? 1 : 0}&tilt=10&azimuth=180&timeframe=hourly&dataset=intl`;
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', url);
            request.onload = () => {
                if (request.status === 200) {
                    var dcArrayOutputkWhPerkWpArr = [...JSON.parse(request.response).outputs.dc];
                    __classPrivateFieldSet(this, _MiniGrid_dcArrayOutputkWhPerkWpFn, t => dcArrayOutputkWhPerkWpArr[Math.round(t) % (HR_PER_DAY * DAYS_PER_YR)], "f");
                    resolve(JSON.parse(request.response));
                }
                else {
                    reject(Error(request.statusText));
                }
            };
            request.onerror = () => {
                reject(Error('Network Error'));
            };
            request.send();
        });
    }
    buildGenerationSite(generationSite) {
        __classPrivateFieldSet(this, _MiniGrid_generationSite, generationSite, "f");
    }
    getDCArrayOutputkWhPerkWp(t) {
        return __classPrivateFieldGet(this, _MiniGrid_dcArrayOutputkWhPerkWpFn, "f").call(this, t);
    }
    operate(t, dt) {
        var dcArrayOutputkWhPerkWp = this.getDCArrayOutputkWhPerkWp(t);
        var load = 0;
        __classPrivateFieldGet(this, _MiniGrid_customers, "f").forEach(customer => {
            load += customer.getTotalLoad(__classPrivateFieldGet(this, _MiniGrid_tariff, "f").call(this, customer.name, t), t);
        });
        var result = __classPrivateFieldGet(this, _MiniGrid_generationSite, "f").operate(t, dt, dcArrayOutputkWhPerkWp, load / (1 - __classPrivateFieldGet(this, _MiniGrid_dxLosses, "f")));
        return {
            availableACFromPVInverters: result.availableACFromPVInverters,
            availableDCFromCCs: result.availableDCFromCCs,
            loadWithDxLosses: result.loadWithDxLosses,
            batterySOCkWh: result.batterySOCkWh,
            batterySOC: result.batterySOC,
            totalSolarToLoad: result.totalSolarToLoad,
            totalSolarToBattery: result.totalSolarToBattery,
            totalBatteryToLoad: result.totalBatteryToLoad,
            totalEnergyToLoad: result.totalEnergyToLoad,
            generatorLoad: result.generatorLoad,
            generatorFuelConsumption: result.generatorFuelConsumption,
            wastedSolar: result.wastedSolar,
            load: load,
            remainingLoadWithDxLosses: result.remainingLoad,
            remainingLoad: load - result.totalEnergyToLoad * (1 - __classPrivateFieldGet(this, _MiniGrid_dxLosses, "f"))
        };
    }
}
_MiniGrid_customers = new WeakMap(), _MiniGrid_tariff = new WeakMap(), _MiniGrid_dxLosses = new WeakMap(), _MiniGrid_dcArrayOutputkWhPerkWpFn = new WeakMap(), _MiniGrid_generationSite = new WeakMap();
/**
 * Simulate mini-grid performance over time.
 *
 * @param {number} t - The total amount of time to simulate [hr].
 * @param {number} dt - The time interval between simulation steps [hr].
 * @param {number} latitude - The latitude of the generation site.
 * @param {number} longitude - The longitude of the generation site.
 * @param {string} PVWATTS_API_KEY - Alphanumeric key for PV Watts API
 * @param {number} panelsPerStringCC - Number of panels in one string connected to a charge controller
 * @param {number} stringsPerSubarrayCC - Number of strings in one subarray connected to a charge controller
 * @param {number} numChargeControllers - Number of charge controllers at site
 * @param {number} numBatteries - Number of batteries at site
 */
async function simulate(t, dt, latitude, longitude, PVWATTS_API_KEY, panelsPerStringCC, stringsPerSubarrayCC, numChargeControllers, numBatteries) {
    var jkm445m = new Panel(0.445, 49.07, 41.17, 11.46, 10.81, 445 * 0.2630);
    var panels = [];
    for (let p = 0; p < panelsPerStringCC; p++) {
        panels.push(jkm445m.copy());
    }
    var pvString = new PVString(panels);
    var pvStrings = [];
    for (let s = 0; s < stringsPerSubarrayCC; s++) {
        pvStrings.push(pvString.copy());
    }
    var subarray = new Subarray(pvStrings, 0.1);
    var pvInput = new PVInput(60, 245, 60, 245, 70, 70, 4.9);
    pvInput.connectSubarray(subarray);
    var cc = new ChargeController(85, [pvInput], 588.88);
    var ccs = [];
    for (let c = 0; c < numChargeControllers; c++) {
        ccs.push(cc.copy());
    }
    var ccGroup = new DCCoupledPVGenerationEquipment(ccs);
    var pvInvGroup = new ACCoupledPVGenerationEquipment([]);
    var smd143 = new Battery(14.3, 0.1, 0, 0, 1000);
    var batteries = [];
    for (let b = 0; b < numBatteries; b++) {
        batteries.push(smd143.copy());
    }
    var batteryBank = new BatteryBank(batteries, 48);
    var batteryInv = new BatteryInverter(15, .95, .95, 1000);
    var site = new GenerationSite(batteryInv, batteryBank, pvInvGroup, ccGroup, null);
    // minigrid.buildGenerationSite(site)
    for (let t = 0; t < 12; t++) {
        // console.log(minigrid.operate(t, 1))
    }
}
async function run() {
    // Get credentials
    var creds;
    const loadCredFile = new Promise((resolve, reject) => {
        const credFileInput = document.getElementById('cred-file');
        const credsFR = new FileReader();
        credsFR.onload = (e) => {
            const contents = credsFR.result;
            creds = JSON.parse(contents);
            resolve(null);
        };
        credsFR.readAsText(credFileInput.files[0]);
    });
    await loadCredFile;
    // Get customers
    var customers;
    const loadCustomerFile = new Promise((resolve, reject) => {
        const custFileInput = document.getElementById('customers_customers');
        const custFR = new FileReader();
        custFR.onload = (e) => {
            const contents = custFR.result;
            const rows = contents.split('\r\n');
            const custTypes = rows[0].split(',').slice(1);
            for (let c = 0; c < custTypes.length; c++) {
                var loadProfileArr = new Array(HR_PER_DAY * DAYS_PER_YR);
                for (let t = 0; t < HR_PER_DAY * DAYS_PER_YR; t++) {
                    const load = rows[t + 3].split(',')[c + 1];
                    console.log(load);
                    resolve(null);
                }
            }
            resolve(null);
        };
        custFR.readAsText(custFileInput.files[0]);
    });
    await loadCustomerFile;
    // TODO: Extract data from form
    const latitude = document.getElementById('location_lat').value;
    const longitude = document.getElementById('location_lat').value;
    // TODO: Pick battery inverter and genset to be barely big enough to handle load
    // Initialize Mini-Grid
    var genericCustomer = new Customer('generic', t => 30, 2);
    var customers = [genericCustomer];
    var minigrid = new MiniGrid(customers, (name, t) => 1, 0.1);
    // await minigrid.place(latitude, longitude, false, PVWATTS_API_KEY)
    // TODO: Optimization loop
    // For each combination of decision variables
    // TODO: Simulate
    // TODO: Create BOQ
    // TODO: Compute IRR
    // Move in the direction of steepest IRR ascent
}
document.getElementById('run').addEventListener('click', run);
