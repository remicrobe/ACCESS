import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne, OneToOne, CreateDateColumn, JoinColumn,
} from 'typeorm';
import {Absence} from "./Absence";
import {Token} from "./Token";
import {Access} from "./Access";
import {Service} from "./Service";
import {HorairesModele} from "./HorairesModele";
import {Horaire} from "./Horaire";
import {Historique} from "./Historique";
export enum typeCollab {
    rh='rh',
    drh='drh',
    arh='arh',
    collab='collab'
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

    @Column({default:null,nullable:true,select:false})
    motdepasse: string;

    @Column({default:'Collaborateur'})
    fonction: string;

    @Column({
        type: "enum",
        enum: typeCollab,
        default: typeCollab.collab
    })
    grade: typeCollab;

    @OneToMany(() => Token, token => token.collab)
    tokens: Token[];

    @OneToMany(() => Absence, absence => absence.collab)
    absences: Absence[];

    @OneToMany(() => Historique, hist => hist.collab)
    historique: Historique[];

    @ManyToOne(() => Service, service => service.collabs, {nullable:true})
    service: Service;

    @ManyToOne(() => HorairesModele, {nullable:true})
    horairesdefault: HorairesModele;

    @OneToOne(() => Horaire)
    @JoinColumn()
    horaire: Horaire

    @Column({default:true})
    actif: boolean;

    @Column({default:false})
    valide: boolean;

    @CreateDateColumn({select:false})
    date: Date;
}