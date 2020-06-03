export enum EnumSite {
  CsGoEmpire = 1,
  Rollbit = 2
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
    case EnumBot.RollbitCsGoLogger: return "Rollbit Logger";
    default: throw new Error("Bot not found");
  }
}