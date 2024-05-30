import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Collaborateur } from "./Collab";

@Entity()
export class Absence {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Collaborateur, utilisateur => utilisateur.absences)
    collab: Collaborateur;

    @Column()
    datedeb: Date;

    @Column()
    periodeDeb: number

    @Column()
    datefin: Date;

    @Column()
    periodeFin: number

    @Column({
        type: "enum",
        enum: ['conge', 'maladie', 'autre']
    })
    raison: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable: true})
    accepte: boolean;

    @Column({nullable: true})
    datereponse: Date;

    @CreateDateColumn({select: true})
    dateDemande: Date;

    @ManyToOne(() => Collaborateur)
    reponseDe: Collaborateur;

    @ManyToOne(() => Collaborateur)
    modifierPar: Collaborateur;
}
