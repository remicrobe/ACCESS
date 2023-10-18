import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Collaborateur} from "./Collab";

@Entity()
export class Absence {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Collaborateur, utilisateur => utilisateur.absences)
    collab: Collaborateur;

    @Column()
    datedeb: Date;

    @Column()
    datefin: Date;

    @Column({
        type: "enum",
        enum: ['conge', 'maladie', 'autre']
    })
    raison: string;
}