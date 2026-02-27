export const AFRICA_REGIONS = {
  BJ: { name: 'Bénin',          currency: 'FCFA', cities: { CTN:'Cotonou', PNV:'Porto-Novo', CAL:'Abomey-Calavi', PAR:'Parakou' }},
  CI: { name: "Côte d'Ivoire",  currency: 'FCFA', cities: { ABJ:'Abidjan', YMO:'Yamoussoukro', BOK:'Bouaké', SAN:'San-Pédro' }},
  SN: { name: 'Sénégal',        currency: 'FCFA', cities: { DKR:'Dakar', THI:'Thiès', KAO:'Kaolack', SLO:'Saint-Louis' }},
  CM: { name: 'Cameroun',       currency: 'FCFA', cities: { YAO:'Yaoundé', DLA:'Douala', BAF:'Bafoussam', GAR:'Garoua' }},
  GH: { name: 'Ghana',          currency: 'GHS',  cities: { ACC:'Accra', KSI:'Kumasi', TAM:'Tamale', TKW:'Takoradi' }},
  TG: { name: 'Togo',           currency: 'FCFA', cities: { LOM:'Lomé', SOK:'Sokodé', KPM:'Kpalimé' }},
  ML: { name: 'Mali',           currency: 'FCFA', cities: { BAM:'Bamako', SIK:'Sikasso', MOP:'Mopti' }},
  BF: { name: 'Burkina Faso',   currency: 'FCFA', cities: { OUA:'Ouagadougou', BOB:'Bobo-Dioulasso' }},
  NG: { name: 'Nigeria',        currency: 'NGN',  cities: { LAG:'Lagos', ABU:'Abuja', PHC:'Port Harcourt', KAN:'Kano' }},
  KE: { name: 'Kenya',          currency: 'KES',  cities: { NAI:'Nairobi', MSA:'Mombasa', KSM:'Kisumu' }},
  ZA: { name: 'Afrique du Sud', currency: 'ZAR',  cities: { JHB:'Johannesburg', CPT:'Cape Town', DRB:'Durban' }},
  GN: { name: 'Guinée',         currency: 'GNF',  cities: { CNK:'Conakry', KDR:'Kindia' }},
  MR: { name: 'Mauritanie',     currency: 'MRU',  cities: { NKC:'Nouakchott', NDB:'Nouadhibou' }},
} as const;

export type CountryCode = keyof typeof AFRICA_REGIONS;

export function countryName(cc: string): string {
  return (AFRICA_REGIONS as Record<string, { name: string }>)[cc]?.name ?? cc;
}

export function cityName(cc: string, cityCode: string): string {
  const region = (AFRICA_REGIONS as Record<string, { cities: Record<string, string> }>)[cc];
  return region?.cities[cityCode] ?? cityCode;
}
