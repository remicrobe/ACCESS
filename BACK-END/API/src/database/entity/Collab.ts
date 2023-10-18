import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne, OneToOne,
} from 'typeorm';
import {Absence} from "./Absence";
import {Token} from "./Token";
import {Access} from "./Access";
import {Service} from "./Service";
import {Horaires} from "./Horaires";
import {HorairesModele} from "./HorairesModele";
export enum typeCollab {
    'rh',
    'drh',
    'arh'
}
@Entity()
export class Collaborateur {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    prenom: string;

    @Column()
    nom: string;

    @Column()
    mail: string;

    @Column()
    motdepasse: string;

    @Column()
    date: Date;

    @Column({
        type: "enum",
        enum: typeCollab,
        default: null
    })
    grade: typeCollab;

    @OneToMany(() => Token, token => token.collab)
    tokens: Token[];

    @OneToMany(() => Absence, absence => absence.collab)
    absences: Absence[];

    @OneToMany(() => Access, access => access.owner)
    accesses: Access[];

    @OneToMany(() => Service, service => service.collabs)
    services: Service[];

    @OneToOne(() => Horaires)
    horaires: Horaires;

    @OneToOne(() => HorairesModele)
    horairesdefault: HorairesModele;
}