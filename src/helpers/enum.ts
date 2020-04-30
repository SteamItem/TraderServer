export enum siteEnum {
  CsGoEmpire = 1,
  Rollbit = 2
}

export function siteText(site: siteEnum): string {
  switch (site) {
    case siteEnum.CsGoEmpire: return "CSGOEmpire";
    case siteEnum.Rollbit: return "Rollbit";
    default: throw new Error("Site not found");
  }
}

export enum botEnum {
  CsGoInstant = 1,
  CsGoDota = 2,
  RollbitCsgo = 3
}

export function botText(bot: botEnum): string {
  switch(bot) {
    case botEnum.CsGoInstant: return "Instant";
    case botEnum.CsGoDota: return "Dota";
    case botEnum.RollbitCsgo: return "Rollbit";
    default: throw new Error("Bot not found");
  }
}