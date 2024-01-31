import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Collaborateur} from "./Collab";
import {Access} from "./Access";

@Entity()
export class Historique {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({select:true})
    date: Date;

    @ManyToOne(() => Collaborateur, utilisateur => utilisateur.historique)
    collab: Collaborateur;

    @ManyToOne(() => Access, acc => acc.historique)
    point: Access;

    @Column()
    typeAction: string

    @Column()
    actionAutorise: boolean

    @Column({default: 'Identité'})
    statutUtilise: string

}