export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  CNG = 'cng',
  ELECTRIC = 'electric',
}

export enum Transmission {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  SCOOTER_CVT = 'scooter-cvt',
  DUAL_CLUTCH = 'dual-clutch',
  SEMI_AUTOMATIC = 'semi-automatic',
}

export enum Trim {
  BASE = 'base',
  MID_LEVEL = 'mid-level',
  TOP = 'top',
  SPORT = 'sport',
  OFF_ROAD = 'off-road',
  LUXURY = 'luxury',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric',
  LIMITED_EDITION = 'limited-edition',
  PERFORMANCE = 'performance',
  COMMERCIAL = 'commercial',
}

export enum EngineType {
  INTERNAL_COMBUSTION = 'internal-combustion-engine',
  HYBRID = 'hybrid-engine',
  ELECTRIC = 'electric-motor',
  ROTARY = 'rotary-engine',
  HYDROGEN_FUEL_CELL = 'hydrogen-fuel-cell',
  COMPRESSED_NATURAL_GAS = 'compressed-natural-gas-engine',
  LIQUEFIED_PETROLEUM_GAS = 'liquefied-petroleum-gas-engine',
}

export enum NumberOfCylinders {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
}

export enum ValvesPerCylinder {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
}

export enum GearBox {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
  TEN = 10,
}

export enum DriveType {
  RWD = 'rwd',
  FWD = 'fwd',
  AWD = 'awd',
  FOUR_WD = '4wd',
  PART_TIME_FOUR_WD = 'part-time-4wd',
  FULL_TIME_FOUR_WD = 'full-time-4wd',
  REAL_WHEEL_DRIVE_WITH_FRONT_WHEEL_DRIVE_ASSIST = 'real-wheel-drive-with-front-wheel-drive-assist',

  //for bikes
  CHAIN_DRIVE = 'chain-drive',
  BELT_DRIVE = 'belt-drive',
  SHAFT_DRIVE = 'shaft-drive',
}

export enum EmmissionNorm {
  BS1 = 'bs1',
  BS2 = 'bs2',
  BS3 = 'bs3',
  BS4 = 'bs4',
  BS5 = 'bs5',
  BS6 = 'bs6',
  EURO_I = 'euro-i',
  EURO_II = 'euro-ii',
  EURO_III = 'euro-iii',
  EURO_IV = 'euro-iv',
  EURO_V = 'euro-v',
  EURO_VI = 'euro-vi',
  EURO_VII = 'euro-vii',
}

export enum SteeringType {
  ELECTRONIC_POWER = 'electronic-power',
  MANUAL = 'manual',
  RACK_AND_PINION = 'rack-and-pinion',
  RECIRCULATING_BALL = 'recirculating-ball',
  POWER = 'power',
  HYDRAULIC_POWER = 'hydraulic-power',
  FOUR_WHEEL = 'four-wheel',
  VARIABLE_GEAR_RATIO = 'variable-gear-ratio',
  STEER_BY_WIRE = 'steer-by-wire',
}

export enum TurnSignalType {
  FRONT_TURN_SIGNAL_LAMP = 'front-turn-signal-lamp',
  REAR_TURN_SIGNAL_LAMP = 'rear-turn-signal-lamp',
}

export enum SteeringGearType {
  RACK_AND_PINION = 'rack-and-pinion',
  RECIRCULATING_BALL = 'recirculating-ball',
  WORM_AND_SECTOR = 'worm-and-sector',
}

