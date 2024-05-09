import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Collaborateur } from "./Collab";
import { IncidentReponse } from "./IncidentReponse";

@Entity()
export class Incident {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Collaborateur, utilisateur => utilisateur.absences)
    collab: Collaborateur;

    @Column()
    description: string;

    @Column({default: true})
    ouvert: boolean;

    @ManyToOne(() => Collaborateur)
    modifiePar: Collaborateur;

    @Column({nullable: true})
    modifieLe: Date;

    @CreateDateColumn({select: true})
    creeLe: Date;

    @Column()
    creePar: string;

    @Column()
    dateIncident: Date;

    @OneToMany(() => IncidentReponse, incidentReponse => incidentReponse.incident)
    reponse: IncidentReponse[];
}
