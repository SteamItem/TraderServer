export enum EnumSite {
  CsGoEmpire = 1,
  Rollbit = 2
}

export function siteText(site: EnumSite): string {
  switch (site) {
    case EnumSite.CsGoEmpire: return "CSGOEmpire";
    case EnumSite.Rollbit: return "Rollbit";
    default: throw new Error("Site not found");
  }
}

export enum EnumBot {
  EmpireInstant = 1,
  EmpireDota = 2,
  RollbitCsGo = 3,
  RollbitCsGoLogger = 4
}

export function getBotText(bot: EnumBot): string {
  switch(bot) {
    case EnumBot.EmpireInstant: return "Instant";
    case EnumBot.EmpireDota: return "Dota";
    case EnumBot.RollbitCsGo: return "Rollbit";
    default: throw new Error("Bot not found");
  }
}

export enum EnumSteamApp {
  CsGo = 730,
  Dota = 570
}