export enum RearSuspensionSystem {
  INDEPENDENT_REAR_SUSPENSION = 'independent-rear-suspension',
  MULTI_LINK_SUSPENSION = 'multi-link-suspension',
  DOUBLE_WISHBONE_SUSPENSION = 'double-wishbone-suspension',
  TRAILING_ARM_SUSPENSION = 'trailing-arm-suspension',
  SEMI_INDEPENDENT_REAR_SUSPENSION = 'semi-independent-rear-suspension',
  TORSION_BEAM_SUSPENSION = 'torsion-beam-suspension',
  TWIST_BEAM_SUSPENSION = 'twist-beam-suspension',
  SOLID_AXLE_REAR_SUSPENSION = 'solid-axle-rear-suspension',
  AIR_SUSPENSION = 'air-suspension',
  ACTIVE_SUSPENSION = 'active-suspension',
  LEAF_SPRING_SUSPENSION = 'leaf-spring-suspension',
  COIL_SPRING_SUSPENSION = 'coil-spring-suspension',

  //for bikes
  MONO_SHOCK_REAR_SUSPENSION = 'mono-shock-rear-suspension',
  TWIN_SHOCK_REAR_SUSPENSION = 'twin-shock-rear-suspension',
}

export enum FrontSuspensionSystem {
  INDEPENDENT_FRONT_SUSPENSION = 'independent-front-suspension',
  MACPHERSON_STRUT = 'macpherson-strut',
  DOUBLE_WISHBONE = 'double-wishbone',
  MULTI_LINK = 'multi-link',
  DEPENDENT_FRONT_SUSPENSION = 'dependent-front-suspension',
  TORSION_BEAM = 'torsion-beam',
  SOLID_AXLE = 'solid-axle',
  HYBRID_FRONT_SUSPENSIONS = 'hybrid-front-suspensions',
  AIR_SUSPENSION = 'air-suspension',
  ACTIVE_SUSPENSION = 'active-suspension',

  //for bikes and scooty
  TELESCOPIC_FORKS = 'telescopic-forks',
  UPSIDE_DOWN_FORKS = 'upside-down-forks',
  CARTRIDGE_FORKS = 'cartridge-forks',
  SINGLE_SHOCK_MONOSHOCK_FRONT_SUSPENSION = 'single-shock-monoshock-front-suspension',
  TELELEVER = 'telelever',
  DUOLEVER = 'duolever',
  HUB_CENTER_STEERING = 'hub-center-steering',
  LEADING_LINK_SUSPENSION = 'leading-link-suspension',
  HYDRAULIC_FRONT_FORKS = 'hydraulic-front-forks',
}

export enum BrakeType {
  DISC_BRAKE = 'disc-brake',
  DRUM_BRAKE = 'drum-brake',
}

export enum SeatingCapacity {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
}

