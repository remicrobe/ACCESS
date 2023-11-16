import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Collaborateur} from "./Collab";

@Entity()
export class Presence {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Collaborateur)
    collab: Collaborateur;

    @Column()
    datePres: Date;

    @Column({ type: 'time', default: '00:00:00' })
    hdeb: string;

    @Column({ type: 'time', default: '00:00:00' })
    hfin: string;

    @ManyToOne(() => Collaborateur)
    modifiePar: Collaborateur;

    @Column()
    modifieLe: Date;

    @CreateDateColumn({select:true})
    creeLe: Date;

    @Column()
    creePar: string;
}