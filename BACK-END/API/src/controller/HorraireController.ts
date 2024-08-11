import {HorairesModele} from "../database/entity/HorairesModele";
import {AppDataSource} from "../database/datasource";
import {HorairesModeleRepository} from "../database/repository/HorairesModeleRepository";

export async function nouveauModele(name:string, Horaire:any) {
    let newHorraire = new HorairesModele()

    newHorraire.nom = name

    newHorraire.hDebLundi = Horaire.hDebLundi;
    newHorraire.hFinLundi = Horaire.hFinLundi;

    newHorraire.hDebMardi = Horaire.hDebMardi;
    newHorraire.hFinMardi = Horaire.hFinMardi;

    newHorraire.hDebMercredi = Horaire.hDebMercredi;
    newHorraire.hFinMercredi = Horaire.hFinMercredi;

    newHorraire.hDebJeudi = Horaire.hDebJeudi;
    newHorraire.hFinJeudi = Horaire.hFinJeudi;

    newHorraire.hDebVendredi = Horaire.hDebVendredi;
    newHorraire.hFinVendredi = Horaire.hFinVendredi;

    newHorraire.hDebSamedi = Horaire.hDebSamedi;
    newHorraire.hFinSamedi = Horaire.hFinSamedi;

    newHorraire.hDebDimanche = Horaire.hDebDimanche;
    newHorraire.hFinDimanche = Horaire.hFinDimanche;

    return await HorairesModeleRepository.save(newHorraire)
}

export async function editModele(id:number,name:string, Horaire:any) {
    let editHoraire = await HorairesModeleRepository.findOneByOrFail({id})

    editHoraire.nom = name

    editHoraire.hDebLundi = Horaire.hDebLundi;
    editHoraire.hFinLundi = Horaire.hFinLundi;

    editHoraire.hDebMardi = Horaire.hDebMardi;
    editHoraire.hFinMardi = Horaire.hFinMardi;

    editHoraire.hDebMercredi = Horaire.hDebMercredi;
    editHoraire.hFinMercredi = Horaire.hFinMercredi;

    editHoraire.hDebJeudi = Horaire.hDebJeudi;
    editHoraire.hFinJeudi = Horaire.hFinJeudi;

    editHoraire.hDebVendredi = Horaire.hDebVendredi;
    editHoraire.hFinVendredi = Horaire.hFinVendredi;

    editHoraire.hDebSamedi = Horaire.hDebSamedi;
    editHoraire.hFinSamedi = Horaire.hFinSamedi;

    editHoraire.hDebDimanche = Horaire.hDebDimanche;
    editHoraire.hFinDimanche = Horaire.hFinDimanche;

    return await HorairesModeleRepository.save(editHoraire)
}