export enum Doors {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

export enum AirBags {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
}

export enum Speakers {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
}

export enum MotorType {
  MAIN_PROPULSION_MOTOR = 'main-propulsion-motor',
  PERMANENT_MAGNET_SYNCHRONOUS_MOTOR = 'permanent-magnet-synchronous-motor',
  ASYNCHRONOUS_AC_INDUCTION_MOTOR = 'asynchronous-ac-induction-motor',
  AUXILIARY_MOTORS = 'auxiliary-motors',
  HEATING_VENTILATION_AND_AIR_CONDITIONING_MOTOR = 'heating-ventilation-and-air-conditioning-motor',
  POWER_STEERING_MOTOR = 'power-steering-motor',
  REGENERATIVE_BRAKING_MOTOR = 'regenerative-braking-motor',
  FRONT_AND_REAR_MOTORS = 'front-and-rear-motors',
  AXLE_MOTORS = 'axle-motors',
  RANGE_EXTENDER = 'range-extender',
}

export enum CoolingSystem {
  AIR_COOLING = 'air-cooling',
  LIQUID_COOLING = 'liquid-cooling',
  OIL_COOLING = 'oil-cooling',
  AIR_AND_OIL_COOLING = 'air-and-oil-cooling',
}

export enum Starting {
  KICK_START = 'kick-start',
  ELECTRIC_START = 'electric-start',
  COMBINATION_START = 'combination-start',
  KEYLESS_START = 'keyless-start',
  SMART_START = 'smart-start',
  KICK_AND_ELECTRIC_HYBRID_START = 'kick-and-electric-hybrid-start',
}

export enum FuelSupply {
  FUEL_TANK = 'fuel-tank',
  FUEL_PUMP = 'fuel-pump',
  FUEL_LINES = 'fuel-lines',
  FUEL_INJECTION_SYSTEM = 'fuel-injection-system',
  CARBURETOR = 'carburetor',
  FUEL_FILTERS = 'fuel-filters',
  OVERFLOW_AND_VENTILATION = 'overflow-and-ventilation',
  FUEL_CAP = 'fuel-cap',
  FUEL_GAUGE_AND_FUEL_LEVEL_SENSOR = 'fuel-gauge-and-fuel-level-sensor',
}

export enum ClutchType {
  MANUAL_CLUTCH = 'manual-clutch',
  AUTOMATIC_CLUTCH = 'automatic-clutch',
}

export enum BikeBodyType {
  STANDARD = 'standard',
  CRUISER = 'cruiser',
  SPORTBIKE = 'sportbike',
  TOURING = 'touring',
  ADVENTURE_TOURING = 'adventure-touring',
  DUAL_SPORT = 'dual-sport',
  DIRT_BIKE = 'dirt-bike',
  CAFE_RACER = 'cafe-racer',
  BOBBER = 'bobber',
  CHOPPER = 'chopper',
  SPORT_TOURING = 'sport-touring',
  SCRAMBLER = 'scrambler',
  NAKED = 'naked',
  ELECTRIC = 'electric',
  MINI_BIKE = 'mini-bike',
  THREE_WHEELER = 'three-wheeler',
  CUSTOM_BUILT = 'custom-built',
}

export enum FrameDesign {
  DELTABOX = 'deltabox-frame',
  TRELLIS = 'trellis-frame',
  TWIN_SPAR = 'twin-spar-frame',
  PERIMETER = 'perimeter-frame',
  BACKBONE = 'backbone-frame',
  MONOCOQUE = 'monocoque-frame',
  SINGLE_CRADLE = 'single-cradle-frame',
  DOUBLE_CRADLE = 'double-cradle-frame',
  SEMI_DOUBLE_CRADLE = 'semi-double-cradle-frame',

  //for electirc bike/scooty
  DIAMOND_FRAME = 'diamond-frame',
  STEP_THROUGH_FRAME = 'step-through-frame',
  CARGO_OR_LONGTAIL_FRAME = 'cargo-or-longtail-frame',
  FOLDING_FRAME = 'folding-frame',
  FULL_SUSPENSION_FRAME = 'full-suspension-frame',
  TRIKE_FRAME = 'trike-frame',
  RECUMBENT_FRAME = 'recumbent-frame',
  CARGO_BOX_OR_BOX_BIKE_FRAME = 'cargo-box-or-box-bike-frame',
}

export enum HeadlightType {
  HALOGEN_HEADLIGHTS = 'halogen-headlights',
  LED_HEADLIGHTS = 'led-headlights',
}

export enum TailLightType {
  STANDARD_TAIL_LIGHT = 'standard-tail-light',
  LED_TAIL_LIGHT = 'led-tail-light',
  INTEGRATED_TAIL_LIGHT = 'integrated-tail-light',
  SEQUENTIAL_LED_TAIL_LIGHT = 'sequential-led-tail-light',
  CUSTOM_TAIL_LIGHT = 'custom-tail-light',
  FENDER_MOUNTED_TAIL_LIGHT = 'fender-mounted-tail-light',
  UNDER_TAIL_TAIL_LIGHT = 'under-tail-tail-light',
  TAIL_LIGHT_WITH_INTEGRATED_REFLECTORS = 'tail-light-with-integrated-reflectors',
  DUAL_TAIL_LIGHTS = 'dual-tail-lights',
  HALO_TAIL_LIGHT = 'halo-tail-light',
}

export enum ABS {
  NO_ABS = 'no-abs',
  SINGLE_CHANNEL_ABS = 'single-channel-abs',
  DUAL_CHANNEL_ABS = 'dual-channel-abs',
}
