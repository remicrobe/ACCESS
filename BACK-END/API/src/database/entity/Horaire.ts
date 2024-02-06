import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Horaire {
    @PrimaryGeneratedColumn()
    id: number;

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


}
