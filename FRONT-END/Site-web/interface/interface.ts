// Interface pour Service
export interface IService {
  id: number;
  chefservice: ICollaborateur | null;
  nomservice: string;
  collabs: ICollaborateur[] | null;
}

// Classe pour Service
class Service implements IService {
  id: number = undefined;
  chefservice: ICollaborateur = undefined;
  nomservice: string = undefined;
  collabs: ICollaborateur[] = undefined;

  constructor() {}
}

// Interface pour Collaborateur

export enum typeCollab {
  rh='rh',
  drh='drh',
  arh='arh',
  collab='collab'
}


export interface ICollaborateur {
  id: number;
  prenom: string;
  nom: string;
  mail: string;
  motdepasse: string | null;
  fonction: string;
  grade: typeCollab;
  tokens: IToken[];
  absences: IAbsence[];
  historique: IHistorique[];
  service: IService | null;
  horairesdefault: IHorairesModele | null;
  horaire: IHoraire | null;
  actif: boolean;
  valide: boolean;
  date: Date | null;
}

// Classe pour Collaborateur
export class Collaborateur implements ICollaborateur {
  id: number = undefined;
  prenom: string = undefined;
  nom: string = undefined;
  mail: string = undefined;
  motdepasse: string = undefined;
  fonction: string = undefined;
  grade: typeCollab = typeCollab.collab;
  tokens: IToken[] = undefined;
  absences: IAbsence[] = undefined;
  historique: IHistorique[] = undefined;
  service: IService = undefined;
  horairesdefault: IHorairesModele = undefined;
  horaire: IHoraire = undefined;
  actif: boolean = true;
  valide: boolean = false;
  date: Date = undefined;

  constructor() {}
}

// Interface pour Horaire
export interface IHoraire {
  id:number,
  hDebLundi:string,
  hFinLundi:string,
  hDebMardi:string,
  hFinMardi:string,
  hDebMercredi:string,
  hFinMercredi:string,
  hDebJeudi:string,
  hFinJeudi:string,
  hDebVendredi:string,
  hFinVendredi:string,
  hDebSamedi:string,
  hFinSamedi:string,
  hDebDimanche:string,
  hFinDimanche:string
}

// Classe pour Horaire
class Horaire implements IHoraire {
  id:number=undefined;
  hDebLundi:string='00:00';
  hFinLundi:string='00:00';
  hDebMardi:string='00:00';
  hFinMardi:string='00:00';
  hDebMercredi:string='00:00';
  hFinMercredi:string='00:00';
  hDebJeudi:string='00:00';
  hFinJeudi:string='00:00';
  hDebVendredi:string='00:00';
  hFinVendredi:string='00:00';
  hDebSamedi:string='00:00';
  hFinSamedi:string='00:00';
  hDebDimanche:string='00:00';
  hFinDimanche:string='00:00'

  constructor() {}
}

// Interface pour Token
export interface IToken {
  id: number;
  collab: ICollaborateur;
  type: tokenType;
  actif: boolean;
  token: string;
  datecreation: Date;
}

// Classe pour Token
class Token implements IToken {
  id: number = undefined;
  collab: ICollaborateur = undefined;
  type: tokenType = undefined;
  actif: boolean = undefined;
  token: string = undefined;
  datecreation: Date = undefined;

  constructor() {}
}

// Interface pour Absence
export interface IAbsence {
  id: number;
  collab: ICollaborateur;
  datedeb: Date;
  datefin: Date;
  raison: string;
  description: string | null;
  accepte: boolean | null;
  datereponse: Date | null;
  dateDemande: Date | null;
}

// Classe pour Absence
export class Absence implements IAbsence {
  id: number = undefined;
  collab: ICollaborateur = undefined;
  datedeb: Date = undefined;
  datefin: Date = undefined;
  raison: string = 'conge';
  description: string = undefined;
  accepte: boolean = undefined;
  datereponse: Date = undefined;
  dateDemande: Date = undefined;

  constructor() {}
}

// Interface pour Historique
export interface IHistorique {
  id:number,
  date:Date,
  collab:ICollaborateur,
  point:IAccess,
  statutUtilise:string
}

// Classe pour Historique
export class Historique implements IHistorique {
  id:number=undefined;
  date:Date=undefined;
  collab:ICollaborateur=undefined;
  point:IAccess=undefined;
  statutUtilise:string='Identité'

  constructor() {}
}

// Interface pour HorairesModele
export interface IHorairesModele {
  id:number,
  nom:string,
  hDebLundi:string,
  hFinLundi:string,
  hDebMardi:string,
  hFinMardi:string,
  hDebMercredi:string,
  hFinMercredi:string,
  hDebJeudi:string,
  hFinJeudi:string,
  hDebVendredi:string,
  hFinVendredi:string,
  hDebSamedi:string,
  hFinSamedi:string,
  hDebDimanche:string,
  hFinDimanche:string,
  collabs:ICollaborateur[]
}

// Classe pour HorairesModele
export class HorairesModele implements IHorairesModele {
  id:number=undefined;
  nom:string=undefined;
  hDebLundi:string='00:00';
  hFinLundi:string='00:00';
  hDebMardi:string='00:00';
  hFinMardi:string='00:00';
  hDebMercredi:string='00:00';
  hFinMercredi:string='00:00';
  hDebJeudi:string='00:00';
  hFinJeudi:string='00:00';
  hDebVendredi:string='00:00';
  hFinVendredi:string='00:00';
  hDebSamedi:string='00:00';
  hFinSamedi:string='00:00';
  hDebDimanche:string='00:00';
  hFinDimanche:string='00:00';
  collabs:ICollaborateur[]=[]

  constructor() {}
}

// Interface pour Access
export interface IAccess {
  id: number;
  macadress: string;
  typePoint: typePoint;
  location: string;
  nompoint: string;
  active: boolean;
  collabAutorise: ICollaborateur[];
  serviceAutorise: IService[];
  historique: IHistorique[];
}

// Classe pour Access
export enum typePoint {
  pointaccess='ap',
  pointeuse='pointeuse'
}

export class Access implements IAccess {
  id: number = undefined;
  macadress: string = undefined;
  typePoint: typePoint = typePoint.pointeuse;
  location: string = undefined;
  nompoint: string = undefined;
  active: boolean = undefined;
  collabAutorise: ICollaborateur[] = undefined;
  serviceAutorise: IService[] = undefined;
  historique: IHistorique[] = undefined;

  constructor() {}
}
