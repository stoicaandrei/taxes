const SALARIU_MINIM_BRUT = 4050;

const CAS_PCT = 0.25;
const CAS_PLAFON_12_SM = 12 * SALARIU_MINIM_BRUT;
const CAS_PLAFON_24_SM = 24 * SALARIU_MINIM_BRUT;

const CASS_PCT = 0.1;
const CASS_PLAFON_6_SM = 6 * SALARIU_MINIM_BRUT;
const CASS_PLAFON_60_SM = 60 * SALARIU_MINIM_BRUT; // pentru PFA
const CASS_PLAFON_12_SM = 12 * SALARIU_MINIM_BRUT; // pentru SRL
const CASS_PLAFON_24_SM = 24 * SALARIU_MINIM_BRUT; // pentru SRL

const IMPOZIT_VENIT_PFA_PCT = 0.1;

const IMPOZIT_PROFIT_SRL_PCT = 0.16;
const IMPOZIT_DIVIDENDE_SRL_PCT = 0.16;

export const taxePfa = (venitAnual: number, cheltuieliAnuale: number) => {
  const venitDupaCheltuieli = venitAnual - cheltuieliAnuale;

  const casDatorat = plafonCAS(venitDupaCheltuieli) * CAS_PCT;
  const cassDatorat = plafonCassPfa(venitDupaCheltuieli) * CASS_PCT;

  const venitDupaContributii = venitDupaCheltuieli - casDatorat - cassDatorat;
  const impozitDatorat = venitDupaContributii * IMPOZIT_VENIT_PFA_PCT;

  const totalTaxe = casDatorat + cassDatorat + impozitDatorat;

  const venitNetDupaTaxe = venitAnual - totalTaxe;

  return {
    casDatorat,
    cassDatorat,
    impozitDatorat,
    totalTaxe,
    venitNetDupaTaxe,
  };
};

export const taxeSrl = (
  venitAnual: number,
  cheltuieliAnuale: number,
  dividendeAnuale: number
) => {
  const venitNetAnual = venitAnual - cheltuieliAnuale;
  const impozitProfitDatorat = venitNetAnual * IMPOZIT_PROFIT_SRL_PCT;

  const impozitDividendeDatorat = dividendeAnuale * IMPOZIT_DIVIDENDE_SRL_PCT;
  const dividendeDupaImpozit = dividendeAnuale - impozitDividendeDatorat;
  const cassDatorat = plafonCassSrl(dividendeDupaImpozit) * CASS_PCT;
  const divdendeNete = dividendeDupaImpozit - cassDatorat;

  const totalTaxe =
    impozitProfitDatorat + impozitDividendeDatorat + cassDatorat;
  const venitNetDupaTaxe = venitNetAnual - totalTaxe - divdendeNete;

  return {
    impozitProfitDatorat,
    impozitDividendeDatorat,
    cassDatorat,
    totalTaxe,
    venitNetDupaTaxe,
    divdendeNete,
  };
};

const plafonCAS = (venitNetAnual: number) => {
  if (venitNetAnual <= CAS_PLAFON_12_SM) {
    return 0;
  } else if (venitNetAnual <= CAS_PLAFON_24_SM) {
    return CAS_PLAFON_12_SM;
  } else {
    return CAS_PLAFON_24_SM;
  }
};

const plafonCassPfa = (venitNetAnual: number) => {
  if (venitNetAnual <= CASS_PLAFON_6_SM) {
    return 0;
  } else if (venitNetAnual <= CASS_PLAFON_60_SM) {
    return venitNetAnual;
  } else {
    return CASS_PLAFON_60_SM;
  }
};

const plafonCassSrl = (venitNetAnual: number) => {
  if (venitNetAnual <= CASS_PLAFON_6_SM) {
    return 0;
  } else if (venitNetAnual <= CASS_PLAFON_12_SM) {
    return CASS_PLAFON_6_SM;
  } else if (venitNetAnual <= CASS_PLAFON_24_SM) {
    return CASS_PLAFON_12_SM;
  } else {
    return CASS_PLAFON_24_SM;
  }
};
