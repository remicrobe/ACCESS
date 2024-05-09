import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Collaborateur } from "./Collab";

@Entity()
export class HorairesModele {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @Column({type: 'time', default: '00:00:00'})
    hDebLundi: string;

    @Column({type: 'time', default: '00:00:00'})
    hFinLundi: string;

    @Column({type: 'time', default: '00:00:00'})
    hDebMardi: string;

    @Column({type: 'time', default: '00:00:00'})
    hFinMardi: string;

    @Column({type: 'time', default: '00:00:00'})
    hDebMercredi: string;

    @Column({type: 'time', default: '00:00:00'})
    hFinMercredi: string;

    @Column({type: 'time', default: '00:00:00'})
    hDebJeudi: string;

    @Column({type: 'time', default: '00:00:00'})
    hFinJeudi: string;

    @Column({type: 'time', default: '00:00:00'})
    hDebVendredi: string;

    @Column({type: 'time', default: '00:00:00'})
    hFinVendredi: string;

    @Column({type: 'time', default: '00:00:00'})
    hDebSamedi: string;

    @Column({type: 'time', default: '00:00:00'})
    hFinSamedi: string;

    @Column({type: 'time', default: '00:00:00'})
    hDebDimanche: string;

    @Column({type: 'time', default: '00:00:00'})
    hFinDimanche: string;

    @OneToMany(() => Collaborateur, collab => collab.horairesdefault, {nullable: true})
    collabs: Collaborateur[];


}
