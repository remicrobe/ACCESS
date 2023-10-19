import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne, OneToOne, CreateDateColumn,
} from 'typeorm';
import {Absence} from "./Absence";
import {Token} from "./Token";
import {Access} from "./Access";
import {Service} from "./Service";
import {HorairesModele} from "./HorairesModele";
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

    @Column({default:null,nullable:true})
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

    @ManyToOne(() => Service, service => service.collabs, {nullable:true})
    service: Service;

    @OneToOne(() => HorairesModele)
    horairesdefault: HorairesModele;

    @Column({ type: 'time',nullable:true, default:null })
    hDebLundi: string;

    @Column({ type: 'time',nullable:true, default:null })
    hFinLundi: string;

    @Column({ type: 'time',nullable:true, default:null })
    hDebMardi: string;

    @Column({ type: 'time',nullable:true, default:null })
    hFinMardi: string;

    @Column({ type: 'time',nullable:true, default:null })
    hDebMercredi: string;

    @Column({ type: 'time',nullable:true, default:null })
    hFinMercredi: string;

    @Column({ type: 'time',nullable:true, default:null })
    hDebJeudi: string;

    @Column({ type: 'time',nullable:true, default:null })
    hFinJeudi: string;

    @Column({ type: 'time',nullable:true, default:null })
    hDebVendredi: string;

    @Column({ type: 'time',nullable:true, default:null })
    hFinVendredi: string;

    @Column({ type: 'time',nullable:true, default:null })
    hDebSamedi: string;

    @Column({ type: 'time',nullable:true, default:null })
    hFinSamedi: string;

    @Column({ type: 'time',nullable:true, default:null })
    hDebDimanche: string;

    @Column({ type: 'time',nullable:true, default:null })
    hFinDimanche: string;

    @Column({default:true})
    actif: boolean;

    @CreateDateColumn({type:'timestamp'})
    date: Date;
}