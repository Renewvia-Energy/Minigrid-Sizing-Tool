var costs = {
    Batteries: {
        Customs: {
            ClearingAgentFees: 71.67,
            InspectionFee: 50,
            NonVAtCustoms: 5135.24,
            PortFees: 106.43,
            VAT: 155.13,
        },
        Materials: {
            Batteries: 22000,
        },
        Transport: {
            InternationalTransport: 444
        }
    },
    CommunityRelations: {
        DirectJobCost: {},
        EquipmentRentals: {},
        Labor: {}
    },
    CusomerMeteringAndWiring: {
        DirectJobCost: {},
        EquipmentRentals: {},
        Labor: {},
        Material: {
            MeteringBaseStation: 1050,
            SM200EMeters: 150,
            SMRPIMeters: 17280,
            SMRDSMeters: 486.62
        },
        Transport: {
            CustomerDropWireTransportToSite: 486.62,
            InternationalTransport: 2367.26
        },
        Customs: {
            ClearingAgentFees:358.33,
            InspectionFee: 250,
            NonVAtCustoms: 250,
            PortFees: 9816.28,
            VAT: 0
        }
    },
    Distribution: {
        Contingency: {
            DistributionContingency: 6618.68 
        },
        DirectJobCost: {
            DistributionSurveyor: 313.87 
        },
        Labor: {
            DistributionLabor: 15439.09 
        },
        Materials: {
            DistributionMaterials: 54927.01 
        },
        Transport: {
            DistributionMaterialsRoadTransport: 729.93
        }
    },
    Fencing: {
        Labor: {
            FencingLabor:  425.79,
        },
        Materials: {
            FencingMaterials: 1830.90,
        },
        Transport: {
            FencingMaterialsTransport: 183.09,
        }
    },
    Generator: {
        Labor: {},
        Materials: {},
        Transport: {}
    },
    Intervers: {
        Customs: {
            ClearingAgentFees: {
                NotSpecify : 358.33,
                SGS : 250.00,
                NCS :  209.69,
                NPA : 532.13 ,
            },
            NonVAtCustoms: 403.39 ,
            VAT: 0,
            VictronSmartSolarMPPT25085ChargeController: 5888.80 
        },
        Materials: {
            BatteryInverterVictronQuattro15kW:  2600.00 
        },
        Transport: {
            InternationalTransport: 540
        }
    },
    Permits: {
        Contingency: {},
        DirectJobCost: {}
    },
    PlantBalanceOfSystem: {
        Contingency: {},
        Labor: {},
        Materials: {},
    },
    PlantSite: {
        Labor: {},
        Materials: {},
    },
    PowerHouse: {
        Labor: {},
        Materials: {},
        Transport: {
            PowerHouseTransportByRoad: 486.62 
        }
    },
    RackingAndMounting: {
        Customs: {
            ClearingAgentFees:  358.33,
            InspectionFee: 250.00,
            NonVATCustoms:  739.46,
            PortFees:  532.13,
            VAT:  23.45,
        },
        Materials: {
            Racking:  2430.00 
        },
        Transport: {
            TransportToSite: 243.31,
        },
        Labor: {
            RackingLabor: 486
        }
    },
    SolarPanels: {
        Customs: {
            ClearingAgentFees:  358.33,
            InspectionFee: 36.29,
            NonVATCustoms:  201.92,
            PortFees:  77.24,
            VAT:  0
        },
        Contingency: {},
        Labor: {},
        Material: {
            SolarPanels: 13267.80 
        },
        Transport: {
            InternationalTransport: 580.65,
            TransportToSite: 486.62 
        },
    },
    TemporaryFacilities: {
        Contingency: {},
        EquipmentRentals: {}
    },
    Transmission: {
        Contingency: {},
        Labor: {},
        Material: {},
        Transport: {},
    },
    TravelLodgingandMeals: {
        EquipmentRentals: {},
        DirectJobCost: {},
        ConstructionConsumables: {}
    }
}
