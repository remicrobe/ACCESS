import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Horaires {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'time' })
    hDebLundi: string;

    @Column({ type: 'time' })
    hFinLundi: string;

    @Column({ type: 'time' })
    hDebMardi: string;

    @Column({ type: 'time' })
    hFinMardi: string;

    @Column({ type: 'time' })
    hDebMercredi: string;

    @Column({ type: 'time' })
    hFinMercredi: string;

    @Column({ type: 'time' })
    hDebJeudi: string;

    @Column({ type: 'time' })
    hFinJeudi: string;

    @Column({ type: 'time' })
    hDebVendredi: string;

    @Column({ type: 'time' })
    hFinVendredi: string;

    @Column({ type: 'time' })
    hDebSamedi: string;

    @Column({ type: 'time' })
    hFinSamedi: string;

    @Column({ type: 'time' })
    hDebDimanche: string;

    @Column({ type: 'time' })
    hFinDimanche: string;
}