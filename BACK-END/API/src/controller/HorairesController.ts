import { Horaires } from '../database/entity/Horaires';
import { AppDataSource } from '../database/datasource';

export async function creerHoraires(
    hDebLundi: string,
    hFinLundi: string,
    hDebMardi: string,
    hFinMardi: string,
    hDebMercredi: string,
    hFinMercredi: string,
    hDebJeudi: string,
    hFinJeudi: string,
    hDebVendredi: string,
    hFinVendredi: string,
    hDebSamedi: string,
    hFinSamedi: string,
    hDebDimanche: string,
    hFinDimanche: string
) {
    const horaires = new Horaires();
    horaires.hDebLundi = hDebLundi;
    horaires.hFinLundi = hFinLundi;
    horaires.hDebMardi = hDebMardi;
    horaires.hFinMardi = hFinMardi;
    horaires.hDebMercredi = hDebMercredi;
    horaires.hFinMercredi = hFinMercredi;
    horaires.hDebJeudi = hDebJeudi;
    horaires.hFinJeudi = hFinJeudi;
    horaires.hDebVendredi = hDebVendredi;
    horaires.hFinVendredi = hFinVendredi;
    horaires.hDebSamedi = hDebSamedi;
    horaires.hFinSamedi = hFinSamedi;
    horaires.hDebDimanche = hDebDimanche;
    horaires.hFinDimanche = hFinDimanche;

    return await AppDataSource.getRepository(Horaires).save(horaires);
}

export async function obtenirHorairesParID(id: number) {
    return await AppDataSource.getRepository(Horaires).findOneBy({id});
}

export async function mettreAJourHoraires(id: number, horaires: Partial<Horaires>) {
    const horairesExistant = await obtenirHorairesParID(id);
    if (!horairesExistant) {
        return null; // Horaires non trouvés
    }

    // Mettre à jour les propriétés fournies
    Object.assign(horairesExistant, horaires);

    return await AppDataSource.getRepository(Horaires).save(horairesExistant);
}

export async function supprimerHoraires(id: number) {
    const horaires = await obtenirHorairesParID(id);
    if (!horaires) {
        return false; // Horaires non trouvés
    }

    await AppDataSource.getRepository(Horaires).remove(horaires);
    return true; // Suppression réussie
}
